---
autoGroup-2: Webpack5
sidebarDepth: 3
title: tapable
---

## 前奏

在Webpack编译过程中存在两个核心对象：
- 负责整体编译流程的Compiler对象
- 负责编译Module的Compilation对象

Webpack编译的过程中，本质是通过tapable实现了在编译过程中的一种发布订阅者模式的插件Plugin机制。

Plugin的本质上基于Tapable这个库去实现的。

tapable使用只需三步：
1. 实例化钩子函数
2. 注册事件
3. 触发事件

tapable提供了九个钩子函数：
```javascript
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```

### 1. 按照同步/异步分类
- Sync(同步)：
  - SyncHook
  - SyncBailHook
  - SyncWaterfallHook
  - SyncLoopHook
- Async(异步)：
  - Parallel(并行)
    - AsyncParallelHook
    - AsyncParallelBailHook
  - Series(串行)
    - AsyncSeriesHook
    - AsynSeriesBailHook
    - AsynSeriesWaterfallHook

对于同步钩子，tap方法注册事件，通过call方法触发同步钩子函数执行。

对于异步钩子，可以通过tap、tapAsync、tapPromise三种方式注册事件，通过对应的callAsync、promise两种方式来触发注册的函数。

### 2. 按照执行机制分类
- Basic Hook：仅仅执行钩子注册的事件，不关心每个被调用的事件的函数的返回值

<img :src="$withBase('/basicFrontEnd/Performance/basic-hook.jpg')" alt="" />

- Waterfall Hook：瀑布类型的钩子，与基本类型的钩子一样，唯一不同的是瀑布类型的钩子会在注册事件执行的时候，将事件函数执行**非undefined**的返回值传递给接下来的事件函数作为参数。

<img :src="$withBase('/basicFrontEnd/Performance/waterfall-hook.jpg')" alt="" />

- Bail Hook：保险类钩子，保险类型钩子在基础钩子上增加了一种保险机制，如果任意一个注册函数执行返回**非undefined**的值，那么整个钩子执行过程会立即终端，之后注册事件函数就不会被调用了

<img :src="$withBase('/basicFrontEnd/Performance/bail-hook.jpg')" alt="" />

- Loop Hook：循环类型钩子，循环类型钩子通过call调用时，如果任意一个注册的事件函数返回**非undefined**，那么会立即重头开始执行所有的注册事件函数，知道所有被注册的事件函数都返回undefined

<img :src="$withBase('/basicFrontEnd/Performance/loop-hook.jpg')" alt="" />


## 基本使用

1. 第一步通过new实例化不同的Hook
  - new Hook的时候接收一个字符串数组作为参数，数组中的值不重要，重要的是数组中对应的字符串个数。
2. 第二步通过tap函数注册事件，注册事件时接收两个参数：
  - 第一个参数是字符串，没有实际意义仅仅是一个标识。这个参数还可以是一个对象为{name:xxx}
  - 第二个参数是本次注册的函数，在调用时会执行这个函数
3. 第三步通过call方法传入对应的参数，调用注册在hook内部的事件函数进行执行
  - 同时在call方法执行时，会将call方法传入的参数传递给每一个注册的事件函数作为实参进行调用

### 1. SyncHook

最基础的同步钩子。

```javascript
const { SyncHook } = require('tapable'); 
// 1. 实例化钩子函数，参数是形参的数组，参数名没有意义，但是数组长度有用
const syncHook = new SyncHook(['name', 'age']);
// 第一个参数是名字，名字没有用
// 2. 注册事件1
syncHook.tap('1', (name, age) => {
  console.log(1, name, age);
})
// 2. 注册事件2
syncHook.tap('2', (name, age) => {
  console.log(2, name, age);
})
// 2. 注册事件3
syncHook.tap('3', (name, age) => {
  console.log(3, name, age);
})

// 3. 调用事件并传递参数，会被每一个注册函数接收到
syncHook.call('zhufeng', 10);

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
 */
```

通过tap函数注册监听函数，然后通过call函数按顺序执行之前注册的函数。

简单的实现是这样的
```javascript
class SyncHook{
  constructor(){
    this.taps = []
  }

  tap(name, fn){
    this.taps.push({name, fn})
  }
  
  call(...args){
    this.taps.forEach((tap)=> tap.fn(...args));
  }
}
```

### 2. SyncBailHook

如果任何事件函数存在返回值，那么会立即中断后序事件函数的调用

```javascript
const { SyncBailHook } = require('tapable');
// 当回调函数返回非undefined的值的时候会停止后续调用
const clickHook = new SyncBailHook(['name', 'age']);

clickHook.tap('1', (name, age) => {
  console.log(1, name, age);
})
clickHook.tap('2', (name, age) => {
  console.log(2, name, age);
  return null; // 返回值为非undefined，中断后序执行
})
clickHook.tap('3', (name, age) => { // 不会执行
  console.log(3, name, age);
})

clickHook.call('zhufeng', 10);

/**
1 zhufeng 10
2 zhufeng 10
 */
```

### 3. SyncWaterfallHook

将上一个函数的返回值传递给下一个函数作为回调函数的第一个参数。

```javascript
const { SyncWaterfallHook } = require('tapable');
// 表示如果上一个回调函数返回结果不为undefined，则会作为下一个回调函数的第一个参数
const clickHook = new SyncWaterfallHook(['name', 'age']);

clickHook.tap('1', (name, age) => {
  console.log(1, name, age);
  return 'jiagou'; // 返回值作为下一个函数的第一个参数
})
clickHook.tap('2', (name, age) => {
  console.log(2, name, age);
  return 'jiagou';// 返回值作为下一个函数的第一个参数
})
clickHook.tap('3', (name, age) => {
  console.log(3, name, age);
})

clickHook.call('zhufeng', 10);
/**
1 zhufeng 10
2 jiagou 10
3 jiagou 10
 */
```

### 4. SyncLoopHook

任意一个被监听的函数存在非undefined返回值时返回重头开始执行

```javascript
const { SyncLoopHook } = require('tapable');
// 不停的循环执行回调函数，直到函数的结果为非undefined
// 特别要注意是每次循环都是从头开始
const hook = new SyncLoopHook(['name', 'age']);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

hook.tap('1', (name, age) => {
  console.log(1, 'counter1', counter1);
  if (++counter1) {
    counter1 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})
hook.tap('2', (name, age) => {
  console.log(2, 'counter2', counter2);
  if (++counter2 == 2) {
    counter2 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})
hook.tap('3', (name, age) => {
  console.log(3, 'counter3', counter3);
  if (++counter3 == 3) {
    counter3 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})

hook.call('zhufeng', 10);

/**
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 0
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 1
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 2
 */
```

### 5. AsyncPallelHook

- tapAsync注册事件，回调需要额外的接收一个callback参数，调用callback表示本次事件执行结束。
- callback的第一个参数是错误对象，第二个参数开始表示本次函数调用的返回值
- promise同理，如果这个promise的返回结果是reject状态，那么和callback传递错误参数同样效果。

异步并行钩子，会并发执行所有异步钩子。

- tapAsync & callAsync

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
  }, 1000)
})
hook.tapAsync('3', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 1000)
})

// 如果是异步钩子需要传递一个回调函数
hook.callAsync('zhufeng', 10, (err) => {
  console.log(err);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
undefined
cost: 1.003s
 */
```

- promise & tapPromise

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
    }, 1000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 1000)
  })
})

// 实际上就是Promise.all
hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
undefined
cost: 1.014s
 */
```

可以看到最终结果执行时打印为 1s，也就是三个事件函数同时开始执行，在 1s 后三个异步函数执行结束，整体回调结束。

### 6. AsyncPallelBailHook

异步并行保险钩子。

```javascript
const { AsyncParallelBailHook, HookMap } = require('tapable');
// 有一个任务返回值不为空就直接结束
// 对Promise来说，就是resolve的值不为空
// 如果reject失败了，不影响流程
const hook = new AsyncParallelBailHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve('结果2'); // 返回非undefined
    }, 1000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 1000)
  })
})

// 实际上就是Promise.all
hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
结果2
cost: 1.009s
3 zhufeng 10
 */
```

由于第二个注册事件执行 resolve('结果2')，会直接执行打印出结果。后面还会执行是由于异步的原因。


### 7. AsyncSeriesHook

异步串行执行。

```javascript
const { AsyncSeriesHook, HookMap } = require('tapable');

const hook = new AsyncSeriesHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 1000)
  })
})

hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
undefined
cost: 6.044s
 */
```

可以看到打印结果为 3s，说明注册函数是依次执行的。


### 8. AsyncSeriesBailHook

异步串行保险钩子。

```javascript
const { AsyncSeriesBailHook, HookMap } = require('tapable');

const hook = new AsyncSeriesBailHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve('结果2'); // 存在返回值，后面不会执行
    }, 2000)
  })
})
hook.tapPromise('3', (name, age) => { // 不会执行
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000)
  })
})

hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
结果2
cost: 3.008s
 */
```

### 9. AsyncSeriesWaterfallHook

异步串行瀑布钩子。

```javascript
const { AsyncSeriesWaterfallHook, HookMap } = require('tapable');

const hook = new AsyncSeriesWaterfallHook(['name', 'age']);
console.time('cost');
hook.tapAsync('1', (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback(null, 1)
  }, 1000)
})
hook.tapAsync('2', (number, age, callback) => {
  setTimeout(() => {
    console.log(2, number, age);
    callback(null, ++number)
  }, 2000)
})
hook.tapAsync('3', (number, age, callback) => {
  setTimeout(() => {
    console.log(3, number, age);
    callback(null, ++number)
  }, 3000)
})

hook.callAsync('zhufeng', 10, (err, data) => {
  console.log(err, data);
  console.timeEnd('cost')
})

/**
1 zhufeng 10
2 1 10
3 2 10
null 3
cost: 6.013s
 */
```

### 10. 拦截器

通过拦截器对整个Tapable发布/订阅流程进行监听，从而触发对应的逻辑。

- register：每次通过tap、tapAsync、tapPromise方法注册事件函数时，会触发register拦截器。这个拦截器接收注册的tap作为参数，同时可以对注册的事件进行修改
- call：通过调动hook实例对象的call、callAsync、promise方法时执行，接收的参数参数为调用hook时传入的参数
- tap：在每一个被注册的事件函数调用之前执行，接收参数为对应的tap对象

```javascript
const { SyncHook } = require('tapable');
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

syncHook.call('zhufeng', 10)

/**
register拦截的是注册
tap拦截的是回调之前

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

### 11. HookMap

本质上就是一个辅助类，通过 HookMap 我们可以更好的管理 Hook。

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

// 在keyedHook中创建一个name为key1的hook，同时为该hook通过tap注册事件 
keyedHookMap.tap('key1', 'plugin1', (name) => { console.log(1, name) }); // 第一种方式，传三个参数

keyedHookMap.for('key2').tap('plugin2', (name) => { console.log(2, name) });// 第二种方式，先for再tap
const hook1 = keyedHookMap.get('key1'); // 取出key1对应的钩子，然后执行
hook1.call('zhufeng');
const hook2 = keyedHookMap.get('key2');
hook2.call('jiagou')

/**
1 zhufeng
2 jiagou
 */
```

### 12. stage

这个属性的类型是数字，数字越大事件回调执行的越晚，支持传入负数，不传时默认为0

```javascript
let { SyncHook } = require('./tapable');
let hook = new SyncHook(['name']);

hook.tap({ name: 'tap1', stage: 1 }, (name) => {
  console.log('tap1', name);
})
hook.tap({ name: 'tap3', stage: 3 }, (name) => {
  console.log('tap3', name);
})
hook.tap({ name: 'tap4', stage: 4 }, (name) => {
  console.log('tap4', name);
})
hook.tap({ name: 'tap2', stage: 2 }, (name) => {
  console.log('tap2', name);
})

hook.call('zhufeng');

/**
tap1 zhufeng
tap2 zhufeng
tap3 zhufeng
tap4 zhufeng
 */
```

### 13. before

```javascript
let { SyncHook } = require('tapable');
let hook = new SyncHook(['name']);

hook.tap({ name: 'tap1' }, (name) => {
  console.log('tap1', name);
})
hook.tap({ name: 'tap3' }, (name) => {
  console.log('tap3', name);
})
hook.tap({ name: 'tap4' }, (name) => {
  console.log('tap4', name);
})
hook.tap({ name: 'tap2', before: ['tap4', 'tap3'] }, (name) => { // 回调再tap3、tap4之前执行
  console.log('tap2', name);
})

hook.call('zhufeng');

/**
 * before优先级比stage高
 */

/**
tap1 zhufeng
tap2 zhufeng
tap3 zhufeng
tap4 zhufeng
 */
```

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
