---
autoGroup-1: ES6
sidebarDepth: 3
title: 20. Promise的使用和自定义promisify
---

## Promise使用方法的注意事项
### 1. Promise中的异常问题
#### 1. Promise成功回调函数的参数异常。   
虽然Promise的executor执行者函数中调用的是resolve成功的回调函数，但是由于参数a未被定义抛出异常，导致Promise自动执行失败的回调函数，并且将Promise实例化对象的状态改为rejected状态。
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

#### 4. reject、resolve不影响executor函数执行    
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
let promise = new Promise((resolve, reject)=>{
  throw new Error('抛出一个错误');
})

promise.then(data=>{
  console.log('resolve: '+ data);  
}).catch(err=>{
  console.log('reject: '+ err);  
})
console.log(promise);

// 等同于
promise.then(null, err=>{
  console.log('reject: '+ err);  
})
```
<img :src="$withBase('/basicFrontEnd/ES6/promise28.png')" alt="promise" />

Promise.prototype.catch()方法返回一个pending状态的Promise对象，所以当第一个catch方法内部抛出异常，也可以通过下一个catch捕获到上一个catch的异常
```javascript
let promise = new Promise((resolve, reject)=>{
  throw new Error('抛出一个错误');
})

promise.then(data=>{
  console.log(data);
}).catch(err=>{
  console.log(err);
  return Promise.reject('又抛出一个错误');
}).catch(err=>{
  console.log(err)
})
```


## Promise的方法
### 1. Promise.all()方法
Promise.all()用于将多个Promise实例包装成一个新的Promise实例。  
```javascript
Promise.all(iterator); // iterator：具备部署iterator接口的数据类型
```
Promise.all()方法的返回值的几种情况：
1. 如果传入参数是一个空的可迭代对象，返回一个已完成（resolve）状态的Promise
```javascript
const p = Promise.all([]);
console.log(p)
```
<img :src="$withBase('/basicFrontEnd/ES6/promise29.png')" alt="promise" />

2. 如果传入不是Promise对象，则先利用Promise.resolve()进行包装成Promise实例，再返回一个异步完成Promise。
```javascript
const p = Promise.all([1,2,3]);
console.log(p)
```
<img :src="$withBase('/basicFrontEnd/ES6/promise30.png')" alt="promise" />

3. Promise.all()返回的Promise状态只有p1, p2, p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1，p2，p3的返回值组成一个数组，传递给p的回调函数。
```javascript
const p1 = new Promise((resolve, reject)=>{resolve('p1')})
const p2 = new Promise((resolve, reject)=>{resolve('p2')})
const p3 = new Promise((resolve, reject)=>{resolve('p3')})
const p = Promise.all([p1,p2,p3]);
p.then(data=>{
  console.log(data); // ['p1', 'p2', 'p3']
})
```

4. 只要p1，p2，p3之中有一个出现失败rejected状态，p的状态就变成rejected，此时第一个成rejected状态的实例的返回值，会传递给p的回调函数.
```javascript
const p1 = new Promise((resolve, reject)=>{resolve('p1')})
const p2 = new Promise((resolve, reject)=>{reject('p2')})
const p3 = new Promise((resolve, reject)=>{resolve('p3')})
const p = Promise.all([p1,p2,p3]);
p.then(data=>{
  console.log(data); 
}).catch(err=>{
  console.log('rejected: '+ err); // rejected: p2
})
```

### 2. Promise.race()
将多个Promise实例包装成一个Promise实例，一旦某一个Promise解决或者拒绝，返回的Promise就会解决或者拒绝。    
Promise.race()返回值的几种情况：
1. 传入的参数是空的可迭代对象，则返回Promise将永远等待
```javascript
const p = Promsie.race([]);
console.log(p)
```
<img :src="$withBase('/basicFrontEnd/ES6/promise31.png')" alt="promise" />

2. 如果传入不是Promise对象，则先利用Promise.resolve()进行包装成Promise实例，再返回第一个异步完成Promise。
```javascript
const p = Promise.race([1, 2, 3]);
console.log(p);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise32.png')" alt="promise" />

3. 只要p1，p2，p3之中有一个实例率先改变状态，p的状态就会跟着改变，那个率先改变的Promise市里的返回值，就传递给p的回调函数。
```javascript
const p1 = new Promise((resolve, reject)=>{resolve('p1')})
const p2 = new Promise((resolve, reject)=>{reject('p2')})
const p3 = new Promise((resolve, reject)=>{resolve('p3')})
const p = Promise.race([p1, p2, p3]);
p.then(data=>{
  console.log(data); // p1
}).catch(err=>{
  console.log('rejected: '+ err); 
})
```

### 3. Promise.resolve()
将现有的对象转成Promise对象。    
Promise.resolve()的参数情况：    
1. 参数一个Promise实例，如果参数是Promise实例，那么Promise.resolve将不会做任何改变、原封不动的返回这个实例。
```javascript
const p1 = new Promise((resolve, reject)=>{
  resolve('p1')
});
const p2 = Promise.resolve(p1);
console.log(p1);
console.log(p2);
console.log(p1 === p2);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise33.png')" alt="promise" />

2. 参数是一个thenable对象，Promise.resolve()方法将这个对象转为Promise对象，然后立即执行thenable对象的then方法
```javascript
let obj = {
  then: function(resolve, reject){
    resolve('ok');
  }
}
const p = Promise.resolve(obj);
console.log(p);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise34.png')" alt="promise" />   
**注意：如果then中执行的是reject方法，则p的状态就是rejected**

3. 参数是原始值，则返回一个新的Promise对象，状态未resolve
```javascript
const p = Promise.resolve(1);
console.log(p);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise35.png')" alt="promise" />  

4. 不带任何参数，直接返回一个resolve状态的Promise对象。
```javascript
const p = Promise.resolve();
console.log(p);
```
<img :src="$withBase('/basicFrontEnd/ES6/promise36.png')" alt="promise" />  

### 4. Promise.reject()
返回新的Promise实例，该实例的状态未rejected。    
Promise.reject()方法的参数，会原封不动的作为reject的理由，变成后续方法的参数。
```javascript
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject)=>{reject('出错了')});

p.then(null, function(s){
	console.log(s); // 出错了
})
```

## Promise优化异步操作
### 1. 读取文件的回调地狱问题
回调地狱：虽然能够通过回调函数的嵌套实现顺序的异步读取文件，但是拥有后期代码维护难，结构重构难的问题。  
```javascript
import { readFile } from 'fs';

readFile('./test1.txt', 'utf-8', (err, data) => {
    if (data) {
        readFile(data, 'utf-8', (err, data) => {
            if (data) {
                readFile(data, 'utf-8', (err, data) => {
                    console.log(data);
                })
            }
        })
    }
})
```

### 2. 使用Promise优化
通过Promise优化读取文件，首先封装readFile函数，返回Promise对象实例，根据是否能够读取文件的状态调用响应的Promise回调函数，通过then方法的调用，每次调用then方法返回新的Promise对象实例，从而形成链式调用。
```javascript
// 采用Promise方式
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        readFile(path, 'utf-8', (err, data) => {
            if (data) {
                resolve(data);
            }
        })
    })
}

readFilePromise('./test1.txt').then(data => {
    return readFilePromise(data);
}).then(data => {
    return readFilePromise(data);
}).then(data => {
    console.log(data);
})
```

### 3. 封装promisify函数
```javascript
function myPromisify(func) {
    return function(...arg) {
        return new Promise((resolve, reject) => {
            func(...arg, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}

let readFilePromisify = myPromisify(readFile)

readFilePromisify('./test1.txt', 'utf-8').then(data => {
    return readFilePromisify(data, 'utf-8');
}).then(data => {
    return readFilePromisify(data, 'utf-8');
}).then(data => {
    console.log(data);
})
```
Node提供了promisify函数可以直接使用
```js
let readFilePromisify = promisify(readFile); // utils.promisify();
```

### 4. 封装promisifyAll
将fs模块上面的方法转成Promise。     
```javascript
function myPromisifyAll(obj) {
    for (let [key, fn] of Object.entries(obj)) {
        if (typeof fn === 'function') {
            obj[key + 'Async'] = myPromisify(fn);
        }
    }
}

myPromisifyAll(fs);
fs.readFileAsync('./test1.txt', 'utf-8').then(data => {
    return fs.readFileAsync(data, 'utf-8');
}).then(data => {
    return fs.readFileSync(data, 'utf-8');
}).then(data => {
    console.log(data);
})
```