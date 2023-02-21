---
autoGroup-1: React
sidebarDepth: 3
title: 13. ConText
---

## Context

`ConText`是上下文，理解为容器，里面可以装很多数据，这些数据可以给程序的多个地方传递数据，这个容器就叫做上下文。实际上就是程序在执行的时候可访问的容器。

> `Context`有什么作用？

给整个组件树共享全局的数据。当不想在组件树中通过逐层传递`props`或`state`方式来传递数据时，可以使用`Context`来实现跨层级的组件数据传递。

`Context`最适合的场景是：
- 杂乱无章的组件都需要同样一些数据的时候
- 不合适在单纯的为了不层层传递属性
- Context弱点：它会弱化及污染组件的纯度导致组件复用性降低


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

目录结构：
|-App.jsx
|-Main.jsx
|-context.js
|-components
    |-ButtonNav
        |-index.jsx
        |-index.scss
        |-Item.jsx
    |-Header
        |-index.jsx
        |-index.scss

#### 1. App.jsx
```javascript
import Main from "./Main.jsx"

import { ThemeContext } from './context.js'
/**
 * ThemeContext 
 * Provider 供应方
 * Consumer 消费方 使用方
 */

class App extends React.Component {
    state = {
        theme: 'black' // 默认theme，可以操作数据，修改组件的颜色
    }
    // 主题改变
    themeChange(theme) {
        this.setState({
            theme
        })
    }

    render() {
        return (
            // 通过Provider提供数据，value给子组件
            <ThemeContext.Provider value={this.state.theme}>
                {/* 页面组件 */}
                <Main themeChange={this.themeChange.bind(this)} />
            </ThemeContext.Provider>

        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

#### 2. Main.jsx
```javascript
import Header from './components/Header' // 导入Header
import ButtonNav from './components/ButtonNav' // 导入组件

// 页面组件
class Main extends React.Component {
    state = {
        navData: [ '第①', '第②', '第③', '第④']
    }
    render() {
        return (
            <>
                {/* 头部 children -> slot */}
                <Header>这是标题</Header>
                {/* 有四个按钮 */}
                <div style={{ marginTop: 88 + 'px' }}>
                    <button onClick={() => this.props.themeChange('black')}>black</button>
                    <button onClick={() => this.props.themeChange('red')}>red</button>
                    <button onClick={() => this.props.themeChange('orange')}>orange</button>
                    <button onClick={() => this.props.themeChange('purple')}>purple</button>
                </div>
                {/* 底部 */}
                <ButtonNav
                    data={this.state.navData}
                />
            </>
        )
    }
}

export default Main;
```

#### 3. context.js
```javascript
/**
 * React.createContext()
 * 创建主题上下文，默认为黑色
 */
const ThemeContext = React.createContext('black');

// 导出
export {
    ThemeContext
}
```

#### 5. ButtonNav/index.jsx
```javascript
import NavItem from './Item.jsx'
import './index.less'

/**
 * 底部导航切换栏
 */
class ButtonNav extends React.Component {
    render() {
        console.log(this.props); // {data: Array(4)}
        return (
            <div className="botton-nav">
                {
                    this.props.data.map((item, index) => {
                        return (
                            <NavItem
                                item={item}
                                index={index}
                                key={index}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default ButtonNav;
```

#### 6. ButtonNav/Item.jsx
```javascript
import './index.less'
import { ThemeContext } from '../../context.js'

class NavItem extends React.Component {
    render() {
        // 接收父组件传递的index item
        const { index, item } = this.props;

        return (
            // 使用
            <ThemeContext.Consumer>
                {/* 如果index为false，说明是第一项 */}
                {
                    (theme) => <div className={index ? 'item' : `item active-${theme}`}>{item}</div>

                }
            </ThemeContext.Consumer>
        )
    }
}

export default NavItem;
```

#### 6. Header/index.jsx
```javascript
import './index.less'
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

export default Header;
```

### 案例：Select城市切换选择器

#### 1. 使用contextType指定上下文类型

缺点：会导致组件污染。

```javascript
// 定义Context
const CityContext = React.createContext({
    name: 'chengdu',
    text: '成都'
})

class App extends React.Component {
    state = {
        cityInfo: {
            name: 'chengdu',
            text: '成都'
        }
    }
    // 切换城市
    changeCity(cityInfo) {
        this.setState({
            cityInfo
        })
    }

    render() {
        return (
            <CityContext.Provider value={this.state.cityInfo}>
                <Header changeCity={this.changeCity.bind(this)} />
                {/* 显示：成都 */}
                <span>{this.state.cityInfo.text}</span> 
            </CityContext.Provider>
        )
    }

}

class Header extends React.Component {
    render() {
        return (
            <Selector changeCity={this.props.changeCity} />
        )
    }
}

class Selector extends React.Component {
    /**
     * 将上下文的类型指定为CityContext，则组件的内部使用this.context，此时this。context就是cityInfo
     * 向上找最近的CityContext的Provider，并且取值 cityInfo
     */
    static contextType = CityContext; // 将上下文的类型指定为CityContext

    render() {
        return (
            // this.context是cityInfo，向上找最近的CityContext的Provider，并且取值 cityInfo
            <select
                value={this.context.name}
                onChange={e => this.props.changeCity({
                    name: e.target.value, // chengdu
                    text: e.target[e.target.selectedIndex].text // 成都。option的内容
                })}
            >
                <option value="">请选择</option>
                <option value="beijing">北京</option>
                <option value="chengdu">成都</option>
                <option value="hangzhou">杭州</option>
                <option value="shenzhen">深圳</option>
            </select>
        )
    }
}
```

#### 2. 组合继承方式

直接传入需要的组件，这样就不用将数据层层传入。

```javascript
class App extends React.Component {
    constructor(props) {
        super(props);
        // 组合
        this.CitySelector = <Selector
            cityData={this.state.cityData}
            cityInfo={this.state.cityInfo}
            changecity={this.changeCity.bind(this)}
        />
    }
    // 数据池
    state = {
        headerTitle: '这是标题',
        cityInfo: {
            name: 'chengdu',
            text: '成都'
        },
        cityData: [
            {
                name: 'chengdu',
                text: '成都'
            },
            {
                name: 'beijing',
                text: '北京'
            },
            {
                name: 'hangzhou',
                text: '杭州'
            },
            {
                name: 'shenzhen',
                text: '深圳'
            }
        ]
    }

    changeCity(cityInfo) {
        this.setState({
            cityInfo
        })
    }

    render() {
        return (
            <>
                {/* 直接传入组件，而不用层层数据传入 */}
                <Header
                    text={this.state.headerTitle}
                    citySelector={this.CitySelector}
                />
                <span>{this.state.cityInfo.text}</span>
            </>
        )
    }
}

class Header extends React.Component {
    render() {
        return (
            <header>
                <h1>{this.props.text}</h1>
                <div>{this.props.citySelector}</div>
            </header>
        )
    }
}

class Selector extends React.Component {
    render() {
        return (
             // 必须使用defaultValue，不能使用value。
            <select
                defaultValue={this.props.cityInfo.name}
                onChange={
                    (e) => this.props.changecity({
                        name: e.target.value,
                        text: e.target[e.target.selectedIndex].text
                    })
                }
            >
                {
                    // 遍历数据
                    this.props.cityData.map((item, index) => {
                        return <option value={item.name} key={index}>{item.text}</option>
                    })
                }
            </select>
        )
    }
}
```

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

通过新旧值检测确定变化，使用了与`Object.is`相同的算法。

### Context.Consumer

- 它使用的是`Provider`提供的`value`
- 最大的作用是订阅`context`变更
- `Consumer`内部使用函数作为子元素(专题：`function as a child`)
- 有一种组件的内部是使用函数作为子元素
- 特点是函数接收`context`最近的`Provider`提供的`value`
- 如果没有写`Provider`会找默认值
- 
```javascript
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

#### 案例

```javascript
/**
 * React.createContext()
 * 创建一个指定的Context对象
 * 组件会找里自己最近的Provider，获取其value
 * 如果没有匹配到Provider就使用的default value，
 * 其他情况均不使用默认参数，包括undefined和null，
 * 但是必须要写value={}
 * 
 * Context.Provider
 * 通过React.createContext创建的组件上下文对象里的一个组件
 * Provider组件可以插入其他组件，目的是订阅这个Context
 * 通过Provider的value属性来将数据传递给Consumer组件

 * value变化，插入Provider属性来将数据传递给Consumer组件
 * new and old value对比使用的算法是与Object.is相同的算法
 */
const AContext = React.createContext('default a');
const BContext = React.createContext('default b')
AContext.displayName = 'MyAContext'; // 针对devtool 的设置 给Provider提供具体的名称方便调试

class App extends React.Component {
    state = {
        a: 'a context',
        b: 'b context'
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                a: 'aa context',
                b: 'bb context'
            })
        }, 1000)
    }
    render() {
        return (
            <BContext.Provider value={this.state.b}>
                <AContext.Provider value={this.state.a}>
                    <Test />
                </AContext.Provider>
            </BContext.Provider>
        )
    }
}
class Test extends React.Component {
    render() {
        return (
            /**
             * Consumer 使用Provider提供的value, 也就是订阅context的变更
             * Consumer内部使用一个函数作为子元素，有一个专题function as a child专门讲
             * 函数接收context最近的Provider提供的value
             * 没有Provider就会找default value
             */
            <BContext.Consumer>
                {
                    (valueB) => (
                        <AContext.Consumer>
                            {
                                (valueA) => (
                                    <div>{valueA + '.' + valueB}</div>
                                    // a context.b context
                                )
                            }
                        </AContext.Consumer>
                    )
                }
            </BContext.Consumer>
        )
    }
}
export default App;
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

三个显示区域有按钮带有各自的样式，可以选择不同的样式同时更改按钮颜色，深入了解跨级应用。

实现：
- 改变按钮颜色
- 登录与未登录显示

<img :src="$withBase('/framework/React/context01.jpg')" alt="context01" />


总结：父组件统一管理状态，嵌套的方式把不同的数据传入共享给响应的子组件，子组件将这些需要的数据渲染即可。

目录结构：
|-App.jsx
|-components
    |-Button
        |-index.jsx
    |-Footer
        |-index.jsx
    |-Header
        |-index.jsx
    |-Main
        |-index.jsx
|-config
    |-index.js
|-context
    |-index.js
|-views
    |-Home.jsx

### 1. App.jsx
```javascript
import { btnStyle } from './config/index.js'
import Home from './views/Home.jsx'
import { BtnStyleContext, LoginStatusContext } from './context'

class App extends React.Component {
    state = {
        style: btnStyle.success, // 默认按钮样式
        loginStatus: false // 默认登录状态
    }
    // 按钮点击回调
    doClick(e) {
        console.log(e.target.textContent)
    }
    // 登录回调
    login() {
        this.setState({
            loginStatus: !this.state.loginStatus // 修改登录状态
        })
    }
    render() {
        return (
            //希望Home组件下所有的按钮通过style定义的样式去改变样式
            //希望点击时执行doClick
            // 从外往里写
            <div className="app">
                <BtnStyleContext.Provider value={{
                    style: this.state.style, // 样式
                    doClick: this.doClick // 点击回调函数
                }}>
                    <LoginStatusContext.Provider value={{
                        status: this.state.loginStatus, // 登录状态
                        login: this.login.bind(this) // 登录回调
                    }}>
                        <Home></Home>
                    </LoginStatusContext.Provider>

                </BtnStyleContext.Provider>

            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

### 2. components/Button/index.jsx
```javascript
import { BtnStyleContext } from '../../context'

class StButton extends React.Component {
    render() {
        return (
            // {...this.props} 将StButton中的其他属性拿出来，包括children
            <BtnStyleContext.Consumer>
                {
                    ({ style, doClick }) => (
                        <button
                            style={style}
                            onClick={doClick}
                            {...this.props}
                        />
                    )
                }
            </BtnStyleContext.Consumer>

        )
    }
}

export default StButton;
```

### 3. components/Footer/index.jsx
```javascript
import StButton from '../Button'
import { LoginStatusContext } from '../../context'

class Footer extends React.Component {
    render() {
        return (
            //StButton -> 自己封装的按钮组件
            <LoginStatusContext.Consumer>
                {
                    ({ status }) => (
                        <div className="footer">
                            <h1>footer</h1>
                            <StButton>footer({
                                status ? '已登录' : '未登录'
                            })</StButton>
                        </div>
                    )
                }
            </LoginStatusContext.Consumer>
        )
    }
}

export default Footer
```

### 4. components/Header/index.jsx
```javascript
import StButton from '../Button'
import { LoginStatusContext } from '../../context'

class Header extends React.Component {
    render() {
        return (
            //StButton -> 自己封装的按钮组件
            <LoginStatusContext.Consumer>
                {
                    ({ status, login }) => (
                        <div className="header">
                            <h1>Header</h1>
                            <StButton>Header({
                                status ? '已登录' : '未登录'
                            })</StButton>
                            <button onClick={login}>登录/注销</button>
                        </div>
                    )
                }
            </LoginStatusContext.Consumer>
        )
    }
}

export default Header
```

### 5. components/Main/index.jsx
```javascript
import StButton from '../Button'
import { LoginStatusContext } from '../../context'

class Main extends React.Component {
    render() {
        return (
            //StButton -> 自己封装的按钮组件
            <LoginStatusContext.Consumer>
                {
                    ({ status }) => (
                        <div className="main">
                            <h1>main</h1>
                            <StButton>main({
                                status ? '已登录' : '未登录'
                            })</StButton>
                        </div>
                    )
                }
            </LoginStatusContext.Consumer>
        )
    }
}

export default Main
```

### 6. config/index.js
```javascript
export const btnStyle = {
    primary: {
        color: '#fff',
        backgroundColor: 'blue'
    },
    success: {
        color: '#fff',
        backgroundColor: 'green'
    },
    warning: {
        color: '#000',
        backgroundColor: 'orange'
    },
    danger: {
        color: '#fff',
        backgroundColor: 'red'
    }
}
```

### 7. context/index.js
```javascript
//Context文件实现全局文件数据共享
import { btnStyle } from "../config";

//样式
export const BtnStyleContext = React.createContext({
    // 创建默认样式为primary
    style: btnStyle.primary,
    // 定义一个回调函数
    doClick: () => {}
});

// 登录状态
export const LoginStatusContext = React.createContext({
    // 未登录
    status: false,
    login: () => {}
});
```

### 8. views/Home.jsx
```javascript
import Header from '../components/Header'
import Footer from '../components/Footer'
import Main from '../components/Main'

class Home extends React.Component {
    render() {
        return (
            <div className="page-home" >
                <Header /> 
                <br />
                <Main />
                <hr />
                <Footer />
                <hr />
            </div >
        )
    }
}

export default Home;
```