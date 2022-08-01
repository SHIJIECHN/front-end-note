---
autoGroup-1: ES6
sidebarDepth: 3
title: 20. Promise的使用和自定义promisify
---

## Promise使用方法的注意事项
### 1. Promise中的异常问题
#### 1. Promise成功回调函数的参数异常。   
虽然Promise的executor执行者函数中调用的是resolve成功的回调函数，但是由于参数a未被定义抛出异常的原因，导致Promise自动执行失败的回调函数，并且将Promise实例化对象的状态改为rejected状态。
```js
let promise = new Promise((resolve, reject)=>{
  resolve(a);
})
promise.then(data=>{
  console.log('resolved: ' + data);
},err=>{
  console.log(promise);
  console.log('rejected: ' + err);
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise22.png')" alt="promise" />

#### 2. Promise状态固化后，代码抛出异常。    
Promise中的executor执行函数执行，调用resolve函数，将Promise实例对象状态改为fulfilled成功状态，此时Promise实例对象的状态已经固化，之后虽然a未定义，但是并不影响到Promise执行成功的回调函数。
```js
let promise = new Promise((resolve, reject)=>{
  resolve('ok');
  console.log(a);
})
promise.then(data=>{
  console.log(promise);
  console.log('resolved: ' + data);
},err=>{
  console.log('rejected: ' + err);
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise23.png')" alt="promise" />


#### 3. Promise作为回调函数参数，状态依赖的问题。    
Promise作为参数，状态依赖的问题，p1和p2都是异步操作，首先执行p1的executor执行者函数，遇到异步任务setTimout，挂起WebAPIs中，然后执行p2的executor执行者函数，遇到异步任务setTimeout，挂起WebAPIs中，然后执行p2的setTimeout函数，此时resolve(p1)执行，p1作为promise但是并没有出状态，所以需要等到p1中的setTimeout执行完成，p1的setTimeout函数执行完成后，p1的状态固化为reject状态，此时p2的resolve(reject)就互相矛盾，但是Promise底层规定此时p2状态按照p1的状态进行。所以p2此时执行失败的回调函数。
```js
const p1 = new Promise((resolve,reject)=>{
	setTimeout(function(){
		reject(new Error('fail'));
	},3000)
})
const p2 = new Promise((resolve,reject)=>{
	setTimeout(function(){
		resolve(p1);
	},1000);
})
p2.then(result => console.log(result))
  .catch(err => console.log(err));
```
<img :src="$withBase('/basicFrontEnd/ES6/promise24.png')" alt="promise" />

#### 4. reject、resolve并不影响executor函数执行    
reject、resolve回调函数并不会影响executor函数的执行。 
```js
const p1 = new Promise((resolve, reject)=>{
	reject(new Error());
	console.log(2);
})
p1.then(res => console.log(res))
	.catch(err => console.log(err));
console.log(3);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise25.png')" alt="promise" />

#### 5. 浏览器显示Promise状态的问题
```js
const p1 = new Promise((resolve, reject) => {
  throw new Error('fail')
})

const p2 = new Promise((resolve, reject) => {
  resolve(p1);
})
p2.then(res=>{
  console.log(res);
}, err=>{
  console.log(err);
})
const p3 = new Promise((resolve, reject)=>{
  resolve('ok')
})
console.log(p1);
console.log(p2);
console.log(p3);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise26.png')" alt="promise" />

Promise实例对象p1首先执行，executor函数中抛出异常，所以打印p1实例对象，p1实例对象状态时rejected；Promise实例对象executor执行成功的回调函数，但是p2实例对象调用成功回调函数依赖p1实例对象，又因为resolve回调函数时异步的，所以执行时，p2实例对象的状态还未确定，所以浏览器显示pending状态，，点击浏览器的展开箭头，相当于执行完成Promise，所以P2浏览器展开后显示rejected（失败状态）

#### 6. Promise异常的传递性     
Promise存在异常拥有传递性的特点，如果Promise实例化对象未对Promise中的异常进行处理，那么异常会逐层传递到最后，直到被捕获处理为止。   
```js
let promise = new Promise((resolve, reject)=>{
  console.log(a);
})
promise.then(value => {
  console.log('resolved: ' + value);
}).then(value=>{
  console.log('resolved: ' + value);
}).then(value=>{
  console.log('resolved: ' + value);
},err=>{
  console.log('rejected: ' + err); //  rejected: ReferenceError: a is not defined
})
```
### 2. Promise中的异常处理Promise.prototype.catch()
Promise.prototype.catch()方法返回一个Promise，并且处理Promise失败状态抛出的异常，它的行为其实与Promise.prototype.then(null, err=>{})相同。
```js
let promise = new Promise((resolve, reject)=>{
  throw new Error('抛出一个错误');
});
promise.then(data=>{
  console.log('resolved: ' + data);
}).catch(err=>{
  console.log('rejected: ' + err);
})
console.log(promise);

// 等同于
let promise = new Promise((resolve, reject)=>{
  throw new Error('抛出一个错误');
});
promise.then(null, err=>{
  console.log('rejected: ' + err);
})
console.log(promise);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise27.png')" alt="promise" />  

#### 1. Promise.prototype.catch()的链式调用
Promise.prototype.then方法返回一个pending状态的全新Promise对象，所以第一个catch方法内部抛出程序错误异常的话，也可以通过下一个catch方法捕获到上一个catch方法抛出的异常。   
```js

```
