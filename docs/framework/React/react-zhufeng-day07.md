---
autoGroup-4: React基础
sidebarDepth: 3
title: render props
---

## render props

在React组件中，共享代码有两种方式：
1. 高阶组件
2. render props

render props是一种在React组件之间使用一个值为函数的prop共享代码的简单技术。

- 具有render props的组件接受一个函数，该函数返回一个React元素并调用它而不是实现自己的渲染逻辑。
- render props是用于告知组件需要渲染什么内容的函数props，而不是强制提供额外的组合。


## 逻辑复用

### 1. 原生的方式

```javascript
import React from './react';
import ReactDOM from './react-dom';

// 实现鼠标在页面上移动时，显示鼠标的坐标
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0
  }
  handleMouseMove = (event)=>{
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  render(){
    return (
      <div onMouseMove={this.handleMouseMove}>
        {/* this.props.children是个函数 */}
        {this.props.children(this.state)}
      </div>
    )
  }
}

let element = (
  <MouseTracker>
    {props=>(
      <div>
        <h1>移动鼠标!</h1>
        <p>当前的鼠标位置是 ({props.x}, {props.y})</p>
      </div>
    )}
  </MouseTracker>
)
ReactDOM.render(element, document.getElementById('root'));
```

### 2. 高阶组件

```javascript
import React from './react';
import ReactDOM from './react-dom';

// 实现鼠标在页面上移动时，显示鼠标的坐标
function withTracker(OldComponent){
  return class MouseTracker extends React.Component {
    state = {
      x: 0,
      y: 0
    }
    handleMouseMove = (event)=>{
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }
    render(){
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state}/>
        </div>
      )
    }
  }
}

function Welcome(props) {
  return (
    <div>
      <h1>移动鼠标!</h1>
      <p>当前的鼠标位置是 ({props.x}, {props.y})</p>
    </div>
  );
}

let Tracker = withTracker(Welcome);// 高阶组件
ReactDOM.render(<Tracker />, document.getElementById('root'));
```

### 3. render props

```javascript
import React from './react';
import ReactDOM from './react-dom';

// 实现鼠标在页面上移动时，显示鼠标的坐标
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0
  }
  handleMouseMove = (event)=>{
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  render(){
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

let element = (
  <MouseTracker render={props=>(
    <div>
      <h1>移动鼠标!</h1>
      <p>当前的鼠标位置是 ({props.x}, {props.y})</p>
    </div>
  )}/>
    
)
ReactDOM.render(element, document.getElementById('root'));
```
