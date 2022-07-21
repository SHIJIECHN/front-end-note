---
autoGroup-1: ES6
sidebarDepth: 3
title: Iterator/Generator
---

## Iterator
迭代器实现
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
对象不具有迭代器接口，手动部署迭代器接口
```js
let obj = {
    start: [1, 2],
    end: [7, 8, 9],
    [Symbol.iterator]() {
        let nextIndex = 0,
            arr = [...this.start, ...this.end],
            len = arr.length;
        return {
            next() {
                if (nextIndex < len) {
                    return { value: arr[nextIndex++], done: false }
                } else {
                    return { value: undefined, done: true };
                }
            }
        }
    }
}

for (let i of obj) {
    console.log(i);
}
```

使obj与map的输出结果一致
```js
let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);
for (let [key, value] of map) {
    console.log(key, value);
    /**
     * ['a', 1]
     * ['a', 1]
     * ['c', 3]
     */
}

// 使obj与map的输出结果一致
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
            }
        }

    }
}

for (let i of obj) {
    console.log(i);
    /**
     * ['a', 1]
     * ['a', 1]
     * ['c', 3]
     */
}

```

默认调用iterator接口的场合：
1. 拓展运算符（...）
2. for...of
3. Array.from()
4. Map，Set
5. Promise.all(), Promise.race()
6. yield

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
返回值是迭代器对象。与yield配合使用，yield产出不同的值，暂停函数运行
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
```

yield 暂停，记忆功能；   
return 结束；

yield本身并没有返回值，或者说总是返回undefined。
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
console.log(iter.next()); //undefined {value: 'b', done: false}
```

yield如果用在另一个表达式中，必须放在圆括号里面
```js
function* demo() {
    yield; // OK
    console.log('hello' + yield); // SyntaxError
    console.log('hello' + yield 123); // SyntaxError

    console.log('hello' + (yield)); // OK
    console.log('hello' + (yield 123)); // OK
}
```

yield返回值。next方法可以带有一个参数，该参数会被当做上一个yield表达式的返回值。
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