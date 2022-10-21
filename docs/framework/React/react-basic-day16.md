---
autoGroup-1: React
sidebarDepth: 3
title: Refs（一）
---

## Refs的应用
Refs提供了一种方式允许我们访问真实DOM。

React的数据流是通过props来实现父子组件的交互，在特殊情况下，Refs允许我们用于强制修改子组件。

### 1. 管理Input的聚焦、内容选择
通过一个按钮，清空input value，然后input聚焦
```js
class MyInput extends React.Component{
  constructor(props){
    super(props);
    // 1. 创建一个ref引用值
    this.inputRef = React.createRef();
  }

  inputOperating(){
    // 3. 获取到节点。通过current来访问DOM节点
    const oInput = this.inputRef.current;
    oInput.focus(); // 操作节点
  }

  render(){
    return(
      <div>
          <input
              type="text"
              // 2. input中使用ref。将ref关联到构造器里创建的inputRef
              ref={this.inputRef}
              // ...
          />
          <button onClick={this.inputOperating.bind(this)}>操作INPUT</button>
      </div>
    )
  }
}
```

### 2. 视频媒体播放
按钮控制媒体的播放和暂停
```javascript
class MyVideo extends React.Component{
  constructor(props){
    super(props);
    // 1. 创建引用值
    this.videoRef = React.createRef();
  }

  videoPlay(){
    // 3. 通过ref获取节点
    this.videoRef.current.play();
  }
  
  render(){
    return(
      <div>
          <video
              // 2. 使用ref
              ref={this.videoRef}
              controls
              // ...              
          />
          <button onClick={this.videoPlay.bind(this)}>Play</button>
      </div>
    )
  }
}
```
### 3. JS强制动画与集成第三方DOM库JQuery
通过按钮控制div大小展示，并引入JQuery库。

```javascript
class MyBox extends React.Component{
  constructor(props){
    super(props);
    // 1. 创建引用值
    this.boxRef = React.createRef();
  }
  boxExtends(){
    // 3. 获取节点
    const oBox = this.boxRef.current;
    // 使用JQuery
    const $box = $(this.boxRef.current)
  }

  render(){
    return(
      <>
        <div
          ref={this.boxRef}
          // ...
        />
        <button onClick={this.boxExtends.bind(this)}>Extend</button>
      </>
    )
  }
}
```

> 是不是所有情况都适合Refs呢？

控制模态框打开关闭不适合使用Refs。

## 控制模态框
采用ref的方式控制模态框
```javascript
// Modal.jsx
class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        /**
         * 如果使用Modal的时候传入了onRef方法，就给onRef传入当前this
         * 也就是说onRef的参数就是当前的组件本身，也就是当前的类的实例，
         * 这个实例就是可以访问open和close
         */
        if (props.onRef) {
            props.onRef(this);
        }
    }
    // 打开模态框
    open() {
        this.modalRef.current.style.display = "block"
    }
    // 关闭
    close() {
        this.modalRef.current.style.display = "none"
    }
    render() {
        return (
            <div
                style={{
                    width: 300 + 'px',
                    border: '1px solid #000',
                    display: 'none'
                }}
                ref={this.modalRef}
            >
                <h1>This is a Modal</h1>
                <p>This is a super Modal.</p>
            </div>
        )
    }
}

// App.jsx
class App extends React.Component{
  modalOpen(){
    switch (status) {
    case 'open':
      // 实例调用组件内的open方法
        this.modal.open();
        break;
    case 'close':
        this.modal.close();
        break;
    default:
        break;
}
  }
  render(){
    return(
      <div>
        {/* onRef是个函数，接收到的参数是组件的实例 */}
        <Modal onRef={(instance)=>this.modal = instance }/>
        <button onClick={() => this.modalOpen('open')}>open</button>
        <button onClick={() => this.modalOpen('close')}>close</button>
      </div>
    )
  }
  
}
```
Modal中的open和close实际上是给使用Modal的组件调用的，那父组件怎么调用Modal中的open和close方法呢？

通过父组件传入onRef方法，方法接受的参数是组件的实例。

> 能不能使用state呢？

上面的做法不合理。考虑status成一个状态，用这个状态控制Modal显示与否。在Modal中不写open和close方法，利用外界传过来的props里面的isOpen状态，来判断是否显示Modal。本身isOpen状态应该是Modal的，但是让给了父组件，这叫做状态提升。

完全是可以状态去控制组件的一些样式，特别是隐藏、显示之类的，包括显示的内容，可以将本身属于子组件里面的状态，让父组件做一次状态的提升，这样的话组件的可配置性更高。
```javascript
class Modal extends React.Component {
    render() {
        return (
            <div
                style={{
                    width: 300 + 'px',
                    border: '1px solid #000',
                    display: this.props.isOpen ? 'block' : 'none'
                }}
            >
                <h1>This is a Modal</h1>
                <p>This is a super Modal.</p>
            </div>
        )
    }
}

class App extends React.Component {
    // isOpen 控制
    state = {
        isOpen: false
    }
    modalOpen(status) {
        this.setState({
            isOpen: status === 'open' ? true : false
        })
    }
    render() {
        return (
            <div>
                <Modal isOpen={this.state.isOpen} />
                <button onClick={() => this.modalOpen('open')}>open</button>
                <button onClick={() => this.modalOpen('close')}>close</button>
            </div>
        )
    }

}
```
避免使用refs来做任何可以通过声明式实现来完成的事请。

### 总结
Refs的使用场景：
1. input组件焦点控制
2. 视频播放
3. 使用JS进行动画控制
4. 第三方库Jquery使用