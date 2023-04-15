---
autoGroup-4: React基础
sidebarDepth: 3
title: 高阶组件
---

## 高阶组件

高阶组件是一个函数，接收一个组件作为参数，返回一个新的组件。

高阶组件的作用是为了复用组件的逻辑，而不是为了复用组件的UI。

用途：
1. 属性代理
2. 反向继承

### 属性代理

属性代理是指通过高阶组件来操作属性的props，返回一个新的组件。如何操作props，是由高阶组件来决定的。

普通情况下，我们定义一个loading组件，需要在每个需要loading的组件中引入。如果我们想在所有需要loading的组件中都显示loading，就需要在每个组件中都写show和hide方法，这样就会造成代码冗余。

```javascript
class Panel extends React.Component{
  show = () => {
    let div = document.createElement('div');
    div.innerHTML = `
      <p id="loading" style="position:absolute;top:100px;left:50%;z-index:10;backgroud-color:gray;">loading</p>
    `;
    document.body.appendChild(div);
  }
  hide = ()=>{
    document.getElementById('loading').remove();
  }
  render(){
    return(
      <div>
        <button onClick={this.show}>显示</button>
        <button onClick={this.hide}>隐藏</button>
      </div>
    )
  }
}
```

使用高阶组件，基于属性代理，操作属性的props，返回一个新的组件

```javascript
// 高阶组件来自于高阶函数，可以接收函数或者返回函数的函数，
const withLoading = OldComponent =>{ // 高阶组件
  return class extends React.Component{
    show = ()=>{
      let div = document.createElement('div');
      div.innerHTML = `
        <p id="loading" style="position:absolute;top:100px;left:50%;z-index:10;backgroud-color:gray;">loading</p>
      `;
      document.body.appendChild(div);
    }
    hide = () =>{
      document.getElementById('loading').remove();
    }
    render(){
      return <OldComponent {...this.props} show={this.show} hide={this.hide} />
    }
  }
}

class Panel extends React.Component{
  render(){
    return(
      <div>
        {this.props.title}
        {/* LoadingPanel没有传入show和hide，是由withLoading高阶组件代理产生的 */}
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    )
  }
}

const LoadingPanel = withLoading(Panel);

ReactDOM.render(<LoadingPanel title="这是标题"/>, document.getElementById('root'));
```

如果我们想使用装饰器语法，如：
```javascript
@withLoadin
class Panel extends React.Component{}
```

1. 需要安装依赖包
```javascript
npm i react-app-rewired customize-cra @babel/plugin-proposal-decorators -D
```

2. 修改package.json文件。在scripts中添加react-app-rewired，用于替换react-scripts
```javascript
scripts:{
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
}
```

1. 添加配置文件config-overrides.js，给babel-loader添加一个插件让它支持装饰器。项目会自动加载这个文件
```javascript
const {override, addBabelPlugin} = require('customize-cra');

module.exports = override(
    addBabelPlugin([
        "@babel/plugin-proposal-decorators",{ "legacy": true} // 添加Babel插件
    ])
);
```

4. 增加配置文件jsconfig.json
```javascript
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

5. 使用装饰器语法
```javascript
const withLoading = OldComponent =>{ // 高阶组件
  return class extends React.Component{
    show = ()=>{
      let div = document.createElement('div');
      div.innerHTML = `
        <p id="loading" style="position:absolute;top:100px;left:50%;z-index:10;backgroud-color:gray;">loading</p>
      `;
      document.body.appendChild(div);
    }
    hide = () =>{
      document.getElementById('loading').remove();
    }
    render(){
      return <OldComponent {...this.props} show={this.show} hide={this.hide} />
    }
  }
}

@withLoading
class Panel extends React.Component{
  render(){
    return(
      <div>
        {this.props.title}
        {/* LoadingPanel没有传入show和hide，是由withLoading高阶组件代理产生的 */}
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    )
  }
}
ReactDOM.render(<Panel title="这是标题"/>, document.getElementById('root'));
```

### 反向继承
 
- 反向继承是指高阶组件继承了被包装组件，而不是被包装组件继承高阶组件
- 基于反向继承可以拦截生命周期、state和渲染过程。


```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// 假设AntDesignButton是一个第三方组件库，我们想要在它的基础上添加一些功能，比如
// 1. 不渲染title，而渲染数字number。
// 2. 给button添加一个点击事件，点击后数字加1
class AntDesignButton extends React.Component{
  state = {name:'张三'}
  conponentWillDidMount(){
    console.log('AntDesignButton conponentWillDidMount');
  }
  componentDidMount(){
    console.log('AntDesignButton componentDidMount');
  }
  render(){
    console.log('AntDesignButton render');
    return(
      <button name={this.state.name}>{this.props.title}</button>
    )
  }
}

const wrapper = OldComponent =>{ // 高阶组件
  // 返回值是一个新的组件继承自OldComponent
  return class extends OldComponent{
    state = {number: 0}
    componentWillMount(){
      console.log('wrapper componentWillMount');
      super.componentWillMount(); // 调用原来的生命周期方法.如果没有这句，那么AntDesignButton的生命周期方法不会执行
    }
    componentDidMount(){
      console.log('wrapper componentDidMount');
      super.componentDidMount(); // 可以不写
    }
    handleClick = () =>{ // 代理了原来的点击事件
      this.setState({number: this.state.number + 1});
    }
    render(){
      console.log('wrapper render');
      let renderElement = super.render(); // 调用原来的render方法。renderElement是个虚拟DOM
      // 不可以直接修改renderElement，因为它是只读的
      // renderElement.props.children = this.state.number;
      // renderElement.props.onClick = this.handleClick;

      // 解决：renderElement克隆一个新的虚拟DOM
      let newProps = {
        ...renderElement.props,
        onClick:this.handleClick,
      }
      // cloneElement(要克隆的虚拟DOM，新的属性，新的子节点)
      let cloneElement = React.cloneElement(renderElement, newProps, this.state.number);
      return cloneElement;
    }
  }
}

let WrappedAntDesignButton = wrapper(AntDesignButton);

ReactDOM.render(<WrappedAntDesignButton title="这是一个按钮标题"/>, document.getElementById('root'));
```

如果想要拦截state，同时又想要保留原来的state。可以在constructor中合并state
  
```javascript
class AntDesignButton extends React.Component{
  constructor(props){ // 这里必须要写constructor，否则wrapper中拿不到state
    super(props);
    this.state = {name:'张三'}
  }
  // other code
}

const wrapper = OldComponent =>{ // 高阶组件
  // 返回值是一个新的组件继承自OldComponent
  return class extends OldComponent{
    constructor(props){
      super(props);
      console.log(this.state); // {name:'张三'}
      // 如果想要拿到子类的state状态的话，可以使用this.state，此时this.state = {name:'张三'}然后再对this.state进行修改
      this.state = {...this.state, number: 0}; // 合并state
    }
    // other code
  }
}
```


### cloneElement实现

cloneElement方法的作用是克隆一个虚拟DOM，克隆的时候可以修改属性和子节点。cloneElement方法的实现如下：

```javascript
/**
 * 根据一个老元素，克隆一个新的元素
 * @param {*} oldElement 老元素
 * @param {*} newProps 新的属性
 * @param {*} children 新的儿子
 */
function cloneElement(oldElement, newProps, children) {
  if(arguments.length > 3){
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  }else{
    children = wrapToVdom(children);
  }
  let props = { ...oldElement.props, ...newProps, children };// 解构老属性，用新属性覆盖老属性
  return{ ...oldElement,props } // 解构老元素，用新props属性覆盖老元素的props属性
}
```


### 属性代理和反向继承的使用场景

如果想要将组件中的state和props都代理，可以使用反向继承。如果只想代理props，可以使用属性代理。