---
autoGroup-1: React
sidebarDepth: 3
title: ConText
---

## Context
conText是上下文，理解为容器，里面可以装很多数据，这些数据可以给程序的多个地方传递数据，这个容器就叫做上下文。实际上就是程序在执行的时候可访问的容器。

> context有什么作用？

给整个组件树共享全局的数据

context最适合的场景是：
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
// Header/index.jsx
import { ThemeContext } from '../../context.js'

/* 头部标题栏。组件组合，this.props.children访问Header组件中间的内容 */
class Header extends React.Component {
    render() {
        return (
            // Consumer组件消费数据 拿到父组件传递的value
            <ThemeContext.Consumer>
                {
                    (theme) => <header className={`header ${theme}`}>{this.props.children}</header>

                }
            </ThemeContext.Consumer>

        )
    }
}
```
其他用法
```javascript
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

## context API