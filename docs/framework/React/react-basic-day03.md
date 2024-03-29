---
autoGroup-1: React
sidebarDepth: 3
title: 3. 渲染元素ReactDOM.render
---

## 渲染
`html`中的`div`容器叫根节点。

根节点内的所有内容都是由`ReactDOM`进行管理，一个`React`应用只有一个根节点。

`ReactDOM`负责更新`DOM`与`React`元素保持一致。

用`ReactDOM.render`方法将`React`元素渲染到根节点.
```javascript
// 返回一个React元素
const rEl = <h1>This is a title.</h1>;

/**
 * 将React元素渲染到根节点
 * @param ReactElement React 元素
 * @param rootNode 根节点
 */
ReactDOM.render(
    rEl,
    document.getElementById('app')
)
```
```javascript
// 类组件不是React元素。转换为React元素：
// 1. <Title />; 
// 2. React.createElement(Title) 
class Title extends React.Component {
    render() {
        return <h1>This is a title.</h1>
    }
}

// 函数组件
function Title() {
    return (<h1>This is title.</h1>)
}

ReactDOM.render(
    // <Title />,
    React.createElement(Title),
    document.getElementById('app')
)
```
总结：

如果是组件渲染，`ReactDOM.render`的第一个参数一定要是一个`React`元素

1. 组件使用`JSX`语法
2. 使用`React.createElement`将组件转为`React`元素

这样才能使组件内部的render函数执行。

`React`元素是不可变的对象（`immutable Object`）。
  - 不能添加属性
  - 不能修改属性
  - 不能删除属性
  - 不能修改属性的枚举、配置、可写。

```javascript
const rEl = <h1>This is a title</h1>
// 不能添加属性
rEl.a = 1;
// 不能修改属性
rEl.props = 2
```

## 更新

> `React`基本的更新逻辑有哪些？

观察`element`中根节点的更新状况

```javascript
// 计时器
function update() {
    const rEl = (
    // 只能有一个根节点
        <div>
            <h1>This is a title.</h1>
            <h2>{new Date().toString()}</h2>
        </div>
    )

    ReactDOM.render(
        rEl,
        document.getElementById('app')
    )
}

setInterval(update, 1000);
```

观察Element中节点的更新状况：

发现`ReactDOM.render`会深度对比新旧元素的状态，只会做必要的真实`DOM`更新，也就是虚拟节点的对比。
- 渲染之前每个`React`元素组成一个虚拟`DOM`的对象结构然后去渲染
- 更新之前形成新的虚拟DOM的对象结构，对比新旧的虚拟`DOM`节点，分析出不同的地方，形成一个`DOM`更新的补丁，打补丁到真实`DOM`去更新

React只更新它需要更新的部分。

ReactDOM.render()首次调用时，容器节点里的所有DOM元素都会被替换，后序的调用则会使用React的DOM差分算法（DOM Diff）进行高效的更新。
