---
autoGroup-2: Hook
sidebarDepth: 3
title: 项目案例
---

## koa + puppeteer爬虫系统

**任务：**
1. 爬取页面数据并上传到MySQL中
2. 图片资源全部上传七牛，程序自动上传
3. 利用koa2做服务端将页面做出来
4. 建立一个后台管理课程和管理爬虫
5. 爬虫接口管理

**技术栈：**
1. puppeteer：Node的一个爬虫库，用来爬取网页数据
2. MySQL：数据库，用来存储爬取的数据
3. Sequelize：Node的一个用来操作数据库的库，让Node端操作数据库变得更方便
4. Koa2：将请求的URL匹配到对应的响应程序，在服务端运行后端程序的框架

### 1. 实现爬虫
1. 生成koa2项目
```javascript
// 安装koa生成器
npm i -g koa-generator
// koa生成器生成项目 crawler
koa crawler
// 安装依赖
cd crawler && npm install
```

2. 安装puppeteer
```javascript
npm i puppeteer
```
### 2. 启动puppeteer
puppeteer是NodeJS的一个库，专门提供爬页面的库。利用Chromium来开启一个浏览器，把url地址放到浏览器中进行页面分析，这个过程就是爬取的过程。
```javascript
// 在routes目录下的index.js里
const pt = require('puppeteer'); // 引入puppeteer
const router = require('koa-router');

router.get('/', async (ctx, next) => {
  
  const bs = await pt.launch(), // browser 发起启动puppeteer。这是异步的过程。其实是个浏览器。
    url = 'https://ke.qq.com/cgi-bin/agency?aid=64228#category=-1&tab=0',   // 爬取的页面url
    pg = await bs.newPage();    // 在browser里面启动一个页面

  // 等待新的页面去开url这个页面，需要配置
  await pg.goto(url, {
    timeout: 30 * 1000,// 超时时间。有可能网站打不开，如果打不开抛出错误
    // 什么时候代表完成呢？官方推荐networkidle2。意思是500ms以后网站没有发起连接了，说明爬取完成。
    waitUtil: 'networkidle2'
  });

  // 分析页面返回一个结果，通过pg.evaluate(()=>{})里面是函数，在函数内部的环境实际上就是页面的环境，
  const result = await pg.evaluate(() => {
    // 这里内部相当于爬虫的页面，就是爬取的页面的控制台，所以可以用window对象
    // 查看是否有jQuery。获取页面jQuery $保存
    const $ = window.$; 
    // 爬起网页数据分析
    return getResource($);
  })
  console.log(result);
  // 关闭浏览器
  await bs.close();
})

function getResource($){
  // 保存item。每一张图片item
    const $item = $('.agency-big-banner-ul .agency-big-banner-li');
    let data = []; // 定义数据的容器（收取爬取后的数据）
    $item.each((index, item) => {
      // 每一个item
      const $el = $(item),
        // 拿到 a 标签
        $elLink = $el.find('.js-banner-btnqq');
      // 组装数据
      const dataItem = {
        // a 标签的dat-id
        cid: $elLink.attr('data-id'),
        // a标签的href
        href: $elLink.prop('href'),
        // a标签下的img标签
        imgUrl: $elLink.find('img').prop('src'),
        // a标签的title
        title: $elLink.prop('title')
      }
      data.push(dataItem)
    })
    return data;
}
```
```javascript
// 1. 启动项目
npm run dev
// 2. 访问页面 http://localhost:3000

// 3. 爬取完毕，终端打印爬取后的数据
```

流程：
1. 使用puppeteer库：
   1. 开启浏览器pt.launch()
   2. 设置url地址
   3. 创建一个新页面
2. 配置选择爬取的地址和配置pg.goto、timeout超时时间、waitUtil:networkidle2完成时机。
3. 分析页面，pg.evaluate(()=> {}),evaluate()函数环境其实类似浏览器的环境，如果爬取的网页中有JQuery，我们可以直接使用JQuery。
4. 在evaluate函数中获取需要的数据，保存JQuery，然后回去需要的节点数组，遍历节点数组，构建需要的数据结构。注意lazy-src懒加载的图片，需要获取lazy-src属性的值。
5. 爬取完成后，关闭浏览器bs.close()


遇到的问题是：所有的代码都是在主进程上进行操作，而JavaScript本身就是单线程，这样的效率比较差。需要开一个子进程处理问题。

## 开启子进程
创建一个puppeteer文件件，里面创建一个crawler.js文件，放置原先的代码，里面的代码将在子进程启动时立即执行。需要注意的是，在子进程需要使用process.send()发送数据。
```javascript
//puppeteer/crawler.js
const pt = require('puppeteer')

;(async (ctx, next) => {
  const bs = await pt.launch() // 启动puppeteer,类似于打开一个浏览器环境
  const pg = await bs.newPage() // 生成一个页面
  const url = 'https://ke.qq.com/cgi-bin/agency?aid=64228#category=-1&tab=0' // 需要爬取的url地址

  await pg.goto(url, {
    timeout: 30 * 1000, // 设置爬取时的超时时间
    waitUtil: 'networkidle2' // 设置500ms内没有发起爬取请求表明爬取结束
  })

  const result = await pg.evaluate(() => {
    const $ = window.$

    function getResource () {}

    // 获取需要的资源（图片地址，标题等）
    return getResource()
  })
  
  await bs.close() // 关闭浏览器环境
  process.send(result) // 发送数据
  setTimeout(() => {
    process.exit(0)
  }, 1000) // 关闭进程
})()
```
修改原来的路由代码
```javascript
// router/index.js
const router = require('koa-router')
const cp = require('child_process') // 引用node的子进程模块
const { resolve } = require('path')

//启动一个子进程，执行脚本crawler.js 执行的结果交给data
router.get('/', async (ctx, next) => {
  const script = resolve(__dirname, '../puppeteer/crawler.js')
  const child = cp.fork(script, []) // 使用子进程去执行

  let invoked = false // 子进程是否被调用
  
  child.on('message', data => { // 获取数据。通过监听message事件，监听到发送消息的结果
    console.log(data)
  })

  child.on('exit', code => { // 监听子进程退出
    if (invoked) return
    invoked = true
    ...
  })

  child.on('error', err => { // 监听子进程错误
    if (invoked) return
    invoked = true
    ...
  })
})
```

总结：
1. 拆分请求路由下爬虫程序到子进程文件中
2. 路由文件引入子进程库
3. 读取子进程脚本文件
4. 启动子进程
5. 完善成功、退出、失败程序日志

## 封装
按照MVC的思想，需要由控制器来粘合view层和model层。因此创建一个controller文件夹，里面方式一个Crawler.js文件。
```javascript
// controllers/Crawler.js

class Crawler {
  crawlSliderData () { // 获取slider数据
    ...
  }
}

module.exports = new Crawler()
```
对puppeteer的启动和子进程的创建进行封装：

### 1. 封装子进程
在libs中常见utils.js文件
```javascript
// libs/utils.js

const cp = require('child_process')
const { resolve } = require('path')

module.exports = {
  /**
   * options: {
   *   path: string; // 子进程中执行的文件路径
   *   message: function; // 子进程得到数据时的回调
   *   exit: function; // 子进程退出时的回调
   *   error: function; // 子进程报错时的回调
   * }
   */
  startProcess (options) { // 启动子进程
    const stript = resolve(__dirname, options.path)；
    // 开启子进程执行script，
    const child = cp.fork(script, []); 

    let invoked = false
    child.on('message', data => {
      options.message(data)
    })

    child.on('exit', code => {
      if (invoked) return
      
      invoked = true
      options.exit(code)
    })

    child.on('error', err => {
      if (invoked) return
      
      invoked = true
      options.error(code)
    })
  }
}
```

### 2. 封装puppeteer的启动
在libs文件夹下，创建crawler.js
```javascript
const pt = require('puppeteer');
/**
 * 开始爬虫配置，包括爬取的网页url、分析页面回调、发送数据结果
 * options {
 *   url: string; // 需要爬取的url地址
 *   callback: function; // 处理函数
 * }
 * return 通过process.send(result)将结果发送给子进程
 */

const crawler = async function (options) {
  const bs = await pt.launch(),
    pg = await bs.newPage(),
    url = options.url;

  await pg.goto(url, {
    waitUtil: 'networkidle2'
  })

  const result = await pg.evaluate(options.callback);

  await bs.close();

  process.send(result);

  setTimeout(() => {
    process.exit(0);
  }, 1000)
}
module.exports = crawler;
```

### 3. 添加子进程执行的文件
由于子进程需要执行一个文件，在这个文件中执行爬虫任务，因此需要新建一个文件用于子进程执行。新建crawler文件夹，里面常见slider.js文件
```js
// crawler/slider.js

const crawler = require('../libs/crawler') // 获取启动puppeteer的函数

// 启动puppeteer
crawler({
  url: 'https://ke.qq.com/cgi-bin/agency?aid=64228#category=-1&tab=0',
  callback () { // 获取数据，和前面evaluate的回调函数代码相同逻辑
    ...
  }
})
```

### 4. 执行子进程
在控制器中添加执行子进程的代码
```js
// controllers/Crawler.js

const { startProcess } = require('../libs/utils')

class Crawler {
  crawlSliderData () { // 爬取页面中slider部分的数据
    startProcess({
      path: '../crawlers/slider',
      async message (data) {
        ...
      },
      async exit (code) {
        ...
      },
      async error (error) {
        ...
      }
    })
  }
}

module.exports = Crawler
```
修改路由
```javascript
// routes/index.js

const router = require('koa-router')()
const crawlerController = require('../controllers/Crawler')

router.prefix('/crawler') // 给路由添加前缀

router.get('/crawl_slider_data', crawlerController.crawlSliderData) // 使用控制器，并修改路由url

module.exports = router
```
相应的app.js中对应的也需要修改
```javascript
// app.js
...
const crawler = require('./routes/crawler')
...
// routes
app.use(crawler.routes(), crawler.allowedMethods())
...
```

## 上传图片到七牛图床
首先配置七牛，可以的发哦ak码和sk码，新建config文件件，创建config.js文件保存配置
```javascript
// config/config.js

module.exports = {
  qiniu: {
    keys: {
      ak: '',
      sk: ''
    },
    bucket: {
      tximg: {
        bucket_name: '', // 空间名称
        domain: '' // 自己的服务器域名
      }
    }
  }
}
```
### 1. 封装上传函数
安装qiniu和nanoid
```javascript
npm i qiniu nanoid -S // qiniu是七牛官方提供的库，nanoid用于生成一个随机字符串
```
在utils.js中封装上传函数
```javascript
// libs/utils.js

const Qiniu = require('qiniu')
const nanoId = require('nanoid')

module.exports = {
  // ...
  qiniuUpload (options) {
    const mac = new Qiniu.auth.digest.Mac(options.ak, options.sk)
    const conf = new Qiniu.conf.Config()
    const client = new Qiniu.rs.BucketManager(mac, conf)
    const key = nanoId() + options.ext // 生成一个随机的图片名称作为上传到七牛的图片名

    return new Promise((resolve, reject) => {
      client.fetch(options.url, options.bucket, key, (error, ret, info) => {
        if (error) {
          reject(error)
        } else {
          if (info.statusCode === 200) {
            reject(error)
          } else {
            if (info.statusCode === 200) {
              resolve({ key })
            } else {
              reject(info)
            }
          }
        }
      })
    })
  }
}
```

在getResource返回的数据中新增一项用来奥村上传七牛后返回的图片名
```javascript
function getResource ($) {
  const $item = $('.agency-big-banner-ul .agency-big-banner-li')
  const data = []

  $item.each((index, item) => {
    const $el = $(item)
    const $elLink = $el.find('.js-banner-btnqq')
    const dataItem = {
      cid: $elLink.attr('data-id'),
      href: $elLink.prop('href'),
      title: $elLink.prop('title'),
      imgUrl: $elLink.find('img').prop('src'),
      imgKey: '' // 用于保存返回的图片名，默认为空字符串
    }

    data.push(dataItem)
  })

  return data
}
```
此时可以调用qiniuUpload将取到的数据中的图片上传到七牛，在Crawler.js中添加如下代码：
```javascript
// controllers/Crawler.js

const { startProcess, qiniuUpload } = require('../libs/utils')
const config = require('../config')

class Crawler {
  crawlSliderData () { // 爬取页面中slider部分的数据
    startProcess({
      path: '../crawlers/slider',
      async message (data) {
        ...
        // 在这里上传图片到七牛
        data.map(async item => {
          if (item.imgUrl && !item.imgKey) {
            const qiniu = config.qiniu

            try {
              const imgData = await qiniuUpload({
                url: item.imgUrl,
                bucket: qiniu.bucket.tximg.bucket_name,
                ak: qiniu.keys.ak,
                sk: qiniu.keys.sk,
                ext: '.jpg'
              })

              if (imgData.key) {
                item.imgKey = imgData.key // 保存上传到七牛返回的图片地址
              }
            } catch (e) {

            }
          }
        })
      },
      async exit (code) {
        ...
      },
      async error (error) {
        ...
      }
    })
  }
}

module.exports = new Crawler()
```

此时访问`http://localhost:3000/crawler/crawl_slider_data`，发现会将图片自动上传到七牛中。

## MySQL和Sequelize连接创建
安装Sequelize和mysql2
```javascript
npm i sequelize mysql2
```
在config文件夹添加配置文件db_config.js
```javascript
module.exports = {
  mysql: {
    base: {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    },
    conf: ['txclass', 'root', '']
  }
}
```
创建db文件夹放置数据库操作相关文件，并创建connections文件夹，在里面添加mysql连接文件mysql_connect.js
```javascript
const Sequelize = require('sequelize'),
  { mysql } = require('../../config/db_config.js');

const seq = new Sequelize(...mysql.conf, mysql.base);

module.exports = seq;
```

## 创建表模型
在db文件夹下新建models文件夹，并在里面添加slider.js文件，再在config文件夹下创建db_type_config.js存放数据类型
```javascript
// config/db_type_config.js

const Sequelize = require('sequelize')

module.exports = {
  STRING: Sequelize.STRING,
  INT: Sequelize.INTEGER
}
```
```javascript
// db/models/slider.js

const seq = require('../connections/mysql_connect')
const { STRING, INT } = require('../../config/db_type_config')

const Slider = seq.define('slider', { // 定义一张表
  cid: {
    comment: 'course ID',
    type: STRING,
    allowNull: false,
    unique: true
  },
  href: {
    comment: 'course detail page link',
    type: STRING,
    allowNull: false
  },
  imgUrl: {
    comment: 'course image url',
    type: STRING,
    allowNull: false
  },
  title: {
    comment: 'course name',
    type: STRING,
    allowNull: false
  },
  imgKey: {
    comment: 'qiniu image name',
    type: STRING,
    allowNull: false
  },
  status: {
    comment: 'course status',
    defaultValue: 1,
    type: INT,
    allowNull: false
  }
})

module.exports = Slider
```
创建一个index.js文件作为出口:
```javascript

// db/models/index.js

const Slider = require('./slider')

module.exports = {
  Slider
}
```
在db文件夹下新建sync.js添加数据库同步操作：
```javascript
// db/sync.js

const seq = require('../connections/mysql_connect')

require('./models') // 引入数据库表

seq.authenticate().then(() => {
  console.log('MySQL server is connected completely.')
}).catch(err => {
  console.log('MySQL server is failed to be connected. Error information is below: ' + err)
})

seq.sync({
  force: true // 强制同步
}).then(() => {
  console.log('The table has been synchronised into database successfully.')
  process.exit()
})
```

在终端中运行node db/sync即可创建一张表。

## 数据入库逻辑
创建一个services文件夹，里面存放表对应的服务。在文件夹中创建Slider.js文件
```javascript
const { Slider: SliderModel } = require('../db/models') // 获取表实例

class SliderService {
  async addSliderData (data) {
    const cid = data.cid
    const result = await SliderModel.findOne({ // 查找数据库是否已存在这条数据
      where: { cid }
    })

    if (result) {
      return await SliderModel.update(data, { // 更新这条数据
        where: { cid }
      })
    } else {
      return await SliderModel.create(data) // 向slider这张表中添加一条数据
    }
  }
}

module.exports = new SliderService()
```
在爬取到数据后应当立即存进数据库，因此在controllers/Crawler.js文件中执行addSliderData:
```javascript
// controllers/Crawler.js

const { startProcess, qiniuUpload } = require('../libs/utils')
const { addSliderData } = require('../services/Slider')
const config = require('../config')

class Crawler {
  crawlSliderData () { // 爬取页面中slider部分的数据
    startProcess({
      path: '../crawlers/slider',
      async message (data) {
        ...
        // 在这里上传图片到七牛
        data.map(async item => {
          if (item.imgUrl && !item.imgKey) {
            const qiniu = config.qiniu

            try {
              const imgData = await qiniuUpload({
                url: item.imgUrl,
                bucket: qiniu.bucket.tximg.bucket_name,
                ak: qiniu.keys.ak,
                sk: qiniu.keys.sk,
                ext: '.jpg'
              })

              if (imgData.key) {
                item.imgKey = imgData.key // 保存上传到七牛返回的图片地址
              }

              const result = addSliderData(data) // 添加数据到数据库

              if (result) {
                console.log('Data create OK.')
              } else {
                console.log('Data create failed.')
              }
            } catch (e) {

            }
          }
        })
      },
      async exit (code) {
        ...
      },
      async error (error) {
        ...
      }
    })
  }
}

module.exports = new Crawler()
```
再次运行程序，并在浏览器运行http://localhost:3000/crawler/crawl_slider_data即可将爬取的数据存放到数据库。

至此，爬虫就完成了

## React + Koa2打造『JS++官网管理后台』

### 1. Redis
> 什么是Redis？

它是内存数据库。优势：访问快，内存压力增大 

安装：https://www.runoob.com/redis/redis-install.html

启动redis服务器：
```javascript
// cmd打开终端，进入文件夹C:\Users\shijie03\Downloads\Redis-x64-5.0.14.1，
// 执行命令启动redis服务
redis-server.exe redis.windows.conf

// 新打开cmd窗口，启动客户端
redis-cli.exe -h 127.0.0.1 -p 6379
```

操作
```js
// 设置或修改
set name 'js++'
// 获取redis
get name
// 获取redis所有key
keys *
// 删除redis key
del name
// 退出客户端
exit
```

### 2. koa2安装redis依赖
koa2项目中安装redis依赖，因为需要koa2去操作redis。
