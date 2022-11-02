---
autoGroup-2: Hook
sidebarDepth: 3
title: useRef
---

## useRef
用法与类组件中的ref相同。

> 注意：默认情况下给函数组件设置ref会报错。
>  Uncaught Error: Function components cannot have string refs. We recommend using useRef() instead.

```javascript
import React, { useRef } from 'react';

const Foo = () => {
  return <input type="text" />;
}

class App extends React.Component {
  inputRef = createRef();

  render() {
    return (
      <div>
        //默认情况下给组件写ref会报错
        //ref没有办法去通过函数组件的方式引用函数组件
        <Foo ref={this.inputRef} />
      </div>
    );
  }
}
```

解决方法：

通过forwardRef方法给子函数组件包裹实现ref转发可以实现

```javascript
const Foo = forwardRef((params) => {
  return <input type="text" />;
});
```

> forwardRef方法是如何实现ref引用问题？

ref可以指向引用，也可以指向原生DOM，也可以是子类组件，但函数组件无法指向。forwardRef可以实现转发ref。

```js
const Foo = forwardRef((params, inputRef) => {
  // console.log(inputRef);
  //{current: null}

  return <input type="text" ref={inputRef} />;
});

class App extends React.Component {
  inputRef = createRef();

  onClick() {
    console.log(this.inputRef.current);
    //获取子组件的视图元素<input type="text" />
  }

  render() {
    return (
      <div>
        <Foo ref={this.inputRef} />
        <button onClick={this.onClick.bind(this)}>button</button>
      </div>
    );
  }
}
```

## useRef写法
当父子组件都为函数组件时，useRef写法更为精简。
```javascript
const App = () => {
  //createRef和useRef写法效果一样
  //区别：
  //1.类组件和函数组件都可以可以用createRef
  //2.但是类组件中不可以使用钩子useRef
  //3.在函数组件中useRef钩子比createRef性能优化更好些
  //const inputRef = createRef();
  const inputRef = useRef();

  const onClick = () => {
    console.log(inputRef.current);
    //获取子组件的视图元素<input type="text" />
  };

  return (
    <div>
      <Foo ref={inputRef} />
      <button onClick={onClick}>button</button>
    </div>
  );
};
```
