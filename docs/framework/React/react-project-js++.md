---
autoGroup-2: Hook
sidebarDepth: 3
title: React + Koa2打造『JS++官网管理后台
---

## Redis
### 1. Redis
> 什么是Redis？

它是内存数据库。优势：访问快，内存压力增大 

> Redis与MySQL比较

1. Redis是内存数据库，访问比较快；MySQL是硬盘数据库，访问相对慢
2. 内存存放公共数据，如登录信息存储；硬盘存储非公共数据，如网站的视图数据。



安装：https://www.runoob.com/redis/redis-install.html

启动redis服务器程序：
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
```javascript
npm i redis@3.0.2 -S
```

## cookie与session的关系
> 客户端与服务器会话机制

cookie存在客户端。session存在服务器中，相当于一个容器，存储用户信息。当用户用登录的方式请求一个API，服务端会将用于信息存储到session中。同时服务端会有一个响应，响应头会带有set-cookie字段，浏览器会根据响应头中set-cookie字段，浏览器会在客户端请求头中自动设置cookie。

> session的存储问题

1. 系统会限制每个进程的最大可用内存。解决：启动多个进程
2. 进程之间数据隔离，无法相互访问

> session存储在哪里？

session存储到Redis。

> session存储到Redis

1. session本身数据量小
2. session不考虑数据丢失的问题
3. session访问度很高，要求访问快，性能高

> 不适合Redis的场景

1. 操作频率不高的数据
2. 数据无法承受丢失的结果
3. 数据量大，内存无法承受

## 配置Redis
### 1. koa2 配置 Redis
```javascript
// 1. 安装依赖koa-redis和koa-generic-session
// koa2-redis： koa2操作redis依赖
// koa-generic-session: koa2操作session
npm i koa-redis@4.0.1 koa-generic-session@2.0.4 -S

// 2. app.js引入
const Redis = require('koa-redis');
const session = require('koa-generic-session');

// 3. 对session加密（加密cookie的key）
app.keys = sessionInfo.keys; 
/**
sessionInfo: {
  keys: ['a1s2@d3#f4$_+g5%6^'], // 加密cookie
  name: 'txclass.sid', // set-Cookies一般就是会有前缀：项目.sid
  prefix: 'txclass.sess', // 存到redis中，会有前缀：项目.sess
}
*/

// 4. 连接 Redis。使用中间件session
app.use(session({
  key: sessionInfo.name, // cookie name
  prefix: sessionInfo.prefix,  // redis key前缀
  cookie: cookieInfo,
  // Redis
  store: koaRedis(redisInfo)
}))
/**
REDIS_CONF: ['6379', '127.0.0.1'] // 端口 ip

redisInfo: {
  all: `${REDIS_CONF[1]}:${REDIS_CONF[0]}`, 
    // 所有的redis都使用一个连接 127.0.0.1:6379
}
*/
```

### 2. 项目中配置连接和操作 Redis
```javascript
// 1. 安装依赖
npm i -S koa-redis@4.0.1
npm i -S koa-generic-session@2.0.4(操作session和redis用)

// 2. 引入 db/connetction/redis_connect.js
const redis = require('redis')；

// 3. 创建redis客户端
const red = redis.createClient(['6379', '127.0.0.1']);

// 4. 监听错误
red.on('error', (error) => {
  console.error('Redis error: ' + error);
})

// 5. 配置操作redis  libs/redisClient.js
/**
 * 设置redis值
 * @param {*} key 设置的key
 * @param {*} value 相应的value
 * @param {*} timeout 过期时间 默认1小时
 */
function redisSet(key, value, timeout = 60 * 60) {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }

  red.set(key, value);
  red.expire(key, timeout)
}

// 6. 获取键名的值
/**
 * 获取redis值
 * @param {*} key 
 * @returns Promise
 */
function redisGet(key) {
  return new Promise((resolve, reject) => {
    red.get(key, (error, value) => {
      if (error) {
        reject(error);
        return;
      }

      if (value == null) {
        resolve(null);
        return;
      }

      try {
        // 如果是JSON字符串
        resolve(JSON.parse(value));
      } catch (e) {
        // 不是JSON字符串
        resolve(value);
      }
    })
  })
}
```

### 3. 测试是否配置成功
1. 安装ejs
2. 
```javascript
// 1. 安装ejs，并修改app.js
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// 2. 配置index路由
const indexController = require('../controllors/Index.js');
router.get('/', indexController.index)

// 3. controllers/Index.js 
class Index {
  async index(ctx, next) {
    const sess = ctx.session;

    if (!sess.uid) {
      sess.uid = 1;
      sess.usename = 'jsjiajia';
      sess.nickname = 'js++';
      sess.gender = 'male';
    }

    redisSet('a', 1);
    redisSet('json', { a: 1, b: 2 });
    redisGet('json').then(res => {
      console.log(res);
    })

    ctx.body = {
      session: sess
    }
  }
}

// 浏览器访问http://localhost:3000
// 可以看到响应头部有set-Cookie字段：Set-Cookie: txclass.sid=Ds1kqi526UNihCKamBq3ZCOZM1XEyQXB;
// 打开redis客户端上查看keys，可以看到
// "txclass.sessDs1kqi526UNihCKamBq3ZCOZM1XEyQXB"
// "a"
// "json"
```
1. 配置连接Redis
2. 配置操作Redis
3. 配置koa操作cookie、session、redis
4. 环境：生产环境与开发环境

测试是否配置成功：
1. 安装ejs
2. 设置index路由


## admin模型

加密


## react项目配置
1. 安装node-sass
2. 别名配置：
```javascript
// node_modules/react-scripts/config/webpack.config.js
alias: {
  ...
  '@': paths.appSrc,
  'pages': paths.appSrc + '/pages',
  'components': paths.appSrc + '/components',
  'assets': paths.appSrc + '/assets',
  'services': paths.appSrc + '/services',
  'utils': paths.appSrc + '/utils'
},
```
3. 安装react-router-dom
4. 图标配置
```javascript
// node_modules/react-scripts/config/webpack.config.js
oneOf: [
  {
    test: /\.(woff2?|eot|ttf|oft|svg)(\?.*)?$/i,
    loader: [
      'url-loader?name=fonts/[name].[ext]'
    ]
  },
]
```
5. react组件创建
```javascript
import React, {Component} from 'react'

export default class IndexPage extends Component{
    constructor(props){
        super(props);
        this.state = {...}
    }
    
    render(){
        return (...)
    }
}
```
6. 路由创建
```javascript
// 安装react-router  react-router-dom
npm i react-router react-router-dom

// 路由表
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

<Router>
  <Switch>
    {/* /login 放在上面 */}
    <Route component={LoginPage} path='/login' />
    {/* <Route component={IndexPage} path='/' /> */}
    {/* 子路由的写法 */}
    <Route path="/" render={props => (
      <IndexPage history={props.history}>
        <Switch>
          <Route component={CollectionPage} path='/collection' />
          <Route component={RecomCoursePage} path='/recom_course' />
          <Route component={CoursePage} path='/course' />
          <Route component={SliderPage} path='/slider' />
          <Route component={StudentPage} path='/student' />
          <Route component={TeacherPage} path='/teacher' />
          <Route component={CrawlerPage} path='/crawler' />
        </Switch>
      </IndexPage>
    )} />
  </Switch>
</Router>
// 路由中，一级路由都需要放到上面，需要匹配二级路由的放在下面
```

## 跨域
```javascript
// 1. 服务端安装：koa2-cors
yarn add koa2-cors@2.0.6

// 2. app.js 引入
const cors = require('koa2-cors');

// 3. 跨域配置
app.use(cors({
  // 设置源
  origin: function (ctx) {
    return 'http://localhost:3001'; // 允许http://localhost:3001的接口请求
  }
}))

// 4. config/env_config.js 设置不同环境判断
const ENV = process.env.NODE_ENV;
module.exports = {
  // 用于对数据库的连接使用什么密码
  isDev: ENV === 'dev', // true 是开发环境
  isPrd: ENV === 'production', // true 是正式环境
}

// 5. config/config.js
corsOrigin: isPrd ? 'http://admin.jsplusplus.com' : 'http://localhost:3001'

// 6. app.js
app.use(cors({
  // 设置源
  origin: function (ctx) {
    return corsOrigin
  }
}))
```

## 登录验证

登录成功之后，返回的响应头部中有两条set-Cookie:

Set-Cookie: txclass.sid=Ds1kqi526UNihCKamBq3ZCOZM1XEyQXB; path=/; expires=Thu, 24 Nov 2022 16:12:58 GMT; httponly    
Set-Cookie: txclass.sid.sig=K4Z66auO_XF5-bFnaHJMfo4Cr6Y; path=/; expires=Thu, 24 Nov 2022 16:12:58 GMT; httponly

当时查看浏览器器Application/Cookies中查看并没有cookie。为什么？

因为前后端分离时，浏览器和后端是不同源的，返回的头部包含Set-Cookie，但是后端不能操作写入Application/Cookies中。

解决：前端axios请求参数配置：withCredentials: true, 请求携带cookie资质。后端也需要设置在不同源的情况下，也有权限设置cookie。
```javascript
// 跨域设置
app.use(cors({
  ...
  // 设置credentials
  credentials: true
}))
```

## history
直接在Route中注册的组件，组件内部可以使用history
```javascript
// App.js
<Router>
  <Switch>
    {/* 在组件LoginPage中可以使用history*/}
    <Route component={LoginPage} path='/login' />
    <Route component={IndexPage} path="/" />
  </Switch>
</Router>

// Login.js
render() {
  // 只要在app.js注册过路由的组件，都会有history
  const { history } = this.props;

  return (
    <div className='container'>
      {/* 将history传递给子组件 */}
      <Login history={history} />
    </div>
  )
}
```

## 页面
占整个页面
```css
html,
body,
#root,
.container {
  height: 100%;
}
```

## 接口
1. /admin/login_action 登录
2. 验证是否登录：/admin/login_check。只要携带了有效的cookie，就能访问session.userInfo，而不是去匹配cookie是否正确。