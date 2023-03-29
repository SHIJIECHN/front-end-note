---
autoGroup-1: Node基础
sidebarDepth: 3
title:  10. process与事件循环
---

## process进程
```javascript
console.log(process.argv);
/**
[  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\小石头\\Documents\\Learning\\A01-前端基\\CSS\\flex-demo\\index.js'
]
*/
console.log(process.execArgv);

console.log(process.execPath); // C:\Program Files\nodejs\node.exe

console.log(process.env);

console.log(process.cwd()); // 执行文件的路径
// C:\Users\小石头\Documents\Learning\A01-前端基础\CSS\flex-demo
```

## 事件循环

[!官网](!https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick)

- 宏任务：回调函数，XHR，setTimeout，setInterval，UI rendering， I/O，setImmidate（node）
- 微任务：promise，process.nextTick（node）

Node.js的事件循环，它会把一些操作放到其他相关的线程来处理，当处理完毕之后，会通知主线程，由主线程决定什么时候来执行。也就是说：
1. Node.js是通过事件循环机制来运行JS代码的
2. 提供了线程池处理I/O操作任务
3. 两种线程：
   1. 事件循环线程：负责安排任务（require、同步执行回调、注册新任务）
   2. 线程池（libuv实现），负责处理任务（I/O操作、CPU密集型任务）

<img :src="$withBase('/operationEnv/Node/EventLoop.png')" alt="EventLoop"> 

### 1. 事件循环阶段phase
1. **Timers**：setTimeout/setInterval
2. Pending callbacks：执行延迟到下一个事件环迭代的I/O回调（内部机制使用）
3. Idle，prepare：系统内部机制使用
4. **Poll**：轮循，检查新的I/O事件；执行I/O的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和setImmediate调度的之外），其余情况node将在适当的时候在此阻塞。
5. **Check**：setImmediate。
6. Close callbacks：关闭回调函数（内部机制使用）。

在每次运行的事件循环之间，Node.js检查它是否在等待任何异步I/O或计时器，如果没有的话，则完全关闭。

```js
setTimeout(()=>{
  console.log('timer')
}, 0);

setImmediate(()=>{
  console.log('check')
});
```
执行结果可能出现以下两种情况，系统执行快时setTimeout先执行，系统执行慢setImmediate先执行。
<img :src="$withBase('/operationEnv/Node/EventLoop01.png')" alt="EventLoop"> 

如果想要setTimeout始终后面循环呢？    
```js
setTimeout(()=>{
  setTimeout(()=>{
    console.log('timer')
  }, 0);
  
  setImmediate(()=>{
    console.log('check')
  });
})
```
<img :src="$withBase('/operationEnv/Node/EventLoop02.png')" alt="EventLoop"> 

## 案例一
```js
// promise1.then
Promise.resolve().then(() => {
  console.log(1)
})

// nextTick1
process.nextTick(() => {
  console.log(2)
})

console.log('start')

// readFile
readFile('1.txt', 'utf-8', () => {
  // setTimeout1
  setTimeout(() => {
    console.log(3)
  }, 0)

  // nextTick2
  process.nextTick(() => {
    console.log(4)
  })

  // setImmediate1
  setImmediate(() => {
    console.log(5)
  })

  console.log(6)
})

console.log(7)

// setTimeout2
setTimeout(() => {
  console.log(8)
}, 0)

// setImmediate2
setImmediate(() => {
  console.log(9)
})

console.log('end')
```
1. 代码执行
```md
<主执行栈>

<微任务>

<Timers>

<Poll>

<Check>
```
2. promise1.then的回调放入微任务队列
```md
<主执行栈>

<微任务>
promise1.then

<Timers>

<Poll>

<Check>
```
3. nextTick1的回调放入微任务队列
```md
<主执行栈>

<微任务>
promise1.then
nextTick1

<Timers>

<Poll>

<Check>
```
4. console.log('statr')执行，输出start
```md
<主执行栈>
start

<微任务>
promise1.then
nextTick1

<Timers>

<Poll>

<Check>
```
5. readFile放入Poll
```md
<主执行栈>
start

<微任务>
promise1.then
nextTick1

<Timers>

<Poll>
readFile

<Check>
```

6. console.log(7)执行，输出7
```md
<主执行栈>
start
7

<微任务>
promise1.then
nextTick1

<Timers>

<Poll>
readFile

<Check>
```

7. setTimeout2放入Timers
```md
<主执行栈>
start
7

<微任务>
promise1.then
nextTick1

<Timers>
setTimeout2

<Poll>
readFile

<Check>
```

8. setImmediate2 放入 Check；
```md
<主执行栈>
start
7

<微任务>
promise1.then
nextTick1

<Timers>
setTimeout2

<Poll>
readFile

<Check>
setImmediate2
```
9. console.log('end') 执行，输出 end
```md
<主执行栈>
start
7
end

<微任务>
promise1.then
nextTick1

<Timers>
setTimeout2

<Poll>
readFile

<Check>
setImmediate2
```

10. 主执行栈清空，准备进入 Timers 阶段，先执行 nextTick1 的回调，输出 2
```md
<主执行栈>
start
7
end
2

<微任务>
promise1.then

<Timers>
setTimeout2

<Poll>
readFile

<Check>
setImmediate2
```
11. nextTick1 的回调执行完毕，清空微任务 promise1.then，输出 1；
```md
<主执行栈>
start
7
end
2
1

<微任务>

<Timers>
setTimeout2

<Poll>
readFile

<Check>
setImmediate2
```
12. 进入 Timers 阶段，setTimeout2 执行，setTimeout2 的回调放入回调队列
```md
<主执行栈>
start
7
end
2
1

<微任务>

<Timers>

<Poll>
readFile

<Check>
setImmediate2

<回调队列>
setTimeout2回调
```
13. 进入 Poll 阶段
    1.  注意这个阶段它有短暂的等待时间，如果在等待时间内 Timers 到时，会先回去执行 Timers setTimeout2 的回调，输出 8；然后再回到 Poll，再进行 Check 执行 setImmediate2 的回调，输出 9。
```md
<主执行栈>
start
7
end
2
1
8
9

<微任务>

<Timers>

<Poll>
readFile

<Check>

<回调队列>
```
  2. 它也有可能在等待时间结束后，Timers 还没到时，会先进入 Check 阶段，执行 setImmediate2 的回调，输出 9；然后回去执行 setTimeout2 的回调，输出 8；
```md
<主执行栈>
start
7
end
2
1
9
8

<微任务>

<Timers>

<Poll>
readFile

<Check>

<回调队列>
```

14. 下一轮没有了微任务， Timers，为空，直接进入 Poll，readFile 的回调执行；setTimeout1 放入 Timers；nextTick2 的回调放入微任务队列；setImmediate1 放入 Check；console.log(6) 执行，输出 6；
```md
<主执行栈>
start
7
end
2
1
9
8
6

<微任务>
nextTick2

<Timers>
setTimeout1

<Poll>

<Check>
setImmediate1

<回调队列>
```

15. 主执行栈执行完毕，nextTick2 的回调执行，输出4
```md
<主执行栈>
start
7
end
2
1
9
8
6
4

<微任务>

<Timers>
setTimeout1

<Poll>

<Check>
setImmediate1

<回调队列>
```

16. Poll 阶段完毕，注意，在 I/O 操作里面，会直接进入 Check 阶段，setImmediate1 执行，输出 5；setTimeout1 执行，输出 3；
```md
<主执行栈>
start
7
end
2
1
9
8
6
4
5
3

<微任务>

<Timers>

<Poll>

<Check>

<回调队列>
```

17.  执行结果有两种：start 7 end 2 1 9 8 6 4 5 3 或者 start 7 end 2 1 8 9 6 4 5 3


## 案例二
```js
console.log('start')

readFile('1.txt', 'utf-8', () => {
  setTimeout(() => {
    // nextTick1
    process.nextTick(() => {
      console.log('nextTick1')
    })
    
    console.log('setTimeout')
  })

  Promise.resolve().then(() => {
    // nextTick2
    process.nextTick(() => {
      console.log('nextTick2')
    })

    console.log('promise')
  })

  setImmediate(() => {
    // nextTick3
    process.nextTick(() => {
      console.log('nextTick3')
    })

    console.log('setImmediate')
  })

  // nextTick4
  process.nextTick(() => {
    console.log('nextTick4')
  })

  console.log('readFile')
})

console.log('end')
```

1. star和end先输出
```md
<主执行栈>
start
end
:

<微任务>
:
:
readFile
:
<回调队列>
```
2. readFile 回调执行，setTimeout 放入 Timers；promise.then 的回调放入微任务队列；setImmediate 放入 Check；nextTick4 的回调挂起；console.log('readFile') 执行，输出 readFile；
```md
<主执行栈>
start
end
readFile
:
nextTick4的回调
<微任务>
promise.then
:
setTimeout
:
:
setImmediate
<回调队列>
```
3. nextTick4 回调执行，输出 nextTick4
```md
<主执行栈>
start
end
readFile
nextTick4
:
<微任务>
promise.then
:
setTimeout
:
:
setImmediate
<回调队列>
```

4. 清空微任务，promise.then 回调执行，nextTick2 的回调挂起，console.log('promise') 执行，输出 promise；
```md
<主执行栈>
start
end
readFile
nextTick4
promise
:
nextTick2 的回调
<微任务>
:
setTimeout
:
:
setImmediate
<回调队列>
```

5. nextTick2 回调执行，输出 nextTick2；
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
:
<微任务>
:
setTimeout
:
:
setImmediate
<回调队列>
```

6. Timer 阶段，setTimeout 执行，回调放入回调队列
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
:
<微任务>
:
:
:
setImmediate
<回调队列>
setTimeout 的回调
```

7. Poll 阶段，去检查 Check，setImmediate 回调执行，nextTick3 的回调挂起；console.log('setImmediate') ，输出 setImmediate；
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
setImmediate
:
nextTick3的回调
<微任务>
:
:
:
<回调队列>
setTimeout 的回调
```

8. nextTick3 的回调执行，输出 nextTick3
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
setImmediate
nextTick3
:
<微任务>
:
:
:
<回调队列>
setTimeout 的回调
```
9. setTimeout 的回调执行，nextTick1 的回调挂起；console.log('setTimeout') 执行，输出 setTimeout；
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
setImmediate
nextTick3
setTimeout
:
nextTick1的回调
<微任务>
:
:
:
<回调队列>
```
10. nextTick1 的回调执行，输出 nextTick1；
```md
<主执行栈>
start
end
readFile
nextTick4
promise
nextTick2
setImmediate
nextTick3
setTimeout
nextTick1
:
<微任务>
:
:
:
<回调队列>
```

## 理解process.nextTick
需要注意的是，在Node.js的文档中指出，process.nextTick从技术上讲，它不属于事件循环的一部分。    
它会在当前阶段的操作完成之后处理nextTick队列。   
任何在给定阶段中调用的process.nexTTick()，它的回调都会在事件循环继续之前执行。可以理解为在当前阶段的所有同步代码执行完成之后，立即执行。   
```js
console.log(1)

// nextTick1
process.nextTick(() => {
  console.log(2)

  // nextTick2
  process.nextTick(() => {
    console.log(3)
  })
})

new Promise((resolve, reject) => {
  // nextTick3
  process.nextTick(() => {
    console.log(4)

    // nextTick4
    process.nextTick(() => {
      console.log(5)
    })
  })
  
  console.log(6)
  resolve()
}).then(() => {
  console.log(7)
})
```
1. 输出console.log(1)
```md
<主执行栈>
1
:
<nextTick回调队列>

<微任务>
:
:
:
```
2. nextTick1放入nextTick回调
```md
<主执行栈>
1
:
<nextTick回调队列>
nextTick1的回调

<微任务>
:
:
:
```
3. Promise的Executor执行，nextTick3放入nextTick回调队列；console.log(6)执行，输出6；Promise状态变更，Promise.then的回调放入微任务队列；
```md
<主执行栈>
1
6
:
<nextTick回调队列>
nextTick1的回调
nextTick3的回调

<微任务>
Promise.then
:
:
:
```
4. 主执行栈完毕，nextTick1 的回调执行，console.log(2) 执行，输出 2；nextTick2 放入 nextTick队列；
```md
<主执行栈>
1
6
2
:
<nextTick回调队列>
nextTick3的回调
nextTick2的回调

<微任务>
Promise.then
:
:
:
```
5. nextTick3 的回调执行，console.log(4) 执行，输出 4；nextTick4 放入 nextTick队列；
```md
<主执行栈>
1
6
2
4
:
<nextTick回调队列>
nextTick2的回调
nextTick4的回调

<微任务>
Promise.then
:
:
:
```
6. nextTick2 的回调执行，console.log(3) 执行，输出 3；
```md
<主执行栈>
1
6
2
4
3
:
<nextTick回调队列>
nextTick4的回调

<微任务>
Promise.then
:
:
:
```
7. nextTick4 的回调执行，console.log(5) 执行，输出 5
```md
<主执行栈>
1
6
2
4
3
5
:
<nextTick回调队列>

<微任务>
Promise.then
:
:
:
```

8. 清空微任务，console.log(7) 执行，输出 7；
```md
<主执行栈>
1
6
2
4
3
5
7
:
<nextTick回调队列>

<微任务>
:
:
:
```















