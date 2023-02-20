---
autoGroup-1: React
sidebarDepth: 3
title: 11. 代码分割
---

## 代码分割
在打包的过程中，会整体打包成一个`bundle`的一个`JS`文件。但是会有一些代码、模块是加载的时候不需要的，我们希望有一些模块在需要的时候再去加载，因此将这些模块分割出来，单独形成一个块（`chunk`）

好处：
1. 模块懒加载
2. 减少应用体积
3. 减少加载时的体积

## import
`import`导入模块：`import`是一个`ES6`的模块化关键字，不是一个函数，它分为静态的导入（`static import`）`import xxx from 'xxx'`和动态导入（`dynamic import`）`import('xxx')`。

`import`是可以被调用的，但是它和普通的函数是不一样的，`import`不是一个对象，它是一个关键字`import xxx/ import(xxx)`类似`typeof(xxx)/ typeof xxx`

区别：
- `static import` 是模块的静态导入，特点是导入并加载时，导入的模块会被编译，不是按需编译
- `dynamic import` 模块的动态导入，根据条件或按需的模块导入

`dynamic import`应用场景：
1. 模块太大，使用可能性很低的模块，这些模块不需要马上加载
2. 模块的导入占用了大量的系统内存
3. 模块需要异步获取
4. 导入模块时需要动态的构建路径（说明符） 
5. 动态说明符：`import ('./' + a + b + '.js')`。路径前面一定要加 './'。
6. 静态说明符：`static import`只支持静态说明符。不支持`import xxx from './'+ a + b + '.js`
7. 模块中的代码需要程序触发了某些条件才能运行的

> 为什么不能滥用动态加载

因为静态导入是有利于初始化依赖的，静态的程序分析或`tree shaking`动态导入是难以工作的。

使用`import`的要求：
- 如果使用`create react app`的方式创建工程是直接可以使用动态导入`import()`
- 如果手动做`webpack`的配置时，查看`webpack`代码分割的指南
- 如果使用`babel`解析`import()`时，安装依赖`@babel/plugin-syntax-dynamic-import` 


## lazy
`React.lazy`方法，`Suspense`是`React`内置组件，挂载到`React`。

> `lazy`是什么？

`lazy`是`React`提供给开发者的懒（动态）加载组件的方法`React.lazy`（参数：函数必须接收一个支持`Promise`的动态导入组件），好处是减少打包体积，对初次渲染不适用的组件延迟加载，它依赖一个内置组件Suspense，给lazy加上loading提示组件的一个容器组件。
```javascript
// loading.jsx
class Loading extends React.Component {
    render() {
        return (
            <div>Loading...</div>
        )
    }
}

export default Loading;

//main.jsx
class Main extends React.Component {
  render(){
    return <div>Main</div>
  }
}

export default Main;

// App.jsx
import Loading from './loading.jsx';
//lazy接收一个动态导入组件的函数
//该函数返回一个Promise
//Promise会resolve一个默认导出的React组件如export default xxx;
//Suspense目前只和lazy配合实现组件等待加载指示器的功能
//服务端渲染不支持,改用loadable Components
const MainComponent = React.lazy(() => import('./main.jsx'));

class App extends React.Component { 
  render(){
    return (
      <React.Suspense fallback={ <Loading /> }>
        <div>
          <MainComponent />
        </div>
      </React.Suspense>
    );
  }
}
```

## 路由懒加载
```javascript
//入口文件
//安装
npm i react-router -S 
npm i react-router-dom -S 

//导入浏览器路由
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
```
```javascript
//App.js 
// react-router v5.0
import { Switch,Route } from 'react-router';
render(){
  return (
    <Suspense fallback = { <Loading /> }>
      <div className="app">
        <Switch>
          <Route path="/page1" component={ lazy(() => import('./views/Page1')) } />
          <Route path="/page2" component={ lazy(() => import('./views/Page2')) } />
          <Route path="/page2" component={ lazy(() => import('./views/Page3')) } />
        </Switch>
      </div>
    </Suspense>
  );
}

// react-router v6.0
import { Route, Routes } from 'react-router'
class App extends Component {
  render() {
    return (
      <Suspense fallback={<Loading />}>
        <div className='app'>
          <Routes>
            <Route path="/page1" element={lazy(() => import('./views/page1.jsx'))}></Route>
            <Route path="/page2" element={lazy(() => import('./views/page2.jsx'))}></Route>
            <Route path="/page3" element={lazy(() => import('./views/page3.jsx'))}></Route>
          </Routes>
        </div>
      </Suspense>
    );
  }
}
```


## 命名导出
`lazy`只支持默认导出(`default exports`)。如果想被引用的模块使用命名导出（`named exports`），可以创建一个中间模块，来重新导出为默认模块。
```javascript
export {
    Test1
};
// Uncaught (in promise) TypeError: Cannot convert object to primitive value
```
命名路由的使用
```javascript
// Components.jsx 
// 有多个export 组件，但是没有default export
class Test1 extends React.component{}
class Test2 extends React.component{}
export{
  Test1
}

// Test1.jsx
// 创建中间件使之成为default export组件
export {
    Test1 as default,
} from './Components.jsx'

// App.jsx
// 在React.lazy中传入这个default export组件
const Test1Component = React.lazy(()=>import('./Test1.jsx'))
```
