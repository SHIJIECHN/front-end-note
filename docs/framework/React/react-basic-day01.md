---
autoGroup-1: React
sidebarDepth: 3
title: 简单认识React
---

## React
学习要求：
- 深度学习原则
- 站在React立场上去理解React的设计理念
- 理解API设计的初衷
- 阅读官方文档

React是什么？

构建用户界面的JavaScript库，

React主观意愿是什么？
1. React 仅仅负责View层渲染
2. React是一个视图渲染的工具库，不做框架的事情，不做自定义指令，不做数据类型强处理

为什么要这么设计React？

对比与vue option横向拆分（data，methods写法较为固定）组件的方式只适用于中小型应用（简单页面数据展示），一旦数据庞大时组件间事件传递数据，不管是否用vuex都会是一个繁琐的操作。

对比React只关注视图，逻辑的写法偏向纵向，可以容易拆分，也可以结合各种设计思想进行模块之间的设计编写，开发者思想清晰时可以对组件更加好的拆分，代码非常的干净，方法可以单独封装后进行组件内部使用，事件传递和数据传递也简单，也更加好的管理和维护，场景上更加复杂的应用场景，后台系统，开发社区也较为成熟。

## 使用React
简单使用React。怎么负责视图渲染？
```javascript
// 1. 添加根容器
<div id="app"></div>

// 2. 引入CDN脚本
// 开发环境
// 注意：script标签新增属性crossorigin src="..."以保持请求时允许跨域
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

// 3. 创建React脚本
class MyButton extends React.Component {
    constructor(props) {
        super(props);

        // 创建state 相当于vue data
        this.state = {
            openStatus: false
        }
    }

    // 渲染视图必须放入render函数里
    render() {
        return '视图'
    }
}
```
总结：
1. React提供了ReactAPI专门处理视图的API集合
2. ReactDOM：从render函数到虚拟DOM节点到真实DOM节点需要用的库

### 1. React.createElement
```javascript
/**
 * React.createElement
 * 标签名称
 * 新增属性
 * 标签文本内容/子节点标签
 */
React.createElement('div', {
'data-tag': 'div'
}, 'This is my first React experience')
```
```javascript
/**
 * ReactDOM.render(){}
 * react元素
 * 挂载的容器节点
 */
ReactDOM.render(
    React.createElement('div', {
            'data-tag': 'div'
        },
        'This is my first React experience'
    ),
    document.getElementById('app')
)

// 页面元素
<div id="app">
    <div data-tag="div">This is my first React experience</div>
</div>
```
```javascript
// 手动新增子节点的写法
// 1. 新增子节点
// 2. class写法是className
// 3. 子节点插入到[]
var span = React.createElement('span', {
    className: 'text',
    key: 1
}, 'This is a span');

ReactDOM.render(
    React.createElement('div', {
        'data-tag': 'div'
    }, [span]),
    document.getElementById('app')
)

// 页面元素
<div id="app">
    <div data-tag="div">
        <span class="text">This is a span</span>
    </div>
</div>
```
React.createElement方法也可以接受React类组件作为参数去创建一个真实节点
```javascript
ReactDOM.render(
    React.createElement(MyButton),
    document.getElementById('app')
)

// 页面元素
<div id="app">视图</div>
```

总结：
1. 继承React.Component
2. render函数返回视图

## 搭建React
创建一个React
```javascript
/**
 * 创建React 17.0.2版本的要求
 * Node>=10.16
 * NPM >= 5.6
 */

// 1. 创建一个脚手架
// 脚手架内部的工程化实现：babel/webpack
// npx命令：npm5.2+ 版本自带的命令
npx create-react-app my-react-app

// 2. 进入文件夹
cd my-react-app

// 3. 启动开发环境
yarn start/npm start
```