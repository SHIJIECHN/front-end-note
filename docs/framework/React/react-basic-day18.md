---
autoGroup-1: React
sidebarDepth: 3
title: 18. JSX（二）
---

## JSX

`JSX`其实是`React.createElement`函数调用的语法糖。`React`会把`JSX`编译为`React.createElement`调用形式。

> 什么是`React`的元素类型

一个类组件或者函数组件就是`React`元素，并且它是一种`React`的元素类型，组件里面用了`JSX`的形式，这个组件必须存在当前的模块作用域中。

`React`会编译`JSX`变成`React.createElement`的调用形式，所以必须要让`React`库存在当前的模块作用域中，如`import React from 'react'`，生产环境下`<script>`引入`CDN`。


## 点语法

> 如何在`JSX`中使用点语法（对象访问的语法`obj.a`)

在一个模块中定义多个`React`组件时，会很方便。

```javascript
// 定义
const MyUI = {
    // 类组件
    Button: class extends React.Component{
        render(){
            return <button>{this.props.children}</button>
        }
    },
    Input: function(props){
        return(
            // ...
        )
    }
}

// 使用
 <MyUI.Button type="danger">Click</MyUI.Button>
```

`React`书写规范：
1. 小写字母开头代表`HTML`的内置组件，如`<div>、<h1>`，将标签转换为字符串'div','h1',作为`React.createElement`第一个参数。
2. 大写字母开头的自定义组件`<MyButton>`，直接编译成`React.createElement(MyButton)`.

> 运行时选择`React`类型

在运行组件的过程中，临时通过`props`去决定到底渲染哪一个组件。

```javascript
class LoginBtnGroup extends React.Component {
    render() {
        return (
            <div>
                <button>登录</button>
                <button>注册</button>
            </div>
        )
    }
}

class WelcomInfo extends React.Component {
    render() {
        return (
            <div>
                <h1>欢迎您！{this.props.username}</h1>
            </div>
        )
    }
}

class Header extends React.Component {
    // 1. 声明一个静态属性，运行时选择React类型
    static components = {
        'login': LoginBtnGroup,
        'welcome': WelcomInfo
    }
    render() {
        // 2. 将类型赋值给一个大写字母开头的变量
        const HeaderUser = Header.components[this.props.type]
        return (
            // 正确
            <HeaderUser {...this.props} />

            // 错误。JSX类型不能是一个表达式
            <components[this.props.type] {...this.props}/>

        )
    }
}
```

## JSX中的props

### 1. JS表达式作为props

在`JSX`中的{}，它里面可以传入任何`JS`表达式，不包括语句`if`、`for`、`switch`、`function`，如果非要表达式，可以在`JSX`外面使用。

案例：通过一个`state`来管理到底显示主标题还是子标题
1. 使用if表达式
2. 使用switch表达式
3. 使用三元运算符
   
```js
class App extends React.Component {
    state = {
        mainTitle: "This is a MainTitle",
        subTitle: "This is a SubTitle",
        titleShow: '1' // sub
    }

    render() {
        let title = ""
        // 1. 使用if进行判断
        if (this.state.titleShow === 'sub') {
            title = <h2>{this.state.subTitle}</h2>
        } else {
            title = <h1>{this.state.mainTitle}</h1>
        }
        // 2. 有多个标题可以使用switch
        switch (this.state.titleShow) {
            case 'main':
                title = <h1>{this.state.mainTitle}</h1>
                break;
            case 'sub':
                title = <h2>{this.state.subTitle}</h2>
                break;
            default:
                title = <h3>There is no Title</h3>
                break;
        }
        return(
            <div>
                {title}
            </div>
        )

        // 解构
        const { titleShow, mainTitle, subTitle } = this.state;
        return (
            <div>
                {/* 3. 不用Switch直接在JSX里面写三目运算符，只适合只有main和sub的情况 */}
                {
                    this.state.titleShow === 'sub'
                        ? <h2>{subTitle}</h2>
                        : <h1>{mainTitle}</h1>
                }

            </div>
        )
    }
}
```
任何地方都可以写`JSX`，如`render`中，不一定都写在`return`里面，只要最后把`JSX return`出去就可以。

### 2. props的赋值方式

两种赋值方式：
1. 字符串字面量：`title="这是一个标题"`
2. 表达式：`title={'这是一个标题'}`

字符串字面量传入props的方式不会被html实体转义
- 如果是 `title='这是一个<标题>'`。显示为：`这是一个<标题>`
- 如果是 `title='这是一个&lt;标题&gt;'`。显示为：`这是一个<标题>`

达式传入props会被被转义为普通实体
- 如果是 `title={'这是一个<标题>'}`。显示为：`这是一个<标题>`（被转义为普通实体）
- 如果是 `title={'这是一个&lt;标题&gt;'}`。 显示：`这是一个&lt;标题&gt;`（被转义为普通实体）


### 3. props的布尔表达

```javascript
function MyTitle(props) {
    const { title, author } = props;

    return (
        <div>
            <h1>{title}</h1>
            <p>{author}</p>
        </div>
    )
}

<MyTitle
    title="This is a Title"
    author="Xiaye"
    /**
      * 语义：字符串传入的意义是字符串的意思，不代表布尔真假
      * 逻辑：字符串true是逻辑真
      */
    authorShow="true"

    // 语义和逻辑：Bool true的意义代表Bool真假
    authorShow={true}

    // 不赋值属性，默认就是Bool 真
    // 不推荐这么做，语义不好
    authorShow
/>
```

### 4. props使用展开操作符

```javascript
const { title,author,authorShow } = this.props;
<MyTitle 
  title={ title }
  author={ author }
  authorShow={ authorShow }
/>

//也可以用展开运算符的方式显示
<MyTitle 
  { ...this.props }
/>

//排除某一个属性的写法：
//先排除不用的写在最前面，剩下的就是用的属性
const { abc, ...others } = this.props;
<MyTitle 
  { ...this.others }
/>
```


## JSX的子元素

### 1. 字符串字面量

字符串字面量作为子元素的特点：是被转义的。
1. 去掉首位空格、换行
2. 字符串之间的多个空格压缩为一个空格，可以通过字符实体`&nbsp;`多个空格
3. 字符串之间的换行压缩为一个空格。使用`<br/>`换行

### 2. JSX作为JSX子元素
```javascript
class ListItems extends React.Component {
    render() {
        // React组件也能够返回存储在数组中的一组数据
        // return [
        //    需要设置key
        //     <li key="1">This is content 1.</li>,
        //     <li key="2">This is content 2.</li>,
        //     <li key="3">This is content 3.</li>
        // ]

        // 如果想返回一组JSX的话，可以直接返回数组
        return this.props.listData.map((item, index) => (
            <li key={index}>{item}</li>
        ))
    }
}

<ListItems listData={this.state.listData} />
```

### 3. unll, undefined, bool
`null`、`undefined`、`bool`都是可以作为`JSX`的子元素，这些子元素是会被忽略不会渲染的，标签是会渲染的。

为什么不会渲染呢？ 为解决条件渲染的问题。

```javascript
return (
    <div>
        {/* 都不会渲染 */}
        <div>{true}</div>
        <div>{false}</div>
        <div>{undefined}</div>
        <div>{null}</div>

        {/* 渲染 */}
        <div>{String(null)}</div>
        <div>
            {this.state.show ? 'ok' : '不ok'}
        </div>
        <div>
            {
                this.state.show && 'ok'
            }
        </div>
        <div>
            {
                this.state.data.length ? '有数据' : '无数据'
            }
        </div>
        <div>
            {
                // 显示0。因为JSX中0是会渲染的
                // this.state.data.length && '有数据'

                this.state.data.lenght > 0 && '有数据'
            }
        </div>
    </div>
```

### 4. 函数作为子元素

函数作为子元素即`props.children`是函数。

`JSX`的`props.children`根`props`本身是有一致的特性，`props.children`就可以传递任何类型的子元素。

```javascript
// 定义一个Repeat组件专门来循环子项并打印出来且每次的index都不同
class Repeat extends React.Component {
    render() {
        const jsxArr = [];
        for (var i = 0; i < this.props.num; i++) {
            // this.props.children 
            // -> 父组件App里传入的值是一个函数(index) 
            // => <p>...</p>
            //并将传入的函数执行并传入参数i的结果依次存入数组
            jsxArr.push(this.props.children(i));
        }
        return jsxArr;
        /**
         * <p>This is item 1.</p>
         * <p>This is item 2.</p>
         */
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <Repeat num={10}>
                    {
                        (index) => <p key={index}>This is item {index + 1}.</p>
                    }
                </Repeat>
            </div>
        )
    }
}
```
```javascript
//Http > index.jsx
//专门定义一个组件来管理请求数据,loading,请求后数据视图格式
class Get extends React.Component{
  async componentDidMount(){
    const result = await axios(this.props.url);
    
    //当修改数据后执行定时器再修改state.component
    this.setState({
      data: result.data
    }, () => {
      setTimeout(() => {
        this.setState({
          //执行传入的函数并传入请求的后端数据返回出结果赋值到component里
          component: this.props.children(this.state.data)
        })
      }, 1000)
    });
  }
  
  state = {
    data: [],
    component: this.props.loading
  }
  
  render(){
    return this.state.component;
  }
}

export default { Get }

//app.jsx
class App extends React.Component{
  render(){
    return(
      <div>
        <Http.Get
          url='http//xxx.com/xxx'
          loading={
            <tr><td>正在加载中...</td></tr>
          }
        >
          {/* 传入一个函数给子组件 */}
          {
            (data) => {
              return data.map(item => (
                <tr key={ item.id }>
                  <td>item.id</td>
                </tr>
              ))
            }
          }
        </Http.Get>
      </div>
    );
  }
}
```

以上专门定义的组件可以节省其他逻辑专门处理数据请求等，把视图的工作交给app组件，把逻辑和视图需要的前期逻辑都交给定义的组件去做。