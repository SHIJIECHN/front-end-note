---
autoGroup-3: 源码专题
sidebarDepth: 3
title:  nextTick原理
---

## 定义
Vue再更新DOM时是异步执行的。当数据发生变化，Vue将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再同统一更新。

## 引入
### 1. 获取元素高度
根据文字的行数来显示展开更多的内容，因此我们在Vue中给数据赋值之后需要获取文字高度。
```js
<div id="app">
    <div class="msg">
        {{msg}}
    </div>
</div>
new Vue({
    el: '#app',
    data: function(){
        return {
            msg: ''
        }
    },
    mounted(){
        this.msg = '我是测试文字'
        console.log(document.querySelector('.msg').offsetHeight) //0
    }
})
```
这时不管怎么获取，文字的Div高度都是0；但是直接获取却是有值:
<img :src="$withBase('/framework/Vue/nextTick01.png')" alt="nextTick" />

### 2. 子组件传参
给子组件传参后，在子组件中调用函数查看参数。
```js
<div id="app">
    <div class="msg">
        <form-report ref="child" :name="childName"></form-report>
    </div>
</div>
Vue.component('form-report', {
    props: ['name'],
    methods: {
        showName(){
            console.log('子组件name：'+this.name)
        }
    },
    template: '<div>{{name}}</div>'
})
new Vue({
    el: '#app',
    data: function(){
        return {
            childName: '',
        }
    },
    mounted(){
        this.childName = '我是子组件名字'
        this.$refs.child.showName()
    }
})
```
虽然页面上展示了子组件的name，但是打印出来却是空值：
<img :src="$withBase('/framework/Vue/nextTick02.png')" alt="nextTick" />

## 异步更新
不管子组件还是父组件，都是在给data中赋值后立马去查看数据导致的。由于“查看数据”这个动作是同步操作的，而且都是在赋值之后；因此猜想：给数据赋值操作时一个异步操作，并没有马上执行。Vue、官网对数据操作是这样描述的：
> Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

也就是说我们在设置this.msg = 'some thing'的时候，Vue并没有马上去更新DOM数据，而是将这个操作放进一个队列中；如果我们重复执行的话，队列还会进行去重操作；等待同一事件循环中的所有数据变化完成之后，会将队列中的事件拿出来处理。   


优点：主要是为了提升性能，因为如果在主线程中更新DOM，循环100次就要更新100次DOM；但是如果等事件循环完成之后更新DOM，只需要更新1次。


为了在数据更新操作之后操作DOM，我们可以在数据变化之后立即使用Vue.nextTick(callback)；这样回调函数会在DOM更新完成后被调用，就可以拿到最新的DOM元素了。

```js
//第一个demo
this.msg = '我是测试文字'
this.$nextTick(()=>{
    //20
    console.log(document.querySelector('.msg').offsetHeight)
})
//第二个demo
this.childName = '我是子组件名字'
this.$nextTick(()=>{
    //子组件name：我是子组件名字
    this.$refs.child.showName()
})
```

## 实现原理

### 1. nextTick
源码位置：/src/core/util/next-tick.js
```js
const callbacks = [] // 队列
let pending = false  // 标识同一时间只能执行一次 timerFunc()
let timerFunc

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve

  // callbacks 新增回调函数 cb，cb会经过统一处理。
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })

  // 执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true
    timerFunc()
  }
  // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
总结：
1. callbacks也就是异步操作队列。
2. callbacks新增回调函数后又执行了timerFunc函数，pending是用来标识同一个时间只能执行一次。
3.  当nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用。因此可以使用async/await。
```js
his.message = '修改后的值'
console.log(this.$el.textContent) // => '原始的值'
// this.$nextTick(function () {
//     console.log(this.$el.textContent) // => '修改后的值'
// })
await this.$nextTick() 
console.log(this.$el.textContent) // => '修改后的值'
```

### 2. timerFunc
根据当前环境支持什么方法则确定调用哪个，分别有：Promise.then、MutationObserver、setImmediate、setTimeout。通过上面任意一种方法，进行降级操作。
```js
export let isUsingMicroTask = false
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  //判断2：是否原生支持MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

总结：
1. 分别判断Promise.then、MutationObserver、setImmediate、setTimeout。
2. isNative函数：判断所传参数是否在当前环境原生就支持。

### 3. flushCallBack
```js
function flushCallbacks () {
  pending = false
  // callBacks 里面的函数复制一份，同事callbacks置空
  const copies = callbacks.slice(0)
  callbacks.length = 0
  // 依次执行callbacks里面的函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
总结：
1. flushCallBack：无论是微任务还是宏任务，都会放到flushCallbacks使用


实现原理总结：
1. 把回调函数放入callbacks等待执行
2. 将执行函数放到微任务或者宏任务中
3. 事件循环到了微任务或者宏任务，执行函数依次执行callback中的回调函数

