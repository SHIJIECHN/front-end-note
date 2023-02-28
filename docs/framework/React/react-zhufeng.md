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
   1. src目录中新建setupProxy.js
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

2. 