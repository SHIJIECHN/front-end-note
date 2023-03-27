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

## 实现异步钩子

