---
autoGroup-2: Vue
sidebarDepth: 3
title: 认识Vue
---

## 三大框架比较
渐进式框架（progresive framework）：`vue`对自己框架和其他框架对比后，生产的一个特定的名词。

1. `Angular`：是综合性框架，开发平台，更关注项目应用，而不是关注视图渲染/状态的管理，是先有需求，再提供应用。适合应用于大型应用。
2. `React`：关注用户界面也就是`View`视图层，怎么把数据渲染到视图中。关注点：视图，所以它是提供了管理视图的库。上手简单，但是深入学习很难，因为官方不提供中央管理和路由。需要另外学习状态中央管理（`Redux`）和路由（`react-router`）
3. `Vue`：关注用户界面`View`视图层，怎么把数据渲染到视图中，关注点：视图。核心库是视图层。与React不同的点是，提供了选择集成`vuex`和`vue-router`。有接口直接配置。Vue想完成大型应用的需求。


## 数据绑定与数据流
1. 数据绑定：数据与视图渲染直接的关系。
   - `React`：单向数据绑定。`event` -> `state`更改 -> 视图变更
   - `Vue`：双向数据绑定。 `event` -> `state/data`更改 -> 视图变更，`v-model` -> 视图变更 ->`state/data`变更
2. 数据流：数据流淌的方向。父子组件中，数据按照什么方向流动。
   - 单向数据流
   - `React/vue`：父组件 -> `state` -> 子组件 -> `props`
  `props: immutable value`  
  `state/data: mutable value`

## 手动搭建vue

`vue3`错误：   
`[Vue warn]: Property "$createElement" was accessed during render but is not defined on instance`.     
`[Vue warn]: Property "_self" was accessed during render but is not defined on instance.`    
`[Vue warn]: Unhandled error during execution of render function 
  at <App>  `     
`Uncaught TypeError: Cannot read properties of undefined (reading '_c') `   
由于`vue`和`vue-loader`版本不一致。   
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

webpack.config.js
```javascript
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 老版本的引入方式

// webpack.config.js是在node环境下运行，所以要遵循CommonJS规范
module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    // 因为引用的Vue是CND外部文件
    externals: {
        'vue': 'Vue'
    },
    devtool: 'source-map',
    module: {
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
运行和打包命令
```json
// package.json
"scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
}
```


## 基本用法
1. `Vue`的核心（系统）：模板语法 -> 核心库 -> 编译模板 -> 渲染`DOM`
2. `vue`文件：组件逻辑的本质就是一个对象，里面有很多特定的属性
3. `vue`将数据与`DOM`进行关联，并建立响应式关联：数据改变，视图更新。数据 -> `ViewModel`核心库 -> 视图，数据 <- `ViewModel`核心库 <- 视图。
4. `vue`完成了数据双向绑定机制，我们的业务关注点全部可放到业务逻辑层，视图层交给了`ViewModel`绑我们完成数据绑定、渲染和更新
```vue
<template>
  <!--组件模板-->
</template>
<script>
  // 组件逻辑，组件逻辑块
</script>
<style>
  /* 组件的样式 */
</style>
```

`v-on`: `onclick/addEventListener` 绑定事件处理函数   
`v-bind`: 属性绑定，引号内部看做变量，`vue`会对它进行解析    
`v-*` 都是`vue`的指令   
`v-model`: `oninput` -> `value `-> `myComment`

## 组件化
`vue`组件化核心：组件系统。`Vue`利用`ES`模块化完成`Vue`组件系统的构建。   
组件化：抽象小型、独立、可预先定义配置的、复用的组件
  - 小型：页面的构成拆分成一个一个的小单元
  - 独立：每一个小单元尽可能都独立开发
  - 预先定义：小单元都可以先定义好，在需要的时候导入使用
  - 预先配置：小单元可以接收一些在使用的时候需要的一些配置
  - 可复用：小单元可以在多个地方使用。可复用性要适当的考量，有些组件确实是不需要复用，可配置性越高，功能性越强。组件最大的作用是独立开发，预先配置，都是为了更好的维护和扩展。

## 应用实例与组件实例
应用实例(`app`)： 通过`creatApp`创建`App`，返回一个应用实例。应用实例主要是用来注册全局组件。
```javascript
const { createApp } = Vue;

// Application 应用
const app = Vue.createApp({}) // {}为根组件

/**
 * 在实例上暴露了很多方法
 * component 注册组件
 * directive 注册指令
 * filter 注册过滤器
 * use 使用插件
 * 
 * 大多数这样的方法都会返回createApp创建出来的应用实例
 * 允许链式操作
 */

// 返回原本的应用实例
app.component('MyTitle', {
    data() {
        return {
            title: 'I love Vue'
        }
    },
    template: `<h1 v-to-lower-case>{{title}}</h1>`
}).directive('toLowerCase', {
    mounted(el) {
        el.addEventListener('click', function() {
            this.innerText = this.innerText.toLowerCase();
        }, false)
    }
}).mount('#app')
```

根组件实例(`vm`)
```javascript
/**
 * 根组件的本质就是一个对象 {}
 * createApp执行的时候需要一个根组件 createApp({})
 * 根组件是Vue渲染的起点
 * 
 * 根元素是一个HTML元素
 * createApp执行创建Vue应用实例时，需要一个HTML元素
 * <div id="app"></div>
 */

const RootComponent = {
    data() {
        return {
            a: 1,
            b: 2,
            total: 0
        }
    },
    mounted() {
        this.plus();
    },
    methods: {
        plus() {
            this.total = this.a + this.b
        }
    },
    template: `<h1>{{a}} + {{b}} = {{total}} </h1>`
}

const app = Vue.createApp(RootComponent);

/**
 * mount方法执行返回的是根组件实例
 * vm -> viewModel -> MVVM -> VM
 * Vue不是一个完整的MVVM模型
 */

const vm = app.mount('#app');
console.log(vm.a, vm.b, vm.total);
```

组件实例
```javascript
/**
 * 每个组件都有自己的组件实例
 * 一个应用中所有的组件否共享一个应用实例
 * 无论是根组件还是应用内其他组件，配置选项、组件的行为都是一样的
 * 
 * 组件实例可以添加一些属性 property
 * data/props/components/methods....
 * this -> $attrs/$emit Vue组件实例内置方法
 */

const MyTitle = {
    props: ['content'],
    template: `
        <h1 :title="content">
            <slot></slot>
        </h1>
    `,
    mounted() {
        console.log(this);
    }
};

const MyAuthor = {
    template: `
        <p>
            Author: <slot></slot>
        </p>
    `
};

const MyContent = {
    template: `
        <p @click="toLowerCase">
            <slot></slot>
        </p>
    `,
    methods: {
        toLowerCase() {
            this.$emit('to-lower-case')
        }
    }
};

const App = {
    components: {
        /**
         * title author content
         */
        MyTitle,
        MyAuthor,
        MyContent
    },
    data() {
        return {
            title: 'This is TITLE',
            author: 'Tom',
            content: 'This is CONTENT'
        }
    },
    template: `
        <div>
            <my-title :content="content">{{title}}</my-title>
            <my-author>{{author}}</my-author>
            <my-content @to-lower-case="toLowerCase">{{content}}</my-content>
        </div>
    `,
    methods: {
        toLowerCase() {
            this.content = this.content.toLowerCase();
        }
    }
}



const app = Vue.createApp(App);
const vm = app.mount('#app');
console.log(vm);
```

## 生命周期函数
```javascript
/**
 * 生命周期函数
 * 
 * 组件是有初始化过程的
 * 在这个过程中，Vue提供了很多每个阶段运行的函数
 * 函数会在对应的初始化阶段自动运行
 */
```