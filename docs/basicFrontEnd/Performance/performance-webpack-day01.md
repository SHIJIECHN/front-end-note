---
autoGroup-4: Webpack
sidebarDepth: 3
title: Webpack简介/Loader
---

## webpack
模块化规范：`ES module`/ `CommonJS`/ `AMD`/ `CMD`.     
`webpack`是模块打包工具。     
支持模块的类型：`js`, `css`, `vue`, `png`, `jpg`...，默认支持`js`模块，其余需要配置。
```javascript
npx webpack // Insufficient number of arguments or no entry found
```
1. 创建`webapck.config.js`文件，指定入口文件。
```javascript
// webapck.config.js
module.exports = {
    entry: './index.js'
}
```
再执行`npx webpack`就会去找`entry`配置。  
2. 更改生成的目录名字
```javascript
// webapck.config.js
const path = require('path');

module.exports = {
    // npx webpack查找的入口文件
    entry: './src/index.js',
    // 改变生成的目录名字
    output: {
        filename: 'bundle.js', // 生成的文件名为bundle.js，如果没有默认是main.js
        path: path.resolve(__dirname, 'dist') // 输出的文件夹名。路径需要配置成绝对路径，这里需要用到path模块。__dirname是当前webpack.config.js所在的目录的名字，也就是这里的webpackTest文件夹，拼接dist是将bundle.js放到dist文件夹下。
    }
}
```
3. `webapck.config.js`是`webpack`的默认配置文件，如果创建的文件不叫这个名字，而是`wbpack.dev.config.js`，就需要在打包的时候设置。
```javascript
npx webpack --config ./webpack.dev.config.js
```

## 图片
图片`loader`： `file-loader`、`url-loader`
```javascript
// index.js
import jspp from './jspp.jpg'
```
报错：    
`ERROR in ./src/jspp.jpg.You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file`

1. `file-loader`
安装依赖：`npm install file-loader --save-dev`
```javascript
// webapck.config.js
module.exports = {
    // ...
    // 模块，告诉webpack遇到什么模块应该怎么处理
     module: {
        rules: [
            // 图片loader: file-loader
            {
                test: /\.(jpg|png\jpe?g|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 最终打包生成的图片名与原图片名相同
                        name: '[name].[ext]',
                        // 生成的图片放到imgs文件夹下
                        outputPath: 'imgs/'
                    }
                }
            }
        ]
    }
}
```
当在源代码中引入图片模块，`file-loader`把图片从源代码目录移动到`dist`目录中，并且改了文件名。

2. `url-loader`
返回的是`base64`编码字符串。图片直接插入到生成的`bundle.js`文件中，不会单独生成到`imgs`文件夹中。   
    - 如果图片很大，对应的`base64`字符串也很大，直接插入使`bundle.js`文件也会臃肿，造成`index.html`加载`bundle.js`时间很长。因此，大图片适合使用`file-loader`单独生成一个文件，`index.html`引入文件。    
    - 如果图片很小，单独生成图片文件，缺点就是需要多发送一次`HTTP`请求。因此，小图片适合使用`url-loader`直接解析成`base64`字符串，设置到`img src`属性上，就不需要发送额外的请求图片的`HTTP`请求。
      
安装依赖：`npm install url-loader --save-dev`
```javascript
// webapck.config.js
module.exports = {
    module: {
        rules: [
            // 图片loader
            {
                test: /\.(jpg|png\jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 最终打包生成的图片名与原图片名相同
                        name: '[name].[ext]',
                        // 生成的图片放到imgs文件夹下
                        outputPath: 'imgs/',
                        // 如果图片大于20kb，就单独生成一个图片文件；如果小于20kb就解析成base64字符串直接设置到img src中
                        limit: 20480 // 20kb 
                    }
                }
            },
        ]
    }
}
```

## 样式

### css文件
新建`index.css`并导入
```javascript
// index.js
import './index.css'
```
报错:   
`ERROR in ./src/index.css. Module parse failed: Unexpected token (1:0). You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file `   

安装依赖： `npm  install css-loader@5.2.7 style-loader@2.0.0 --save-dev `
```javascript
// webapck.config.js
module.exports = {
    module: {
        rules: [
            // 样式loader
            {
                test: /\.css$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    'style-loader', // 插入到style标签中
                    'css-loader' // 分析css代码
                ]
            }
        ]
    }
}
```

安装`css-loader`, `style-loader`版本与`webpack`版本不相符，出现错误：    
`ERROR in ./src/index.css. Module build failed (from ./node_modules/style-loader/dist/cjs.js): TypeError: this.getOptions is not a function at Object.loader.`

解决：如何找到`webpack`对应的`loader`版本？  
1. 首先要知道自己的`webpack`的版本
2. 在`github`中查找想要使用的`loader`
   以[css-loader](https://github.com/webpack-contrib/css-loader/blob/v5.2.7/package.json)为例
3. 通过`Tags`选项选择不同的版本
 <img :src="$withBase('/basicFrontEnd/Performance/webpack-loader01.png')" alt="webpack-loader01"> 

4. 查看`package.json`文件，寻找当前版本的`loader`适用的`webpack`版本。
 <img :src="$withBase('/basicFrontEnd/Performance/webpack-loader02.png')" alt="webpack-loader02"> 

5. 最后通过`npm install --save-dev css-loader@5.2.7`进行安装。

### scss文件
```javascript
// index.scss
body {
    background-color: #f4f4f4;
    img {
        width: 200px;
    }
}
```
引入
```javascript
// index.js
import './index.scss';
```
打包报错：   
`ERROR in ./src/index.scss 1:5. Module parse failed: Unexpected token (1:5)You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.`   

安装依赖：`npm install sass-loader@10.2.1 node-sass@4.14.1 --save-dev`

```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 样式loader
            {
                test: /\.scss$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    'style-loader', // 插入到style标签中
                    'css-loader', // 分析css代码
                    'sass-loader' // 转换成css代码
                ]
            }
        ]
    }
}
```

`node-sass`安装失败：`gyp verb 'which' failed Error: not found: python2`。提示没有安装`Python`。    
解决：
1. 下载安装`Python`。
2. 删除文件夹下`package-lock.json`文件，将`node-sass`版本号修改为需要安装的版本号。再进行`npm install`。

### 样式前缀
`postcss-loader`: 主要是为了解决在低版本浏览器中无法使用`CSS3`的语法（如`transform`），使用`postcss-loader`处理后可以为属性添加厂商前缀（如`-webkit-transform`）。
安装：`npm i -D postcss-loader@4.3.0`  
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 样式loader
            {
                test: /\.scss$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    'style-loader', // 插入到style标签中
                    'css-loader', // 分析css代码
                    'postcss-loader',  // 注意：需要放在sass-loader之后
                    'sass-loader' // 转换成css代码
                ]
            }
        ]
    }
}
``` 
`postcss-loader`必须与插件`autoprefixer`一起使用。
安装： `npm i autoprefixer@^9.8.8 -D` 
根目录下创建`postcss.config.js`配置文件
```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
当运行发现，浏览器中并没有加上前缀，这是因为当前浏览器可以识别`transform`属性，就不再加前缀了。那么我们还需要通过`package.json`文件，添加配置项`browserslist`，来让我们的项目面向的浏览器的范围更宽。
```JSON
// package.json
"browserslist": [
    "> 1%", //市场份额>1%
    "last 2 versions" // 并且上了2个版本
],
```

### 引用scss文件
当`scss`文件中再引入另一个`scss`文件时
```scss
// index.scss
@import './logo.scss';
```
老版本的浏览器会发生错误，此时需要增加对`css-loader`的配置参数。为`css-loader`单独添加配置。
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 样式loader
            {
                test: /\.scss$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    'style-loader', // 插入到style标签中
                    {
                        loader: 'css-loader', // 分析css代码
                        options: {
                            importLoaders: 2 // 还要走前面2个loader，也就是postcss-loader和sass-loader
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}
```

### 字体文件
新增配置
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 字体文件loader
            {
                test: /\.(eot|svg|ttf|woff)/,
                loader: 'file-loader'
            }
        ]
    }
}
```


