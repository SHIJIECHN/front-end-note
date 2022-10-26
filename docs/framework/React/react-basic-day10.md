---
autoGroup-1: React
sidebarDepth: 3
title: 组合继承、CSS Module
---

## 包含组合
`children`属性：表示组件标签的子节点，当组件标签有子节点时，`props`就会有`props.children`属性。
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

> 为什么JSX还可以通过`props`传递视图`React`元素？

`JSX`本质上都会转成`React`元素（`Object`对象），视图通过`props`传递比较像`vue`的插槽，但是`React`没有插槽概念的定义，`React`本身就允许`props`传递任何类型的数据到子组件

## 多层组合
```javascript
//给Header组件底下的Select组件组合属性和方法
//仅仅传给Header组件就能实现多层嵌套组件传值
render(){
  return (
    <div>
      <Header
        text={this.state.headerTitle}
        citySelector={
          //组合
          <Selector
            cityData={this.state.cityData}
            changeCity={this.changeCity.bind(this)}
          ></Selector>
        }
      ></Header>
    </div>
  );
}
```

> 组件如何做继承关系？

`React` 目前还没有发现有需要组件继承的需求，因为通过`children`或者传递视图`React`元素的方式完全可以解决组件组合的问题，`props`可以传递任何类型的数据，所以组合的方式完全可以替代继承方案。

> 如何处理逻辑部分需要继承性或者公用性？

这个需要开发者自己去写逻辑抽离的模块、函数、类，单独进行模块导入使用。

## CSS Module

CSS模块化：将`css`当成模块传递到组件内部用`JS`逻辑去调用样式

> 如何调用

```javascript
// index.module.css -> vite 

// 引入模块
import styles from './index.module.css';

// 组件使用
<div className={style.container} >
```

## 组件更新机制
组件通过`setState()`方法执行更新渲染。

父组件重新渲染时，也会重新渲染子组件，但只会渲染当前组件子树（当前组件及其所有子组件）。

## 性能优化

> 组件性能如何优化？

- 减轻`state`，只存储跟组件渲染相关的数据（如`count`/列表数据/`loading` 等）
- 避免不必要的重新渲染，如避免不必要的子组件渲染（解决：`shouldComponentUpdate()`钩子函数，通过它返回值决定是否`true`，`false`重新渲染）

注意：不用做渲染的数据不要放在`state`中，比如定时器`id`等，可以放在构造器定义的`this`中。

```javascript
//关于shouldComponentUpdate
//触发时机：更新阶段的钩子函数，组件重新渲染render前执行
class AComponent extends Component{
  //newxProps -> 最新的props
  //nextState -> 最新状态
  //this.state -> 当前状态(更新前)
  shouldComponentUpdate(nextProps, nextState){
    //根据条件，决定是否重新渲染
    if(xxx){
      return true;
    }else{
      return false;
    }
    
    //写法1：通过nextState判断
    //nextState.number !== this.state.number -> true
    return nextState.number !== this.state.number;
  }
}

//写法2：通过nextProps判断
//给子组件传值
<Child number={this.state.number} />
//在子组件中的shouldComponentUpdate进行判断
```

