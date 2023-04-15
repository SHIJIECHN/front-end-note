---
autoGroup-4: React基础
sidebarDepth: 3
title: 生命周期
---

## 老生命周期

- 组件挂载
  - constructor
  - componentWillMount
  - render
  - componentDidMount
- 组件更新
  - shouldComponentUpdate
  - componentWillUpdate
  - render
  - componentWillReceiveProps(子组件)
  - componentDidUpdate
- 组件卸载
  - componentWillUnmount


```javascript
import React from 'react';
import ReactDOM from 'react-dom';
class ChildCounter extends React.Component {
  static defaultProps = {
    name: '珠峰架构'
  }
  componentWillMount() {
    console.log('ChildCounter 1.componentWillMount')
  }
  render() {
    console.log('ChildCounter 2.render')
    return <div>{this.props.count}</div>
  }
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount')
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.count % 3 === 0;// 如果是3的倍数就更新，否则就不更新
  }
  componentWillReceiveProps() {
    console.log('ChildCounter 4.componentWillReceiveProps');
  }
  componentWillUnmount() {
    console.log('ChildCounter 5.componentWillUnmount');
  }
}

class Counter extends React.Component {
  static defaultProps = { // 1. 设置默认属性
    name: 'Counter'
  }
  constructor(props) {
    super(props);
    this.state = { // 2. 设置默认状态
      number: 0
    }
    console.log('Counter 1.constructor')
  }
  componentWillMount() {
    console.log('Counter 2.componentWillMount')
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 })
  }
  // setState会引起状态的变化，父组件更新的时候，会让子组件的属性发生变化
  // 当属性或者状态发生改变的话，会走此方法来决定，是否要渲染更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    return nextState.number % 2 === 0;// 奇数不更新，偶数更新
  }
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate');
  }
  componentDidMount() {
    console.log('Counter 4.componentDidMount')
  }
  render() {
    console.log('Counter 3.render')
    return (
      <div>
        <p>{this.props.name}:{this.state.number}</p>
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

```javascript
// 机制：父组件为偶数时更新，子组件是三的倍数时更新。当父组件为4时，子组件卸载。
// 初始化 number: 0  count: number。
Counter 1.constructor               父组件构造函数
Counter 2.componentWillMount        父组件将要挂载
Counter 3.render                    父组件render
ChildCounter 1.componentWillMount   子组件挂载
ChildCounter 2.render               子组件render 
ChildCounter 3.componentDidMount    子组件挂载完成
Counter 4.componentDidMount         父组件挂载完成
// 点击第一次 number：1，count：1  
Counter 5.shouldComponentUpdate          父组件要更新
// 点击第二次 number：2，count：2 
Counter 5.shouldComponentUpdate          父组件要更新
Counter 6.componentWillUpdate            父组件将要更新
Counter 3.render                         父组件render
ChildCounter 4.componentWillReceiveProps 子组件props更新
Counter 7.componentDidUpdate              父组件更新完成
// 点击第三次 number: 3 count: 3
Counter 5.shouldComponentUpdate          父组件要更新
// 点击第四次 number：4，卸载子组件
Counter 5.shouldComponentUpdate          父组件要更新
Counter 6.componentWillUpdate            父组件将要更新
Counter 3.render                         父组件render
ChildCounter 5.componentWillUnmount      子组件卸载
Counter 7.componentDidUpdate             父组件更新完成
```

## 新的生命周期

- getDerivedStateFromProps：当属性来的时候，或者状态更新，或者属性和状态没变但是调用forceUpdate的时候，调用此方法
- getSnapshotBeforeUpdate：获取更新前的真实DOM状态快照。更新DOM之前触发。

```javascript
// 子组件才能看到效果
static getDerivedStateFromProps(nextProps, prevState) {
  const { count } = nextProps;
  // return null; // 返回null不修改状态
  return { ...prevState, count: count * 2 }; // 新的状态对象
}

getSnapshotBeforeUpdate() {
  return {
    prevScrollTop: this.wrapper.current.scrollTop, // 更新前向上卷去的高度
    prevScrollHeight: this.wrapper.current.scrollHeight // 更新前内容的高度
  }
}
```

## DOM-DIFF

### 1. 第一版：按照索引一一对比

只考虑对应元素老的和旧的相互比较：
- 老的为null，新的为null，结果是null
- 老的不为null， 新的为null，删除节点
- 老的为null，新的不为null，新增节点
- 老的不为null，新的不为null，但是类型不同，删除老的，新增新的
- 老的不为null，新的不为null，且类型相同。用新的属性更新老的节点属性，儿子节点比较

```javascript
// 比较新旧的虚拟DOM，找出差异更新到真实DOM上
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  if (!oldVdom && !newVdom) { // 如果老的虚拟DOM是null，新的虚拟DOM是null，就返回null

  } else if (oldVdom && (!newVdom)) { // 老的为不为null，新的为null，组件被销毁
    let currentDOM = findDOM(oldVdom); // 拿到老的虚拟DOM对应的dom
    currentDOM.parentDOM.removeChild(currentDOM);// 删除老的真实DOM
    if (oldVdom.classInstance // 有实例
      && oldVdom.classInstance.componentWillUnmount // 并且实例上有componentWillUnmount方法
    ) {
      oldVdom.classInstance.componentWillUnmount();// 执行组件卸载方法
    }
  } else if (!oldVdom && newVdom) { // 老的没有，新的有，组件挂载
    let newDOM = createDOM(newVdom); // 创新新的真实DOM
    // TODO 不一定是appendChild，有可能插入在前面
    parentDOM.appendChild(newDOM); // 将DOM添加到父DOM树中去 
    if (newDOM.componentDidMount) newDOM.componentDidMount();
  } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type)) {
    // 新老都有，但是类型不同。也不能复用，则需要删除老的，添加新的
    let oldDOM = findDOM(oldVdom); // 获取老的真实DOM
    let newDOM = createDOM(newVdom); // 创建新的真实DOM
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);// 把老的替换成新的
    if (oldVdom.classInstance // 有实例
      && oldVdom.classInstance.componentWillUnmount // 并且实例上有componentWillUnmount方法
    ) {
      oldVdom.classInstance.componentWillUnmount();// 执行组件卸载方法
    }
    if (newDOM.componentDidMount) newDOM.componentDidMount();
  } else { // 老的有，新的也有，类型也一样，需要复用老节点，进行深度的递归dom diff了
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') {// 说明是原生组件 div
    // 让新的虚拟DOM的真实DOM属性等于老的虚拟DOM对应的那个真实DOM
    let currentDOM = newVdom.dom = findDOM(oldVdom); // 拿到老的dom
    // 用新的属性更新DOM的老属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);// 更新属性
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);// 更新儿子
  }
}

/**
 * 更新儿子
 * @param {*} parentDOM 
 * @param {*} oldVChildren 老的儿子
 * @param {*} newVChildren 新的儿子
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  // 格式化。将它们变成数组。
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);// 取长度的最大值
  for (let i = 0; i < maxLength; i++) {
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i]);// 比较
  }
}
```

### 2. 第二版：考虑移动和key

- 构建map={A: A节点, B: B节点, C: C节点...}
- 定义变量lastPlacedIndex上一个不需要移动的节点，默认值0
- 遍历新的虚拟DOM数组，根据key到map中查找，有没有相同的key，如果有，则对比两个节点的type

