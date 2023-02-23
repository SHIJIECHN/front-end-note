---
autoGroup-4: Hook
sidebarDepth: 3
title: React
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

1. create-react-app基于运用
```javascript
npx create-react-app my-app
cd my-app
npm start
```

一个React项目中，默认安装：
- react：React框架的核心
- react-dom：React视图渲染的核心，基于React构建WebApp（HTML页面）。
- react-native：构建和渲染App的
- react-script：脚手架为了让项目目录看起来干净一些，把webpack打包的规则及相关的插件/loader等都隐藏到了node_modules目录下，react-script就是脚手架中自己对打包命令的一种封装，基于它打包，会调用

目录文件分析：

package.json
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
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
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



## 2. 搭建React开发环境
```javascript
npx create-react-app my-app
cd my-app
npm start
```

默认会自动安装React，React由两部分组成，分别是：
- React.js 是React的核心库
- react-dom.js 是提供与DOM相关的功能，内部比较重要的方法是render，它用来向浏览器里插入DOM元素

## 3. JSX
