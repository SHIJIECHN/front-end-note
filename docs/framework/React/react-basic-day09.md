---
autoGroup-1: React
sidebarDepth: 3
title: 父子组件通信和状态提升
---

## 状态提升
两个组件（无父子关系）共享一个数据并且同步数据变化。

单项数据流：
- 数据的流动都是从父到子通过`props`向下传递
- 关键点：`props`是只读属性，不能去操作，它对应的数据操作交给父组件完成，数据由父组件管理
- 状态提升：本应该是子组件的数据的状态交给父组件来保存，然后通过`props`传递给子组件

> 如何解决两个组件需要共享同一状态并且状态同步的情况

```javascript
// 类组件调用(实例化)的时候，组件内部的状态是独立且唯一的
// 组件一
class Info extentds React.Component { 
  // 业务逻辑1 
}

// 组件二
class UserNameInput extentds React.Component {
  // 业务逻辑2
  
  // 使用了组件1
  render(){
    return (
      <Info />
    );
  }
}

//父组件
class App extends React.Component { 
  //使用了两次组件2
  render(){
    return (
      // 向各自的子组件传值
      // 这样传值结果是：两个组件的state状态数据是不同步的，相互独立的
      <UserNameInput inputNum={ 1 }/>
      <UserNameInput inputNum={ 1 }/>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

总结：
1. 类组件调用（实例化）的时候，组件内部的状态时唯一且独立的
2. 组件嵌套与调用，和类组件还是函数组件没有关系
3. 类组件与函数组件相互是可以调用的
4. 将子组件定义的状态提升到父组件去传值使用，实现两个组件同一状态同步

## 组件通信
### 1. 父传子
提供要传递的`state`数据，在子组件绑定属性即可

### 2. 子传父
利用回调函数，父组件提供回调，子组件调用，将要传递的数据作为回调函数的参数
1. 父组件提供一个回调函数（用于接收数据）
2. 将该函数作为属性的值，传递给子组件
3. 子组件通过props调用回调函数
```javascript
class Father extends React.Component{
  //1.定义父组件的回调函数方法
  getChildMsg = (msg) => {
    console.log('接收到子组件的数据', msg);
  }
  
  render(){
    return(
      //2.将整个回调函数传递给子组件
      <Child getChildMsg={this.getChildMsg} />
    );
  }
}

class Son extends React.Component{
  state = { childMsg: '子组件私有数据' }
  
  handleClick = () => {
    //通过`props`调用回调函数
    return this.props.getChildMsg(this.state.childMsg);
  }
  
  render(){
    return(
      //3.执行自己的方法
      <button onClick="this.handleClick">点击</button>
    );
  }
}
```

### 3. 兄弟传
将共享状态数据提升到最近的公共父组件中，由公共父组件管理这个状态（状态提升思想）

公共父组件负责：
1. 提升共享状态
2. 提供操作共享状态的方法

要通信的子组件只需要通过`props`接收状态或操作状态的方法
```javascript
class Counter extends React.Componet{
  //提供共享状态
  state = { count: 0 }
  
  //提供修改状态的方法
  onIncrement = () => { ... }
  
  render(){
    return (
      <div>
        <Child1 count={this.state.count} />
        <Child2  onIncrememnt={this.onIncrement} />
      </div>
    );
  }
}

const Child1 = props => { 
  return <h1>计算器:{props.count}</h1> 
};

const Child2 = props => { 
  return (
    <button onClick = {() => props.onIncrememnt()}>+1</button>
  )
};
```