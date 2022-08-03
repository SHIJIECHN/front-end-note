---
autoGroup-1: ES6
sidebarDepth: 3
title: 22. async与await、ES6的模块化
---

## async/await
读取文件      
```js
import fs from 'fs'
import { promisify } from 'util'
import co from 'co'

let readFile = promisify(fs.readFile);

function* read() {
    let value1 = yield readFile('./test1.txt', 'utf-8');
    let value2 = yield readFile(value1, 'utf-8');
    let value3 = yield readFile(value2, 'utf-8');
    return value3;
}

let promise = co(read());
promise.then(res => console.log(res))
```

### 1. async函数对比Generator函数的改进
async与await：async就是Generator函数的语法糖，返回的是一个Promise对象。
1. 内置执行器。Generator函数的执行必须依靠执行器，所以才有co模块，而async函数自带执行器。也就是说，async函数执行与普通函数执行一样，async()直接调用即可。
2. 更好的语义。sync和await VS *号和yield表达式，语义更清楚。async表示函数内部有异步操作，await表示紧跟在后面的表达式需要等待的结果。
3. 更广的适用性。async函数await命令后面，可以是Promise对象和原始值。
4. 返回值是Promise。async函数的返回结果是Promise，Generator函数返回值是迭代器。async函数可以看作多个异步操作，包装一个Promise对象（通过Promise.resolve()包装），await命令就是内部then命令的语法糖。

```js
import fs from 'fs'
import { promisify } from 'util'

let readFile = promisify(fs.readFile);

async function read() {
    let value1 = await readFile('./test1.txt', 'utf-8');
    let value2 = await readFile(value1, 'utf-8');
    let value3 = await readFile(value2, 'utf-8');
    return value3;
}

let promise = read();
promise.then(val => console.log(val)) // finally
```
错误处理
```js
import fs from 'fs'
import { promisify } from 'util'

let readFile = promisify(fs.readFile);

async function read() {
    let value1 = await readFile('./test1.txt', 'utf-8');
    let value2 = await readFile(value1, 'utf-8');
    let value3 = await readFile(value2, 'utf-8');
    return value3;
}

let promise = read();
promise.then(val => {
    console.log(val);
}, (e) => {
    console.log(e);
})
```

Promise.all()：只要有一个出错，所有结果都不会收到
```js
import fs from 'fs'
import { promisify } from 'util'

let readFile = promisify(fs.readFile);

let f = Promise.all([
    readFile('./test1.txt', 'utf-8'),
    readFile('./test2.txt', 'utf-8'),
    readFile('./test3.txt', 'utf-8')
])

f.then(val => {
    console.log(val); // [ './test2.txt', './test3.txt', 'finally' ]
})
```
将剩余没有出错的结果拿到
```js
async function readAll() {
    let value1,
        value2,
        value3,
        res = new Set();

    try {
        value1 = await readFile('./test1.txt', 'utf-8');
    } catch (e) {
        console.log(e);
    }

    try {
        value2 = await readFile('./test2.txt', 'utf-8');
    } catch (e) {
        console.log(e);
    }

    try {
        value3 = await readFile('./test3.tx', 'utf-8'); // 出错
    } catch (e) {
        console.log(e);
    }

    res.add(value1);
    res.add(value2);
    res.add(value3);

    return res;
}

readAll().then(res => {
    console.log(res); // { './test2.txt', './test3.txt', undefined }
})
```

### 2. async返回值promise对象的状态改变
async函数返回Promise对象，必须等待内部所有的await命令后面的Promise对象执行完，才会发生状态变化，除非遇到return语句或抛出错误。也就是说，只有async函数的异步操作执行完成，才会执行then方法的回调函数。

### 3. await命令

#### 1. await正常返回的情况
正常情况下，await命令后面是一个Promise对象，返回该对象的结果。如果不是Promise对象，就直接返回对应的值。
```javascript
async function demo(){
  return 123;
  // 等同于
  return await 123;
}
demo().then( data => cosnole.log(data))
```
await命令的参数是123，这是等于return 123，然后async通过Promise.resolve()将123包装成Promise对象。

#### 2. await后面是thenable对象的情况
await命令后面是一个thenable对象（即定义了then方法的对象），那么await会将其等同于Promise对象。
```javascript
let thenable = {
	then:function(resolve, reject) {
		resolve(1111);
	}
}
async function demo(){
	return await thenable;
}
let promise = demo();
console.log(promise); 
/**
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: 1111
 */
promise.then(data=>{
	console.log(data); // 1111
})
```

#### 4. await命令后面的Promise对象如果变成reject状态，则reject的参数会被catch方法的回调接收.
```javascript
async function demo() {
  await Promise.reject('出错了')
}

demo().then(data => {
  console.log(data);
}).catch(err => {
  console.log('rejected: ', err); // rejected:  出错了
})
```

#### 4. 任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行。
```javascript
async function demo(){
	await Promise.reject('出错了');
	await Promise.resolve('1111'); // 不会执行
}
```
我们希望前一个异步操作失败，但是不要阻止后面的异步操作。这时候可以用try...catch语句将第一个await包裹起来，进行捕获异常；这样第二个异步操作就可以进行下去.
```javascript
async function demo() {
  try {
    await Promise.reject('出错了');
  } catch (e) {
    console.log('async internal error: ' + e);
  }
  return await Promise.resolve('1111');
}

demo().then(data => {
  console.log(data);
})
/**
 * async internal error: 出错了
 * 1111
 */
```

###  4. 错误处理
#### 1. 如果await后面的异步操作错误，name等同于async函数返回的Promise对象被reject
async函数体内部出现异常，那么async函数返回的promise状态为rejected状态，之后返回的promise实例对象的catch方法或者失败的回调函数进行捕获异常。
```javascript
async function demo() {
  await new Promise((resolve, reject) => {
    console.log(a);
  })
}

demo().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
})
/**
ReferenceError: a is not defined
    at index.js:3:17
    at new Promise (<anonymous>)
    at demo (index.js:2:9)
    at index.js:7:1
 */
```

#### 2. async函数内部也可以防止出错的方法，将其放入try...catch语句中进行捕获。这样不会影响后面代码的执行。
```javascript
async function demo() {
  try {
    await Promise.reject('出错了');
  } catch (e) {
    console.log('async internal error: ' + e);
  }
  return await Promise.resolve('1111');
}

demo().then(data => {
  console.log(data);
})
/**
 * async internal error: 出错了
 * 1111
 */
```
3. 多个await命令，可以统一放入try...catch语句中
```javascript
async function read() {
	try {
		let value1 = await readFile('./name.txt', 'utf-8');
		let value2 = await readFile(value1, 'utf-8');
		let value3 = await readFile(value2, 'utf-8');
	}catch(e) {
		console.log('rejected: ' + e);
	}
}
```
