---
autoGroup-4: JavaScript碎片知识
sidebarDepth: 3
title: Event Loop（浏览器）
---

## Event Loop
<img :src="$withBase('/basicFrontEnd/Javascript/EventLoop.png')" alt="EventLoop" />

- 执行栈：所有代码都会放到这里执行；
- 微任务：语言标准提供的API运行，Promise，MutationObserve、process.nextTick、setImediate；
- GUI渲染：渲染DOM；
- 宏任务：宿主提供的异步方法和任务，setTimeout、setInterval、script、UI渲染、ajax、DOM事件；

### 1. 例子1
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Loop</title>
</head>
<body>
  <div id="J_wrapper" style="width: 200px; height: 30px; background: orange"></div>

  <script src="./1.js"></script>
</body>
</html>
```
1.js
```javascript
const oWrapper = document.querySelector('#J_wrapper')

console.log('start')

oWrapper.style.background = 'blue'

Promise.resolve().then(() => {
  console.log(1)
  for (let i = 1; i < 10000000000; i++) {
    let a = 1
  }
})
setTimeout(() => {
  console.log(2)
}, 0)

console.log('end')
```
结合事件循环图分析一下流程：
<img :src="$withBase('/basicFrontEnd/Javascript/EventLoop02.png')" alt="EventLoop" />

最终我们可以看到浏览器中输出的结果:
```Markdown
start
end
1
2
```
并且可以看到在输出1之后，会有一段等待 for 循环执行过程，之后才会把 div 的颜色变成蓝色。

### 2. 例子2
```javascript
console.log(1);
// setTimeout1
setTimeout(() => {
  console.log(2)
  // Promise1.then
  Promise.resolve().then(() => {
    console.log(3)
  })
}, 0);
// Promise2
new Promise((resolve, reject) => {
  console.log(4)
  // setTimeout2
  setTimeout(() => {
    console.log(5)
    resolve(6);
  }, 0);
  // Promise2.then1
}).then((res) => {
  console.log(7);
  // setTimeout3
  setTimeout(() => {
    console.log(res)
  }, 0);
  // Promise2.then2
}).then(() => {
  console.log(8);
  // Promise2.then3
}).then(() => {
  console.log(9);
});
```


### 3. 例子3
```javascript
let p = new Promise(resolve => {
  resolve(1);
  Promise.resolve().then(() => console.log(2));
  console.log(4);
}).then(t => console.log(t));
console.log(3);
```
这个题比较有意思。我们需要知道 Promise 中的 Executor 里面的代码是同步执行的，并且在 resolve 之后的代码也还是会继续执行的，并且只有 then 被调用的时候，回调才会被放入微任务队列。

控制台输出：
```md
4
3
2
1
```
这里需要注意到，在 Promise 中，当且仅当状态变更， then 被调用的时候，它的回调才会被放入微任务队列。

### 4. 例子4
```javascript
// setTimeout1
setTimeout(() => {
  console.log('A');
}, 0);
var obj = {
  func: function() {
    // setTimeout2
    setTimeout(function() {
      console.log('B');
    }, 0);
    return new Promise(function(resolve) {
      console.log('C');
      resolve();
    });
  },
};
obj.func().then(function() {
  console.log('D');
});
console.log('E');
```

### 5. 例子5
```javascript
console.log("script start");

// setTimeout1
setTimeout(function() {
  console.log("setTimeout---0");
}, 0);

// setTimeout2
setTimeout(function() {
  console.log("setTimeout---200");
  // setTimeout3
  setTimeout(function() {
    console.log("inner-setTimeout---0");
  });
  // Promise1.then
  Promise.resolve().then(function() {
    console.log("promise5");
  });
}, 0);

// Promise2
Promise.resolve()
  // Promise2.then1
  .then(function() {
    console.log("promise1");
  })
  // Promise2.then2
  .then(function() {
    console.log("promise2");
  });
// Promise3.then
Promise.resolve().then(function() {
  console.log("promise3");
});
console.log("script end");
```

#### 例子5-1
```javascript
console.log('start')

// Promise1
Promise.resolve()
  // Promise1.then1
  .then(() => {
    console.log(1)

    // setTimeout1
    setTimeout(() => {
      console.log(2)
    })
  })
  // Promise1.then2
  .then(() => {
    console.log(3)

    // setTimeout2
    setTimeout(() => {
      console.log(4)
    })
  })
  // Promise1.then3
  .then(() => {
    console.log(5)

    // setTimeout3
    setTimeout(() => {
      console.log(6)
    })
  })

// Promise2
Promise.resolve()
  // Promise2.then1
  .then(() => {
    console.log(7)

    // setTimeout4
    setTimeout(() => {
      console.log(8)
    })
  })
  // Promise2.then2
  .then(() => {
    console.log(9)

    // setTimeout5
    setTimeout(() => {
      console.log(10)
    })
  })
  // Promise2.then3
  .then(() => {
    console.log(11)

    // setTimeout6
    setTimeout(() => {
      console.log(12)
    })
  })

console.log('end')
```

### 6. 例子6
```javascript
// setTimeout1
setTimeout(function () {
  console.log('timeout1');
}, 1000);

console.log('start');

// Promise1.then
Promise.resolve().then(function () {
  console.log('promise1');
  // Promise2.then
  Promise.resolve().then(function () {
    console.log('promise2');
  });
  // setTimeout2
  setTimeout(function () {
    // Promise3.then
    Promise.resolve().then(function () {
      console.log('promise3');
    });
    console.log('timeout2')
  }, 0);
});
```

控制台输出：
```md
start
done
promise1
promise2
timeout2
promise3
timeout1
```

### 7. 例子7
据说是一道头条的面试题。
```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```
