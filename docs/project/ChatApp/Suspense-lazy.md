---
autoGroup-1: React开发问题
sidebarDepth: 3
title: Context上下文问题
---

## ConText

- 老版本的使用


## 场景

组件在使用时，组件的数据流主要是从父组件流向子组件：

<img :src="$withBase('/project/React/context-API-01.png.png')" alt="" />

`<Nav/>`组件是`<Dashboard />`的子组件，`<Dashboard />`是`<App />`的子组件。`<Nav/>`需要获取`<App />`中的数据`authUser`。

- 方式一：可以使用组件一级一级的向下传递。缺点：当组件之间层级很深时，就会造成臃肿。
- 方式二：使用Redux

```javascript
import React from "react";
import { render } from "react-dom";

// Nav组件
const Nav = ({ authUser }) => (
    <div>
    <p>
        Your username is <strong>{authUser.username}</strong>
    </p>
    </div>
);

// Dashboard组件
const Dashboard = ({ authUser }) => (
    <div>
    <h3>Yo! This is the dashboard</h3>
    {/* 将authUser值传给 Nav 组件*/}
    <Nav authUser={authUser} />
    </div>
);

// APP组件 定义authUser属性
const authUser = {
    username: "codebeast"
};
const App = () => (
    <div>
    {/* 将值传给 Dashboard 组件*/}
    <Dashboard authUser={authUser} /> 
    </div>
);

render(<App />, document.getElementById("root"));
```


## 老版本React

- `<Nav/>`组件中定义组件属性`contextTypes`对象，对象中的属性表示要从父组件中取得的属性值。
- `<App/>`组件中定义静态方法`childContextTypes`和方法`getChildContext`，将传递给组件树的上下文通过这两个方法发射出去。

```javascript
// Nav 函数组件
import ProperTypes from 'prop-types'
const Nav = ({}, {authUser})=> {
    <div>
        <p>
          Your username is <strong>{authUser.username}</strong>
        </p>
    </div>
}
Nav.contextTypes = {
    authUser: PropTypes.object
}

// Nav 类组件
class Nav extends React.Component{
    static contextTypes = {
        authUser: PropTypes.object
    }

    render(){
        const {authUser} = this.context; // 直接从this.context中解构
        return(
            <div>
                <p>
                  Your username is <strong>{authUser.username}</strong>
                </p>
            </div>
        )
    }
}

// App
class App extends React.Component {
    // 必须定义静态方法childContextType与上下文对象相对应
    static childContextTypes = {
        authUser: PropTypes.object
    };
    state = {
        authUser: {
            username: "codebeast"
        }
    };
    // 返回组要传递给组件树的任何上下文对象
    getChildContext() {
        return { authUser: this.state.authUser };
    }
    render() {
        return (
            <div>
            <Dashboard />
            </div>
        );
    }
}
```

## 新版本API

- 使用`createContext()`方法定义一个上下文对象`AuthContext`，给属性定义一个默认值，这个值会在`Provider`失败的会使用到。
- `<App/>`中使用`AuthContext.Provider`传递一个值`value`，这个值`value`将数据传递到下级组件中
- `<Nav/>`根组件中使用`AuthContext.Consumer`属性消费，它接收一个`render prop`函数，参数是从`Provider`中传递过去的`value`值

```javascript
// 定义AuthContext
const AuthContext = React.createContext({
    username: ""
});

// App中使用AuthContext.Provider提供数据
const authUser = {
    username: "codebeast"
};

const App = () => (
    <div style={styles}>
        <AuthContext.Provider value={authUser}>
            <Dashboard />
        </AuthContext.Provider>
    </div>
);

// Nav消费数据
const Nav = () => (
    <AuthContext.Consumer>
        {authUser => (
            <div>
                <p>
                    Your username is <strong>{authUser.username}</strong>
                </p>
            </div>
        )}
    </AuthContext.Consumer>
);

// Dashboard
const Dashboard = () => (
    <div>
        <h3>Yo! This is the dashboard</h3>
        <Nav />
    </div>
);
```