---
autoGroup-1: Webpack
sidebarDepth: 3
title: 6. 性能优化
---

## webpack4 vs webpack5
版本号：npm info webpack versions  
webpack-cli: npm info webpack-cli versions   

## 优化打包构建速度
### 1. babel-loader代码缓存
```javascript
// webpack.base.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, 
                    // 1.将babel（es6->es5）编译好的es5代码缓存到文件夹里面，下次使用时先去
                    // 缓存文件夹中查看有没有编译好的代码，如果有就直接从文件夹中拿出编译好的代码
                },
                exclude: /node_modules/, 
                // 2. path.resolve(__dirname, 'node_modules) 排除不进行编译的模块
                // node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
            }
        ]
    }
}
```

### 2. IgnorPlugin  
不引入相应的包，最终打包生成的代码没有该不引入的包的代码。   
moment是js时间库。直接import就把所有国家的语言包都导入了，而我们只需要中文。
```javascript
// webpack.base.js
module.exports = {
    noParse: [/vue\.min\.js$/], // 告诉vue.min.js文件不需要进行打包和解析的
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
         // 忽略moment库的locale文件夹。这里面包含所有国家的语言包。再导入需要的语言包：
        //  import 'moment/locale/zh-cn', 只引入了中文
    ]
}

// index.js
import moment from 'moment';
import 'moment/local/zh-cn'; // 手动引入中国时间包

moment.locale('zh-cn'); // 设置中国时间包
```
区别：   
- IgnorePlugin不引入相应的代码，最终打包生成的代码没有代码
- noParse不做打包，最终打包的文件的代码任然有该没打包的文件

### 3. 多进程打包
#### 3.1 HappyPack
JS单线程->NodeJS基于JS 单线程 -> Webpack基于NodeJS 单线程 开启多进程打包。多核CPU适合多进程打包。   
happyPack  
```javascript
// webpack.prod.js
const HappyPack = require('happyPack');
const ParalleUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports ={
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'], 
                // 把js文件的处理交给id=babel的happypack的实例，这个实例在plugins中声明
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use:ExtractTextPlugin.extract({
                    use: ['happypack/loader?id=css']
                })
            }
        ],
        plugins: [
            // 创建id为babel的实例
            new HappyPack({
                id: 'babel',
                // 如何处理 .js 文件，用法和 Loader 配置中一样
                loaders: ['babel-loader?cacheDirectory'], // 使用缓存的另一种写法
            }),
            new  HappyPack({
                id: 'css',
                 // 如何处理 .css 文件，用法和 Loader 配置中一样
                loaders: ['css-loader']
            })
            // 开启多进程压缩js
            new ParalleUglifyPlugin({
                uglifyJS:{
                    output: {
                        beautify: false, // 输出的代码压缩
                        comment: false // 去掉注释
                    }
                }
            }),
            new ExtractTextPlugin({
                filename: `[name].css`,
            }), 
        ]
    }
}
```
项目大时开启多进程打包。
注意：
1. 在Loader配置中，所有文件的处理都交给了happypack/loader去处理，使用紧跟其后的queryString?id=babel去告诉happypack/loader去选择哪个HappyPack实例去处理文件。
2. 在Plugin配置中，新增了两个人HappyPack实例分别用于告诉happypack/loader去如何处理.js 和 .css 文件。选项中的id属性值和上面的?id=babel相对应，选项中的loaders属性和Loader配置中一样。

HappyPack原理：
1. 在整个webpack构建流程中，最耗时的流程就是Loader对文件的转换操作了，因为要转换的文件数据巨多，而且这些转换操作都是只能一个个挨着处理。HappyPack的核心原理就是把这些部分任务分解到多个进程去并行处理，从而减少了总的构建时间。
2. new HappyPack()实例化一个HappyPack就是告诉HappyPack核心调度器如何通过一系列Loader去转换一类文件，并且可以指定如何给这类转换操作分配子进程。
3. 核心调度器的逻辑代码在主进程中，也就是运行着Webpack的进程中，核心调度器会把一个个任务分配给当前空闲的子进程，子进程处理完毕后会把结果发送给核心调度器，他们之间的数据交换是通过进程间通信API实现的。
4. 核心调度器收到来自子进程处理完毕的结果后悔通知Webpack该文件处理完毕。

#### 3.2 ParalleUglifyPlugin
当有多个JavaScript文件需要输出和压缩时，原本会使用UglifyJS去一个个挨着压缩再输出，但是ParallelUglifyPlugin则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过UglifyJS去压缩，但是变成了并行执行。
```javascript
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
    plugins: [
        // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
        // 缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果返回
        // cacheDir 用于配置缓存存放的目录路径
        cacheDir: '.uglify-cache',
        uglifyJS: {
            output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            },
            compress: {
            // 删除所有的 `console` 语句，可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
            }
        }
        })
    ]
}
```

### 4. 使用自动更新
原理：
1. 定时去获取这个文件的最后编辑时间，每次存下最新的最后编辑时间，当发现当前或者的和最后一次保存的最后编辑时间不一致，就认为该文件发生了变化。配置项中watchOptions.poll就是用于控制定时检查的周期。
2. 当发现某个文件发生了变化时，不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，在一次性告诉监听者。配置项中的watchOptions.aggregateTimeout就是用于配置这个等待时间。目的是因为我们在编辑代码的过程中可能会频繁的输入文字导致文件变化的事件高频的发生，如果每次都重新执行构建就会让构建卡死。
3. 默认情况下Webpack会从配置的Entry文件触发，递归解析出entry文件所依赖的文件，把这些依赖的文件都加入到监听列表中去。
4. 减少需要监听的文件数量和降低检查的频率。

```javascript
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}
```

自动刷新浏览器：webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器。

### 5. 热更新HMR
原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。
```javascript
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry:{
    // 为每个入口都注入代理客户端
    main:[
        'webpack-dev-server/client?http://localhost:8080/', 
        'webpack/hot/dev-server',
        './src/main.js'
    ],
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，
    // 会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
};

// index.js
// 只有当开启了模块热替换时 module.hot 才存在
if(module.hot) {
    // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示
    // 只接受 ./math 这个子模块
    // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
	// 监听 math.js文件
	module.hot.accept(['./math'], () => {
		console.log('hello');
	})
}
```
到现在为止，热更新只开启了CSS热更新（因为在style-loader中帮助我们写好了），JS热更新需要配置。


## 优化产出代码体积
### 1. CDN加速
实际上最影响用户体验的是网页首次打开时的加载等待。导致这个问题的根本是网络传输过程耗时大，CDN的作用就是加速网络传输。 

CDN又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。CDN其实是通过优化物理链路层传输过程中的网速有限、丢包等问题来提升网速的。 

webpack实现CDN的接入：
1. 静态资源的导入 URL 需要变成指向 CDN 服务的绝对路径的 URL 而不是相对于 HTML 文件的 URL。
2. 静态资源的文件名称需要带上有文件内容算出来的hash值，以防止被缓存
3. 不同类型的资源放到不同域名的CDN服务上去，以防止资源的并行加载被阻塞。

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {WebPlugin} = require('web-webpack-plugin');

module.exports = {
  // 省略 entry 配置...
  output: {
    // 给输出的 JavaScript 文件名称加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/',
  },
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 压缩 CSS 代码
          use: ['css-loader?minimize'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        }),
      },
      {
        // 增加对 PNG 文件的支持
        test: /\.png$/,
        // 给输出的 PNG 文件名称加上 Hash 值
        use: ['file-loader?name=[name]_[hash:8].[ext]'],
      },
      // 省略其它 Loader 配置...
    ]
  },
  plugins: [
    // 使用 WebPlugin 自动生成 HTML
    new WebPlugin({
      // HTML 模版文件所在的文件路径
      template: './template.html',
      // 输出的 HTML 的文件名称
      filename: 'index.html',
      // 指定存放 CSS 文件的 CDN 目录 URL
      stylePublicPath: '//css.cdn.com/id/',
    }),
    new ExtractTextPlugin({
      // 给输出的 CSS 文件名称加上 Hash 值
      filename: `[name]_[contenthash:8].css`,
    }),
    // 省略代码压缩插件配置...
  ],
};
```

- output.publicPath 中设置 JavaScript 的地址。
- css-loader.publicPath 中设置被 CSS 导入的资源的的地址。
- WebPlugin.stylePublicPath 中设置 CSS 文件的地址。

### 2. Tree Shaking 
Tree Shaking 正常工作的前提是交给 Webpack 的 JavaScript 代码必须是采用 ES6 模块化语法的， 因为 ES6 模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），这让 Webpack 可以简单的分析出哪些 export 的被 import 过了。 如果你采用 ES5 中的模块化，例如 module.export={...}、require(x+y)、if(x){require('./util')}，Webpack 无法分析出哪些代码可以剔除。

配置Babel让其保留ES6模块化语句，修改.babelrc文件：
```javascript
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```
当使用了大量第三方库时，发现Tree Shaking不生效，原因是大部分npm中的代码都是采用的CommonJS语法。

```javascript
module.exports = {
  resolve: {
    //  用于配置采用哪个字段作为模块的入口描述
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
};
```

### 3. Scope Hoisting
原理：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。因此只有那些被引用了一次的模块才能被合并。

优点：
1. 代码体积更小，因为函数声明语句会产生大量代码
2. 代码在运行时因为创建的函数作用域更少了，内存开销也随着变小

```javascript
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ],
};
```

### 4. 按需加载
按钮被点击时才去加载被分割出去的 show.js 文件，加载成功后再执行 show.js 里的函数
```javascript
window.document.getElementById('btn').addEventListener('click', function () {
  // 当按钮被点击后才去加载 show.js 文件，文件加载成功后执行文件导出的函数
  import(/* webpackChunkName: "show" */ './show').then((show) => {
    show('Webpack');
  })
});

// show.js
module.exports = function (content) {
  window.alert('Hello ' + content);
};
```

关键代码`import(/* webpackChunkName: "show" */ './show')`，Webpack会这样处理：
1. 以 ./show.js 为入口新生成一个 Chunk；
2. 当代码执行到 import 所在语句时才会去加载由 Chunk 对应生成的文件
3. import 返回一个 Promise，当文件加载成功时可以在 Promise 的 then 方法中获取到 show.js 导出的内容。

```javascript
// webpack.config.js 配置
module.exports = {
  // JS 执行入口文件
  entry: {
    main: './main.js',
  },
  output: {
    // 为从 entry 中配置生成的 Chunk 配置输出文件的名称
    filename: '[name].js',
    // 为动态加载的 Chunk 配置输出文件的名称
    chunkFilename: '[name].js',
  }
};
```