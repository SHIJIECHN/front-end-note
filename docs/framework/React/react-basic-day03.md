---
autoGroup-1: React
sidebarDepth: 3
title: 渲染元素ReactDOM.render
---


## 渲染
html中的div容器叫根节点。根节点内的所有内容都是由ReactDOM进行管理，一个React应用只有一个根节点。用ReactDOM.render方法将React元素渲染到根节点.
```javascript
const rEl = <h1>This is a title.</h1>;

/**
 * @param ReactElement react 元素
 * @param rootNode 根节点
 */
ReactDOM.render(
    rEl,
    document.getElementById('app')
)
```
基本的更新逻辑：
1. React元素是不可变的对象。immutable Object，不能添加属性，不能修改属性，不能删除属性，不能修改属性的枚举、配置、可写。

观察element中根节点的更新状况
```javascript
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
ReactDOM.render会深度对比新旧元素的状态，只会做必要的真实DOM更新，也就是虚拟节点的对比