---
autoGroup-1: ES6
sidebarDepth: 3
title: async/await
---

## async/await
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
async与await：async就是Generator函数的语法糖，返回的是一个Promise对象。
1. 内置执行器。Generator函数的执行必须靠执行器co模块，而async韩式自带执行器。
2. 更好的语义
3. 更广的适用性
4. 返回值是Promise

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