---
autoGroup-4: React基础
sidebarDepth: 3
title: Ref的处理
---

## 原生DOM元素添加ref

- ref与key，和props是同级的，也就是props中不包括这两个
- 在创建真实DOM的时候进行赋值，也就是createDOM中。

```javascript
class Sum extends React.Component {
  numberA;
  numberB;
  result;
  constructor(props) {
    super(props);
    this.numberA = React.createRef();// { current: null}
    this.numberB = React.createRef();
    this.result = React.createRef();
  }

  handleClick = (event) => {
    let numberA = this.numberA.current.value;
    let numberB = this.numberB.current.value;
    this.result.current.value = parseFloat(numberA) + parseFloat(numberB);
  }

  render() {
    return (
      <>
        <input ref={this.numberA} type="text" />
        <input ref={this.numberB} type="text" />
        <button onClick={this.handleClick}>+</button>
        <input ref={this.result} type="text" />
      </>
    )
  }
}

// createDOM
if (ref) ref.current = dom; 
```

## class组件添加Ref

- 在类组件挂载的时候，让ref的current指向类组件实例

```javascript
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  getInputFocus = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <input type="text" ref={this.inputRef} />
    )
  }
}

// 点击按钮，让input获得焦点
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }
  getFormFocus = () => {
    // this.textInputRef.current指向TextInput类组件的实例
    this.textInputRef.current.getInputFocus();
  }
  render() {
    return (
      <>
        <TextInput ref={this.textInputRef}></TextInput>
        <button onClick={this.getFormFocus}>获得焦点</button>
      </>
    )
  }
}


// react.js
/** 类组件使用 */
function createRef() {
  return { current: null }
}

// createDOM
function mountClassComponent(vdom) {
  const { type, props, ref } = vdom; // 获取类组件和属性
  // other code
  if (ref) ref.current = classInstance; // 让ref的current指向类组件实例
  return createDOM(renderVdom);
}
```

## Ref转发（函数组件）

- 函数组件没有实例，不能直接加ref
- 使用React.forwardRef转发，只有类组件才能加ref，所以实际上forwardRef返回的就是类组件

```javascript
function TextInput(props, ref) {
  return (
    <input ref={ref} />
  )
}

const ForwardedTextInput = React.forwardRef(TextInput)

// 点击按钮，让input获得焦点
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }
  getFormFocus = () => {
    this.textInputRef.current.focus();
  }
  render() {
    return (
      <>
        <ForwardedTextInput ref={this.textInputRef} />
        <button onClick={this.getFormFocus}>获得焦点</button>
      </>
    )
  }
}


// react.js
/** 函数组件使用 */
function forwardRef(FunctionComponent) {
  // 返回一个类组件
  return class extends Component {
    render() {
      // 将props和ref转发给函数组件
      return FunctionComponent(this.props, this.props.ref); // 执行函数组件
    }
  }
}
```