---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 【MVVM专题】认识和实现MVVM轮子（1）
---

## 准备工作与目录结构
1. 安装vite：yarn add vite   
2. 修改package.json 
```json
"scripts": {
    "dev": "vite"
},
```
3. 创建index.html与文件夹src


文件目录结构
```powershell
│   index.html
│   package.json
│   yarn.lock
│
├───MVVM
│   │   index.js
│   │   render.js                 useDOM
│   │
│   ├───compiler                  编译模板template
│   │       event.js              处理事件
│   │       state.js              处理template中的{{}}
│   │
│   ├───reactive                  响应式数据
│   │       index.js              数据代理
│   │       mutableHandler.js     Proxy代理处理函数
│   │
│   └───shared
│           utils.js              工具函数
│
└───src
        App.js
```

## MVC缺点
驱动被MVC分离成三部分，跟我们普通的 M V的逻辑混合在一起了。   
MVVM: 实现驱动VM -> 叫ViewModel。帮我们干什么呢？<br> M层 -> Model  数据保存和处理的层，里面保存了data还有协议处理的问题，也就是逻辑，事件处理函数。<br>V层 -> 视图。<br>也就是VM想做的事情就是，Vue想改变数据，通过VM，M要驱动视图的更新也要经过VM。<br>Model -> Data Bindings（数据绑定） -> View <br>View -> DOM Listeners -> Model

## 主函数
### useDOM函数
创建一个应用。App()返回HTML完整的模板，放到app里面去。
```javascript
useDOM(
    App(), // template, state, methods 返回完整的模板
    document.querySelector("#app") // 挂载到app
);
```

### App函数
返回一个对像
```javascript
{ 
    template, 
    methods, 
    state
}
```

## 响应式数据
useReactive创建响应式数据。
```javascript
const state = useReactive({
    count: 0,
    name: "XiaYe",
});
```
数据代理，对useReactive中传入的对象进行代理，目标：
- 第一点用state能直接访问到count。
- 第二点就是在我更新的时候，我希望视图帮我更新。


### reactive/index.js
```javascript
import { mutableHandler } from "./mutableHandler.js";

export function useReactive(target) {
  return createReactObject(target, mutableHandler);
}

/**
 * 数据代理
 * @param target
 * @param baseHandler Proxy里面需要的get set 需要单独定义
 * @returns {*}
 */
function createReactObject(target, baseHandler) {
  // 判断target是不是对象，不是一个对象，return它本身
  if (!isObject(target)) {
    return target;
  }

  return new Proxy(target, baseHandler);
}
```

### reactive/mutableHandler.js
```javascript
/**
 * createGetter() 和 createSetter()执行后返回函数
 */
const get = createGetter(),
  set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    // ...
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    // ...
  };
}

/**
 * get set是两个函数
 */
const mutableHandler = {
  get,
  set,
};

export { mutableHandler };
```
为什么把Proxy分开写？<br>
因为mutableHandler里面扩展的业务非常多的，单独的写一个文件好扩展。get，set为什么返回一个函数？因为在createGetter return之前可能要做很多事情，里面还传递很多参数，还需要一些函数。

## 模板编译
compiler
- event.js
- state.js


