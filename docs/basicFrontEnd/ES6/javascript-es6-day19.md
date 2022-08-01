---
autoGroup-1: ES6
sidebarDepth: 3
title: 19. Promise基础
---

## Promise由来
单线程如果遇到数据量大的问题，解决的方案是异步操作，而一步操作通常是通过回调函数的方式进行解决。在JQuery中也是通过Callbacks处理异步操作，而JQuery中的Deferred()方法返回的对象就是一个异步操作的容器对象（引出Promise的），储存异步操作，所以也可以说Promise是阉割版的Deferred()。   

1. Jquery中的Deferred()代码
```js
function  waitHandle(){
  // 创建一个deferred对象
  var dtd = $.Deferred();
  var wait = function(){

    var task = function(){
      console.log('执行完成');
      // 表示异步任务已经完成
      dtd.resolve(); // 引出Promise的概念
    }
    setTimeout(task, 2000);    
  }
  return dtd;
}

// w变量保存异步操作的容器对象
var w = waitHandle();
w.done(function(){
  console.log('ok1')
}).fail(function(){
  console.log('err1')
})
```

2. Promise A+ 是什么呢？   
Promise A+规范：不止JQ利用callback实现promise，还有其他的库实现Promise，但是都是要遵循Promise A+规范进行开发的。

## Promise的作用
1. Promise解决回调地狱的问题   
异步操作通过回调地狱进行解决，但是多层嵌套的回调函数产生回调地狱的问题，导致后期代码维护困难，所以通过Promise解决回调地狱的问题。

2. Promise解决try...catch只能捕获到同步代码的异常   
try...catch只能捕获到同步代码中抛出的异常，而异步操作中的异常并不能够进行捕获。
```js
try{
  // 同步异常
  console.log(a);
  // 异步异常
  setTimeout(function(){
    console.log(a);
  }, 30)
}catch(e){
  console.log(e); // ReferenceError: a is not defined at app.js:3:15
}
```
3. Promise解决同步并发异步代码的问题
同步并发异步代码：回调在同步并发异步代码的问题上传统的ES5可以用发布订阅的模式进行解决，同步并发代码用回调函数来做会出现什么问题呢？   
下面同时执行读取文件的异步操作，如果通过回调函数的方式进行，就不能够确定到底是哪一个回调函数首先执行，因为三个回调函数都会在web APIs中挂起，当第一个文件读取完毕之后，回调函数才会被推入到任务队列中等待执行，但是我们并不能够知道哪个回调函数首先执行。
```js
const fs = require('fs');
const arr = [];
fs.readFile('./name.txt', 'utf-8', (err, data) => {
  console.log(1);
  if (data) {
    arr.push(data);
  }
  arr.length === 3 && console.log(arr);
})

fs.readFile('./number.txt', 'utf-8', (err, data) => {
  if (data) {
    arr.push(data);
  }
  arr.length === 3 && console.log(arr);
})
fs.readFile('./score.txt', 'utf-8', (err, data) => {
  if (data) {
    arr.push(data);
  }
  arr.length === 3 && console.log(arr);
})
```

## Promise语法
### 1. Promise基础语法
- Promise构造函数：必须通过new关键字进行调用构造函数
- executor：执行者函数
- resolve：promise成功状态的回调函数
- reject：promsie失败的回调函数

```js
let promise = new Promise(excurtor);
executor: function(resolve, reject){}
```

### 2. Promise理解
1. Promise简单来说可以看作是一个容器，容器中保存着某个未来才会结束的异步操作的结果；
2. 从语法上来说，Promise是一个对象，它可以获取异步操作的消息，所以promise代表异步的操作，是发生在以后的事情，而不是现在的事情。
3. 好比我去KFC买汉堡，销售员给我一张小票，这个小票是对之后汉堡是否做好的一个承诺，这个小票中包含着汉堡是否做好的状态，而我现在可以拿着这个小票（异步操作对象），想干啥什么就去干什么（同步代码），并不会影响到我的主进程（代码的执行）。

### 3. Promise对象的状态
1. Promise对象的基础状态
  - pending：进行中
  - fulfilled（resolve）：已成功
  - reject：已失败

2. Promise对象的状态不受外界的影响，只有异步操作的操作结果，可以决定promise对象当前是哪一种状态，任何其他的操作都不会影响到这个状态的改变。
3. Promise异步操作的状态不可逆性
  > - Promise异步操作状态的不可逆性：一个状态过渡到另一个状态，一旦状态改变之后，就不能再次改变
  > - Promise对象状态的改变只有两种可能：pending状态过渡到fulfilled状态，pending状态过渡到reject状态
  > - 只要这两种情况发生，promise对象的状态就进入固化，不再改变；如果状态已经发生改变，再对Promise对象添加回调，是可以直接拿到这个结果的；如果是事件的话，一旦错过，就真的错过了.

```js
let promise = new Promise((resolve, reject) => {
  // 调用成功状态回调函数
  resolve();
  // 尝试改变成功状态，无效
  reject();
})
```

4. executor执行函数中的resolve，reject回调函数的作用

> 1. resolve函数：将Promise对象的状态从pending改为fulfilled状态，在异步操作时进行调用，并将异步操作的结果作为参数传递出去。
> 2. reject函数：将Promise对象的状态从pending改为reject状态，在异步操作失败时调用，并将异步操作的结果作为参数传递出去。
```js
let promsie = new Promise((resolve, reject) => {
  resolve('成功');
})

let promise = new Promise((resolve, reject) => {
  reject('失败');
})
```

### 4. Promise的executor执行函数
executor函数：虽然执行函数时回调函数，但是执行函数是同步执行的代码，name同步执行的代码如何表示异步操作的呢？其实对应的操作就需要用到resolve，reject两参数；   
> 1. resolve：让promise异步操作的状态改为成功状态，然后触发执行绑定的成功的回调函数
> 2. reject：让promise异步操作的状态改为失败状态，然后触发执行绑定的失败的回调函数

```js
let promise = new Promise((resolve, reject) => {
  setInterval(function(){
    Math.random() * 100 > 60 ? resolve('Ok') : reject('No');
  })
})
promise.then(data => {
  console.log(data);
}, err => {
  console.log(err);
})
```

1. 通常Promise代表异步的操作，而Promise中executor是同步执行的代码，如果我在executor中不写异步代码，namePromise还能正常执行吗？    

在executor执行函数中不写异步代码也是可以正常执行的，当然executor中的同步代码会按照正常的代码执行顺序执行。
```js
let promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
})
console.log(3);
// 1 2 3
```
2. 证明executor执行函数是同步进行；而resolve，reject则是异步进行。   
> Promise代表的是异步操作，但是excutor执行者是同步执行的，所以console.log(0)首先打印结果，然后resolve()作用改变promise的状态调用promise绑定的成功状态的回调函数，resolve()回调函数执行显然是一个异步操作，根据JS引擎执行的机制，会被推入到回调函数队列中，当同步任务完成之后，再执行；同步代码console.log(2)会在console.log(0)的同步代码执行完成后执行。 

```js
let promise = new Promise((resolve, reject)=>{
  console.log(0);
  resolve(1);
})
promise.then(data=>{
  console.log(data);
},err=>{
  console.log(err);
})
console.log(2);
// 0  2  1
```

### 5. Promise中的then方法
1. Promise中的then方法基本认识
> Promise实例对象具有then方法，也就是说在Promise.prototype定义了then()方法。它的作用就是为Promise实例操作Promise状态改变后的回调函数，then()方法的第一个参数是成功（resolve）回调函数，第二参数是失败（reject）函数.

```js
let promise = new Promise((resolve, reject) => {
  resolve('ok');
})
promise.then(data=>{
  console.log(data);
},err=>{
  console.log(err);
})
```
2. Promise的链式调用  
> then方法返回一个新的Promise对象实例（和原来的Promise实例不相等）。因此可以采取链式写法，在then后面直接调用另一个then方法

```js
let promise = new Promise((resolve, reject) => {
  resolve('OK 1');
})
promise.then(data1 => {
  console.log(data1); // OK 1
}).then(data2 => {
  console.log(data2); // undefined
})
```
3. Promise的链式调用的then方法，方法中参数传递问题以及返回值的问题。
> 默认情况下： Promise中then方法调用后，返回的Promise实例对象的状态由上一个Promise实例对象的状态决定，而调用成功或者失败的回调函数也是通过上一个Promise实例对象返回的状态决定；Promise实例对象状态未固化，then方法调用后默认返回一个进行中（pending）状态的Promise；Promise实例对象状态固化后，then方法每次调用后都会默认返回一个成功（resolve）状态的Promise；第一次then返回的参数作为下一次then执行的参数。

- promise状态未固化的情况

```js
let promise = new Promise((resolve, reject)=>{
	
});
let p1 = promise.then();
console.log(promise);
console.log(p1);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise.png')" alt="promise" />


- promise状态固化的情况

```js
let promise = new Promise((resolve, reject) => {
  resolve('ok'); // 成功状态
});

let p2 = promise.then(data1 => {
  console.log('data1: ' + data1); // ok
  // 默认返回
  return new Promise((resolve, reject) => {
    resolve(undefined);
  })
})

p2.then(data2 => {
  console.log('data2: '+ data2); // undefined
})
console.log(promise);
console.log(p2);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise01.png')" alt="promise" />

为什么promise的状态打印的是fulfilled，而p2的状态打印的是pending呢？因为此时按照代码的执行，exectuor执行者函数首先同步执行，resolve('ok')改变promise的状态显然是异步代码，所以将resolve的回调函数data=>{}挂载到WebAPIS中等待执行，p2的状态需要等待promise状态固化才能够决定自己的状态，所以回调函数data2=>{}也挂载到WebAPIS中等待执行；打印promise的值，由于exectuor函数中执行resolve()函数，将promise的状态改为fulfilled状态，所以打印promise就是成功状态，而打印p2时，由于promise成功的回调函数data=>{}还在任务队列中等待执行，所以p2的状态还未改变，所以是pending状态，又因为我们上面说过，当promise实例对象状态固化后，then()方法会默认返回一个成功状态的Promise状态实例，所以当promise的resolve回调函数data=>{}执行后，此时p2实例化对象的状态才会通过new实例化，而隐式属性\[\[PromiseState]]是fufilled状态，\[\[PromiseResult]]是undefined这种情况，说明在实例化p2之前就打印p2的实例化对象.

### 6. 手动改变then的返回值
1. 手动改变then的返回值，返回原始数据类型，相当于返回成功状态的promise，并且带着原始数据类型的值执行回调函数。

```js
let promise = new Promise((resolve, reject) => {
  resolve('ok');
})
promise.then( data => {
  console.log(data); // ok
  return 2;
}).then(data => {
  console.log(data); // 2
})
```

2. 手动改变then()方法返回值，返回Promise对象，取决于返回的Promise对象状态而去执行相应的回调函数.
```js
let promise = new Promise((resolve, reject) => {
  resolve('ok');
})
promise.then(one => {
  console.log('one: '+ one); // one: ok
  return new Promise((resolve, reject) => {
    reject('err-info');
  })
}).then( two => {
  console.log(two);
}, err => {
  console.log('err: ' + err); // err: err-info
})
```

## 手写Promise引入
```javascript
doSomething().then(function(data) {
    console.log('Got a value: ' + data);
})

function doSomething() {
    return {
        then: function(callback) {
            var value = 66;
            callback(value);
        }
    }
}
```
### 1. 改造domSomething
```javascript
function myPromise(fn) {
    var callback = null;
    // 实例化对象的then属性
    this.then = function(cb) {
        callback = cb;
    }
    // 函数定义
    function resolve(value) {
        callback(value); // Uncaught TypeError: callback is not a function
    }
    fn(resolve);
}

// var promsie = new myPromise(function(resolve) { ... });

function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}
doSomething().then(function(data) {
    console.log('Got a value: ' + data);
})

// 分解：
// 1. 
let promise1 = doSomething();
/**
 * doSomething()实际上执行的是fn(resolve)
 * promise1返回的是一个对象，对象上面有then方法。
 * {
 *  then: function(){ ... }
 * }
 */
// 2. callback是在then中定义的，但是执行doSomething()的时候就要调用。
let promise2 = promise1.then(function(data) {
    console.log('Got a value: ' + data);
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise19.png')" alt="promise" />

### 2. resolve中设置计时器解决
```javascript
function myPromise(fn) {
    var callback = null;
    // 实例化对象的then属性
    this.then = function(cb) {
        callback = cb;
    }

    // 函数定义
    function resolve(value) {
        // 新增
        setTimeout(() => {
            callback(value)
        }, 1);
    }

    fn(resolve);
}

var promsie = new myPromise(function(resolve) {

})

function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}

let promise1 = doSomething();
let promise2 = promise1.then(function(data) {
    console.log('Got a value: ' + data);
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise20.png')" alt="promise" />

### 3. Promise的3种状态解决
```javascript
function myPromise(fn) {
    var state = 'pending';
    var value = '';
    var callback = null;

    this.then = function(onResolved) {
        handle(onResolved)
    }

    function resolve(newValue) {
        value = newValue;
        state = 'resolved';
    }

    function handle(onResolved) {
        onResolved(value); // onResolved就是callback
    }

    fn(resolve);
}

var promsie = new myPromise(function(resolve) {

})

function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}
let promise1 = doSomething();
/**
 * doSomething()执行结果：
 * 1. 返回对象：
 * {
 *  then: function(){ ... }
 * }
 * 2. 修改value和state的数值
 * value = 66;
 * state = 'resolved';
 */
let promise2 = promise1.then(function(data) {
    console.log('Got a value: ' + data);
});
/**
 * 实际就是执行 data = 66
 * function(data) {
 *  console.log('Got a value: ' + data);
 * }
 */
```

## Promise面试题
### 案例一
```js
const first  = () => new Promise((resolve, reject) => {
  console.log(3); // 1
  let p = new Promise((resolve, reject) => {
    console.log(7); // 2
    setTimeout(() => {
      console.log(5); // 6
      resolve(6);
      console.log(p); // 7 Promise<fulfilled> 1
    }, 0);
    resolve(1);
  })
  resolve(2);
  p.then(arg =>{
    console.log(arg); // 4 -> 1
  });
});

first().then(arg =>{
  console.log(arg); // 5 -> 2
})

console.log(4); // 3 
```
<img :src="$withBase('/basicFrontEnd/ES6/promise02.png')" alt="promise" />

### 案例二: async await
```js
let a;
const b = new Promise((resolve, reject)=>{
  console.log("promise1"); // 1 promise1
  resolve();
})
  .then(()=>{
    console.log("promise2"); // 4 promise2
  })
  .then(()=>{
    console.log("promise3"); // 5 promise3
  })
  .then(()=>{
    console.log("promise4"); // 6 promise4
  });

a = new Promise( async (resolve, reject) => {
  console.log(a); // 2 undefined； 赋值的时机，这里a还没有执行完，还没有赋值
  await b;
  console.log(a); // 7 Promise<pending>
  console.log("after1"); // 8 after1
  await a;  // 卡在这里
  resolve(true);
  console.log("after2");
})

console.log("end"); // 3 end
```
<img :src="$withBase('/basicFrontEnd/ES6/promise03.png')" alt="promise" />

让await a执行。将resolve提前
```js
resolve(true);
await a;  
```
<img :src="$withBase('/basicFrontEnd/ES6/promise04.png')" alt="promise" />

调整resolve(true)的位置
```js
a = new Promise( async (resolve, reject) => {
  resolve(true);
  console.log(a);  // undefined 同步代码还没执行完
  await b;
  console.log(a); 
  console.log("after1"); 
  await a;  
  console.log("after2");
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise05.png')" alt="promise" />

### 案例三: Promise.all()
```js
function runAsync(x){
  const p = new Promise(resolve=>{
    setTimeout(()=>{
      resolve(x, console.log(x))
    }, 1000)
  })
  return p;
}

function runReject(x){
  const p = new Promise((res, rej)=>{
    setTimeout(()=>{
      rej(`Error: ${x}`, console.log(x+'!')) // 传递两个参数
    }, 1000*x)
  })
  return p;
}

Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))
```
<img :src="$withBase('/basicFrontEnd/ES6/promise06.png')" alt="promise" />

1. 成功执行顺序：1 3 , runReject(2)先执行于runReject(4)。在执行rej的时候，console.log会执行。
2. 错误只会捕获一次。Error：2 是catch捕获的错误。

### 案例四：Promise.race()
```js
function runAsync(x){
  const p = new Promise(resolve=>{
    setTimeout(()=>{
      resolve(x, console.log(x))
    }, 1000)
  })
  return p;
}

Promise.race([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log("result: ", res))
  .catch(err => console.log(err))
```
<img :src="$withBase('/basicFrontEnd/ES6/promise07.png')" alt="promise" />

### 案例五
```js
async function async1(){
  console.log('async start');
  new Promise(r => {
    console.log("promise");
  })
  console.log("async end");
}

async1();
console.log("start");
```
<img :src="$withBase('/basicFrontEnd/ES6/promise08.png')" alt="promise" />

### 案例六
```js
async function async1(){
  console.log(1);
  await async2();
  console.log(2);
}
async function async2(){
  setTimeout(()=>{
    setTimeout(()=> {
      console.log(3);
    }, 0)
  })
  console.log(4);
}
async1();
console.log(5);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise09.png')" alt="promise" />

### 案例七
```js
async function async1(){
  console.log(1);
  await async2();
  console.log(2);
  setTimeout(()=>{
    console.log(3);
  }, 0)
}

async function async2(){
  setTimeout(()=>{
    console.log(4);
  }, 0);
  console.log(5);
}

async1();
setTimeout(()=>{
  console.log(6);
}, 0);
console.log(7);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise10.png')" alt="promise" />

### 案例八
```js
async function async1(){
  console.log(1);
  await new Promise(r => {
    console.log(2);
  })
  console.log(3);
  return 4;
}

console.log(5);
async1().then(res => console.log(res))
console.log(6);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise11.png')" alt="promise" />

**注意await的promise没有resolve，所以后面不会执行了**

### 案例九
```js
async function async1(){
  console.log(1);
  await new Promise(resolve => {
    console.log(2);
    resolve(3);
  }).then( res=> console.log(res));
  console.log(4);
  return 5;
}

console.log(6);
async1().then(res => console.log(res))
console.log(7);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise12.png')" alt="promise" />

### 案例十
```js
async function async1(){
  console.log(1);
  await new Promise(resolve => {
    console.log(2);
    resolve(3);
  }).then( res=> console.log(res));
  console.log(4);
  return 5;
}

console.log(6);
async1().then(res => console.log(res))
new Promise(resolve => {
  console.log(7);
  setTimeout(()=>{
    console.log(8);
  })
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise13.png')" alt="promise" />

### 案例十一
```js
async function testSomething(){
  console.log(1);
  return 2
}

async function testAsync(){
  console.log(3);
  return Promise.resolve(4)
}

async function test(){
  console.log(5);
  const v1 = await testSomething();
  console.log(v1);
  const v2 = await testAsync();
  console.log(v2);
  console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
  console.log(6);
  resolve(7);
})

promise.then(val => console.log(val))

console.log(8);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise14.png')" alt="promise" />


### 案例十二
```js
async function async1(){
  await async2();
  console.log(1)
  return 2;
}

async function async2(){
  return new Promise((resolve, reject)=>{
    console.log(3);
    reject(4);
  })
}

async1().then(res => console.log(res))
```
<img :src="$withBase('/basicFrontEnd/ES6/promise15.png')" alt="promise" />


### 案例十三
```js
async function async1(){
  try{
    await Promise.reject('error!!')
  }catch(e){
    console.log(e);
  }

  console.log('async1');
  return Promise.resolve('async1 success');
}

async1().then(res=> console.log(res))
console.log("script start");
```
<img :src="$withBase('/basicFrontEnd/ES6/promise16.png')" alt="promise" />

### 案例十四
```js
const async1 =  async ()=>{
  console.log('async1');
  setTimeout(()=>{
    console.log('timer1');
  }, 2000);
  await new Promise( resolve => {
    console.log("promise1");
  });
  console.log('async1 end');
  return 'async1 success';
}
console.log("script start");
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then( Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(()=>{
  console.log("timer2");
}, 1000);
```
**注意：当await执行的是Promise时，需要resolve才能往下执行**
```js
Promise.resolve(1)
  .then(2)
  .then( Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
```
then里面一定是函数，不是函数无效。
<img :src="$withBase('/basicFrontEnd/ES6/promise17.png')" alt="promise" />

### 案例十五
```js
const p1 = new Promise(resolve =>{
  setTimeout(()=>{
    resolve('resolves')
    console.log("timer1");
  }, 0)
  resolve("resolve1")
  resolve("resolve2")
})
  .then(res =>{
    console.log(res);
    setTimeout(()=>{
      console.log(p1);
    }, 1000)
  })
  .finally(res => {
    console.log('finnaly', res);
  })
```
<img :src="$withBase('/basicFrontEnd/ES6/promise18.png')" alt="promise" />

### 案例十六
1. 使用Promise实现每隔一秒输出1，2，3.

2. 使用promise实现红绿灯交替重复亮

3. 实现一个mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中

4. 手写一个promise