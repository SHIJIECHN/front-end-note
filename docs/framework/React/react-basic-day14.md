---
autoGroup-1: React
sidebarDepth: 3
title: Fragment
---

## Fragment
Fragment允许将子列表分组，而无需DOM添加额外节点。

Fragment是在React下的一个组件，文档碎片不会占用真实节点，原则上React每个组件都需要根节点。

> React.Fragment 创建一个文档碎片。


也可以简写使用短语法`<>...</>`声明一个React.Fragment碎片。

**注意：短语法不支持key**
```javascript
// Fragment除了key属性，不支持其他任何属性
<React.Fragment key={id}>
    <dt>{id}:{name}</dt>
    <dt>{desc}</dt>
</React.Fragment>
```

应用场景： 一般在表格上使用解决没有根节点的问题
```javascript
class Table extends React.Component {
    state = {
        headers: [
            'Name',
            'ID',
            "Age"
        ]
    }

    render() {
        return (
            <table border="1">
                {/* <caption> 标签定义表格的标题 */}
                <caption>Private Infomation</caption>
                <thead>
                    <tr>
                        <TableHeaders headers={this.state.headers} />
                    </tr>
                </thead>
                <tbody>
                    <tr></tr>
                </tbody>
            </table>
        )
    }
}
```
```js

//使用fragment碎片避免每次新增th时都会套用div，达到不用div也可以包裹里面的元素内容
//同时也会报错: th不能作为div的子元素  
class TableHeaders extends React.Component {
    render() {
        return (
 
            <React.Fragment>
                {
                    this.props.headers.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))
                }
            </React.Fragment>

        )
    }
}
```