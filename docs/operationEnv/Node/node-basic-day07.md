---
autoGroup-1: Node基础
sidebarDepth: 3
title:  7. events模块、fs模块
---

## events
### 1. require('events')是一个类
1. 后端继承自EventEmitter的实例，前端则是DOM元素
2. 前端的事件名都是与浏览器约定好的，固定的类型如click，mousemove等，后端的事件名是自定义的
3. 前端通过UI操作来触发事件，后端通过emit（事件名）来触发事件

```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

// 监听自定义事件
ce.on('test', () => {
    console.log(1);
})

// 触发自定义事件
ce.emit('test'); // 1
```

### 2. 事件触发次数没有限制
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

// 监听自定义事件
ce.on('test', () => {
    console.log(1);
})

// 触发自定义事件
setInterval(() => {
    ce.emit('test')
}, 500);
```

### 3. 事件传参方式
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

ce.on('test', (data, data1, data2) => {
    console.log(data, data1, data2);
})

ce.emit('test', 'hello', 11, 22); // 'hello' 11 22
```

### 4. 通用事件
例如error，自定义名称不要和通用事件名称相同
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

ce.on('error', (data) => {
    console.log(data);
})

ce.emit('error', new Error('going wrong'));
// Error: going wrong
// at Object.<anonymous>...
```

### 5. once触发一次
如果想要绑定的事件只触发一次，可以使用once去监听事件
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

ce.once('test', (data, time) => {
    console.log(data, time);
})

setInterval(() => {
    ce.emit('test', 'test', Date.now());
}, 500);
// test 1658183637685
```

### 6. 一个自定义事件可以绑定多个监听函数
```javascript

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

function fn1() {
    console.log('fn1');
}

function fn2() {
    console.log('fn2');
}

ce.on('test', fn1);
ce.on('test', fn2);

ce.emit('test');
// fn1
// fn2
```

### 7. 移除事件的方法removeListener
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

function fn1() {
    console.log('fn1');
}

function fn2() {
    console.log('fn2');
}

ce.on('test', fn1);
ce.on('test', fn2);
ce.removeListener('test', fn1);

ce.emit('test');
// fn2
```

### 8. 移除事件方法off
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

function fn1() {
    console.log('fn1');
}

function fn2() {
    console.log('fn2');
}

ce.on('test', fn1);
ce.on('test', fn2);
ce.off('test', fn1);

ce.emit('test');
// fn2
```

### 9. 移除所有事件removeAllListener
```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

function fn1() {
    console.log('fn1');
}

function fn2() {
    console.log('fn2');
}

ce.on('test', fn1);
ce.on('test', fn2);
ce.removeAllListeners('test');

ce.emit('test');
```

### 10. getMaxListeners, listenerCount
- getMaxListeners：获取监听的最大事件数
- listenerCOunt(事件名)：获取监听事件数量

```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}

const ce = new CustomEvent();

function fn1() {
    console.log('fn1');
}

function fn2() {
    console.log('fn2');
}

ce.on('test', fn1);
ce.on('test', fn2);
console.log(ce.getMaxListeners()); // 10
console.log(ce.listenerCount('test')); // 2
```

## fs
fs模块可用于与文件系统进行交互
### 1. readFile读取文件
#### 1. 没有指定编码方式时，默认是用buffer传递数据
```javascript
// 没有指定编码方式时，默认是用buffer传递参数
const fs = require('fs');

fs.readFile('./index.html', (err, data) => {
    if (err) console.log(err);

    console.log(data); // <Buffer 3c 21 44 4f  ... 390 more bytes>
    console.log(data.toString()); // data.toString默认输出为utf-8
})
```

#### 2. 如果readFile的第二个参数填写了编码格式，data会按照编码格式转化
```javascript
const fs = require('fs');

fs.readFile('./index.html', 'utf-8', (err, data) => {
    if (err) console.log(err);

    console.log(data); // 输出为utf-8方式
});
```

#### 3. readFileSync虽然可以同步读取文件，但是不建议这么做
```javascript
const fs = require('fs');

let res = fs.readFileSync('./index.html', 'utf-8');
console.log(res);
```

### 2. writeFile写入文件
#### 1. 如果这个文件存在，所有的内容会被重新覆盖，不存在会创建一个新的文件
```js
const fs = require('fs');

fs.writeFile('./test.js', 'this is a test', err => {
  if(err){
    console.log(err);
  }else{
    console.log('done');
  }
})
```

#### 2. 用buffer也可以写入文件
```js
const fs = require('fs');
const content = Buffer.from('this is test111');

fs.writeFile('./test.js', content, err => {
  if(err){
    console.log(err);
  }else{
    console.log('done');
  }
})
```

### 3. fs.stat文件的一些状态信息
```js
const fs = require('fs');

fs.stat("./test.js", (err, data) => {
  if(err) throw err;
  console.log(data.atime); // 上次提交时间 2022-07-19T07:32:23.870Z
  console.log(data.isDirectory()); // 是文件夹吗？ false
  console.log(data.isFile()); // 是文件吗？  true
})
```

### 4. fs.rename更改文件名称
```js
const fs = require('fs');

fs.rename('./test.js', 'newTest', (err, data) => {
  if(err) throw err;
  console.log('done');
})

// test.js - > newTest
```

### 5. fs.unlink删除文件
```js
const fs = require('fs');

fs.unlink('newTest', (err, data) => {
  if(err) throw err;
  console.log('done');
})
```

### 6. fs.readdir读取文件
```js
const fs = require('fs');

fs.readdir('./', (err, files) => {
  if(err) throw err;
  console.log(files);
})
//  [ '.vscode', 'app.js', 'index.css', 'index.html', 'list.js']

```

### 7. fs.mkdir新建文件夹
```js
const fs = require('fs');

fs.mkdir('./test.js', err => {
  if(err) throw err;
  console.log('done');
})
```

### 8. fs.rmdir移除文件夹
```js
const fs = require('fs');

fs.rmdir('./test.js', err => {
  if(err) throw err;
  console.log('done');
})
```

### 9. fs.watch监听文件夹
```js
fs.watch('./', {
  recursive: true
}, (eventType, fileName) => {
  console.log(eventType, fileName);
})
```
监听filename的修改，其中filename是文件或目录