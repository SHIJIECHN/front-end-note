---
autoGroup-1: React
sidebarDepth: 3
title: 17. Refs（二）
---

## React.createRef()用法分析

通过`React.createRef()`方法创建`ref`容器。使用`ref`：
1. 通过`createRef`可以创建一个ref对象
2. 通过元素的`ref`属性可以附加到`React`元素上
3. 一般通过构造器中给`this`上的属性赋值`ref`，方便整个组件使用
4. `ref`只要传递`React`元素中，就可以利用`current`属性访问到真实`DOM`节点。

> `ref`在什么时候更新？

`ref`在`componentDidMount`和`componentDidUpdate`触发前更新，也就是说可以在这两个生命周期函数内访问到`ref`最终的值。

`ref`三种不同的使用方式：
1. `ref`放在`html`元素上，`current`就是真实`DOM`节点
2. `ref`放在`class`组件上，`current`指向组件的实例
3. `ref`放在函数组件上，函数组件没有实例，`createRef`附加不到组件上，不能使用（如何使用？）
  
```javascript
// refs放在class组件上
class App extends React.Component {
    constructor(props) {
        super(props);
        this.TestRef = React.createRef();
    }
    componentDidMount() {
      console.log(this.TestRef);
    }

    render() {
      return (
        <div>
            <Test ref={this.TestRef} />
        </div>
      )
    }
}
```

组件的实例：

<img :src="$withBase('/framework/React/Refs.jpg')" alt="Refs" />

> 函数组件如何使用`ref`？

使用`useRef`。

```javascript
function Test2() {
    // 1. 函数组件中使用useRef。声明divRef
    const divRef = React.useRef(null);

    // 3. 打印。针对React中的componentDidMount，函数组件中使用useEffect，不依赖任何变量
    React.useEffect(() => {
        console.log(divRef)
    }, [])

    return (
        // 2. 附加到元素中
        <div ref={divRef}>Hello, Function Ref!</div>
    )
}
```

## Refs转发到DOM组件机制

在父组件中将子组件元素节点`input`清空并聚焦，需要获得子组件中`input`的`DOM`，因此需要将`ref`传递。

> 如何将子节点的`ref`暴露给父组件？

React 16.3以上通过`Refs`转发。

将`ref`自动的通过组件传递，普通的定义一个类组件是无法满足的，主要使用`React.forwardRef((props, ref) => {return React元素})`

```javascript
// 1. 创建ref对象
this.myInputRef = React.createRef();

// 2. 给组件赋值ref
<MyInput ref={this.myInputRef}/>

// 3. 通过forwardRef向input转发ref属性
const MyInput = React.forwardRef((props, ref) => (
    // 4. ref参数只能用forwardRef定义的组件内可接收
    <input type="text" ref={ref} />
))

// 5. myInputRef.current指向input DOM节点
componentDidMount() {
  console.log(this.myInputRef);
}
```

步骤：
1. 在父组件中通过调用React.createRef创建ref对象。
2. 子组件使用ref属性，并将值关联到创建的ref对象中，将其向下传递`<MyInput ref={ref} />`。
3. 通过React.forwardRef转发ref属性值，forwardRef内函数(props, ref) => ...，作为其第二个参数。
4. 向下转发该ref参数到`<input ref={ref} />`，将其指定为JSX属性。
5. 父组件中可以打印子节点的信息。

:::tip
第二个参数ref只在使用React.forwardRef定义组件时存在。常规函数和class组件不接收ref参数，且props中也不存在ref。
:::

## 高阶组件Refs转发机制
> 高阶组件如何进行Refs转发呢？

```javascript
// 1. 创建ref对象引用值
this.inputRef = React.createRef();

// 2. 用ref接收我们转发的ref
<MyInputHoc ref={this.inputRef} />
const MyInputHoc = InputHoc(MyInput);

function InputHoc(WrapperComponent) {
    class Input extends React.Component {
        render() {
            // 4. 在容器组件内部获取ref属性
            const { forwardedRef, ...props } = this.props;
            return (
                // 5. 将ref传递给参数组件
                <WrapperComponent ref={forwardedRef} {...props} />
            )
        }
    }

    // 3. 向子组件传递ref。将其作为常规props属性传递给容器组件，如forwardedRef
    function forwardRef(props, ref) {
        return <Input {...props} forwardedRef={ref} />
    }
    // 给React.forwardRef组件命名
    forwardRef.displayName = 'input - ' + WrapperComponent.name;
    return React.forwardRef(forwardRef)
}
```


## 将DOM Refs暴露给父组件

### 1. 使用`refs`转发机制

React 16.2及以下`Refs`转发。

```javascript
// 1. 创建ref对象
this.inputRef = React.createRef();

// 2. 组件使用ref
<MyInput inputRef={this.inputRef} />

// 3. 子组件中使用
class MyInput extends React.Component {
    render() {
        return (
            <input ref={this.props.inputRef} />
        )
    }
}
```

### 2. 回调Refs方式一(本组件操作)

使用`ref`回调函数，在实例的属性中存储对`DOM`节点的引用。在组建挂载时，会调用`ref`回调函数并传入`DOM`元素。在`componentDidMount`或`componentDidUpdate`触发前，保证`refs`一定是最新的。

```javascript
class MyInput extends React.Component{
  constructor(props){
    super(props);
    this.myInput = null;
  }
  this.focusInput = ()=>{
    if(this.myInput) this.myInput.focus();
  }
  componentDidMount(){
    this.focusInput();
  }

  // 2. 回调函数会接收一个el的参数，这个参数就是节点
  setMyInput(el){
    this.myInput = el;
  }
  render(){
    return(
      // 1. ref使用回调函数
      <input ref={this.setMyInput.bind(this)} />
    )
  }
}
```

### 3. 回调方式二(父组件操作)

在父组件中设置回调函数，父组件通过`props`的方式将`ref`传进去。

```javascript
class MyInput extends React.Component {
    render() {
        return (
            <input type="text" className="my-input" ref={this.props.InputRef} />
        )
    }
}

class App extends React.Component {
    componentDidMount() {
        console.log(this.oInput);
    }
    render() {
        return (
            <div>
              {/* 把refs回调函数当做InputRef props传递给子组件 */}
                <MyInput InputRef={el => this.oInput = el} />
            </div>
        )
    }
}
```


### 4. String 类型的 Refs（已废弃）
将refs设置为字符串形式
```javascript
class MyInput extends React.Component{
  componentDidMount(){
    // 2. 获取ref
    console.log(this.refs.inputRef);
  }
  render(){
    // 1. ref定义为字符串的形式
    return <input type="text" ref='inputRef' />
  }
}
```

这种方式的缺点：
1. `string Refs`依赖于当前组件实例下面的`refs`集合里的`ref`，需要`React`保持追踪当前正在渲染的组件，如果当前组件没有加载完成，`this`是没法确定的，导致`React`在获取`ref`的时候可能回比较慢。
2. 不能在`render`中工作。不能组合，只能有一个`ref`。