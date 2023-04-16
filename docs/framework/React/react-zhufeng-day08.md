---
autoGroup-4: React基础
sidebarDepth: 3
title: PureComponent
---

## PureComponent

- PureComponent是一个组件类，它和Component的区别是：
  - Component每次状态或者属性发生改变都会更新
  - PureComponent重写了shouldComponentUpdate方法，只有状态或者属性发生改变才会更新
- PureComponent是浅比较，只比较一层，如果状态或者属性是一个对象，那么只比较对象的引用地址，如果是同一个对象，那么就不会更新

```javascript
export class PureComponent extends Component {
  // PureComponent重写shouldComponentUpdate方法，只比较状态和属性
  shouldComponentUpdate(nextProps, nextState) {
    // 比较老属性和新属性，比较老状态和新状态，如果有任何一个不相等，就返回true，否则返回false
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }
}

/**
 * 比较两个对象是否相等
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns 
 */
export function shallowEqual(obj1={}, obj2={}){
  if(obj1 === obj2) return true; // 如果两个对象是同一个对象，那么肯定相等
  if(typeof obj1 !== 'object' || obj1 === null) return false; // 如果obj1不是对象或者是null，那么肯定不相等
  if(typeof obj2 !== 'object' || obj2 === null) return false; // 如果obj2不是对象或者是null，那么肯定不相等

  let keys1 = Object.keys(obj1);// 获取obj1的所有key
  let keys2 = Object.keys(obj2); // 获取obj2的所有key
  if(keys1.length !== keys2.length) return false; // 如果两个对象的key的个数不一样，那么肯定不相等
  for(let key of keys1){ // 遍历obj1的所有key
    if(!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]){ // 如果obj2没有这个key，或者obj1和obj2的这个key对应的值不一样
      return false; 
    }
  }
  return true;
}
```
```javascript
import React from './react';
import ReactDOM from './react-dom';

// 新状态和老状态如果是同一个对象，那么就不会更新
// PureComponent重写了shouldComponentUpdate方法，只有状态或者属性发生改变才会更新

class SubCounter extends React.PureComponent{
  render(){
    console.log('SubCounter render');
    return <div>{this.props.count}</div>
  }
}

class Counter extends React.PureComponent{
  state = { number: 0};
  inputRef = React.createRef();
  handleClick = (event)=>{
    // this.inputRef.current.value如果是数字，就转成数字，如果不是数字，就转成0
    let amount = isNaN(this.inputRef.current.value) ? 0 : parseInt(this.inputRef.current.value);
    this.setState({ number: this.state.number + amount })
  }
  render(){
    console.log('Counter render');
    return(
      <div>
        <p>{this.state.number}</p>
        <input ref={this.inputRef} type="text"/>
        <button onClick={this.handleClick}>+</button>
        <SubCounter count={this.state.number}/>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

## React.memo

- React.memo是一个函数，它的作用和PureComponent一样，只有状态或者属性发生改变才会更新
- React.memo里面可以入一个比较函数，可以自定义比较规则。如果不传，就是浅比较。比较返回如果返回true，就不更新，如果返回false，就更新。

### 1. 基本使用

- 子组件使用React.memo包裹，当父组件更新时，子组件需要比较新旧props，查看props是否发生改变，如果发生改变才会更新，否则不更新

```javascript

import React from './react';
import ReactDOM from './react-dom';

function SubCounter(props){
  console.log('SubCounter render');
  return <div>{props.count}</div>
}
// React.memo里面可以入一个比较函数，可以自定义比较规则。如果不传，就是浅比较。
// 如果返回true，就不更新，如果返回false，就更新
// let MemoSubCounter = React.memo(SubCounter, (prevProps, nextProps)=>{
//   return JSON.stringify(prevProps) === JSON.stringify(nextProps); // 深比较
// });

let MemoSubCounter = React.memo(SubCounter);
console.log(MemoSubCounter);// {$$typeof: Symbol(react.memo), compare: null, type: ƒ SubCounter(props)}

class Counter extends React.Component{
  state = {number: 0};
  inputRef = React.createRef();
  handleClick = (event)=>{
    // this.inputRef.current.value如果是数字，就转成数字，如果不是数字，就转成0
    let amount = isNaN(this.inputRef.current.value) ? 0 : parseInt(this.inputRef.current.value);
    this.setState({ number: this.state.number + amount })
  }
  render(){
    console.log('Counter render');
    return(
      <div>
        <p>{this.state.number}</p>
        <input ref={this.inputRef} type="text"/>
        <button onClick={this.handleClick}>+</button>
        <MemoSubCounter count={this.state.number}/>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

### 2. 实现

```javascript
// React.memo
/** memo方法 */
function memo(FunctionComponent, compare) {
  return {
    $$typeof: REACT_MEMO,
    type: FunctionComponent,
    compare: compare || shallowEqual // 比较函数，默认是shallowEqual
  }
}

// 组件挂载的时候，如果是memo组件，就调用mountMemoComponent方法
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if(type && type.$$typeof === REACT_MEMO){
    return mountMemoComponent(vdom); // 如果是memo组件，就调用mountMemoComponent方法
  }
  // other code
}

/**
 * memo组件挂载
 * @param {*} vdom 
 * @returns 
 */
function mountMemoComponent(vdom){
  let {type,props} = vdom;
  let newRenderVdom = type.type(props); // type={$$typeof:Symbol(react.memo),compare:null,type:xxx}
  vdom.prevProps = props; // 保存旧的props，在更新的时候会用到
  vdom.oldRenderVdom = newRenderVdom;
  return createDOM(newRenderVdom);
}


// 组件更新的时候，如果是memo组件，就调用updateMemoComponent方法
function updateElement(oldVdom, newVdom) {
  // type类型：文本组件、原生组件、类组件、函数组件、forwardRef组件、provider组件、consumer组件、memo组件
  if(oldVdom.type&&oldVdom.type.$$typeof === REACT_MEMO){
    updateMemoComponent(oldVdom, newVdom)
  }else if(/** other code */){
    // other code
  }
}

/**
 * memo组件更新: 比较新旧属性是否相等，如果相等就不更新，如果不相等，就更新
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateMemoComponent(oldVdom, newVdom){
  let {type, prevProps} = oldVdom; 
  if(type.compare(prevProps, newVdom.props)){ // 比较新旧属性是否相等，如果相等就不更新
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    newVdom.prevProps = newVdom.props; 
  }else{ // 如果不相等，就更新
    let parentDOM = findDOM(oldVdom).parentNode;// 老的真实DOM的父节点
    let { type, props } = newVdom; // type是Memo组件，props是Memo组件的属性
    let renderVdom = type.type(props); // type.type是Memo组件的返回值，是一个函数
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.prevProps = props; // 将新的属性赋值给newVdom.prevProps
    newVdom.oldRenderVdom = renderVdom;
  }
}
```