---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Process
---

## 模块

默认执行文件使用node来执行，他会把这个文件当成一个模块，此时this是空对象，模块中默认把this给修改了。

```javascript
console.log(this);// {}
```

在前端中访问变量通过window属性，但是在后端中，想访问全局需要通过global

```javascript
console.log(global);
/**
<ref *1> Object [global] {
  global: [Circular *1],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  }
}
 */

// 展示全部属性
console.dir(global, { showHidden: true });
```

- Buffer：node中的二进制对象（最早的时候浏览器不能直接读写文件）
- __dirname：当前文件执行时的目录，绝对路径
- __filename: 文件自己的绝对路径
- process：
  - platform
  - chdir：一般不用
  - cwd：current working directory 当前工作目录。webpack会自动查找运行webpack的目录下查找webpack.config.js。
  - env：执行代码时传入环境。if(process.env.NODE_ENV === 'development')
  - argv：执行代码时传入的参数
  - nextTick：
- setImmediate


解析执行代码时传入的参数：

```javascript
console.log(process.argv); // 会根据用户传递的参数来解析，生成对应的功能
// ['执行node所在的exe文件', '当前执行的文件', ...其他参数]

let argv = process.argv.slice(2).reduce((memo, current, index, arr) => {
  if (current.startsWith('--')) {
    memo[current.slice(2)] = arr[index + 1];
  }
  return memo;
}, {});
console.log(argv);
/**
 * 终端执行：node 1.js --port 3000 --info abc
 * 执行结果：{ port: '3000', info: 'abc' }
 */
```


## nextTick

nextTick是node自己实现的，不属于node中的EventLoop，优先级比promise更高。

```javascript
Promise.resolve().then(() => {
  console.log('promise')
})

process.nextTick(() => {
  console.log('nextTick')
})
/**
nextTick
promise
 */
```

