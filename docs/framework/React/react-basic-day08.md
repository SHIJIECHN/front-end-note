---
autoGroup-1: React
sidebarDepth: 3
title: 8. 受控组件与非受控组件
---

## 受控组件

在`react`有两种表单处理方式：
- 受控组件
- 非受控组件

关于`html`和`react`中状态的冲突：

- `html`中的表单元素是可输入的，有自己的可变状态
- `react`中可变状态一般保存在`state`中，并且只能通过使用`setState()`来更新

> react如何解决以上冲突？

将`state`与表单中的`value`绑定在一起，由`state`值来控制表单元素的值

控制表单输入行为取值的方式的组件，跟`input`表单相关的渲染数据必须保存在自己的`state`数据里。

```javascript
<input type="text" value={this.state.txt} />
```

受控使用步骤:
1. 在`state`中添加一个状态，作为表单元素的`value`值（控制表单元素的值的来源）
2. 给表单元素绑定`change`事件，将表单元素的值设置为`state`的值（控制表单元素的值的变化）

常见的表单元素：
- 文本框
- 富文本框
- 下拉框
- 单选框与复选框

表单操作：通过修改页面的内容从而更改`state`数据，事件绑定`e.target.value/e.target.checked`

案例：用户信息提交表单
```javascript
class App extends React.Component {
    constructor() {
        super();

        this.state = {
            txt: 'Please write something in inputarea',
            content: 'Please write something in textarea',
            city: 'beijing',
            isCheck: true
        };
    }

    //文本框
    handleTxtChange = (e) => {
        this.setState({ txt: e.target.value });
    };
    //富文本框
    handleContentChange = (e) => {
        this.setState({ content: e.target.value });
    };
    //下拉菜单
    handleCityChange = (e) => {
        this.setState({ city: e.target.value });
    };
    //复选框
    handleIsCheckChange = (e) => {
        this.setState({ isCheck: e.target.checked });
    };

    render() {
        return (
            <div>
                <h1>This is form demo</h1>
                <hr />
                {/* 文本框 */}
                <h4>文本框:</h4>
                <input
                    type="text"
                    value={this.state.txt}
                    onChange={this.handleTxtChange}
                />
                <hr />
                {/* 富文本框 */}
                <h4>富文本框:</h4>
                <textarea
                    value={this.state.content}
                    onChange={this.handleContentChange}
                ></textarea>
                <hr />
                {/* 下拉菜单 */}
                <h4>下拉菜单：</h4>
                <select value={this.state.city} onChange={this.handleCityChange}>
                    <option value="shanghai">上海</option>
                    <option value="beijing">北京</option>
                    <option value="shenzhen">深圳</option>
                </select>
                <hr />
                {/* 复选框 */}
                <h4>复选框：</h4>
                爱好：
                <input
                    type="checkbox"
                    checked={this.state.isCheck}
                    onChange={this.handleIsCheckChange}
                />
                篮球
                <hr />
            </div>
        );
    }
}
```
使用一个事件处理函数同时处理多个表单元素
```javascript
//1.给表单元素添加name属性，名称与state相同
{/* 文本框 */}
<h4>文本框:</h4>
<input
  name="txt"
  type="text"
  value={this.state.txt}
  onChange={this.handleTxtChange}
/>

//2.根据表单元素类型获取对应值
this.handleChange = (e) => {
  const target = e.target;
  const name = target.name;
  const value = target.type === 'checkbox' 
    ? target.checked 
    : target.value;
  
  //3.根据name设置对应state
  this.setState({
    [name]: value
  });
};
```

受控组件和非受控组件的区别：
- 受控组件（推荐使用）
  - 视图表单数据受控于`state`状态数据组件
  - 控制表单操作并且同步`state`
- 非受控组件：视图表单数据是只读的


## 非受控组件

不受控于`state`，使用`React`中的`ref`从`DOM`节点中获取表单数据得到的组件。

### ref使用的两种方式

> 如何不通过`state`数据状态保存表单标签里面的值？

通过`ref`可以保存，在标签里定义`ref="xxxRef"`，通过`this.refs.xxx.value`访问到保存的值。
```javascript
// 1. 创建带有ref的输入框
 <input type="text" placeholder="用户名" ref="usernameRef" />

// 2. 通过ref对象获取文本框的值
console.log(this.refs.usernameRef.value)
```

也可以创建引用挂载到视图上React.createRef()

```javascript
//1.调用React.createRef()方法创建一个ref对象
constructor(){
  super();
  this.txtRef = React.createRef();
}

//2.将创建好的ref对象添加到文本框中
<input type="text" ref={this.txtRef} />

//3.通过ref对象获取文本框的值
console.log(this.txtRef.current.value);
```

### 默认值
在`React`渲染生命周期时，表单元素上的`value`将会覆盖`DOM`节点中的值。在非受控组件中，你经常希望`React`能赋予组件一个初始值，但是不去控制后续的更新。在这种情况下，你可以指定一个`defaultValue`属性，而不是`value`。在一个组件已经挂载之后去更新`defaultValue`属性的值，不会造成`DOM`上值的任何更新。

`form field`默认值在组件挂载完毕后进行更新，不会导致`DOM`的任何更新。
- `select`标签通过`defaultValue`属性拿到默认值
- `radio`单选框/`checkbox`复选框标签通过`defaultCheck`属性拿到默认值

```javascript
class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);

        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.genderRef = React.createRef();
        this.fileRef = React.createRef();
    }

    handleSubmitClick(e) {
        e.preventDefault();
        // console.log(this.refs.usernameRef.value)
        console.log(
            this.usernameRef.current.value,
            this.passwordRef.current.value,
            this.genderRef.current.value,
            this.fileRef.current.files[0]
        )
    }

    handleResetClick(e) {
        e.preventDefault();
        // this.refs.usernameRef.value = '';
        // this.refs.passwordRef.value = '';
    }

    render() {
        return (
            <form onSubmit={this.handleSubmitClick}>
                <p>
                    用户名：
                    {/* <input type="text" placeholder="用户名" ref="usernameRef" /> */}
                    <input type="text" placeholder="用户名" ref={this.usernameRef} />
                </p>
                <p>
                    密码：
                    {/* <input type="password" placeholder="密码" ref="passwordRef" /> */}
                    <input type="password" placeholder="密码" ref={this.passwordRef} />
                </p>
                <p>
                    <select
                        // form field 默认值 - 组件挂载完毕后进行更新，不会导致DOM的任何更新
                        defaultValue="female"
                        ref={this.genderRef}
                    >
                        <option value="male">男</option>
                        <option value="female">女</option>
                    </select>
                </p>
                <p>
                    {/* 上传 */}
                    <input type="file" ref={this.fileRef} />
                </p>
                <p>
                    {/* <button onClick={this.handleSubmitClick}>登录</button> */}
                    <button type="submit">登录</button>
                    <button onClick={this.handleResetClick}>重置</button>
                </p>
            </form>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

