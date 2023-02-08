---
autoGroup-1: React
sidebarDepth: 3
title: 条件渲染与列表渲染
---

## 条件渲染
登录状态和非登录状态
```javascript
// APP
//   LoginForm
//   Welcome
//   Tip

// 登录页面
class LoginForm extends React.Component {
    state = {
        username: '', // 用户名
        password: '' // 密码
    }
    login = () => {
        // 解构数据
        const { username, password } = this.state;
        // 验证数据
        if (!username.length || !password.length) {
            alert('用户名或密码不能为空！')
        }
        // 登录操作
        this.props.login(username, password);

    }
    // 用户名输入框发生改变
    handleUserNameChange = (e) => {
        // 用户名。e.target.value当前输入框的值
        this.setState({
            username: e.target.value
        })
    }
    // 密码输入框发生改变
    handlePassWordChange = (e) => {
        // 密码
        this.setState({
            password: e.target.value
        })
    }

    render() {
        return (
            <div>
                <p>
                    用户名：
                    <input
                        type="text"
                        placeholder="用户名"
                        onChange={
                            this.handleUserNameChange
                        }
                    />
                </p>
                <p>
                    密码：
                    <input
                        type="text"
                        placeholder="密码"
                        onChange={
                            this.handlePassWordChange
                        }
                    />
                </p>
                <p>
                    <button onClick={this.login}>登录</button>
                </p>
            </div>
        )
    }
}

// 欢迎页面
class Welcome extends React.Component {
    render() {
        return (
            <div>
                <h1>欢迎您，亲爱的用户</h1>
                <button onClick={this.props.logout}>退出登录</button>
            </div>
        )
    }
}

class Tip extends React.Component {
    render() {
        const { tipShow } = this.props;
        if (!tipShow) {
            // 注意：如果render函数返回null，不会进行任何渲染
            return null;
        }

        return (
            <p>This is a Tip.</p>
        )
    }
}

class App extends React.Component {
    state = {
        logged: false,
        count: 0,
        tipShow: false
    }

    // 退出登录。因为要修改logged状态，所以写在App中
    logout = () => {
        this.setState({
            logged: false,
            tipShow: false
        }, () => {
            // 更改完state的回调
            console.log(this.state.logged); // false
        })
    }
    // 登录
    login = (username, password) => {

        if (username != 123 || password != 123) {
            alert('用户名或密码错误');
            return;
        }
        this.setState({
            logged: true,
            tipShow: true
        })
    }

    render() {
        // 解构出logged是否登录状态
        const { logged, count, tipShow } = this.state;
        // logged为true显示欢迎页面，为false显示登录页面
        // if (logged) {
        //     return <Welcome logout={this.logout} />
        // } else {
        //     return <LoginForm login={this.login} />
        // }

        // 与运算表达式和三目运算
        return (
            <div>
                {
                    logged && <span>尊贵的会员</span>
                }
                {
                    // 是一定不会返回0，但是会返回false表达式0
                    // 判断表达式一定是布尔false，null，undefined的时候，才不会被渲染
                    // 0 '' 一定会被渲染出来的
                    count.toString() && <p>会员等级：{count}</p>
                }
                {
                    logged
                        ? <Welcome logout={this.logout} />
                        : <LoginForm login={this.login} />
                }
                <Tip tipShow={tipShow} />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```
根据logged的值来渲染不同的组件。

### 阻止组件渲染
如果你希望隐藏组件，可以让render方法直接返回null，而不进行任何渲染

根据props的值进行条件渲染，如果tipShow的值是false，那么组件则不会渲染。
```javascript
class Tip extends React.Component {
    render() {
        const { tipShow } = this.props;
        if (!tipShow) {
            // 注意：如果render函数返回null，不会进行任何渲染
            return null;
        }

        return (
            <p>This is a Tip.</p>
        )
    }
}
```
在组件的render方法中返回null并不会影响组件的生命周期。

## 列表渲染

关于`key`值：
- 列表中的每个子元素都必须唯一的`key`属性
- `key`是`React`查看元素是否改变的唯一标识
- `key`必须在兄弟节点中唯一，确定的（兄弟结构是在同一列表中的兄弟元素）
- 不建议使用`index`作为`key`值（禁止），建立在列表顺序改变，元素增删的情况下
- 列表项增删或顺序改变，`index`的对应项就会改变，`key`对应的项还是之前列表情况的对应元素的值
- 导致状态混乱，查找元素性能会变差

解决方法：
- 如果列表是静态不可操作的，可以选择`index`作为`key`，也不推荐，有可能这个列表在以后维护的时候有可能变更为可操作的列表
- 避免使用`index`
- 可以用数据的`ID`
- 使用动态生成一个静态`ID`，如通用包`nanoid`

注意：
- `key`是不会作为属性传递给子组件的，必须显示传递`key`
- 防止开发者在逻辑中对`key`值进行操作

```javascript
import { nanoid } from 'nanoid'

class App extends React.Component {
    state = {
        arr: [
            {
                id: 1,
                name: '张三'
            },
            {
                id: 2,
                name: "李四"
            },
            {
                id: 3,
                name: '王五'
            }
        ]
    }

    render() {
        return (
            <table border="1">
                <thead>
                    <tr>
                        <th>KEY</th>
                        <th>ID</th>
                        <th>名字</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.arr.map(item => {
                            const key = nanoid()
                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        )
    }
}

// 拆分组件

class ItemTitle extends React.Component {
    render() {
        return (
            <thead>
                <tr>
                    <th>KEY</th>
                    <th>ID</th>
                    <th>NAME</th>
                </tr>
            </thead>
        )
    }
}

class ListItem extends React.Component {
    render() {
        const { sid, item } = this.props;
        return (
            <tr>
                <td>{sid}</td>
                <td>{item.id}</td>
                <td>{item.name}</td>
            </tr>
        )
    }
}

class ListTable extends React.Component {
    state = {
        arr: [
            {
                id: 1,
                name: '张三'
            },
            {
                id: 2,
                name: "李四"
            },
            {
                id: 3,
                name: '王五'
            }
        ]
    }

    render() {
        return (
            <table border="1">
                <ItemTitle />
                <tbody>
                    {
                        this.state.arr.map(item => {
                            const sid = nanoid();
                            /**
                             * key是不会作为属性传递给子组件的，必须显示传递key值，为什么？
                             * 防止开发者在逻辑中对key值进行操作
                            */
                            return (
                                <ListItem
                                    item={item}
                                    sid={sid}
                                    key={sid}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

ReactDOM.render(
    <ListTable />,
    document.getElementById('app')
)
```
提取一个`ListItem`组件，应该把`key`保留在`ListItem`元素上，而不是放在`ListItem`组件中的`tr`元素上。

### key只是在兄弟节点之间必须唯一

`key`在其兄弟节点之间应该是独一无二的，然后它们不需要是全局唯一的。

`key`会传递信息给`React`，但是不会传递给你的组件，如果你的组件中需要使用`key`属性的值，用其他属性名显示传递这个值。
```javascript
<ListItem
    item={item}
    sid={sid}
    key={sid}
/>
```
`ListItem`组件可以读出`props.sid`，但是不能读出`props.key`。
