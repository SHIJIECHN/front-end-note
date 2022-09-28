---
autoGroup-1: React
sidebarDepth: 3
title: 渲染元素ReactDOM.render
---

## 渲染
html中的div容器叫根节点。

根节点内的所有内容都是由`ReactDOM`进行管理，一个`React`应用只有一个根节点。

ReactDOM负责更新DOM与React元素保持一致。

用`ReactDOM.render`方法将`React`元素渲染到根节点.
```javascript
const rEl = <h1>This is a title.</h1>;

/**
 * 将react元素渲染到根节点
 * @param ReactElement react 元素
 * @param rootNode 根节点
 */
ReactDOM.render(
    rEl,
    document.getElementById('app')
)
```
```javascript
// 类组件
// 不是React元素，
// 使用方式：1. <Title />; 2. React.createElement(Title) 
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
总结：如果是组件渲染，`ReactDOM.render`的第一个参数一定要是一个`React`元素
1. 组件使用`JSX`语法
2. 使用`React.createElement`将组件转为`React`元素

问题：`React`基本的更新逻辑有哪些？
- `React`元素是不可变的对象（`immutable Object`）。
  - 不能添加属性
  - 不能修改属性
  - 不能删除属性
  - 不能修改属性的枚举、配置、可写。

## 更新
观察`element`中根节点的更新状况
```javascript
// 计时器
function update() {
    const rEl = (
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
发现`ReactDOM.render`会深度对比新旧元素的状态，只会做必要的真实`DOM`更新，也就是虚拟节点的对比。
- 渲染之前每个`React`元素组成一个虚拟`DOM`的对象结构然后去渲染
- 更新之前形成新的虚拟DOM的对象结构，对比新旧的虚拟`DOM`节点，分析出不同的地方，形成一个`DOM`更新的补丁，打补丁到真实`DOM`去更新

