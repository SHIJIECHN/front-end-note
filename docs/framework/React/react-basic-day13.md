---
autoGroup-1: React
sidebarDepth: 3
title: ConText
---

## Context
`ConText`是上下文，理解为容器，里面可以装很多数据，这些数据可以给程序的多个地方传递数据，这个容器就叫做上下文。实际上就是程序在执行的时候可访问的容器。

> `Context`有什么作用？

给整个组件树共享全局的数据。当不想在组件树中通过逐层传递`props`或`state`方式来传递数据时，可以使用`Context`来实现跨层级的组件数据传递。

`Context`最适合的场景是：
- 杂乱无章的组件都需要同样一些数据的时候
- 不合适在单纯的为了不层层传递属性
- 它会弱化及污染组件的纯度导致组件复用性降低


```js
// context.js
/**
 * React.createContext()
 * 创建主题上下文
 */
const ThemeContext = React.createContext('black');

// 导出
export {
    ThemeContext
}
```
```javascript
// App.jsx
import Main from "./Main.jsx"

import { ThemeContext } from './context.js'
/**
 * ThemeContext 
 * Provider 供应方
 * Consumer 消费方 使用方
 */

class App extends React.Component {
    // 定义theme
    state = {
        theme: 'black'
    }

    themeChange(theme) {
        this.setState({
            theme
        })
    }

    render() {
        return (
            // 通过Provider提供数据 给子组件提供value
            <ThemeContext.Provider value={this.state.theme}>
                {/* 页面组件 */}
                <Main themeChange={this.themeChange.bind(this)} />
            </ThemeContext.Provider>

        )
    }
}
```
```js
// main.jsx
import Header from './components/Header'
class Main extends React.Component{
    render(){
        return(
            <Header>我是标题</Header>
        )
    }
}

// Header/index.jsx
import { ThemeContext } from '../../context.js'
/* 头部标题栏。组件组合，this.props.children访问Header组件中间的内容 */
class Header extends React.Component {
    render() {
        return (
             /**
             * 拿到父组件传递的value
             * 将theme的值应用到class类里形成动态的类名
             */
            <ThemeContext.Consumer>
                {
                    (theme) => <header className={`header ${theme}`}>{this.props.children}</header>

                }
            </ThemeContext.Consumer>

        )
    }
}
```
如果只想避免层层传递一些属性，组合组件比`context`更好
```javascript
class App extends React.Component{
    constructor(props){
        super(props);
        this.CitySelector = <Selector
            cityData={this.state.cityData}
            cityInfo={this.state.cityInfo}
            changecity={this.changeCity.bind(this)}
        />
    }

    render(){
        return(
            <Header
                citySelector={this.CitySelector}
            ></Header>
        )
    }
}
class Header extends React.component{
    render(){
        return(
            <div>{this.props.citySelector}</div>
        )
    }
}
class Selector extends React.Component {
    /**
     * 将上下文的类型指定为CityContext
     * this.context -> cityInfo
     * 向上找最近的CityContext的Provider，并且取值 cityInfo
     */
    static contextType = CityContext;

    render() {
        return (
            <select
                value={this.context.name}
                onChange={e => this.props.changeCity({
                    name: e.target.value,
                    text: e.target[e.target.selectedIndex].text
                })}
            >
                <option value="beijing">北京</option>
                <option value="chengdu">成都</option>
                <option value="hangzhou">杭州</option>
                <option value="shenzhen">深圳</option>
            </select>
        )
    }
}
```

### 案例：移动端底部导航栏切换
vite + context + react

实现：
- 点击导航栏按钮切换显示页面
- 点击按钮显示不同标题颜色背景（一键切换皮肤）
- 点击按钮显示不同底部导航栏子项颜色（一键切换皮肤）

<img :src="$withBase('/framework/React/context.jpg')" alt="context" />

## Context API
> 如何使用`Context`

使用`Context`，需要用到两种组件:
- 生产者`Provider`，通常是一个父节点
- 消费者`Consumer`，通常是一个或多个子节点
- 还需要声明静态属性`ContextType`提供给子组件的`Context`对象的属性

### React.createContext
- 创建一个指定的`Context`对象
- 组件会找离自己最近的`Provider`获取其`value`(在`state`里定义的)

```javascript
const AContext = React.createContext(defaultValue);
```
创建一个`Context`对象，当`React`渲染一个订阅了这个`Context`对象的组件，这个组件会从组件树中离自身最近的那个匹配的`Provider`中读取到当前的`context`值。

只有当组件所处的树中没有匹配到`Provider`时，其`defaultValue`参数才会生效。此默认值有助于在不使用`Provider`包装组件的情况下对组件进行测试。注意：将`undefined`、`null`传递给`Provider`的`value`时，消费组件的`defaultValue`不会生效。

### Context.Provider
```javascript
<AContext.Provider value={ /**某个值 */}/>
```
- 它是通过`React.createContext`创建的上下文对象里的一个组件
- `Provider`组件可以插入其他组件的目的是可以订阅这个`Context`
- 通过`Provider`的`value`属性来将数据传递给其他`Consumer`组件

一个`Provider`可以和多个消费组件有对应关系。多个`Provider`也可以嵌套使用，里层的会覆盖外层的数据。
```javascript
<BContext.Provider value={this.state.b}>
    <AContext.Provider value={this.state.a}>
        <Test />
    </AContext.Provider>
</BContext.Provider>
```
当`Provider`的`value`值发生变化时，它内部的所有消费组件都会重新渲染。从`Provider`到其内部`consumer`组件的传播不受制于`shouldComponentUpdate`函数，因此当`consumer`组件在其祖先组件跳过更新的情况下也能更新。

通过新旧值检测确定变化，使用了与`Object.is`相同的算法

### Context.Consumer
- 它使用的是`Provider`提供的`value`
- 最大的作用是订阅`context`变更
- `Consumer`内部使用函数作为子元素(专题：`function as a child`)
- 有一种组件的内部是使用函数作为子元素
- 特点是函数接收`context`最近的`Provider`提供的`value`
- 如果没有写`Provider`会找默认值
```javascript
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

### Class.contextType
- 是class类内部的一个静态属性（相当于ES3中给构造函数新增属性Selector.contextType）
- 它必须指向一个由React.createContext执行后返回的Context对象
- 给当前环境下的context重新指定引用
- 指定后父组件上下文会有数据，不指定会显示空对象（context：{}）
- 在生命周期函数和render函数中都可以访问

```javascript
class Test extends React.Component{
  //在组件内部里内置声明一个conetextType
  //目的：可以获取一个上下文state里定义的数据
  static contextType = React.createContext('默认值');

  render(){
    //可以获取一个组件上下文state里定义的数据
    console.log(this.context);
    //{name: 'hangzhou', text:'杭州'}
    
    return ( ... );
  }
}
```
```javascript
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;
```

> 在组建数据共享下，Provider/Consumer和contextType上如何选择

- 推荐使用Provider/Consumer，因为更具有语义化
- 在代码阅读上contextType较难理解

### Context.displayName
```javascript
const AContext = React.createContext('default a');
AContext.displayName = 'MyAContext';
```
针对devtool的设置,给Provider提供具体的名称方便调试

## 动态Context嵌套
案例：Context跨级共享应用