---
autoGroup-1: ES6
sidebarDepth: 3
title: 21. iterator、generator
---
## Iterator

### 1. 迭代器与迭代模式的区别
1. 迭代器模式：结构化模式，从源目标一次一个的方式抽取。
2. 迭代器：是一种有序的、连续的，基于抽取的阻止方式。

### 2. 内部迭代器与外部迭代器
1. 内部迭代器：系统内部定义好的迭代规则，调用系统内部的迭代器接口（for...of, forEach），在进行调用的时候一次性能够拿到数据内部的结构。
2. 外部迭代器：手动部署iterator迭代器的接口，调用手动部署的迭代器接口，一次抽取一个数据。

### 3. 部署iterator接口数据的类型
1. 部署iterator接口数据的类型：
```md
array, map, set, string, TypeArray, NodeList, arguments
```
2. 默认调用iterator接口的场合：
> 1. 拓展运算符（...）
> 2. for...of
> 3. Array.from()
> 4. Map，Set
> 5. Promise.all(), Promise.race()
> 6. yield

### 4. 迭代器实现
```js
function makeIterator(arr) {
    let nextIndex = 0;
    return {
        next() {
            if (nextIndex < arr.length) {
                return { value: arr[nextIndex++], done: false }
            } else {
                return { value: undefined, done: true }
            }
        }
    }
}

let iter = makeIterator(['a', 'b']);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
```

## 自定义可迭代对象
Object没有部署iterator接口，因为对象是无序的，没有遍历的顺序，所以并没有办法进行有序的抽取数据，遍历器的本质是线性的处理方法，而对象的接口属于非线性。

### 1. 实现自定义可迭代对象的两种方式
1. 通过源对象的键名作为迭代的顺序
```javascript
let obj = {
  a: 1,
  b: 2,
  c: 3
}

obj[Symbol.iterator] = function(){
  let idx = 0,
    keyArr = Object.keys(obj), // 获取源对象的键名 ['a', 'b', 'c']
    len = keyArr.length,
    _self = this;

  return {
    next(){
      if(idx < len){
        return { value: _self[keyArr[idx++]], done: false }
      }else{
        return { value: undefined, done: true}
      }
    }
  }
}

for(let val of obj){
  console.log(val);
}
```
2. 源对象转为Map形式，将Map转为数组之后进行迭代。
```javascript
let obj = {
    a: 1,
    b: 2,
    c: 3,
}
obj[Symbol.iterator]= function() {
    let nextIndex = 0;
    let map = new Map();
    // 源对象转为Map数据结构
    for (let [key, value] of Object.entries(this)) {
        map.set(key, value);
    }
    console.log(map); // {'a' => 1, 'b' => 2, 'c' => 3}

    // 将Map数据结构转为数组，利于之后返回迭代对象
    let mapEntries = [...map.entries()]; // [['a', 1], ['b', 2], ['c', 3]]
    return {
        next() {
            return nextIndex < mapEntries.length ? { value: mapEntries[nextIndex++], done: false } : { value: undefined, done: true };
        }
    }
}

for (let i of obj) {
    console.log(i);
    /**
     * ['a', 1]
     * ['b', 2]
     * ['c', 3]
     */
}
```

### 2. 可迭代对象return方法
迭代器中的return方法。如果for...of循环提前退出（通常是因为出错，或者有break语句），就调用return()方法。
```js
let obj = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.iterator]() {
        let nextIndex = 0;
        let map = new Map();
        for (let [key, value] of Object.entries(this)) {
            map.set(key, value);
        }

        let mapEntries = [...map.entries()];
        return {
            next() {
                return nextIndex < mapEntries.length ? { value: mapEntries[nextIndex++], done: false } : { value: undefined, done: true };
            },
            // 只要能终止for...of循环的操作都会默认调用这个return方法： break， throw new Error()
            return () {
                return { value: 1, done: true }  // 必须返回一个对象
            }
        }

    }
}

for (let i of obj) {
    console.log(i);
    // break; // 
    throw new Error('hello');
}
```

## Generator
### 1. Generator与iterator的联系
Generator生成器函数执行返回一个遍历器对象，而通过遍历器对象可以进行迭代。也就是说，通过Generator生成器函数可以对自定义部署iterator接口进行简化，通过实现Generator生成器函数实现自定义iterator接口部署。

1. 自定义\[Symbol.iterator]接口
```javascript
obj[Symbol.iterator] = function(){
  let idx = 0,
    keyArr = Object.keys(obj), // 获取源对象的键名 ['a', 'b', 'c']
    len = keyArr.length,
    _self = this;

  return {
    next(){
      if(idx < len){
        return { value: _self[keyArr[idx++]], done: false }
      }else{
        return { value: undefined, done: true}
      }
    }
  }
}
```
2. 利用Generator生成器函数进行实现iterator简化
```javascript
let obj = {
  a: 1,
  b: 2,
  c: 3
}

obj[Symbol.iterator] = function * (){
  var _self = this;
  var keys = Object.keys(obj);
  for(let key of keys){
    yield [key, _self[key]]
  }
}

for(let val of obj){
  console.log(val);
}
```

3. Generator函数执行后，返回一个遍历对象，该对象本身也具有Symbol.iterator属性，执行后返回自身。
```javascript
function * gen(){}
var g = gen();
g[Symbol.iterator]() === g; // true
```

### 2. Generator函数的基本概念
Generator生成器函数时ES6提供的一种异步编程解决方案，语法角度上，Generator函数可以理解成一个状态机，封装了多个内部状态；执行Generator函数会返回一个遍历器对象，也就是说Generator函数处理状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以一次遍历Generator函数内部的每一个状态。

1. Generator函数的特征
> 1. function关键字与函数名之间有 * 号
> 2. 函数体内部使用yield关键字，定义不同内部状态；通常yield 'a' 表示一个异步操作，返回异步操作的状态。yield产出不同的值，暂停函数运行。

2. Generator函数的执行顺序
> 1. Generator函数test函数调用后并不会执行，返回一个遍历器对象（指向内部状态的指针对象）
> 2. 调用遍历器对象的next()方法，才能够将指针移动到下一个内部状态。每次调用遍历对象的next()方法，内部的指针对象就从上一次停下来的位置进行执行，直到遇见yield关键字和return语句为止。yield表达式是Generator函数暂停的标志，next()方法则是恢复程序执行.
```js
function* test() {
    console.log(0);
    yield 'a';
    console.log(1);
    yield 'b';
    console.log(2);
    yield 'c';
    console.log(3);
    return 'd';
}

// 返回值是迭代器对象; yield产出不同的值，暂停函数运行
let iter = test(); // 函数不会执行，返回的也不是函数运行结果，而是迭代器对象
console.log(iter.next()); //0 {value: 'a', done: false}
console.log(iter.next()); //1 {value: 'b', done: false}
console.log(iter.next()); //2 {value: 'c', done: false}
console.log(iter.next()); //3 {value: 'd', done: true}
console.log(iter.next()); // {value: undefined, done: true}
```

### 3. Generator函数中return与yield的区别
1. 语义上的区别：yield（函数暂停）return（函数终止）
2. 产出值的区别：
  - yield：迭代器接口迭代的是yield表达式产出的值，yield产出的值能够存在iterator当中，也就是说yield有多少个，相应的返回对象中done的false与true是根据它的产出值决定的，如果有值就是true，如果没值就是false；
  - return：return虽然能够产出值，但是不会寄存在iterator接口中，也就是说不会成为迭代器迭代的值；

3. 本质区别：
  - yield产出值，它是暂停Generator函数，暂停的化，下一次执行就会找到上一次执行的位置，所以yield存在记忆功能；
  - return虽然能够产出值，但是不寄存在iterator当中，并且return直接终止Generator函数，并不存在记忆功能；

### 4. yield表达式
1. 基本注意事项
> 1. yield只能够存在Generator生成器函数当中，在普通函数中抛出异常；
> 2. Generator遇到yield表达式，就暂停执行后面的操作，并将紧跟yield后面的表达式值，作为返回的对象的value值；
> 3. Generator函数在上一次next()调用之后，如果没有遇到新的yield表达式，就一直运行到函数结果，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值；
> 4. 如果Generator没有手动显示return语句，则返回的对象value属性值为undefined；

2. 特殊注意事项
> 1. yield本身并没有返回值，或者说总是返回undefined。
```js
function* test() {
    let a = yield 'a';
    console.log(a);
    yield 'b';
    yield 'c';
    return 'd';
}

let iter = test();
console.log(iter.next()); 
console.log(iter.next()); 
/**
 {value: 'a', done: false}
 undefined
 {value: 'b', done: false}
 */
```

> 2. yield如果用在另一个表达式中，必须放在圆括号里面
```js
function* demo() {
    yield; // OK
    console.log('hello' + yield); // SyntaxError
    console.log('hello' + yield 123); // SyntaxError

    console.log('hello' + (yield)); // OK
    console.log('hello' + (yield 123)); // OK
}
```
> 3. yield表达式可以当作函数参数，或者放在赋值操作表达式右边，可以不加括号
```javascript
// 函数参数
function * demo(){
	foo(yield 'a', yield 'b');
}
function foo(a, b) {
	console.log(a, b);
}
let iter = demo();
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

// 赋值操作
function * demo(){
	let input = yield 2;
}
```

### 5. next方法的返回值
#### 3. next方法可以带有一个参数，该参数会被当做上一个yield表达式的返回值。
```js
function* foo() {
    let value1 = yield 1;
    console.log('value1: ', value1);
    let value2 = yield 2;
    console.log('value2: ', value2);
    let value3 = yield 3;
    console.log('value3: ', value3);
    let value4 = yield 4;
    console.log('value4: ', value4);
}

let iter = foo();
// next参数标识上一个yield表达式的返回值，所以第一次使用next方法时，传递参数是无效的。
console.log(iter.next('one')); // {value: 1, done: false}
console.log(iter.next('two')); // value1: two  {value: 2, done: false}
console.log(iter.next('three')); // value2: three  {value: 3, done: false}
console.log(iter.next('four')); // value3: four  {value: 4, done: false}
console.log(iter.next('five')); // value4: two  {value: undefined, done: true}
```

for...of循环自动遍历Generator函数运行时生成的Iterator对象。
```js
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    yield 6;
    return 7;
}

for (let i of foo()) {
    console.log(i); // 1,2,3,4,5,6。不包含7
}
```

Generator函数就是遍历器生成函数。因此可以把Generator赋值给对象Symbol.iterator属性。 

采用generator函数优化obj部署迭代器
```js
let obj = {
    start: [1, 2],
    end: [7, 8, 9],
    [Symbol.iterator]: function*() {
        let nextIndex = 0,
            arr = [...this.start, ...this.end],
            len = arr.length;
        while (nextIndex < len) {
            yield arr[nextIndex++];
        }
    }
}
for (let i of obj) {
    console.log(i); // 1,2,7,8,9
}

/**********************************************/
let obj = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.iterator]: function*() {
        let nextIndex = 0;
        let map = new Map();
        for (let [key, value] of Object.entries(this)) {
            map.set(key, value);
        }

        let mapEntries = [...map.entries()];
        while (nextIndex < mapEntries.length) {
            yield mapEntries[nextIndex++]
        }

    }
}

for (let i of obj) {
    console.log(i); // ['a', 1], ['b', 2], ['c', 3]
}
```

优化文件读取流程
```js
import fs from 'fs'

fs.readFile('./test1.txt', 'utf-8', (err, data) => {
    fs.readFile(data, 'utf-8', (err, data) => {
        fs.readFile(data, 'utf-8', (err, data) => {
            console.log(data);
        })
    })
})

// // promisify 优化

function myPromisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}

let readFilePromisify = myPromisify(fs.readFile);

readFilePromisify('./test1.txt', 'utf-8')
    .then(res => readFilePromisify(res, 'utf-8'))
    .then(res => readFilePromisify(res, 'utf-8'))
    .then(res => console.log(res))

// generator生成器函数优化

function* read() {
    let value1 = yield readFilePromisify('./test1.txt', 'utf-8'); // 返回Promise对象
    let value2 = yield readFilePromisify(value1, 'utf-8');
    let value3 = yield readFilePromisify(value2, 'utf-8');
    console.log(value3);
}

let iter = read();
let { value, done } = iter.next(); // {value: xxx, done: false}
value.then((val) => {
    console.log(val); // ./test2.txt
    let { value, done } = iter.next(val);

    value.then(val => {
        console.log(val); // ./test3.txt
        let { value, done } = iter.next(val);

        value.then(val => {
            console.log(val); // finally
        })
    })
})

// 优化

function Co(iter) {
    return new Promise((resolve, reject) => {
        let next = (data) => {
            let { value, done } = iter.next(data);
            if (done) {
                resolve(value);
            } else {
                value.then(val => {
                    next(val);
                });
            }
        }
        next();
    })
}

let promise = Co(read());
promise.then((val) => {
    console.log(val); //  finally
})
```

return()方法
```js
function* get() {
    yield 1;
    yield 2;
    yield 3;
}

let g = get();
console.log(g.next()); // {value: 1, done: false}
console.log(g.return()); //  {value: undefined, done: true} 终止迭代
console.log(g.next());

// 同等于

function* get() {
    yield 1;
    return; // 终止迭代
    yield 2;
    yield 3;
}
```

throw()方法
```js
let g = function*() {
    try {
        yield;
    } catch (e) {
        console.log('生成器内部异常', e);
    }
    console.log(1);
}

let i = g();
console.log(i.next());
console.log(i.throw()); // 必须写在next的后面才能被catch捕获到，因为g中有一个yield。后面的代码依旧会执行
console.log(i.next());
```
文件读取错误捕获
```js
import fs from 'fs'
import { promisify } from 'util'
import co from 'co'

let readFile = promisify(fs.readFile);

function* read() {
    try {
        let value1 = yield readFile('./test1.tx', 'utf-8');
        let value2 = yield readFile(value1, 'utf-8');
        let value3 = yield readFile(value2, 'utf-8');
        return value3;
    } catch (e) {
        console.log('read 内部异常:', e);
    }
}

let promise = co(read());
promise.then(res => console.log(res))
```