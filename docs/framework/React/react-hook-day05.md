---
autoGroup-2: Hook
sidebarDepth: 3
title: useMemo、useCallback
---

## useMemo
在性能优化时，通过传一个特定的值，这个值不会随着组件而重新计算

> 什么时memo

它跟类组件中的PureComponent方法用途一样，如果视图在绑定某个方法时，组件加载是会重复产生新的函数方法，而memo方便包裹使用就能避免组件绑定的方法多次执行。

它是函数组件中优化组件的一种方式，不希望子组件重新运行。

```javascript
//PureComponent在类组件中的写法：
class Foo extends PureCompoent{
  //定义了PureCompoent之后就不会重复执行下面的程序，除了有属性更新的情况
  render(){
    return (...);
  }
}

//memo在函数组件中的写法：
const Foo = memo((props) => {
  //和PureCompoent的效果一样
  return (...);
});

function App(){
  render(){ ... }
  
  return (
    //视图绑定的方法在默认情况下，会多次执行render方法
    <Foo render={ render }></Foo>
  );
}
```

## useCallback

> 什么是useCallback？

它固定的是一个函数，性能优化的手段。

它可以将视图绑定的方法重新改变为同一个引用，除非依赖项有修改，否则永远都不会去渲染

```javascript
function App(){
  const [count, setCount] = useState(0);
  //当第二个参数数组有依赖时，当依赖项有变化时才重新渲染视图
  //useCallback在首次渲染之后才执行
  const myRender = useCallback(() => {...}, [count]);
  
  return (
    //由于每次绑定的视图方法是不同的引用值，在渲染时会生成不同的方法
    <Foo render={ myRender }></Foo>
  );
}

const Foo = memo(props => {
  return (
    <div>
      <ul>{props.render()}</ul>
    </div>
  )
})
```

> 什么是useMemo？

它固定的是一个值，性能优化的手段，它跟useCallback实现的效果一样，防止子组件多次渲染的问题，区别在于写法不同。

```javascript
function App(){
  const [count, setCount] = useState(0);
  //当第二个参数数组有依赖时，当依赖项有变化时才重新渲染视图
  //这里useMemo在首次渲染期间执行(值：函数执行完后返回的字符串)
  const myRender = useMemo(() => {...}, [count]);
  
  return (
    //由于每次绑定的视图方法是不同的引用值，在渲染时会生成不同的方法
    <Foo render={ myRender }></Foo>
  );
}

const Foo = memo((props) => {
  return (
    //注意这里的render没有执行
    //因为上面的memo()方法传入的是一个值所以不用执行
    <div>{props.render}</div>
  );
})
```

::: tip
useCallback和useMemo区别：useCallback(fn, deps) 相当于 useMemo(() => fn, deps)
:::