---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Events
---

## 常用方法

发布订阅模式常用方法：
- 订阅方法
- 发布方法
- 取消方法
- 订阅一次

## 继承对象原型的方法

```javascript
// 继承对象原型方法：
// 第一种方式：直接继承（互相影响）
Girl.prototype.__proto__ = EventEmitter.prototype;
// 第二种方式：setPrototypeOf。同上面一种方式一样
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype);
// 第三种方式：Object.create（使用）
Girl.prototype = Object.create(EventEmitter.prototype);

// Object.create()原型继承的原理实现
function create(proto) {
  function Fn() { };
  Fn.prototype = proto;
  return new Fn(); // 它上面有所有EventEmitter.prototype方法

}
```

### 2. 实现

- 源码实现四种方法
  - 订阅方法
  - 发布方法
  - 取消方法
  - 订阅一次。注意逻辑中先执行一次回调，在进行删除，使用切片的方法。如果要在函数执行之前就取消，需要给one添加属性，否则无法获取与传入到callback相同的引用。再在off中判断删除

:::: tabs
::: tab index.js
```javascript
const EventEmitter = require('./events');
const util = require('util')

function Girl() {

}
util.inherits(Girl, EventEmitter); // 原型继承 需要通过实例来调用继承

let girl = new Girl();

const cry = (a, b) => {
  console.log('哭')
}

// '女生失恋': [fn1, fn2]
girl.on('女生失恋', cry)
girl.on('女生失恋', (a, b) => {
  console.log('吃')
})
const fn = () => {
  console.log('逛街')
}
girl.once('女生失恋', fn)

setTimeout(() => {
  girl.off('女生失恋', fn);
  girl.emit('女生失恋', 'a', 'b')
  girl.off('女生失恋', cry); // 移除
  girl.emit('女生失恋', 'a', 'b')
}, 1000)

/**
哭
吃
吃
 */
```
:::   
::: tab Events.js
```javascript
function EventEmitter() {
  this._events = {};
}
EventEmitter.prototype.on = function (eventsName, callback) {
  if (!this._events) {
    this._events = {}
  }
  if (this._events[eventsName]) {
    this._events[eventsName].push(callback); // {女生失恋: [fn1, fn2]}
  } else { // {女生失恋: [fn1]}
    this._events[eventsName] = [callback]
  }
}
EventEmitter.prototype.emit = function (eventName, ...args) {
  this._events[eventName].forEach(fn => {
    fn(...args);
  })
}
EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events && this._events[eventName]) {
    // 如果存储的方法和传入非不一样就留下，一样的就留下
    this._events[eventName] = this._events[eventName]
      .filter(fn => fn !== callback && fn.l !== callback);
  }
}

EventEmitter.prototype.once = function (eventName, callback) {
  // 注意：callback执行完再删除
  const one = () => { // 绑定执行完毕后再删除
    callback(); // 切片：变成目的就是增加自己的逻辑
    this.off(eventName, one);
  }
  one.l = callback; // 自定义属性，与callback关联起来
  this.on(eventName, one);
}

module.exports = EventEmitter;
```
:::   
::::

