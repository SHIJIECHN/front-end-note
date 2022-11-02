---
autoGroup-2: Hook
sidebarDepth: 3
title: useImperativeHandle
---

## useImperativeHandle
父组件通过绑定ref视图去拿到子组件的真实DOM是存在问题的，本希望父组件能使用子租金按DOM的某些功能（如focus等），甚至拿到真实DOM也可以把子组件的DOM删除。

如何只使用子组件的方法，而不去操作子组件真实DOM呢？

可以使用useImperativeHandle钩子。useImperativeHandle应当与forwardRef一起使用.

```javascript
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  const inputMethod = () => {
    console.log('This is FancyInput method.')
  }

  // 通过参数ref把子组件的方法暴露出去
  useImperativeHandle(ref, () => {
    // 返回方法集合
    return {
      inputMethod
    }
  })
  // 抛出子组件的引用
  return <input ref={inputRef} />
})
function App() {
  const myRef = useRef(null);
  useEffect(() => {
    console.log(myRef); // current是一个对象而不是子组件真实DOM 
    /**
      current:
        inputMethod: () => { console.log('This is FancyInput method.'); }
          length: 0
          name: "inputMethod"
          arguments: (...)
          caller: (...)
     */
  })
  return (
    <div>
      <FancyInput ref={myRef} />
    </div>
  )
}
```

## useLayoutEffect
和useEffect相同,区别在于触发的时机不一样
- 在DOM加载完成之后执行useEffect
- 在DOM加载完成之前可以使用useLayoutEffect

## useDebugValue
用的不多,在卡法这工具栏中显示自定义hook标签(提示hook信息)