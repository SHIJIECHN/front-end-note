---
autoGroup-1: Webpack
sidebarDepth: 3
title: 5. 代码分割
---

## 代码分割
index.js分成两个部分：
1. 业务逻辑的代码
2. lodash 包的代码  

打包后main.js就包括了这两个部分，只要业务代码发生改变，就会重新打包。我们希望只打包业务代码，不用打包lodash部分代码。   
代码分割(Code Splitting)：按照项目结构把第三方库代码或者公共部分代码拆分出去，打包之后的结果也是分开的文件，将来有业务代码发生改变我们也只需要加载业务部分的代码。而公共的代码就不需要加载了，性能得到了提升。
```javascript
// src/lodash.js
import _ from 'lodash'
window._ = _;

// src/index.js
const result = _.join(['test1', 'test2', 'test3']);
console.log(result);

// webpack.base.js
module.exports = {
    entry: {
        lodash: './src/lodash.js', // 注意顺序
        main: './src/index.js'
    }
}
```
```javascript
// webpack.config.js
module.exports = {
    // 优化配置项
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: false,
                default: false
            }
        }, // webpack帮助我们代码分割
    },
}
```
打包出来dist：

<img :src="$withBase('/basicFrontEnd/Performance/webpack-splitChunk01.png')" alt="webpack-splitChunk01"> 

## splitChunk参数
1. chunks
```javascript
// webpack.config.js
module.exports = {
    // 优化配置项
    optimization: {
        splitChunks: {
            chunks: 'async'
        }, // webpack帮助我们代码分割
    },
}
```
### 1. index.js为异步代码：
```javascript
function createElement() {
    return import ( /*webpackChunkName: "lodash"*/ 'lodash').then(({ default: _ }) => {
        const result = _.join(['test1', 'test2', 'test3'], '-');
        const div = document.createElement('div');
        div.innerText = result;
        return div;
    })
}
// 代码只有执行到createElement()，以上异步的代码才会被执行，lodash才会被引用
const createElementPromise = createElement();
createElementPromise.then(div => {
    document.body.appendChild(div);
})
```
打包结果dist：

<img :src="$withBase('/basicFrontEnd/Performance/webpack-splitChunk02.png')" alt="webpack-splitChunk02">        

### 2. index.js为同步代码
```javascript
import _ from 'lodash'

const result = _.join(['test1', 'test2', 'test3']);
const div = document.createElement('div');
div.innerText = result;
document.body.appendChild(div);
```
打包结果dist：

<img :src="$withBase('/basicFrontEnd/Performance/webpack-splitChunk03.png')" alt="webpack-splitChunk03" />  

代码没有进行分割，所有的代码都在main.js中。当chunks为async时只会对异步代码进行打包，如果要对同步代码也进行打包，chunks设置为all。
```javascript
// webpack.config.js
module.exports = {
    // 优化配置项
    optimization: {
        splitChunks: {
            chunks: 'all'
        }, // webpack帮助我们代码分割
    },
}
```
同步代码打包结果： 

<img :src="$withBase('/basicFrontEnd/Performance/webpack-splitChunk04.png')" alt="webpack-splitChunk04">    

输出是文件名有vendors~main.js。如果想要修改文件的名字就需要配置项CacheGroup配置。
```javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',  
            cacheGroups: {
                // 'verdors'决定输出的文件名：verdors~main.js。如果修改为test，那么输出的文件名就是test~main.js
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    } 
}
```
我们在打包一个同步代码的时候，我们告诉webpack我们通过slitChunk做代码分割，chunks为all，也就是同步异步代码都要分割。默认打包出来的文件名是verdors~main.js，设置了cacheGroups意思就是想更加精确的控制输出的文件，就会检查导入的模块是来自哪里，这里的lodash是来自node_modules的，此时就会匹配到verdors这一项（verdors->test），输出文件的前缀就会有vendors。main是因为我们引入lodash的文件是index.js，index.js对应的入口文件名为main（webpack中entry配置）。
```javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000, // 如果引入的包大于30kb的话，就进行代码分割。小于就不进行代码分割
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, // 优先级
                    // 自定义打包出来的第三方包文件名就叫vendors.js
                    filename: 'vendors.js'
                }
            }
        }
    } 
}
```
minChunks参数
```javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
             // 缓存组，设置了这个配置项，可以将多个第三方包（lodash，jQuery等）打包到一起-> vendors.js
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: 'vendors.js',
                    minChunks: 2, 
                    // 默认为1，一个模块在入口文件里面被使用了多少次，由于测试的lodash只引入来一次，
                    // 所以就不会进行代码分割
                },
                // 公共模块
                default: {
                    minChunks: 2, // 一般设置为2
                    priority: -20,
                    reuseExistingChunk: true, // 已经存在的chunks就进行复用
                    filename: 'common.js'
                }
            }
        }
    } 
}
```


## CSS分割
在生产环境中，css文件通过link的方式引入，而不是直接插入style标签中。   
插件mini-css-extract-plugin安装：
```javascript
npm install mini-css-extract-plugin@1.6.2 --save-dev    
```
只需要在生产环境中使用因此需要将开发环境配置进行修改，同时生产环境中对css文件loader处理与开发环境不同，因此需要将css的loader的配置分别提取到开发环境与生产环境配置中。
```javascript
// webpack.prod.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [{
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
        }, ]
    }
}

// webpack.dev.js
module.exports = {
    module: {
        rules: [{
            test: /\.css$/i,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader'
            ]
        }, ]
    }
}
```
打包后发现，没有css文件， 在index.html中也没有style标签。主要是因为Tree Shaking的原因，因为index.css引入后并没有使用。需要修改package.json中sizeEffects。
```json
"sizeEffects": [
    "*.css"
]
```
当我们做Tree Shaking的时候不用管css文件。   


生产环境下压缩css代码：   
安装css-minimizer-webpack-plugin：

```javascript
npm install css-minimizer-webpack-plugin@1.3.0 --save-dev
``` 
```javascript
// webpack.prod.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        // minimize: true, 如果实在生产环境，需要设置
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    }
}
```

打包后将多个css文件合并成一个文件，配置
```javascript
// webpack.prod.js
module.exports = {
    optimization: {
        //  minimize: true, 如果实在生产环境，需要设置
        minimizer: [
            new CssMinimizerPlugin(), // css代码压缩
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true, // 不管默认规则，只要是css文件，都分割
                },
            },
        },
    },
}
```


如果多个文件都用到lodash变量的模块实例，不需要文件引入，直接webpack配置。还可以暴露模块中单个值
```javascript
//webpack.config.js
module.exports = {
    plugins: [
         new webpack.ProvidePlugin({
            '_': 'lodash', // lodash变量
            'join': ['lodash', 'join'], //  lodash的join方法
        })
    ]
}

// index.js
function component() {
    const element = document.createElement('div');
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = join(['Hello', 'webpack'], '-')
    return element;
}

document.body.appendChild(component());
```


