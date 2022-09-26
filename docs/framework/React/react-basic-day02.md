---
autoGroup-1: React
sidebarDepth: 3
title: JSX
---

## JSX是什么
1. 一种标签语法、JS进行的语法扩展
2. 不是字符串、不是HTML标签
3. 描述UI呈现与交互的直观的表现形式
4. 生成React元素


## createElement与JSX对比
```javascript
// JSX
const rEl = <h1 className="title">This is my first JSX experience.</h1>

// createElement
const rEl = React.createElement('h1',
    {
        className: 'title'
    }, 'This is my first JSX experience.'
);

ReactDOM.render(rEl, document.getElementById('app'));
```
插值表达式
```javascript
class MyButton extends React.Component {
    constructor(props) {
        super(props);

        // 创建state 相当于vue data
        this.state = {
            openStatus: false
        }
    }

    statusChange() {
        this.setState({
            openStatus: !this.state.openStatus
        })
    }

    // 渲染视图必须放入render函数里
    render() {
        // JSX 遵循JS的命名规范，一般使用camelCase（小驼峰）
        // class => className  tabindex => tabIndex
        return (
            <div className="wrapper">
                <p className="text">
                    {/**插值表达式 */
                        this.state.openStatus ? '打开状态' : '关闭状态'
                    }
                </p>
                <button onClick={this.statusChange.bind(this)}>
                    {this.state.openStatus ? '关闭' : '打开'}
                </button>
            </div>
        )
    }
}

ReactDOM.render(
    React.createElement(MyButton),
    document.getElementById('app')
);
```
总结：
1. JSX 遵循JS的命名规范，一般使用camelCase（小驼峰）
2. 插值表达式中是js语法

为什么React不把视图标记和逻辑分开呢？
1. 渲染和UI标记是有逻辑耦合
2. 即使是这样的耦合也能实现关注点分离
```javascript
render(){
    return (
        <button onClick={this.statusChange.bind(this)}>
            {this.state.openStatus ? '关闭' : '打开'}
        </button>
    )
}
```

## JSX插值表达式
一切有效的（符合JS编程逻辑的）表达式都写在 { } 里面。JSX有编译的过程，被编译以后转化为React元素，实际上是一个普通的对象。
```javascript
const rEl = <h1 className="title">This is my first JSX experience</h1>
console.log(rEl);
/**
 * 打印react对象
 * console.log(rEl);
 * {
 *   $$typeof: Symbol(react.element),
 *   key: null,
 *   props: {className: 'title', children: 'This is a title part.'},
 *   ref: null,
 *   type: "h1",
 *   _owner: null,
 *   _store: {validated: false},
 *   _self: null,
 *   _source: null
 * }
 */
```
为什么使用Symbol？rEl的类型是我自己定义的react元素，保证它唯一的值。

比较
```javascript
const rEl = <h1 className="title">This is my first JSX experience</h1>;
const rEl2 = React.createElement('h1',
    {
        className: 'title'
    }, 'This is my first JSX experience.'
);
console.log(rEl, rEl2);
/**
 * console.log(rEl);
 * {
 *   $$typeof: Symbol(react.element),
 *   key: null,
 *   props: {className: 'title', children: 'This is a title part.'},
 *   ref: null,
 *   type: "h1",
 *   _owner: null,
 *   _store: {validated: false},
 *   _self: null,
 *   _source: null
 * }
 */
/**
 * console.log(rEl2);
 * {
 *   $$typeof: Symbol(react.element),
 *   key: null,
 *   props: {className: 'title', children: 'This is a title part.'},
 *   ref: null,
 *   type: "h1",
 *   _owner: null,
 *   _store: {validated: false},
 *   _self: null,
 *   _source: null
 * }
 */
```
rEl编译以后会转化成rEl2，JSX实际上是React.createElement的上层。rEl需要经过编译以后才会变成React元素，rEl2执行了就会返回一个React元素。

渲染一个列表
```javascript
var arr = [
    {
        id: 1,
        name: '张三'
    },
    {
        id: 2,
        name: '李四'
    }
];

function setList() {
    return (
        <ul>
            {
                arr.map(item => {
                    return (
                        <li key={item.id}>
                            <span>{item.id}</span>
                            <p>{item.name}</p>
                        </li>
                    )
                })
            }
        </ul>
    )
};

const rEl = setList();

ReactDOM.render(
    rEl,
    document.getElementById('app'));
```

单标签必须要闭合
```javascript
const rEl = <img src="" />
```
render之前所有JSX内容都会转成字符串，所有输入的内容都会进行转移(XSS攻击不会发生)