---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack loader
---

## loadre-run


## 实战
- babel-loader
- file-loader
- url-loader
- less-loader
- style-loader
- css-loader
- sass-loader


## babel-loader 

环境配置：
```javascript
npm i webpack-dev-serve
```
package.json
```json
  "scripts": {
    "build": "webpack",
    "start": "webpack serve"
  },
```

webpack.config.js
```javascript

```

想使用自定义的loader？

npm run build 错误：   
Function has non-object prototype 'null' in instanceof check。

解决：node版本，使用node 16.12.0可以解决。

定位到最原始的文件，而不是打包后的：
```javascript
// webpack.config.js
{
  test: /\.js$/,
  // 3
  use: [path.resolve('./loaders/babel-loader.js')],
  include: path.resolve('src'), // 新增
}

// babel-loader.js
const options = { // 传递给babel的参数
  presets: ["@babel/preset-env"], // 声明一个预设
  inputSourceMap,// 上一个loader传递过来的 sourceMap  // 新增
  sourceMaps: true, // 告诉babel我要生成sourceMap // 新增
  filename: path.basename(this.resourcePath), // 新增
}
```


## file-loader

处理图片。

## url-loader


## less-loader & style-loader




