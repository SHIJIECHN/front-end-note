---
autoGroup-4: 函数式编程
sidebarDepth: 3
title: 防抖与节流
---

## 防抖
1. 当事件触发时，相应的函数不会被立即触发，而是会被推迟执行
2. 当事件连续密集触发时，函数的触发会被一直推迟
3. 只有当等待一段时间后也没有再次触发该事件，那么才会真正执行响应函数
```html
<div id="app" style="height:150px;line-height:150px;text-align:center; color: #fff;background-color:#ccc;font-size:80px;"></div>
```
```javascript
/**
 * @param {*} fn 防抖处理的函数
 * @param {*} delay 延迟时间，默认为1s
 * @param {*} triggerNow 是否要第一次立即执行，默认为false
 * @returns 
 */
function debounce(fn, delay = 1000, triggerNow = false) {
  // 定义一个定时器
  let t = null;
  // 记录是否立即执行，默认为false
  let isImmediate = false;

  // 将回调接收的参数保存到args数组中
  function _debounce(...args) {
    let context = this; // 保存this指向

    // t不为null，也就是说有定时器存在。取消上一次的定时器
    if (t) clearTimeout(t);

    // 当第一次触发，并且需要触发第一次时间
    if (triggerNow && !isImmediate) {
      fn.apply(context, args);
      // 将isImmediate设置为true，这样不会影响到后面频繁触发的函数调用
      isImmediate = true;
    }

    t = setTimeout(function () {
      // 使用apply改变fn的this，同时将参数传递给fn
      fn.apply(context, args);
      // 当定时器里的函数执行时，也就是说频繁触发事件的最后一次事件
      // 将isImmediate设置为false，这样下一次的第一次触发事件才能被立即执行
      isImmediate = false;
    }, delay);
  }

  // 防抖函数会返回另一个函数，该函数才是真正被调用的函数
  return _debounce;
}


let num = 1;
let app = document.getElementById('app');

function count() {
  app.innerHTML = num++;
}
// 多次执行
// app.onmousemove = count;
// 使用防抖
app.onmousemove = debounce(count, 1000, true);
```

## 节流
1. 节流是指当事件触发时，执行这个事件的响应函数
2. 但是该事件如果被频繁触发，那么节流函数会按照一定的频率来执行函数

```javascript
/**
 * 节流(时间戳)
 * @param {*} fn 执行的函数
 * @param {*} interval 间隔时间
 * @param {*} leading 是否要第一次立即执行，默认为true
 */
function throttle(fn, interval, leading = true) {
  // 用于记录上一次函数的执行时间
  let lastTime = 0;
  // 内部的控制是否立即执行的变量
  let isLeading = true;
  // time 保存定时器的id
  let time = null;

  const _throttle = function (...args) {
    // 获取当前时间
    const nowTime = new Date().getTime();

    // 第一次不需要立即执行
    if (isLeading && leading) {
      // 将lastTime设置为nowTime，这样就不会导致第一次时remainTime大于interval
      lastTime = nowTime;

      // 将isLeading设置为false，这样就不会对后续的lastTime产生影响
      isLeading = false;
    }

    // 剩余时间
    const remainTime = nowTime - lastTime;
    // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
    if (remainTime - interval >= 0) {
      fn.apply(this, args);
      // 将上一次函数执行的时间设置为nowTime
      lastTime = nowTime;
    }

    if (remainTime < interval) {
      if (time) clearTimeout(time)

      // 设置定时器
      time = setTimeout(() => {
        // 由于该定时器，会在没有事件触发的interval时间间隔后才会执行，
        // 也就是说一轮事件执行已结束，使用需要将isLeading复原，这样下
        // 一轮事件的第一次事件就不会立即执行了。
        isLeading = true;
      }, interval)
    }
  }

  return _throttle;
}

let num = 1;
let app = document.getElementById('app');

function count() {
  app.innerHTML = num++;
}

app.onmousemove = throttle(count, 1000);
```