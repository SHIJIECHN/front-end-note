---
autoGroup-4: React基础
sidebarDepth: 3
title: 组件化与JSX
---

## 1. 组件化开发的概念
我们可以很直观的将一个复杂的页面分割成若干个独立组件，每个组件包含自己的逻辑和样式，再将这些独立租金啊组合完成一个复杂的页面。这样既减少了逻辑复杂度，又实现了代码的重用。
  - 可组合：一个组件可以和其他的组件一起使用或者可以直接嵌套在另一个组件内部
  - 可重用：每个组件都是具有独立功能的，它可以被使用在多个场景中
  - 可维护：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护


如何划分组件？

业务组件：针对项目需求封装的
  - 普通业务组件，没有啥复用性，只是单独拆出来的一个模块
  - 通用业务组件，具有复用性。如Header、Nav
  
功能组件：使用于多个项目。例如UI组件库中的组件
  - 通用功能组件

因为组件化开发，必然会带来**工程化**的处理，也就是基于webpack等工具，如vite、rollup、turbopack
  + 实现组件的合并、压缩、打包等
  + 代码编译、兼容、校验等


## 2. React的工程化/组件化开发
哦我们可以基于webpack自己去搭建一套工程化打包的架子，但是这样非常的麻烦、复杂；React官方为我们提供了一个脚手架: create-react-app.

+ 脚手架：基于它创建项目，默认就把webpack的打包规则已经处理好了。把项目需要的基本文件也创建好了。

create-react-app基于运用

```javascript
npx create-react-app my-app
cd my-app
npm start
```

项目目录：
|-node_modules
|-src : 所有后续编写的代码，几乎都放在src下，打包的时候，一般只对这个目录下的代码进行处理
|-public：放页面模板
|-package.json

%PUBLIC_URL%： 后期webpack打包的时候，会对这个语法进行编写，代表：public这个目录。

一个React项目中，默认安装：
- react：React框架的核心
- react-dom：React视图渲染的核心，基于React构建WebApp（HTML页面）。
- react-native：构建和渲染App的
- react-script：脚手架为了让项目目录看起来干净一些，把webpack打包的规则及相关的插件/loader等都隐藏到了node_modules目录下，react-script就是脚手架中自己对打包命令的一种封装，基于它打包，会调用node_modules中的webpack等处理。

目录文件分析：

1. package.json
```json
{
  "name": "example", 
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4" // 性能检测工具
  },
  /**
    打包命令是就与react-script处理
  */
  "scripts": {
    "start": "react-scripts start", // 开发环境，在本地启动web服务器，预览打包内容
    "build": "react-scripts build", // 生产环境：打包部署，打包的呢绒输出到dist目录中
    "test": "react-scripts test", // 单元测试
    "eject": "react-scripts eject" // 暴露webpack配置规则
  },
  /**
    对webpack中ESLint测法检测的相关配置
    词法检测：
    + 词法错误：不符合标准规范 let var = 10。
    + 符合标准，代码本身不会报错，但是不符合ESLint的检测规范。 const num = 20; num声明了，但是没有使用。
  */
  "eslintConfig": { 
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  /**
    基于browserList规范，设置浏览器的兼容情况
    @1 postcss-loader + autoprefixer会给CSS3设置相关的前缀
    @2 babel-loader 会把ES6编译为ES5
 */
  "browserslist": {
    "production": [
      ">0.2%", // 使用率超过0.2%的浏览器
      "not dead", // 不考虑IE
      "not op_mini all" // 不考虑Opera

      // 兼容IE配置
      ">0.2%",
      "last 2 versions",
      "not ie<=8"
    ],
    "development": [ // 默认不兼容低版本和IE浏览器的
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```

## 3. 脚手架进阶

暴露配置项。

```javascript
yarn eject  
// y 一旦暴露出来，就无法还原回去
```
有一个错误，这个错误：我们刚刚把代码改了，在暴露之前，先让我们把代码提交到git历史取保留下来，防止暴露后的代码覆盖了我们之前的代码。
- 本地有git仓库
- 代码在暴露之前修改过

```javascript
git add -A
git commit -m 'init'
```

再次执行命令，就可以了。

改变的package.json

```json
{
  "name": "example",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@babel/core": "^7.16.0", //es6 -> es5
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.3", // 刷新
    "@svgr/webpack": "^5.5.0",
    "@testing-library/jest-dom": "^5.16.5", // 单元测试
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "babel-jest": "^27.4.2", // babel
    "babel-loader": "^8.2.3",
    "babel-plugin-named-asset-import": "^0.3.8",
    "babel-preset-react-app": "^10.0.1", // 对@babel/preset-env语法包的重写，目的是把ES6转ES5，重写的目的就是让语法包可以识别React语法，实现代码转换
    "bfj": "^7.0.2",
    "browserslist": "^4.18.1",
    "camelcase": "^6.2.1", // 语言处理
    "case-sensitive-paths-webpack-plugin": "^2.4.0",
    "css-loader": "^6.5.1",
    "css-minimizer-webpack-plugin": "^3.2.0",
    "dotenv": "^10.0.0",
    "dotenv-expand": "^5.1.0",
    "eslint": "^8.3.0",
    "eslint-config-react-app": "^7.0.1",
    "eslint-webpack-plugin": "^3.1.1",
    "file-loader": "^6.2.0",
    "fs-extra": "^10.0.0",
    "html-webpack-plugin": "^5.5.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^27.4.3",
    "jest-resolve": "^27.4.2",
    "jest-watch-typeahead": "^1.0.0",
    "mini-css-extract-plugin": "^2.4.5", // 提取css
    "postcss": "^8.4.4", // 结合autoprefixer
    "postcss-flexbugs-fixes": "^5.0.2",
    "postcss-loader": "^6.2.1",
    "postcss-normalize": "^10.0.1",
    "postcss-preset-env": "^7.0.1",
    "prompts": "^2.4.2",
    "react": "^18.2.0",
    "react-app-polyfill": "^3.0.0",
    "react-dev-utils": "^12.0.1",
    "react-dom": "^18.2.0",
    "react-refresh": "^0.11.0",
    "resolve": "^1.20.0",
    "resolve-url-loader": "^4.0.0",
    "sass-loader": "^12.3.0", // create-react-app 默认配置的是sass，项目中用的是sass，则无需再处理了。但是用的是less/stylus，则还需要处理。
    "semver": "^7.3.5",
    "source-map-loader": "^3.0.0",
    "style-loader": "^3.3.1",
    "tailwindcss": "^3.0.2",
    "terser-webpack-plugin": "^5.2.5",
    "web-vitals": "^2.1.4",
    "webpack": "^5.64.4",
    "webpack-dev-server": "^4.6.0",
    "webpack-manifest-plugin": "^4.0.2",
    "workbox-webpack-plugin": "^6.4.1"
  },
/**
不再用react-script封装的插件执行命令了，直接基于node，去执行对应的入口文件
eject命令没有了，执行yarn eject是不可逆的，暴露之后，无法再隐藏回去了。
 */
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js"
  },
  "eslintConfig": {
    // ...
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "jest": {
    //...
  },
/**
类似于babel.config.js，对babel-loader的额外配置。
 */
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

项目常见的配置修改：

1. sass -> less

```javascript
yarn add less@4.1.3 less-loader@^8

yarn remove sass-loader
```

create-react-app脚手架默认webpack规则的修改：直接去暴露的源码中改。

2. 别名：alias

3. 修改域名和端口号

如果想基于修改环境变量的方式来改
```javascript
yarn add cross-env
// 修改端口号

```

4. 改浏览器兼容。修改兼容列表，实现浏览器兼容
   - 对postcss-loader生效：控制CSS3的前缀
   - 对babel-loader生效：控制ES6的转换
  
遗留的问题：无法处理ES6内置API的兼容。我们需要@babel/polyfill对常见内置的API重写了。

可以：
```javascript
yarn add @babel/polyfill
// 在入口中 import '@babel/polyfill'
```
脚手架中不需要我们自己安装。

react-app-polyfill对@babel/polyfill的重写。

5. 处理跨域
   1. src目录中新建setupProxy.js（注意：必须时js，不能为ts，ts不生效）
   2. yarn add http-proxy-middleware。http-proxy-middleware实现跨域代理模块，webpack-dev-server的跨域代理原理，也是基于它完成的

如果不想这样太麻烦的写法：可以在package.json中定义一个字段：proxy: '...', 但是proxy后面只能跟字符串，也就是只能代理到一台服务器上。

## 4. MVC模式和MVVM模式
React是Web前端框架
1. 目前市面上比较主流的前端框架
   - React
   - Angular
   - Vue
  主流的思想：不在直接操作DOM，而是改为“数据驱动思想”.

  操作DOM思想：
  - 操作DOM比较消耗性能，主要原因就是：可能会导致DOM重排（回流）/ 重绘。
  - 操作起来也相对麻烦一些

  数据驱动思想：
  - 我们不会再直接操作DOM
  - 我们去操作数据，当我们修改了数据，框架会按照相关的数据，让页面重新渲染
  - 框架底层实现视图的渲染，也是基于操作DOM完成的
    - 构建了一套虚拟DOM-> 真实DOM的渲染体系
    - 有效避免了DOMd重排/重绘
  - 开发效率更高、最后的性能也相对较好

2. React框架采用的是MVC体系，Vue框架采用的是MVVM体系。
   - MVC： model数据层 + view视图层 + controller控制层
     - 1. 我们需要按照专业的语法去构建视图（页面）：React中式基于jsx语法来构建视图的
     - 2. 构建数据层：但凡在视图中，需要“动态”处理的（获取需要变化的，不管是样式还是内容），我们豆要有对应的数据模型。
     - 3. 控制层：当我们在视图中（或者根据业务需求）进行某些操作的时候，都是去修改相关的数据，然后React框架会按照罪行的数据，重新渲染视图，以此让用户看到最新的效果。
  
    数据驱动视图的渲染
    视图中的表单内容改变，想要修改数据，需要开发者自己去写代码实现
  
   - MVVM：model数据层 + view视图层 + viewModel数据/视图监听层
     - 1. 数据驱动视图渲染：监听数据的更新，让视图重新更新
     - 2. 视图驱动数据的更改：监听页面中表单元素内容改变，自动去修改相关的数据
    "双向驱动"

## 5. JSX语法使用的细节

### 5.1 JSX构建视图基础知识

JSX：JavaScript and xml(html)把JS和HTML标签混合在一起，并不是我们之前写的字符串拼接。

- @1 vscode如何支持JSX语法（格式化、快捷提示）
  + 创建的js文件，把后缀名社会为jsx即可，这样js文件中就可以支持JSX语法了
  + webpack打包规则中，也是会对.jsx这种文件，按照JS的方式进行处理
- @2 在HTML中嵌入“JS表达式”，需要基于“{} 胡子语法”
  + JS表达式：执行有结果的。变量、数学运算、三元运算符、循环（借助于数组的迭代方法处理map、）。不是JS表达式：if循环、命令式变成的循环（for、for/in、for/of、while）。
- @3 在ReactDOM.createRoot()的时候，不能直接把HTML/BODY作为根容器，需要指定一个额外的盒子，例如：#root。
- @4 每一个构建的视图，只能有一个“根节点”
  - 出现多个根节点则报错，Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>？
  - React给我们提供了一个特殊的标签（节点）：<></> React.Fragment 空文档标题标签。即保证了只有一个根节点，又不新增一个HTML层级结构。


```javascript
import React from 'react'; // React 语法核心
import ReactDOM from 'react-dom/client'; // 构建HTML（WebApp）的核心

// 获取页面中#root的容器，作为“根”容器
const root = ReactDOM.createRoot(document.getElementById('root'));

// 基于render方法渲染我们编写的视图，把渲染后的内容全部插入到#root中进行渲染
root.render(
  ....
)
```

## 6. JSX

- React元素是构建React应用的最小单位，也就是所谓的虚拟DOM
- React元素本身是不可变的

```javascript
// 两种方式等效
// 方式一
let element = (
  <div className='title' style={{ color: 'orange' }}>
    <span>hello</span> hello
  </div>
)
// 方式二
let element = React.createElement("div", {
  className: 'title',
  style: {
    color: 'red'
  }
}, React.createElement('span', null, 'hello'), 'world');
```

### 1. 创建虚拟DOM

createElement就是创建虚拟DOM，createElement传入参数：
- type：节点类型
- config：配置项，如children
- children：子节点，可以有多个子节点。
- 返回一个对象。

思路：
1. 需要获取配置项，配置项中可能可能包括className、style等信息
2. 通过传入的参数判断是否有子节点，并新增children属性数组，存放子节点。

```js
function createElement(type, config, children){
  let props = { ...config }; // 配置项
  if (arguments.length > 3) { // 实际传入的参数如果大于3，说明有多个儿子节点
    // 为了后续DOM-Diff方便，我们主动在这里进行了一些处理，源码里面没有
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // children：字符串、数字、null、undefined、数组
    props.children = wrapToVdom(children);
  }
  return {
    type,
    props
  }
}
```

### 2. 将虚拟DOM转成真实DOM并挂载到页面中

主要是使用render函数，将虚拟节点转成真实DOM节点。并挂载到页面中。

思路：
1. 首先转换节点
  - 通过type属性判断是文本节点还是元素节点，文本节点使用document.createTextNode创建，元素节点使用document.createElement创建
  - 根据虚拟props，更新真实节点的属性。
  - 处理子元素props.children，如果多个子元素需要递归。
2. 使用appendChild，将节点挂载到root容器中。

```javascript
/**
 * 把虚拟DOM转成真实DOM，插入到容器中
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

/**
 * 把虚拟DOM转成真实DOM
 * @param {*} vdom 虚拟DOM
 */
function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;// 1. 先获取到真实DOM元素
  if (type === REACT_TEXT) { // 如果是一个文本元素，就创建一个文本节点
    dom = document.createTextNode(props.content);
  } else {
    dom = document.createElement(type); // 原生DOM类型
  }
  // 2. 更新元素属性
  if (props) {
    updateProps(dom, {}, props);
    // 它是个对象并且只有一个儿子
    if (typeof props.children == 'object' && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) { // 数组。多个儿子
      reconcileChildren(props.children, dom)
    } else { // null 或 undefined，不处理

    }
  }

  // 让虚拟DOM的dom属性指向它的真实dom
  // vdom.dom = dom;
  return dom;

}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let chilVdom = childrenVdom[i];
    render(chilVdom, parentDOM);
  }
}

/**
 * 根据虚拟DOM中的属性更新真实DOM
 * @param {*} dom 真实DOM
 * @param {*} oldProps 老的属性
 * @param {*} newProps 新的属性
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) { // 遍历新的属性
    if (key === 'children') continue; // 后面会单独处理children属性，所以此方法跳过
    if (key === 'style') { // 样式
      let styleObj = newProps[key]; // 获取到新的样式属性
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom[key] = newProps[key];
    }
  }
}

```

### 3. 完整案例

目录结构：
```javascript
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    ├── constant.js
    ├── index.js
    ├── react-dom.js
    ├── react.js
    └── utils.js
```

:::: tabs
::: tab index.js
```javascript
import React from './react';
import ReactDOM from './react-dom';

/**
 * 1. 实现createElement方法，返回一个react元素
 * 2. 实现render方法，把React元素变成真实的DOM插入到页面root中
 */

let element = React.createElement("div", {
  className: 'title',
  style: {
    color: 'red'
  }
}, React.createElement('span', null, 'hello'), 'world');

console.log(JSON.stringify(element, null, 2))
ReactDOM.render(element, document.getElementById('root'));
```
:::    
::: tab react.js
```javascript
import { wrapToVdom } from './utils.js'
/**
 * 创建元素
 * @param {*} type 类型
 * @param {*} config 配置项
 * @param {*} children 第一个儿子
 */
function createElement(type, config, children) {
  let props = { ...config }; // 配置项
  if (arguments.length > 3) { // 实际传入的参数如果大于3，说明有多个儿子节点
    // 为了后续DOM-Diff方便，我们主动在这里进行了一些处理，源码里面没有
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // children：字符串、数字、null、undefined、数组
    props.children = wrapToVdom(children);
  }
  return {
    type,
    props
  }
}

const React = {
  createElement
}
export default React;
```
::: 
::: tab react-dom.js
```javascript
import { REACT_TEXT } from "./constant.js";
/**
 * 把虚拟DOM转成真实DOM，插入到容器中
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

/**
 * 把虚拟DOM转成真实DOM
 * @param {*} vdom 虚拟DOM
 */
function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;// 1. 先获取到真实DOM元素
  if (type === REACT_TEXT) { // 如果是一个文本元素，就创建一个文本节点
    dom = document.createTextNode(props.content);
  } else {
    dom = document.createElement(type); // 原生DOM类型
  }
  // 2. 更新元素属性
  if (props) {
    updateProps(dom, {}, props);
    // 它是个对象并且只有一个儿子
    if (typeof props.children == 'object' && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) { // 数组。多个儿子
      reconcileChildren(props.children, dom)
    } else { // null 或 undefined，不处理

    }
  }

  // 让虚拟DOM的dom属性指向它的真实dom
  // vdom.dom = dom;
  return dom;

}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let chilVdom = childrenVdom[i];
    render(chilVdom, parentDOM);
  }
}

/**
 * 根据虚拟DOM中的属性更新真实DOM
 * @param {*} dom 真实DOM
 * @param {*} oldProps 老的属性
 * @param {*} newProps 新的属性
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) { // 遍历新的属性
    if (key === 'children') continue; // 后面会单独处理children属性，所以此方法跳过
    if (key === 'style') { // 样式
      let styleObj = newProps[key]; // 获取到新的样式属性
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom[key] = newProps[key];
    }
  }
}

const ReactDOM = {
  render
}

export default ReactDOM;
```
:::
::: tab utils.js
```javascript
import { REACT_TEXT } from "./constant.js";
/**
 * 不管原来是什么样的元素，都转成对象的形式，方便后续的DOM-Diff
 * @param {*} elemnet 
 * @returns 
 */
export function wrapToVdom(element) {
  // 如果是字符串或数字，返回一个对象，也是一个React元素，也是虚拟DOM
  if (typeof element === 'string' || typeof element === 'number') {
    return { type: REACT_TEXT, props: { content: element } };// content就是文本内容
  } else {
    return element
  }
}
```
:::
::: tab constant.js
```javascript
// 表示这是一个文本类型的元素，在源码里没有这样的类型
// 字符串、数字进行特殊处理
export const REACT_TEXT = Symbol('REACT_TEXT');
```
:::
::: tab index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <style>
      .title{
        background-color: green;
        color: orange;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```
:::
::::
