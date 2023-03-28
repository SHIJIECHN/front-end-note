---
autoGroup-2: Webpack5
sidebarDepth: 3
title: tapable
---


## 实现SyncHook

### 1. 前奏
惰性函数
```javascript
// this.call -> CALL_DELEGATE -> this.call
const CALL_DELEGATE = (...args) => {
  call = () => { // 给call方法重新赋值
    console.log('这是动态创建出来的call方法')
  }
}
let call = CALL_DELEGATE;
call(); // 第一次加载返回的是CALL_DELEGATE里面的函数
// 第二次调用时，直接执行
call(); // 这是动态创建出来的call方法
call(); // 这是动态创建出来的call方法
/**
 * 为什么这么做呢？
 * 1. 为了性能。2. 只能这么实现。
 */
```

父类能调用子类的方法吗？如果是子类的实例的话，就可以调用，如果是父类的实例就不能调用。
```javascript
class Parent {
  a() {
    this.b();
    console.log('a');
  }
}
class Child extends Parent {
  b() {
    console.log('b');
  }
}
let child = new Child();
child.a(); // b

let parent = new Parent();
parent.b();// TypeError: parent.b is not a function
```

动态创建函数：
```javascript
function sum(a, b) {
  return a + b;
}

// 所有函数内部底层实现
// 动态创建函数然后执行
let minus = new Function('a,b', 'return a-b');
console.log(minus(2, 1));// 1
```

- 基类Hook
- 代码工厂SynHookCodeFactory，动态的创建函数
- SyncHook继承Hook
- 通过实例化代码工厂函数SynHookCodeFactory创建一个factory，SynHookCodeFactory继承HookCodeFactory

- tap就是存放回调函数
- call就是执行函数
  


- tap方法实现
  - 调用Hook里面的tap方法
  - 往taps中存放对象 {name:'1',type:'sync', fn}
- call方法实现
  - CALL_DELEGATE是call方法的代理方法，在代理方法中创建call方法（懒编译或懒加载）
  - call方法里面调用compile，compile方法是子类中实现的
  - compile方法具体实现是工厂函数完成，主要任务是动态产生临时函数。包括两个方法setup和create。setup主要是给实例添加_x数组，保存所有的回调函数。create产生fn临时函数。

动态编译产生的临时函数fn：
```javascript
(function anonymous(name, age
) {
var _x = this._x;

var _fn0 = _x[0];
_fn0(name, age);

var _fn1 = _x[1];
_fn1(name, age);

var _fn2 = _x[2];
_fn2(name, age);
      
})
```

### 2. 实现
目录结构
```javascript
├── index.js
└──tapable
  ├── Hook.js
  ├── HookCodeFactory.js
  ├── SyncHook.js
  └── index.js
```

:::: tabs
::: tab index.js
```javascript
const { SyncHook } = require('./tapable');
const syncHook = new SyncHook(['name', 'age']);
syncHook.tap('1', (name, age) => {
  console.log(1, name, age);
})
syncHook.tap('2', (name, age) => {
  console.log(2, name, age);
})
syncHook.tap('3', (name, age) => {
  console.log(3, name, age);
})

syncHook.call('zhufeng', 10);
```
:::
::: tab tapable/index.s
```javascript
let SyncHook = require('./SyncHook.js');
exports.SyncHook = SyncHook
```
:::
::: tab SyncHook.js
```javascript
const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class SynHookCodeFactory extends HookCodeFactory { // 子类代码工厂
  constructor() {
    super()
  }
  content({ onDone }) {
    return this.callTapsSeries({ // callTapsSeries属于父类方法
      onDone
    })
  }
}
let factory = new SynHookCodeFactory(); // 实例化代码工厂
class SyncHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = SyncHook;
```
:::
::: tab Hook.js
```javascript

// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE;
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }

  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    const tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }

  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }

  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;
```
:::
::: tab HookCodeFactory.js
```javascript
class HookCodeFactory {
  constructor() { }
  // 初始化。hookInstance为syncHook实例，
  // options为{ taps: [{..},{..},{..}], args: ['name', 'age'], type: 'sync}
  setup(hookInstance, options) {
    // 映射出来一个回调函数的数组，赋给hooks实例的_x属性
    // _x 才是真正回调函数的数组
    hookInstance._x = options.taps.map(item => item.fn);
  }

  init(options) { // 给options赋值
    this.options = options; // {taps, args, type}
  }

  deinit() { // 销毁参数
    this.options = undefined;
  }

  args() {  // 形参列表
    if (Array.isArray(this.options.args)) {
      return this.options.args.join(', '); // name,age
    }
    return '';
  }

  header() { // 回调函数的头部 var _x = this._x;
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    return code;
  }

  create(options) {
    this.init(options); // 初始化参数
    let fn; // 将要创建的fn
    switch (this.options.type) {
      case 'sync':
        fn = new Function( // 动态创建一个函数
          this.args(),// 参数
          this.header() + this.content({ // content是子类来实现
            onDone: () => '' // onDone就是最后执行的代码块
          })
        )
    }
    this.deinit(); // 销毁
    return fn;
  }

  callTapsSeries({ onDone }) {
    // 拼接代码块 var _fn0 = _x[0]; _fn0(name, age);
    let code = this.options.taps.map((item, index) => `
        var _fn${index} = _x[${index}];
        _fn${index}(${this.args()});
      `
    ).join('\n');
    return code;
  }
}
module.exports = HookCodeFactory;
```
:::
::::

调整HookCodeFactory的callTapsSeries方法与源码类似写法：
```javascript
class HookCodeFactory {
  // ... 省略

  callTapsSeries({ onDone }) {
    if (this.options.taps.length === 0) {
      return onDone()
    }
    let code = "";
    let current = onDone;
    for (let j = this.options.taps.length - 1; j >= 0; j--) { // 倒序循环taps
      const content = this.callTap(j, { onDone: current });
      current = () => content;
    }
    code += current();
    return code;
  }
  /**
   * 第一次执行时，tapIndex=2, onDone=""
   * @param {*} tapIndex 
   * @param {*} param1 
   */

  callTap(tapIndex, { onDone }) {  // 拼接var _fn2 = _x[2]; _fn2(name, age);
    let code = '';
    code += `var _fn${tapIndex} = _x[${tapIndex}];`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()});`
        if (onDone) {
          code += onDone(); // 拼接 onDone
        }
        break;
      default:
    }
    return code;
  }
}
module.exports = HookCodeFactory;
```

但是还有一个问题：后面再添加一个tap和call
```javascript
syncHook.tap('1', (name, age) => {
  console.log(1, name, age);
})
syncHook.tap('2', (name, age) => {
  console.log(2, name, age);
})
syncHook.tap('3', (name, age) => {
  console.log(3, name, age);
})

syncHook.call('zhufeng', 10);

syncHook.tap('4', (name, age) => {
  console.log(4, name, age);
})

syncHook.call('jiagou', 10);
/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
1 jiagou 10
2 jiagou 10
3 jiagou 10

源码执行结果为：
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
1 jiagou 10
2 jiagou 10
3 jiagou 10
4 jiagou 10  // 多一个
 */
```

因为call没有重置，在intert之前重置编译
```javascript
class Hook{
  // ...  省略
    
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this._resetCompilation(); // 重置编译
    this.taps.push(tapInfo);
  }
}
```

## 实现异步钩子

AsyncParalleHook

### 1. callAsync与tapAsync

产生的动摇编译函数：
```javascript
(function anonymous(name, age, _callback
) {
  var _x = this._x;
  var _counter = 3; // 计数器3个回调函数，或者说3个任务
  var _done = (function () {
    _callback(); // 最终的回调
  });

  var _fn0 = _x[0];
  _fn0(name, age, (function (_err0) {
    if (_err0) {
      _callback(_err0);
    } else {
      if (--_counter === 0) _done();
    }
  }));

  var _fn1 = _x[1];
  _fn1(name, age, (function (_err1) {
    if (_err1) {
      _callback(_err1);
    } else {
      if (--_counter === 0) _done();
    }
  }));

  var _fn2 = _x[2];
  _fn2(name, age, (function (_err2) {
    if (_err2) {
      _callback(_err2);
    } else {
      if (--_counter === 0) _done();
    }
  }));

})
```

```javascript
├── index.js
└──tapable
  ├── AsyncParallelHook.js
  ├── Hook.js
  ├── HookCodeFactory.js
  ├── SyncHook.js
  └── index.js
```

:::: tabs
::: tab index.js
```javascript
const { AsyncParallelHook, HookMap } = require('./tapable');
// 异步并行钩子，所有的回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');
hook.tapAsync('1', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000)
})
hook.tapAsync('2', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000)
})
hook.tapAsync('3', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000)
})

// 如果是异步钩子需要传递一个回调函数
hook.callAsync('zhufeng', 10, (err) => {
  console.log(err);
  console.timeEnd('cost');
})
```
:::   
::: tab AsyncParallelHook.js
```javascript
const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    // 并行
    return this.callTapsParallel({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new AsyncParallelHookCodeFactory(); // 实例化代码工厂
class AsyncParallelHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
```
:::   

::: tab Hook.js
```javascript

// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE; // call方法的代理
    this.callAsync = CALL_ASYNC_DELEGATE; // callAsync方法的代理 //////////////////
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }
  tapAsync(options, fn) { ///////////////////////////
    this._tap('async', options, fn);
  }
  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    const tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this._resetCompilation(); // 重置编译
    this.taps.push(tapInfo);
  }
  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;
```
:::   
::: tab tapable/index.js
```javascript

let SyncHook = require('./SyncHook.js');
exports.SyncHook = SyncHook
let AsyncParallelHook = require('./AsyncParallelHook.js');
exports.AsyncParallelHook = AsyncParallelHook
```
:::   
::::

### 2. promise 与 tapPromise

:::: tabs
::: tab AsyncParallelHook.js
```javascript
const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    // 并行
    return this.callTapsParallel({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new AsyncParallelHookCodeFactory(); // 实例化代码工厂
class AsyncParallelHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
```
:::   
::: tab Hook.js
```javascript

// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE; // call方法的代理
    this.callAsync = CALL_ASYNC_DELEGATE; // callAsync方法的代理 
    this.promise = PROMISE_DELEGATE; // promise///////////////////////////
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }
  tapAsync(options, fn) {
    this._tap('async', options, fn);
  }
  tapPromise(options, fn) { ///////////////////////////////////
    this._tap('promise', options, fn);
  }
  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    const tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {//////////////////
    this._resetCompilation(); // 重置编译
    this.taps.push(tapInfo);
  }
  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;
```
:::   
::: tab HookCodeFactory.js
```javascript
class HookCodeFactory {
  constructor() { }
  // 初始化。hookInstance为syncHook实例，
  // options为{ taps: [{..},{..},{..}], args: ['name', 'age'], type: 'sync}
  setup(hookInstance, options) {
    // 映射出来一个回调函数的数组，赋给hooks实例的_x属性
    // _x 才是真正回调函数的数组
    hookInstance._x = options.taps.map(item => item.fn);
  }

  init(options) { // 给options赋值
    this.options = options; // {taps, args, type}
  }

  deinit() { // 销毁参数
    this.options = undefined;
  }

  args(options = {}) {  // 形参列表 ///////////////////////////
    const { before, after } = options;
    let allArgs = this.options.args || []; // 原始非参数['name', 'age']
    if (before) allArgs = [before, ...allArgs];
    if (after) allArgs = [...allArgs, after]; // _callback
    if (allArgs.length > 0) {
      return allArgs.join(', '); // name,age,_callback
    }
    return '';
  }

  header() { // 回调函数的头部 var _x = this._x;
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    return code;
  }

  create(options) {
    this.init(options); // 初始化参数
    let fn; // 将要创建的fn
    switch (this.options.type) {
      case 'sync':
        fn = new Function( // 动态创建一个函数
          this.args(),// 参数
          this.header() + this.content({ // content是子类来实现
            onDone: () => '' // onDone就是最后执行的代码块
          })
        )
        break;
      case 'async':
        fn = new Function(
          this.args({ after: '_callback' }),
          this.header() + this.content({ // content是子类来实现
            onDone: () => '_callback();\n' // 全部完成之后最后执行的回调
          })
        )
        break;
      case 'promise': ///////////////////////
        let content = this.content({ // content是子类来实现
          onDone: () => '_resolve();\n' // 全部完成之后最后执行的回调
        });
        content = `return new Promise((function (_resolve, _reject) {
          ${content}
        }));`;
        fn = new Function(
          this.args(),
          this.header() + content);
        break;

    }
    this.deinit(); // 销毁
    return fn;
  }
  callTapsParallel({ onDone }) {
    let code = `var _counter = ${this.options.taps.length};\n`;
    if (onDone) { //   var _done = (function () {  _callback(); });
      code += `
      var _done = (function () {
        ${onDone()}
      });
      `;
    }
    for (let i = 0; i < this.options.taps.length; i++) {
      const done = () => `if (--_counter === 0) _done();`;
      code += this.callTap(i, { onDone: done })
    }
    return code;
  }

  callTapsSeries({ onDone }) {
    if (this.options.taps.length === 0) {
      return onDone()
    }
    let code = "";
    let current = onDone;
    for (let j = this.options.taps.length - 1; j >= 0; j--) { // 倒序循环taps
      const content = this.callTap(j, { onDone: current });
      current = () => content;
    }
    code += current();
    return code;
  }
  /**
   * 第一次执行时，tapIndex=2, onDone=""
   * @param {*} tapIndex 
   * @param {*} param1 
   */

  callTap(tapIndex, { onDone }) {  // 拼接var _fn2 = _x[2]; _fn2(name, age);
    let code = '';
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()});`
        if (onDone) {
          code += onDone();
        }
        break;
      case 'async': ///////////////////////////
        let cbCode = `
          function (_err${tapIndex}) {
            if (_err${tapIndex}) {
              _callback(_err${tapIndex});
            } else {
              ${onDone()}
            }
          }
        `;
        code += `_fn${tapIndex}(${this.args({ after: cbCode })});`;
        break;
      case 'promise':
        code = `
          var _fn${tapIndex} = _x[${tapIndex}];
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then(
            function (_result${tapIndex}) {
              ${onDone()}
            });
        `;
        break;
      default:
    }
    return code;
  }
}
module.exports = HookCodeFactory;
```
:::   
::: tab index.js
```javascript
const { AsyncParallelHook, HookMap } = require('./tapable');
// 异步并行钩子，所有的回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
debugger
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000)
  })
})

// 实际上就是Promise.all
hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})
```
:::  
::: tapable/index.js
```javascript
let SyncHook = require('./SyncHook.js');
exports.SyncHook = SyncHook
let AsyncParallelHook = require('./AsyncParallelHook.js');
exports.AsyncParallelHook = AsyncParallelHook
```
:::   
::::

## 拦截器interceptor

```javascript
(function anonymous(name, age
) {
  var _context = {};
  var _x = this._x;
  var _taps = this.taps;
  var _interceptors = this.interceptors;

  _interceptors[0].call(_context, name, age);
  _interceptors[1].call(_context, name, age);

  var _tap0 = _taps[0];
  _interceptors[0].tap(_context, _tap0);
  _interceptors[1].tap(_context, _tap0);
  var _fn0 = _x[0];
  _fn0(_context, name, age);

  var _tap1 = _taps[1];
  _interceptors[0].tap(_context, _tap1);
  _interceptors[1].tap(_context, _tap1);
  var _fn1 = _x[1];
  _fn1(_context, name, age);

})
```

:::: tabs
::: tab index.js
```javascript
const { SyncHook } = require('./tapable');
const syncHook = new SyncHook(['name', 'age']);

syncHook.intercept({
  context: true, // 需要一个上下文对象
  register: (tapInfo) => { // 当你注册一个回调函数的时候触发
    console.log(`${tapInfo.name}-1注册`);
    tapInfo.register1 = 'register1';
    return tapInfo;
  },
  tap: (context, tapInfo) => { // 每个回调函数都会触发一次
    console.log(`开始触发`, context);
    if (context) {
      context.name1 = 'name1';
    }
  },
  call: (context, name, age) => {// 每个call触发，所有的回调只会共触发一次
    console.log(`开始调用1, `, context, name, age);
  }
})
syncHook.intercept({
  context: true, // 需要一个上下文对象
  register: (tapInfo) => { // 当你注册一个回调函数的时候触发
    console.log(`${tapInfo.name}-2注册`);
    tapInfo.register2 = 'register2';
    return tapInfo;
  },
  tap: (context, tapInfo) => { // 每个回调函数都会触发一次
    console.log(`开始触发`, context);
    if (context) {
      context.name2 = 'name2';
    }
  },
  call: (context, name, age) => {// 每个call触发，所有的回调只会共触发一次
    console.log(`开始调用2, `, context, name, age);;
  }
})

// 注册 let tapInfo = {name, type, fn, context}
syncHook.tap({ name: '函数A', context: true }, (name, age) => {
  console.log('回调1', name, age);
})
// console.log(syncHook.taps[0]);
/**
{
  type: 'sync',
  fn: [Function (anonymous)],
  name: '函数A',
  context: true,
  register1: 'register1',
  register2: 'register2'
}
 */
syncHook.tap({ name: '函数B', context: true }, (name, age) => {
  console.log('回调2', name, age);
})
debugger
syncHook.call('zhufeng', 10)

/**
 * register拦截的是注册
 * tap拦截的是回调之前
=register=
函数A-1注册
函数A-2注册
函数B-1注册
函数B-2注册

=call=
开始调用1,  {} zhufeng 10
开始调用2,  {} zhufeng 10

=tap=
开始触发 {}
开始触发 { name1: 'name1' }
回调1 { name1: 'name1', name2: 'name2' } zhufeng

=tap=
开始触发 { name1: 'name1', name2: 'name2' }
开始触发 { name1: 'name1', name2: 'name2' }
回调2 { name1: 'name1', name2: 'name2' } zhufeng
 */
```
:::   
::: tab Hook.js
```javascript

// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE; // call方法的代理
    this.callAsync = CALL_ASYNC_DELEGATE; // callAsync方法的代理 
    this.promise = PROMISE_DELEGATE; // promise
    this.interceptors = [];///////////////////////////
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }
  tapAsync(options, fn) {
    this._tap('async', options, fn);
  }
  tapPromise(options, fn) {
    this._tap('promise', options, fn);
  }
  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    let tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    tapInfo = this._runRegisterInterceptors(tapInfo);//////////////////////////////
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }
  _runRegisterInterceptors(tapInfo) {////////////////////////////////
    for (const interceptor of this.interceptors) {
      if (interceptor.register) { // 如果有注册拦截器
        let newTapInfo = interceptor.register(tapInfo);
        if (newTapInfo) {
          tapInfo = newTapInfo
        }
      }
    }
    return tapInfo;
  }
  intercept(interceptor) {/////////////////////////////
    this.interceptors.push(interceptor)
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this._resetCompilation(); // 重置编译
    this.taps.push(tapInfo);
  }
  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      interceptors: this.interceptors, ///////////////////////
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;
```
:::   
::: tab HookCodFactory.js
```javascript
class HookCodeFactory {
  constructor() { }
  // 初始化。hookInstance为syncHook实例，
  // options为{ taps: [{..},{..},{..}], args: ['name', 'age'], type: 'sync}
  setup(hookInstance, options) {
    // 映射出来一个回调函数的数组，赋给hooks实例的_x属性
    // _x 才是真正回调函数的数组
    hookInstance._x = options.taps.map(item => item.fn);
  }

  init(options) { // 给options赋值
    this.options = options; // {taps, args, type}
  }

  deinit() { // 销毁参数
    this.options = undefined;
  }

  args(options = {}) {  // 形参列表 ///////////////////////////
    const { before, after } = options;
    let allArgs = this.options.args || []; // 原始非参数['name', 'age']
    if (before) allArgs = [before, ...allArgs];
    if (after) allArgs = [...allArgs, after]; // _callback
    if (allArgs.length > 0) {
      return allArgs.join(', '); // name,age,_callback
    }
    return '';
  }

  header() { // 回调函数的头部 var _x = this._x;
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    if (this.needContext()) { // 如果需要上下文就拼一个空对象/////////////////////////
      code += `  var _context = {};\n`;
    } else {
      code += `  var _context;\n`
    }
    if (this.options.interceptors.length > 0) {
      code += `var _taps = this.taps;`
      code += `var _interceptors = this.interceptors;`
    }
    for (let k = 0; k < this.options.interceptors.length; k++) {
      // 拿到每个拦截器
      const interceptor = this.options.interceptors[k];
      if (interceptor.call) {
        code += `_interceptors[${k}].call(${this.args({
          before: this.needContext() ? '_context' : undefined
        })});`
      }
    }
    return code;
  }

  create(options) {
    this.init(options); // 初始化参数
    let fn; // 将要创建的fn
    switch (this.options.type) {
      case 'sync':
        fn = new Function( // 动态创建一个函数
          this.args(),// 参数
          this.header() + this.content({ // content是子类来实现
            onDone: () => '' // onDone就是最后执行的代码块
          })
        )
        break;
      case 'async':
        fn = new Function(
          this.args({ after: '_callback' }),
          this.header() + this.content({ // content是子类来实现
            onDone: () => '_callback();\n' // 全部完成之后最后执行的回调
          })
        )
        break;
      case 'promise':
        let content = this.content({ // content是子类来实现
          onDone: () => '_resolve();\n' // 全部完成之后最后执行的回调
        });
        content = `return new Promise((function (_resolve, _reject) {
          ${content}
        }));`;
        fn = new Function(
          this.args(),
          this.header() + content);
        break;

    }
    this.deinit(); // 销毁
    return fn;
  }
  callTapsParallel({ onDone }) {
    let code = `var _counter = ${this.options.taps.length};\n`;
    if (onDone) { //   var _done = (function () {  _callback(); });
      code += `
      var _done = (function () {
        ${onDone()}
      });
      `;
    }
    for (let i = 0; i < this.options.taps.length; i++) {
      const done = () => `if (--_counter === 0) _done();`;
      code += this.callTap(i, { onDone: done })
    }
    return code;
  }

  callTapsSeries({ onDone }) {
    if (this.options.taps.length === 0) {
      return onDone()
    }
    let code = "";
    let current = onDone;
    for (let j = this.options.taps.length - 1; j >= 0; j--) { // 倒序循环taps
      const content = this.callTap(j, { onDone: current });
      current = () => content;
    }
    code += current();
    return code;
  }
  ////////////////////////////////
  needContext() {
    for (const tapInfo of this.options.taps) {
      if (tapInfo.context) return true
    }
  }
  /**
   * 第一次执行时，tapIndex=2, onDone=""
   * @param {*} tapIndex 
   * @param {*} param1 
   */


  callTap(tapIndex, { onDone }) {  // 拼接var _fn2 = _x[2]; _fn2(name, age);
    let code = '';
    ////////////////////////////////
    code += `  var _tap${tapIndex} = _taps[${tapIndex}];`
    for (let i = 0; i < this.options.interceptors.length; i++) {
      let interceptor = this.options.interceptors[i];
      if (interceptor.tap) {
        code += `_interceptors[${i}].tap(${this.needContext() && '_context,'} _tap${tapIndex});`
      }
    }
    /////////////
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args({ /////////////////////////
          before: this.needContext() ? '_context' : undefined
        })});`
        if (onDone) {
          code += onDone();
        }
        break;
      case 'async':
        let cbCode = `
          function (_err${tapIndex}) {
            if (_err${tapIndex}) {
              _callback(_err${tapIndex});
            } else {
              ${onDone()}
            }
          }
        `;
        code += `_fn${tapIndex}(${this.args({ after: cbCode })});`;
        break;
      case 'promise':
        code = `
          var _fn${tapIndex} = _x[${tapIndex}];
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then(
            function (_result${tapIndex}) {
              ${onDone()}
            });
        `;
        break;
      default:
    }
    return code;
  }
}
module.exports = HookCodeFactory;
```
::: 
::: tab tapable/index.js
```js
let SyncHook = require('./SyncHook.js');
exports.SyncHook = SyncHook
let AsyncParallelHook = require('./AsyncParallelHook.js');
exports.AsyncParallelHook = AsyncParallelHook
```
:::   
::: tab AsyncParallelHook.js
```javascript
const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    // 并行
    return this.callTapsParallel({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new AsyncParallelHookCodeFactory(); // 实例化代码工厂
class AsyncParallelHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
```
:::   
::: tab SyncHook.js
```javascript
const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class SynHookCodeFactory extends HookCodeFactory {
  constructor() {
    super()
  }
  content({ onDone }) {
    return this.callTapsSeries({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new SynHookCodeFactory(); // 实例化代码工厂
class SyncHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = SyncHook;
```
:::   
::::


## HookMap

```javascript
const { SyncHook } = require('tapable');
class HookMap {
  constructor(factory) {
    this._map = new Map();// 存放钩子，key是名字，value是实例
    this._factory = factory;
  }
  get(key) {
    return this._map.get(key);
  }
  tap(key, options, fn) {
    return this.for(key).tap(options, fn)
  }
  for(key) {
    const hook = this.get(key);// 钩子
    if (hook) { // 如果有钩子，就返回钩子
      return hook;
    }
    // 没有钩子，就创建钩子
    let newHook = this._factory(key); // new SyncHook(['name'])
    this._map.set(key, newHook);
    return newHook;
  }
}

const keyedHookMap = new HookMap(() => new SyncHook(['name']));// 创建一个map，value是钩子函数实例
keyedHookMap.tap('key1', 'plugin1', (name) => { console.log(1, name) }); // 第一种方式，传三个参数
keyedHookMap.for('key2').tap('plugin2', (name) => { console.log(2, name) });// 第二种方式，先for再tap
const hook1 = keyedHookMap.get('key1'); // 取出key1对应的钩子，然后执行
hook1.call('zhufeng');
const hook2 = keyedHookMap.get('key2');
hook2.call('jiagou')
```