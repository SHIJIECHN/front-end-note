---
autoGroup-1: React
sidebarDepth: 3
title: 组合继承、CSS Module
---

## 包含组合
children属性：表示组件标签的子节点，当组件标签有子节点时，props就会有props.children 属性。
```javascript
//1.如果Container内部有内容, React会在props内部增加children属性
//2.如果Container内部有非元素内容, children: 非元素内容
//3.如果Container内部有单个元素内容, children:React元素对象
//4.如果Container内部有多个元素内容, children: [...(React元素对象)]

// 非元素内容和单个元素节点
class Container extends React.Component {
  render(){
    console.log(this.props);
  }
  
  return (
    //包含组合
    <div className="container">
      { this.props.children }
    </div>
  );
}

class App extends React.Component {
  render(){
    return (
     //<Container>123</Container>
     <Container>
       <h1>Title</h1>
     </Container>
   );
  }
}
```
```javascript
// 多个元素节点
class Container extends React.Component {
  render(){
    console.log(this.props);
  }
  
  return (
    <div className="container">
      <div className="header">
        { this.props.header }
      </div>
        <div className="sidebar">
        { this.props.sidebar }
      </div>
        <div className="main">
        { this.props.main }
      </div>
    </div>
  );
}

class Header extends React.Conponent {...}
class SideBar extends React.Conponent {...}
class Main extends React.Conponent {...}

class App extends React.Component {
  render(){
    return (
     <Container>
       header = { <Header/> }
       sidebar = { <SideBar/> }
       main = { <Main/> }
     </Container>
   );
  }
}
```

> 为什么JSX还可以通过props传递视图React元素？

JSX本质上都会转成React元素（Object对象），视图通过props传递比较像vue的插槽，但是React没有插槽概念的定义，React本身就允许props传递任何类型的数据到子组件

## 多层组合
```javascript

```

> 组件如何做继承关系？
> 
React 目前还没有发现有需要组件继承的需求，因为通过children或者传递视图React元素的方式完全可以解决组件组合的问题，props可以传递任何类型的数据，所以组合的方式完全可以替代继承方案。

> 如何处理逻辑部分需要继承性或者公用性？

这个需要开发者自己去写逻辑抽离的模块、函数、类，单独进行模块导入使用。

## CSS Module
CSS模块化：将css当成模块传递到组件内部用JS逻辑去调用样式

> 如何调用

```javascript
// index.module.css -> vite 

// 引入模块
import styles from './index.module.css';

// 组件使用
<div className={style.container} >
```