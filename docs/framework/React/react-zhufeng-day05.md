---
autoGroup-4: React基础
sidebarDepth: 3
title: Context
---

## 实现

- 组件挂载的时候，需要判断有没有设置静态属性contextType，如果设置了就需要将实例对象context指向type.contextType._currentValue，如`type.contextType._currentValue = {color: 'red', changeColor: () => {}}`
- 更新的时候，需要获取最新值的context。组件render的时候可以拿到最新值。

```javascript
/** 类组件挂载 */
function mountClassComponent(vdom) {
  const { type, props, ref } = vdom; // 获取类组件和属性
  let defaultProps = type.defaultProps;// 类默认属性
  let componentProps = { ...defaultProps, ...props }; //props是传过来的属性，两个合并
  const classInstance = new type(componentProps); // 实例化组件
  // 在组件进行挂载时，如果类组件有contextType属性，就把contextType._currentValue赋值给类组件的context属性
  if (type.contextType) { 
    classInstance.context = type.contextType._currentValue; // type.contextType = context
  }
  // other code
  return dom;
}

/** 组件更新时 */
forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom; // 拿到老的虚拟DOM
    let oldDOM = findDOM(oldRenderVdom);// 根据老的虚拟DOM，查到老的真实DOM
    if (this.constructor.contextType) { // 组件进行更新时，需要拿到最新的context
      this.context = this.constructor.contextType._currentValue;
    }
    // other code
}

/** createContext的实现 */
function createContext(){
  let context = {$$typeof: REACT_PROVIDER}; // 声明一个context对象
  context.Provider = { $$typeof: REACT_PROVIDER, _context: context };
  context.Consumer = {$$typeof: REACT_CONTEXT, _context: context};
  return context;
}
/**
context = {
  $$typeof : Symbol(react.provider)
  Consumer: {$$typeof: Symbol(react.context), _context: {…}}
  Provider: {$$typeof: Symbol(react.provider), _context: {…}}
}
_context是context对象，循环引用
 */
```

Provider和Consumer组件在使用的时候，也是作为React的元素类型，所以执行的时候也需要进行组件挂载，如何进行挂载呢？

```javascript
function createDOM(vdom){
  if(type && type.$$typeof === REACT_PROVIDER){ // 如果是Provider组件
    return mountProviderComponent(vdom)
  }else if(type && type.$$typeof === REACT_CONTEXT){ // 如果是Consumer组件
    return mountContextComponent(vdom);
  }
  // other code
}

/**
 * Consumer组件挂载
 * @param {*} vdom 
 * @returns 
 */
function mountContextComponent(vdom){
  let {type,props} = vdom; // type={$$typeof:Symbol(react.context),_currentValue:xxx}, props={children:xxx}
  let context = type._context; // 获取context
  let value = context._currentValue; // 获取context中的_currentValue值
  let renderVdom = props.children(value); // 获取子元素. props.children是一个函数，传入value值，返回子元素
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * Provider组件挂载
 * @param {*} vdom 
 * @returns 
 */
function mountProviderComponent(vdom){
  // type={$$typeof:Symbol(react.provider),_context:context}, props={value:xxx, children:xxx}
  let {type,props} = vdom; 
  // 在渲染Provider组件的时候，拿到属性中的value，赋给context._currentValue。
  // 后面使用的时候，就可以从context._currentValue中拿到值
  type._context._currentValue = props.value;
  let renderVdom = props.children; // 获取子元素
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
```

当组件更新时，也需要更新Provider和Consumer组件，如何更新呢？

```javascript
function updateElement(oldVdom, newVdom) {
  // 注意：需要判断的是 oldVdom.type.$$typeof
  if(oldVdom.type&&oldVdom.type.$$typeof === REACT_PROVIDER){ // 如果是Provider组件
    updateProviderComponent(oldVdom, newVdom)
  }else if(oldVdom.type&&oldVdom.type.$$typeof === REACT_CONTEXT){ // 如果是Consumer组件
    updateConsumerComponent(oldVdom, newVdom)
  }
  // other code
}

/** Consumer组件更新 */
function updateConsumerComponent(oldVdom, newVdom){
  let parentDOM = findDOM(oldVdom).parentNode;// 老的真实DOM的父节点
  let { type, props } = newVdom; // type是Consumer组件，props是Consumer组件的属性
  let renderVdom = props.children(type._context._currentValue); // props.children是Consumer组件的子节点，是一个函数
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

/** Provider组件更新 */
function updateProviderComponent(oldVdom, newVdom){
  let parentDOM = findDOM(oldVdom).parentNode;// 老的真实DOM的父节点
  let { type, props } = newVdom; // type是Provider组件，props是Provider组件的属性
  type._context._currentValue = props.value; // 将Provider组件的value属性赋值给context的_currentValue属性
  let renderVdom = props.children; // props.children是Provider组件的子节点
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
```
由于新增了两种type类型，所以需要在`findDOM`方法中进行判断，如果是Provider和Consumer组件，就需要返回其子元素的真实DOM。修改后的`findDOM`方法如下：

```javascript
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === 'string' || type === REACT_TEXT) { // 原生组件
    dom = vdom.dom;
  } else { // 类组件、函数组件、forwardRef组件、provider组件、consumer组件
    // 找它的oldRenderVdom的真实DOM元素
    dom = findDOM(vdom.oldRenderVdom);
  }
  return dom;
}
```


## 使用

- Consumer组件的children是一个函数，函数的参数就是Provider的value属性
- Provider组件的value属性就是要传递的值，Provider组件的children就是Provider组件之间的内容
- 函数组件和类组件都可以使用context
- 一般情况下，函数组件使用Consumer，类组件使用contextType,但是也可以使用Consumer

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
//  1.创建Context 
const ThemeContext = React.createContext();

// 2.使用Context
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "red"
    };
  }
  changeColor = color => {
     this.setState({ theme: color });
  };
  render() {
  const contextValue = {color: this.state.theme, changeColor: this.changeColor};
    return (
      <ThemeContext.Provider value="red">
        <div style={{
          margin: '10px',
          border: `5px solid ${this.state.color}`,
          padding: '5px',
          width: '200px'
        }}>
          主页
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    );
  }
}

class Header extends React.Component {
  static contextType = ThemeContext;// 类组件可以使用静态属性contextType
  render() {
    return (
      <div style={{
        margin: '10px',
        border: `5px solid ${this.context}`,// this.context就是Provider的value属性
        padding: '5px',
        width: '200px'
      }}>
        头部
        <Title />
      </div>
    );
  }
}

class Title extends React.Component {
  static contextType = ThemeContext; // 类组件可以使用静态属性contextType
  render() {
    return (
      <div style={{
        margin: '10px',
        border: `5px solid ${this.context}`, // this.context就是Provider的value属性
        padding: '5px',
        width: '200px'
      }}>
        标题
      </div>
    );
  }
}

function Main() {
  return (
    // 函数组件可以使用Consumer
    <ThemeContext.Consumer> 
      {value => (
        <div style={{
          margin: '10px',
          border: `5px solid ${value}`, // value就是Provider的value属性
          padding: '5px',
          width: '200px'
        }}>
          主体
          <Content />
        </div>
      )}
    </ThemeContext.Consumer>
  );
}

function Content() {
  return (
    // 函数组件可以使用Consumer
    <ThemeContext.Consumer>
      {value => (
        <div style={{
          margin: '10px',
          border: `5px solid ${value}`, // value就是Provider的value属性
          padding: '5px',
          width: '200px'
        }}>
          内容
          <button onClick={() => this.context.changeColor('red')}>变红</button>
          <button onClick={() => this.context.changeColor('green')}>变绿</button>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}

ReactDOM.render(<App />, document.getElementById('root'))
```

## 使用多个Context

- 使用多个Context时，可以使用`React.createContext`创建多个Context，然后在Provider组件中使用`value`属性传递值，嵌套使用Consumber组件获取值。

```javascript
import React from './react';
import ReactDOM from './react-dom';

const GrandFatherContext = React.createContext();
const FatherContext = React.createContext();

class Son extends React.Component {
  render() {
    return (
      <GrandFatherContext.Consumer>
        {
          grandFathValue => (
            <FatherContext.Consumer>
              {
                fatherValue => (
                  <div>
                    <p>name: {grandFathValue.name}</p>
                    <p>age: {fatherValue.age}</p>
                  </div>
                )
              }
            </FatherContext.Consumer>
          )
        }
      </GrandFatherContext.Consumer>
    )
  }
}

class Father extends React.Component {
  render() {
    let fatherValue = {age: 20 }
    return (
      <FatherContext.Provider value={fatherValue}>
        <div style={{ margin: '10px', border: `5px solid red`, padding: '5px', width: '200px' }}>
          <Son/>
        </div>
      </FatherContext.Provider>
    )
  }
}

class GrandFather extends React.Component {
  render() {
    let grandFathValue = {name: 'grandFather' }
    return (
      <GrandFatherContext.Provider value={grandFathValue}>
        <div style={{ margin: '10px', border: `5px solid red`, padding: '5px', width: '200px' }}>
          <Father/>
        </div>
      </GrandFatherContext.Provider>
    )
  }
}

ReactDOM.render(<GrandFather />, document.getElementById('root'));
```