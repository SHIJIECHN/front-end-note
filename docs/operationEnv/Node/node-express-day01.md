---
autoGroup-2: Node框架
sidebarDepth: 3
title:  1. Express的定义、安装、添加中间件
---

## Express创建与中间件
1. 创建package.json 
2. 安装nodemon：npm install nodemon
3. 安装express：npm install express

```javascript
// 内部模块引入
const http = require('http');

// 第三方模块引入
const express = require('express');
// 处理请求
const app = express();

// 中间件
app.use((req, res, next) => {
    console.log('在中间件中...');
    next(); // 必须执行next方法，才能继续往下执行，否则就在这里结束。
});

app.use((req, res, next) => {
    console.log('在另一个中间件中....');
})

// 服务器
const server = http.createServer(app);
// 监听端口3000
server.listen(3000);
```

## 中间件处理不同路由、解析请求
```javascript
// 中间件
app.use((req, res, next) => {
    console.log('在中间件中...');
    next(); // 必须执行next方法，才能继续往下执行，否则就在这里结束。
});

app.use((req, res, next) => {
    console.log('在另一个中间件中....');
    // 可以自定义Header覆盖默认值
    res.send('<h1>你好, Express</h1>'); // 响应
})
```
中间件执行next方法到下一个中间件，或者res.send发送对应的响应，如果前面的中间发送了对应的响应，后面中间件就不会再执行。

### app.use应用
1. app.use([path],)
```javascript
// 只要路径中有/，就能响应
app.use('/', (req, res, next) => {
    console.log('在另一个中间件中....');
    res.send('<h1>你好, Express</h1>'); // 响应
})
```
访问http://127.0.0.1:3000/add-product也会响应，因为默认是只要路径包含 "/"，就会响应。解决方法：
```javascript
app.use('/add-product', (req, res, next) => {
    res.send('<h1>你好, 添加产品页</h1>'); // 响应
})
app.use('/', (req, res, next) => {
    console.log('在另一个中间件中....');
    res.send('<h1>你好, Express</h1>'); // 响应
})
``` 

## body-parser解析请求体内容
1. 处理GET与POST请求
```javascript
// req.body的解析
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// 中间件
app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type=""text name="title" /><button type="submit">添加产品</button></form>'); // 响应
})

app.use('/product', (req, res, next) => {
    // 获取请求体的信息
    console.log(req.body);
    // 重定向
    res.redirect('/');
})

app.use('/', (req, res, next) => {
    console.log('在另一个中间件中....');
    res.send('<h1>你好, Express</h1>'); // 响应
})
```
2. 只处理GET请求
```javascript
app.get('/', (req,res,next)=>{
    //...
})
```

## 路由使用
目录结构
<img :src="$withBase('/operationEnv/Node/express.png')" alt="express">     

### 1. app.js
```javascript
// 内部模块引入
const http = require('http');

// 第三方模块引入
const express = require('express');
const bodyParser = require('body-parser');
// 处理请求
const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000)
```
### 2. admin.js
```javascript
const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type=""text name="title" /><button type="submit">添加产品</button></form>'); // 响应
})

router.post('/product', (req, res, next) => {
    // 获取请求体的信息
    console.log(req.body);
    // 重定向
    res.redirect('/');
})

module.exports = router;
```

### 3. shop.js
```javascript
const express = require('express');
const router = express.Router();

// 完全匹配 "/" 路径
router.get('/', (req, res, next) => {
    res.send('<h1>你好, Express</h1>');
})

module.exports = router
```

## 添加404页面
```javascript
// app.js
app.use((req, res, next) => {
    res.status('404').send('<h1>页面走丢了</h1>');
})
```
<img :src="$withBase('/operationEnv/Node/express-404.png')" alt="express">    

## 公共路径提取
/admin/add-product和/admin/product前面添加admin
```javascript
// app.js
app.use('/admin', adminRoutes);
```
<img :src="$withBase('/operationEnv/Node/express01.png')" alt="express">  

## 创建返回html文件
添加views文件夹
<img :src="$withBase('/operationEnv/Node/express02.png')" alt="express"> 

### 1. shop.html
```html
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">商店</a></li>
                <li><a href="/admin/add-product">添加产品</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h1>我的产品</h1>
        <p>这是产品列表...</p>
    </main>
</body>
```

### 2. add-product.html
```html
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">商店</a></li>
                <li><a href="/admin/add-product">添加产品</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <form action="/admin/product" method="post">
            <input type="text" name="title" />
            <button type="submit">添加产品</button>
        </form>
    </main>
</body>
```

### 3 admin.js
```javascript
const path = require('path');
const express = require('express');
const router = express.Router();

// /admin/add-product
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
})

// /admin/product
router.post('/product', (req, res, next) => {
    // 获取请求体的信息
    console.log(req.body);
    // 重定向
    res.redirect('/');
})

module.exports = router;
```

### 4. shop.js
```javascript
const path = require('path')
const express = require('express');
const router = express.Router();

// 完全匹配 "/" 路径
router.get('/', (req, res, next) => {
    // sendFile自动设置头部，path.join处理路径
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
})

module.exports = router
```
<img :src="$withBase('/operationEnv/Node/express03.png')" alt="express"> 

## 返回404页面
在views中添加404.html
```html
<!--404.html-->
<body>
    <h1>页面走丢了</h1>
</body>
```
修改app.js
```javascript
// app.js
app.use((req, res, next) => {
    res.status('404').sendFile(path.join(__dirname, 'view', '404.html'))
})
```
## 优化路径显示
创建文件夹utils/path.js
```javascript
// path.js
const path = require('path');

module.exports = path.dirname(process.mainModule.filename)
```
修改admin.js和shop.js
```javascript
// admin.js
const rootDir = require('../utils/path.js')

// /admin/add-product
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

// shop.js
const rootDir = require('../utils/path.js')
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
})
```

## 增加样式和增加静态文件
1. 创建public/css/index.css
2. app.js中添加内置中间件
```javascript
// 请求自动转发到public文件夹下
app.use(express.static(path.join(__dirname, 'public')))
```
3. 引用
```html
<link href="/css/index.css">
```

## 分享数据

## 模板引擎
### 1. pug


### 2. express-handlebars


### 3. ejs
partials
