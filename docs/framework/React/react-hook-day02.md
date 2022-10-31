---
autoGroup-2: Hook
sidebarDepth: 3
title: useEffect
---

## useEffect
> 什么是副作用？

在纯函数中，只要和外部存在交互时就不是纯函数

> 哪些操作会导致不是纯函数？

- 引用外部变量
- 执行外部函数

> 什么是纯函数？

相同的输出会引起相同的输出

> React中的副作用

只要不是在组件渲染时用到的变量，所有操作都为副作用。

> 副作用包括哪些呢？

- 跟外部有关的东西
- 依赖useState声明的变量和函数
- 依赖外部全局document/window变量（改变全局变量，计时器）
- 依赖AJAX（全局的new XMLHTTPRequest()返回的对象） 

> 在类组件中如何做副作用？通过生命周期函数(componentDidMount/componentDidUpdate)中做副作用，函数组件中的useEffect相当于将两个生命周期相结合执行的结果一样，但是会存在执行时间不同。

<img :src="$withBase('/framework/React/lifecycle.jpg')" alt="lifecycle" />

useEffect的执行时间：
1. 初次渲染执行（did mount之后）
2. 组件完成更新（did update之后）

关于useEffect执行的具体时间点：

具体时间点是以页面DOM加载完成为准。render执行构建React节点，由react节点构成虚拟DOM树，在componentDidUpdate后才完成真实DOM节点渲染，componentDidUpdate是在真实DOM构建之前执行。同理componentDidMount也是在真实DOM构建之前执行。而useEffect是先真实DOM构建之后执行。

> 为什么useEffect函数可以在真实DOM构建以后执行？

因为它是一个异步程序

> useEffect做了什么？

告诉React组件在渲染后执行某些操作，并保存传递的函数，并且在执行DOM更新之后调用它

> 为什么在组件内调用useEffect？

将useEffect放在组件内部可以让开发者在effect中直接方位state变量或props，不需要其他的API去读取它，它已经保存在函数的作用域中。

> useEffect都会在每次渲染后执行吗？

是的。默认情况下，在第一次渲染之后和每次更新之后都会执行。如果想要在渲染之前执行副作用，就要使用useLayoutEffect。

> useEffect里面的函数是什么？

闭包。闭包初次渲染拿到的是初始值，点击更新以后拿到的是当前更新后的值。

```javascript
function App() {
  const [count, setCount] = useState(0);

  console.log('render'); // 初次渲染和更新的时候都会执行

  useEffect(() => {
    // 副作用
    console.log('useEffect'); 
  })
}
```

## 存在返回值的问题

> useEffect的清理函数什么时候执行？

1. 在每次运行副作用函数之前执行
2. 在组件销毁的时候也会执行

```javascript
function App() {
  const [count, setCount] = useState(0);
  // 执行1
  // 执行3
  console.log('render');

  useEffect(() => {
    // 执行2
    // 执行5
    console.log('useEffect')
    return () => {
        //执行4
      console.log('清理函数');
    }
  })

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}
/**
 * 存在清理函数时：
 * render + useEffect
 * 
 * 点击Click
 * render+ 清理函数 + useEffect
 * /
```
每一次副作用函数都是不同的唯一的函数。怎么清理timer？在清理函数中执行clearInterval(timer)。每次清理都是上一次的timer。
```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log('render')

  useEffect(() => {
    let timer = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    console.log('useEffect')

    return () => {
      console.log('clear Effect');
      clearInterval(timer); // 就是外面定义的timer，上一次的timer
    }
  })

  return ( /* ... */ )
}
```

> 引起的问题：每次都会清除一个计时器，再生成一个计时器，所以又多个计时器。因此我们希望只有一个计时器。也就是希望只在初次渲染（did mount的时候）执行，不希望在did update的时候执行。

添加依赖项空数组: []。

> 此时计时器在执行，但是页面上显示的count一直显示1，不会增加，为什么？

因为此时拿到的count一直是闭包的count。点击以后count为1。

解决方法：

- 第一种使用异步的方式更新count。
```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log('render')

  useEffect(() => {
    console.log('开启计时器');

    let timer = setInterval(() => {
      console.log('进入计时器');
      setCount(count => count + 1); // 此时的setCount中的count就是参数count
    }, 1000)

    return () => {
      // 依赖项为空[]时，这里不会执行，因为useEffect只在didMount的时候执行
      console.log('清除计时器');
      clearInterval(timer)
    }
  }, [])

  return (/*...*/)
}
/**
 * render + 开启计时器 + 进入计时器
 * render + 进入计时器
*/
```
- 第二种修改添加依赖项\[count]
```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log('render')

  useEffect(() => {
    console.log('开启计时器');

    let timer = setInterval(() => {
      console.log('进入计时器');
      setCount(count + 1); 
    }, 1000)

    return () => {
      console.log('清除计时器');
      clearInterval(timer)
    }
  }, [count])

  return (/*...*/)
}
/**
 * render + 开启计时器 + 进入计时器
 * render + 清除计时器 + 开启计时器 + 进入计时器
 * render + 清除计时器 + 开启计时器 + 进入计时器
*/
```

## 依赖项
useEffect的第二个参数：
1. 指定当前副作用effect函数，所需要的依赖项。
2. 依赖项是空数组，effect只是在初次渲染和卸载的时候执行，更新的时候不执行。
3. 有依赖项，依赖项不变，useEffect不会执行。只有当依赖项不一致的时候才会重新执行。

## 总结
1. useEffect的执行时机。
2. 返回值清理函数的执行时机
3. 上一次state和最新state的获取
4. 依赖项


## 关注点分离
两个不相关的副作用写在一起不合理。将关注点分离：
1. 拆分副作用。只需要保证副作用的顺序，就会按顺序执行
2. 通过四定义Hook来实现。




