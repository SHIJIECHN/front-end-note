---
autoGroup-2: ES6
sidebarDepth: 3
title: JavaScript模块化
---

## JS模块化解决的问题
1. 最开始都是直接写在\<script>标签中
```html
<!--index.html-->
<script>
    var a = [1,2,3,4,5].reverse();
    var b = a.concat([7,8,9,10]);
    var c = b.join('-');
    console.log(a);
    console.log(b);
    console.log(c);
</script>
```
2. 业务进一步复杂，开发者开始把JavaScript写到独立的JS文件中，与html文件解耦。
```html
<!--index.html-->
<script src="js/index.js"></script>
```
index.js
```js
var a = [1,2,3,4,5].reverse();
var b = a.concat([7,8,9,10]);
var c = b.join('-');
console.log(a);
console.log(b);
console.log(c);
```
3. 再后来，更多的开发者参与进来，更多的js文件被引入进来
```html
<!--index.html-->
<script src="js/module_a.js"></script>
<script src="js/module_b.js"></script>
<script src="js/module_c.js"></script>
<script src="js/index.js"></script>
```
js文件
```js
// module_a.js
var a = [1,2,3,4,5].reverse();

// module_b.js
var b = a.concat([7,8,9,10]);

// module_c.js
var c = b.join('-');

// index.js
console.log(a);
console.log(b);
console.log(c);
```
module_x.js文件里面声明的变量在于全局作用域中，而且很难保证所有的js文件不冲突，所以会有下面问题：
1. 加载顺序
2. 污染全局

## 传统模块化
立即执行函数，有独立的作用域
```html
```html
<!--index.html-->
<script src="js/module_a.js"></script>
<script src="js/module_b.js"></script>
<script src="js/module_c.js"></script>
<script src="js/index.js"></script>
```
js文件
```js
// module_a.js
var moduleA = (function() {
    var a = [1, 2, 3, 4, 5].reverse();
    return {
        a: a
    }
})();

// module_b.js
var moduleB = (function(moduleA) {
    var b = moduleA.a.concat([7, 8, 9, 10]);
    return {
        b: b
    }
})(moduleA);

// module_c.js
var moduleC = (function(moduleB) {
    var c = moduleB.b.join('-');
    return {
        c: c
    }
})(moduleB);

// index.js
;
(function(moduleA, moduleB, moduleC) {
    console.log(moduleA.a);
    console.log(moduleB.b);
    console.log(moduleC.c);
})(moduleA, moduleB, moduleC);
```
实际上就是闭包，模块里面并不是把作用域抛到全局，而是形成一个闭包。    
解决了全局污染以及模块之间的依赖问题，但是没有解决加载顺序。

给用户提供一个配置项，让他通过配置实现不同的功能————插件化。

## CommonJS
CommonJS就是解决上面问题的模块化规范。
```html
<!--index.html-->
<script src="js/index.js"></script>
```
js文件
```js
// module_a.js
var a = (function() {
    return [1, 2, 3, 4, 5].reverse();
})();

module.exports = {
    a
}

// module_b.js
var moduleA = require('./module_a.js');
var b = (function() {
    return moduleA.a.concat([7, 8, 9, 10]);
})();

module.exports = {
    b
}

// module_c.js
var moduleB = require('./module_b.js');
var c = (function() {
    return moduleB.b.join('-');
})();

module.exports = {
    c
}

// index.js
var moduleA = require('./module_a.js');
var moduleB = require('./module_b.js');
var moduleC = require('./module_c.js');

console.log(moduleA.a);
console.log(moduleB.b);
console.log(moduleC.c);
```
特点：
1. 每个文件就是一个模块，有自己的作用域；
2. 文件加载同步进行；
3. 对服务端非常友好，有缓存机制；
4. 一定是在NodeJS中运行，所以基本上用在服务端

## AMD/CMD
AMD（Asynchronous Module Definition）异步模块定义。
```js
define(moduleName, [module], factory); // 定义模块
require([module], callback); // 引入模块
```
RequireJS实现AMD
```html
<!--index.html-->
<script src="js/require.js"></script>
<script src="js/index.js"></script>
```
js文件
```js
// module_a.js
define('moduleA', function() {
    var a = [1, 2, 3, 4, 5];
    return {
        a: a.reverse()
    }
})


// module_b.js
define('moduleB', ['moduleA'], function(moduleA) {
    var b = [7, 8, 9, 10];
    return {
        b: moduleA.a.concat(b)
    }
})

// module_c.js
define('moduleC', ['moduleB'], function(moduleB) {
    return {
        c: module.b.join('-')
    }
})

// index.js
require.config({
    paths: {
        moduleA: 'js/module_a',
        moduleB: 'js/module_b',
        moduleC: 'js/module_c',
    }
})

require(['moduleA', 'moduleB', 'moduleC'], function(moduleA, moduleB, moduleC) {
    console.log(moduleA.a);
    console.log(moduleB.b);
    console.log(moduleC.c);
})
```
前置依赖：会得到所有依赖加载结束才会执行后面的函数。

CMD（Common Module Definition）通用模块定义。
```js
define(function(reqiure, exports, module){}); // 定义模块
seajs.use([module路径], function(moduleA, moduleB, moduleC){}); // 使用模块
```
SeaJS实现CMD
```html
<!--index.html-->
<script src="js/sea.js"></script>
<script src="js/index.js"></script>
```
js文件
```js
// module_a.js
define(function(require, exports, module) {
    var a = [1, 2, 3, 4, 5];
    return {
        a: a.reverse()
    }
})

// module_b.js
define(function(require, exports, module) {
    var moduleA = require('module_a'),
        b = [7, 8, 9, 10];
    return {
        b: moduleA.a.concat(b)
    }
})

// module_c.js
define(function(require, exports, module) {
    var moduleB = require('module_b');
    return {
        c: moduleB.b.join('-')
    }
})

// index.js
seajs.use(['module_a.js', 'module_b.js', 'module_c.js'], function(moduleA, moduleB, moduleC) {
    console.log(moduleA.a);
    console.log(moduleB.b);
    console.log(moduleC.c);
});
```
CMD依靠require加载，define定义，export导出，module操作模块。在使用模块时， 需要配置模块的URL。依赖加载完毕后执行callback。

CMD与CommonJS、AMD本质的不同：依赖就近，按需加载。
AMD：依赖前置。前置的模块加载完毕，再执行回调。
CommonJS：需要的时候再去加载，依赖就近原则，按照就近原则加载。

## ES6模块化
```js
import module from '模块路径'; // 导入模块
export module; // 导出模块
```