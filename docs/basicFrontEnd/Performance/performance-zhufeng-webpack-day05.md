---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack loader
---

## loader
- loader只是一个导出为函数的JS模块，它接收一个loader产生的结果或者资源文件(resource file)作为入参。也可以用多个loader函数组成loader chain
- compiler需要得到最后一个loader产生的处理结果。这个处理结果应该是string或者Buffer(被转换为一个string)


## loader-run

[loader-runner](https://github.com/webpack/loader-runner#readme)是一个执行loader链条的模块

### 1. loader执行流程

<img :src="$withBase('/basicFrontEnd/Performance/loader-runner.png')" alt="loader-runner" />


### 2. loader的类型
- post（后置）
- inline（内联）
- normal（正常）
- pre（前置）

执行顺序：post => inline => normal => pre

### 3. loader-run执行

```javascript
/** 
 * loader是如何组装和工作的 
 * 1. 为什么说loader的执行是从右向左，从下向上
 * 2. 为什么分成四种loader，loader类型不同决定执行的顺序
 *    因为loader配置是分散的，它可能会有多个配置文件合并而来
 * */

const path = require('path');
const fs = require('fs');
const { runLoaders } = require('loader-runner');
// 源文件的绝对路径 C:/User/src/05.loader/src/index.js
const filePath = path.resolve(__dirname, 'src', 'index.js');
let loaders = [];

// 如何得到 loaders 数组？
// 要加载的资源 require('inline-loader1!inline-loader2!./src/index.js')
const request = `inline-loader1!inline-loader2!${filePath}`;
// 切分，先将前缀去掉，在分割
const parts = request.replace(/^-?!+/, '').split('!');
// 最后一个元素就是要加载的资源文件 ./src/index.js
const resource = parts.pop();
// loader=inline-loader1 => inline-loader1的绝对路径
// c:/user/05.loader/loaders/inline-loader1.js
const resolveLoader = (loader) => path.resolve(__dirname, 'loaders', loader);
// inlineLoaders = [inline-loader1的绝对路径, inline-loader2的绝对路径]
const inlineLoaders = parts.map(resolveLoader);
// 配置文件rules数组
const rules = [
  {
    test: /\.js$/,
    enforce: 'pre', // 一定先执行
    use: ['pre-loader1', 'pre-loader2']
  },
  {
    test: /\.js$/, // 没有设置，默认是normal
    use: ['normal-loader1', 'normal-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'post', // post webpack保证一定是最后执行的
    use: ['post-loader1', 'post-loader2']
  },
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  // 正则匹配上了模块的路径
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') { // enforce: 'pre'
      preLoaders.push(...rule.use)
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use)
    }
  }
}
// 通过loader名字，获得loader绝对路径
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);

if (request.startsWith('!!')) { // 不要pre、post、normal
  loaders = [...inlineLoaders];
} else if (request.startsWith('-!')) { // 不要pre、normal
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) { // 不要normal
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}

console.log(loaders);

/**
 * 1. 读取要加载的资源
 * 2. 把资源传递给loader链条，一一处理，最后得到结果
 */
runLoaders({
  // 加载和转换的资源 可以包含查询字符串
  resource,
  // loader的绝对路径
  loaders,
  // 额外的loader上下文对象
  context: { name: 'zhufeng' },
  // 读取文件的方法
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  console.log(err)
  console.log(result);
  // "console.log('hello index.js');\r\n" + '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
})

/**
 console.log(loaders);
 [
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader2'
]
 */
/**
 loader里面内容输出：
 post1-pitch
post2-pitch
inline1-pitch
inline2-pitch
normal1-pitch
normal2-pitch
pre1-pitch
pre2-pitch
pre2
pre1
normal2
normal1
inline2
inline1
post2
this.name:  zhufeng
post1
 */

/**
console.log(result);
{
  result: [
    "console.log('hello index.js');\n" +
      '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
  ],
  resourceBuffer: <Buffer 63 6f 6e 73 6f 6c 65 2e 6c 6f 67 28 27 68 65 6c 6c 6f 20 69 6e 64 65 78 2e 6a 73 27 29 3b 0a>,
  cacheable: true,
  fileDependencies: [
    'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\src\\index.js'
  ],
  contextDependencies: [],
  missingDependencies: []
}
 */
```

loader文件夹中，统一写成：
```javascript
function loader(source) {
  console.log('pre1');
  return source + '//pre1'
}
loader.pitch = function () {
  console.log('pre1-pitch');
}
module.exports = loader
```

### 4. 特殊配置
|符号|含义|
|----|:----|
|!!|不要后置、普通、前置loader，只要内联loader|
|-!|不要普通、前置loader|
|!|不要普通loader|

### 5. pitch
- a!b!c!module，正常调用顺序是c、b、a，但是真正的调用顺序是a(pitch)、b(pitch)、c(pitch)。
- c、b、a任意其中一个pitch返回了值就相当于它以及右边的loader不再执行。比如如果b返回了字符串"result b"，则只有a会被系统执行，且a的loader接收到的参数result b。
- 根据loader的返回值，可以loader分成两种：
  - 1. 最左边的loader。返回值只能是JS代码，因为它的返回值是给webpack，webpack是要用它生成JS AST
  - 2. 其他的loader。返回值没有要求，可以是任意的内容，但是需要下一个loader能处理

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




