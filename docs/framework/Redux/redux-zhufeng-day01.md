---
autoGroup-1: Redux
sidebarDepth: 3
title: Redux(珠峰)
---

## 1. Redux应用场景

- 随着Javascript单页应用开发日趋复杂，管理不断变化的state非常困难
- Redux的出现就是为了解决state李的数据问题
- 在Redux中，数据在组件中式单向流动的
- 数据从一个方向父组件流向子组件（通过props），由于这个特征，两个非父子关系的组件（或者称为兄弟组件）之间的通信就比较麻烦

基本实现：

1. state就是状态
2. getState()获取状态
3. dispatch(action)派发动作，动作是一个对象，必须有一个type属性，表示动作的类型
4. subscribe(listener)订阅状态变化事件
5. dispatch({type: 'INCREMENT'})初始化状态


```javascript
/**
 * 创建仓库的工厂方法，返回一个仓库，仓库就是一个JS对象，包含了应用的状态和一些方法
 * @param {*} reducer 根据老状态和动作计算下一个新状态
 */

export const createStore = (reducer)=>{
    let state; // 可以存放任意的内容
    let listeners = [];
    function getState(){
        return state;
    }
    function dispatch(action){
        state = reducer(state, action);
        listeners.forEach(listener=>listener());
    }
    function subscribe(listener){
        listeners.push(listener);
    }
    dispatch({type: '@@REDUX/INIT'})
    return {
        getState,
        dispatch,
        subscribe
    }
}
```

## 2. Redux的基本使用

目录结构：

```javascript
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    ├── components
    │   └── Counter1.js
    ├── index.js
    ├── redux
    │   └── index.js
    └── store
        └── index.js
```

1. 组件挂载完成后，触发store.subscribe()方法，将回调函数放入listeners数组中
2. 点击“+” 会触发 dispatch方法，执行回调函数

:::: tabs
::: tab index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter1 from './components/Counter1';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Counter1/>
  </React.StrictMode>
);
```
:::
::: tab store/index.js
```javascript
import {createStore} from '../redux';
/**
 * 处理器函数
 * @param {*} state 老状态
 * @param {*} action 动作对象，也是一个普通的JS对象，必须有一个type属性，用来标识你要做什么
 */
let initialState = { number:0}
function reducer(state=initialState, action){
  switch(action.type){
    case 'ADD':
      return {number: state.number+1};
    case 'MINUS':
      return {number: state.number-1};
    default:
      return state;
  }
}

let store = createStore(reducer);

export default store;
```
:::   
::: tab components/Counter1.js
```javascript
import React from 'react'
import store from '../store'

class Counter1 extends React.Component{
    state = {
        number: 0
    }
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>{
            this.setState({
                number: store.getState().number
            })
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={()=> store.dispatch({type: 'ADD'})}>+</button>
                <button onClick={()=> store.dispatch({type: 'MINUS'})}>-</button>
            </div>
        )
    }
}

export default Counter1;
```
:::   
::: tab redux/index.js
```javascript

/**
 * 创建仓库的工厂方法，返回一个仓库，仓库就是一个JS对象，包含了应用的状态和一些方法
 * @param {*} reducer 根据老状态和动作计算下一个新状态
 */

export const createStore = (reducer)=>{
    let state; // 可以存放任意的内容
    let listeners = [];
    function getState(){
        return state;
    }
    function dispatch(action){
        state = reducer(state, action);
        listeners.forEach(listener=>listener());
    }
    function subscribe(listener){
        listeners.push(listener);
        return ()=>{
            // listeners = listeners.filter(item=>item!==listener); // 取消订阅listener
            let index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    }
    dispatch({type: '@@REDUX/INIT'})
    return {
        getState,
        dispatch,
        subscribe
    }
}
```
:::   
::::


## bindActionCreators

就是将actionCreator和dispatch绑定在一起，返回一个新的函数，新的函数可以直接调用dispatch

- 使用方式有两种：
  - 第一个参数是对象，里面有多个actionCreator
  - 第一个参数是actionCreator

```javascript
<button onClick={()=> store.dispatch({type: 'ADD'})}>+</button>
// 变成下面的写法
 <button onClick={bindActions.add}>+</button>
```

```javascript
// 用来创建action的工厂函数actionCreator，返回action
function add(){
    return {type: 'ADD'}
}
function minus(){
    return {type: 'MINUS'}
}

const actions = {add, minus};

// bindActionCreaters的使用：
// 1. 第一个参数是对象
const bindActions = bindActionCreators(actions, store.dispatch);// 将action和dispatch绑定在一起
//2. 第一个参数是个函数
const bindAdd = bindActionCreators(add, store.dispatch);
const bindMinus = bindActionCreators(minus, store.dispatch);

// 组件中使用
<button onClick={bindActions.add}>+</button>
<button onClick={bindActions.minus}>-</button>

<button onClick={bindAdd}>+</button>
<button onClick={bindMinus}>-</button>
```

bindActionCreaters的实现：

```javascript
/**
 * 传入老的actionCreator，返回一个新的actionCreator。{type: 'ADD'}
 * @param {*} actionCreator 
 * @param {*} dispatch 
 * @returns 
 */
function bindActionCreator(actionCreator, dispatch){
    // 返回一个函数，这个函数会调用actionCreator，然后将结果传递给dispatch
    return function(...args){
        return dispatch(actionCreator.apply(this, args))
    }
}

/**
 * 绑定action的创建者和dispatch
 * 1. 创建一个对象boundActionCreators, 最后返回的就是这个对象
 * 2. 遍历actionCreators，得到每个actionCreator.对每个actionCreator调用bindActionCreator进行绑定，
 * @param {*} actionCreators action的创建者对象 {add：add函数, minus：minus函数}
 * @param {*} dispatch 派发动作的方法
 */
const bindActionCreators = (actionCreators, dispatch)=>{
    if(typeof actionCreators === 'function'){ // actionCreators是个函数
        return bindActionCreator(actionCreators, dispatch);
    }
    // actionCreators是个对象
    const boundActionCreators = {};
    for(const key in actionCreators){
        const actionCreator = actionCreators[key]; // key = add minus，actionCreator = add函数 minus函数
        if(typeof actionCreator === 'function'){// 如果是函数
            // bindActionCreator返回一个函数，就是返回dispatch({type: 'ADD'}}})
            // 得到的结果就是：{add: ()=>dispatch({type: 'ADD'}})}
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    }
    return boundActionCreators;
}
export default bindActionCreators;
```

## combindReducers

可能会有很多的组件，每个组件都有自己的状态和动作。规定redux只能有一个仓库，只能有一个reducer，只有一个状态，放在一起会很混乱。因此我们需要将reducer放在不同的文件夹中，然后再使用combindReducers将所有的reducer连接起来组成一个reducers，然后再创建仓库的时候传入这个reducers。

```javascript
/**
 * 合并reducers
 * @param {*} reducers 对象，里面有很多reducer {counter1: reducer1, counter2: reducer2}
 */
const combineReducers = reducers => {
    // 调用时传入老状态state和动作对象action，返回合并后的新reducer
    return function combineReducer(state={},action){
        let nextState = {};
        for(let key in reducers){
            // nextState['counter1']=counter1(counter1State, action)
            nextState[key] = reducers[key](state[key], action);// 调用counter1的reducer，根据action={type:..}得到新的状态
        }
        return nextState;
    }
    /**
     * nextState = {
     *  counter1: {number: 0},
     *  counter1: {number: 0},
     * }
     */
}
export default combineReducers;
```

store中使用

```javascript
import {createStore} from '../redux';
import combinedReducers from './reducers';

let store = createStore(combinedReducers);

export default store;
```

组件中使用

```javascript
import React from 'react'
import store from '../store'
import {bindActionCreators} from 'redux'
import actions from '../store/actions/counter2'

// 第一个参数是对象
const bindActions = bindActionCreators(actions, store.dispatch);// 将action和dispatch绑定在一起

class Counter1 extends React.Component{
    state = {
        number: 0
    }
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>{
            this.setState({
                number: store.getState().counter2.number
            })
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                <p>{this.state.number}</p>
                {/* <button onClick={()=> store.dispatch({type: 'ADD'})}>+</button> */}
                <button onClick={bindActions.add2}>+</button>
                <button onClick={bindActions.minus2}>-</button>
            </div>
        )
    }
}

export default Counter1;
```

## react-redux

react-redux是一个react的插件，用来连接react和redux的，主要解决代码冗余的问题，

现在每个文件中都引入需要action、bindActions
```javascript
import {bindActionCreators} from '../redux'
import actions from '../store/actions/counter1'

const bindActions = bindActionCreators(actions, store.dispatch);// 将action和dispatch绑定在一起
```

组件在使用仓库的时候：

1. 输入。从仓库的装呀中获取状态，在组件中进行显示
2. 输出。可以在组件中派发动作，修改仓库中的状态。

它提供了Provider和connect，Provider用来向组件提供仓库，connect用来连接组件和仓库。

### 使用

引入Provider和store，然后在根组件中使用Provider包裹，将store传入Provider中。

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter1 from './components/Counter1';
import Counter2 from './components/Counter2';
import { Provider } from './react-redux';
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Counter1/>
    <Counter2/>
  </Provider>
);
```

在组件中引入connect，执行connect并将组件传入，返回一个新的组件，这个新的组件就是连接了仓库的组件。

```javascript
import React from 'react'
import actions from '../store/actions/counter1'
import {connect} from './react-redux'

class Counter1 extends React.Component{
    render(){
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add1}>+</button>
                <button onClick={this.props.minus1}>-</button>
            </div>
        )
    }
}
// 输入：把仓库中的状态输入到组件中
// 传入state总状态，返回新的状态，state.counter1将会成为Counter1组件的属性对象
const mapStateToProps = (state) => state.counter1;

// 输出：把动作进行派发到仓库中，改变状态的值
// 经过绑定后，也会成为Counter1的属性对象
const mapDispatchToProps = actions;
// Counter1.props = {...state.counter1, ...actions}
// connect执行两次，传入参数mapStateToProps和mapDispatchToProps
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter1);
```