---
autoGroup-4: React基础
sidebarDepth: 3
title: 生命周期
---

## 老声明周期

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

- 组件挂载
- 组件更新
- 组件卸载
