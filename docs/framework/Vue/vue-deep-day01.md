---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 渐进式框架、三大框架对比、数据流和绑定
---

## 渐进式框架
渐进式框架（progresive framework）：`vue`对自己框架和其他框架对比后，生产的一个特定的名词。

## 三大框架比较
1. `Angular`：是综合性框架，是一个开发平台，它在开发的时候更关注项目应用，它不是光解决视图渲染/状态的管理，是先有需求，再有提供应用。适合应用于大型应用
    - 为什么说Angular适合于开发大型应用？因为它的功能非常完整，它集成在Angular内部，所以说它在研发的时候的关注点是项目及应用。只是它里边觉得视图渲染状态管理这些我们用双向数据绑定的这种方式是比较合理的，而不是它并不关注于单独的视图和状态管理。这种应用实际上叫自上而下的开发，相当于就是我们有了所有这些大型应用的需求，我们通过这些需求自上而下一步一步的往下延展）。
2. `React`：用于构建用户界面的JavaScript库，关注用户界面也就是`View`视图层，也就是怎么把数据渲染到视图中。关注点：视图，所以它叫库，就是提供了一套管理视图和状态数据之间的一个方法库。官方不提供中央管理和路由。需要另外学习状态中央管理（`Redux`）和路由（`react-router`）
3. `Vue`：关注用户界面`View`视图层，关注怎么把数据渲染到视图中，关注点：视图。核心库是视图层。与React不同的点是，提供了选择集成`vuex`和`vue-router`。有接口直接配置。Vue想完成大型应用的需求。


## 数据绑定与数据流
1. 数据绑定：数据与视图渲染直接的关系。
   - `React`：单向数据绑定。通过`event`（事件）去触发`state`更改导致视图变更，这个过程叫数据的单向绑定。（数据的单向绑定：就是我的数据绑定的视图只有一种方案能够更改，就是用我们的event去更改我们的state，state变了视图才会变，视图是没有办法反过来做的，也就是说我在视图变的同时去更改我的state这是做不到的）
   - `Vue`：双向数据绑定。 `event`触发 -> `state/data`更改 -> 视图变更，那么视图的变化导致了数据变化以后，我们的state/data它也会变更。`v-model`封装了一套oninput这样的事件，就是说我在输入的过程中，它会不断的去执行oninput，绑定这个事件处理函数，当然你没绑定，是v-model帮你绑定的 -> 视图变更导致`state/data`变更
2. 数据流：数据流淌的方向。父子组件中，数据按照什么方向流动。
   - `React/vue`都是单向数据流
   - `React/vue`：父组件 -> `state` -> 子组件作为`props`->子组件的props变更不能导致父组件的state变更，只能是父组件的state变更导致子组件的props变更
  `props: immutable value`  
  `state/data: mutable value`

## Vue项目的集中构建方式
新建文件夹vite-cdn，打开终端执行<br>
`npm init -y`<br>
生成`package.json`文件。安装`vite`<br>
`yarn add vite -D`<br>
把`package.json`里面的“`test`”变成“`dev`”执行命令变成`vite`。新建文件`index.html`，写入
```html

<div id="app"></div>

<body>
    <script src="https://unpkg.com/vue@3.1.2/dist/vue.global.js"></script>
    <script type="module" src="./src/main.js"></script>
</body>
```
新建`src`文件夹，新建`main.js`文件，然后`npm run dev`。


## webpack从0开始搭建Vue2/3项目
新建目录`2.vue`，打开终端执行<br>
`npm init -y`<br>
生成`package.json`文件。然后安装`webpack`、`webpack-cli`、`webpack-dev-server`。   
`yarn add webpack@4.44.2 webpack-cli@3.3.12 webpack-dev-server@3.11.2 -D`<br>
修改`package.json`
```json
// package.json
"scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
}
```
新建目录`public`里建文件`index.html`。目录`src`里建文件`main.js`，引入`CDN`
```html
<!--public/index.html-->
<body>
    <script src="http://cdn.jsdelvr.net/npm/vue@2.6.14/dist/vue.js"></script>
</body>
```
然后`yarn add vue-loader@15.0.0 vue-template-compiler@2.6.14 html-webpack-plugin@4.5.0 -D`   
vue2版本
```json
// package.json
// <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
"devDependencies": {
    "html-webpack-plugin": "4.5.0",
    "vue-loader": "^15.0.0",  // 15版本 vue v2.6.14
    "vue-template-compiler": "^2.6.14",
    "webpack": "4.44.2",
    "webpack-cli": "3.3.12",
    "webpack-dev-server": "3.11.2"
}
```

`webpack.config.js`
```javascript
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 老版本的引入方式

// webpack.config.js是在node环境下运行，所以要遵循CommonJS规范
module.exports = {
    mode: 'development', // 开发环境
    entry: './src/main.js', // 入口文件
    output: {
        path: resolve(__dirname, 'dist'), // 输出文件
        filename: 'main.js' // 输出文件名
    },
    // 因为引用的Vue是CND外部文件，webpack需要配置externals
    externals: {
        'vue': 'Vue'
    },
    devtool: 'source-map',
    module: {
        // 处理.vue结尾的文件
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'public/index.html')
        })
    ]
}
```
然后`npm run dev`。

`vue3`需要安装：`yarn add @vue/compiler-sfc@^3.0.0 vue-loader@16.0.0`
  
```json
// package.json
// Vue CDN版本引入<script src="https://unpkg.com/vue@3.1.2/dist/vue.global.js"></script>
"devDependencies": {
    "@vue/compiler-sfc": "^3.0.0", // 注意版本 3.2以上版本需要vue也是3.2以上
    "html-webpack-plugin": "4.5.0",
    "vue-loader": "^16.0.0", // 16版本, vue v3.1.2
    "webpack": "4.44.2",
    "webpack-cli": "3.3.12",
    "webpack-dev-server": "3.11.2"
}
```

`vue3`错误：   
`[Vue warn]: Property "$createElement" was accessed during render but is not defined on instance`.     
`[Vue warn]: Property "_self" was accessed during render but is not defined on instance.`    
`[Vue warn]: Unhandled error during execution of render function 
  at <App>`     
`Uncaught TypeError: Cannot read properties of undefined (reading '_c') `   
由于`vue`和`vue-loader`版本不一致。 
   


