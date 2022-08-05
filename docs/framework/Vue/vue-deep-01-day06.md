---
autoGroup-2: Vue深度学习系列
sidebarDepth: 3
title: 6. 【MVVM专题】认识和实现MVVM轮子
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
inex.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Document</title>
</head>

<body>
    <div id="app"></div>

    <!--vite要求script为module-->
    <script src="./src/App.js" type="module"></script>
</body>

</html>
```
App.js
```javascript
import { useDOM, useReactive } from "../MVVM";

// 返回一个对象{ template, methods, state}
function App() {
    // 创建响应式数据
    const state = useReactive({
        count: 0,
        name: "XiaYe",
        school: {
            name: {
                one: 'yan'
            }
        }
    });

    // 事件处理函数
    const add = (num) => {
        state.count += num;
    };

    const minus = (num) => {
        state.count -= num;
    };

    const changeName = (name) => {
        state.name = name;
    };

    return {
        template: `
    <h1>{{ count }}</h1>
    <h2>{{ name }}</h2>
    <h2>{{ school.name.one}}</h2>
    <button onClick="add(2)">+</button>
    <button onClick="minus(1)">-</button>
    <button onClick="changeName('小野')">Change Name</button>
  `,
        state,
        methods: {
            add,
            minus,
            changeName,
        },
    };
}

// useDOM函数创建一个应用，App()返回HTML完整的模板，放到app里面去
useDOM(
    App(), // template, state, methods 返回完整的模板
    document.querySelector("#app") // 挂载到app
);
```


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
### 1. useDOM函数
创建一个应用。App()返回HTML完整的模板，放到app里面去。
```javascript
useDOM(
    App(), // template, state, methods 返回完整的模板
    document.querySelector("#app") // 挂载到app
);
```
useDOM函数使用render函数处理template和state。   
MVVM/render.js
```javascript
/**
 * 函数创建一个应用。App()返回HTML完整的模板，放到app里面去。
 * @param { template, state, methods } App函数返回的对象
 * @param rootDOM #app节点
 */
export function useDOM({ template, state, methods }, rootDOM) {
    // 用render处理template和state
    // 需要把state里面的数据替换到template中去
    rootDOM.innerHTML = render(template, state);
    bindEvent(methods);
}
``` 


### 2. App函数
返回一个对像
```javascript
{ 
    template, 
    methods, 
    state
}
```

## 渲染函数与更新
MVVM/render.js
```javascript
import { eventFormat, stateFormat } from ".";
import { bindEvent } from "./compiler/event";

/**
 * 函数创建一个应用。App()返回HTML完整的模板，放到app里面去。
 * @param { template, state, methods } App函数返回的对象
 * @param rootDOM #app节点
 */
export function useDOM({ template, state, methods }, rootDOM) {
    // 用render处理template和state
    // 需要把state里面的数据替换到template中去
    rootDOM.innerHTML = render(template, state);
    // 绑定事件处理函数
    bindEvent(methods);
}

/**
 * 处理template两件事：需要处理{{}} 和 template中事件onClick="minus(2)"
 * @param template App函数的template模板
 * @param state App中定义的响应式数据
 * @returns {*}
 */
export function render(template, state) {
    // 处理事件， state数据替换{{}}
    template = eventFormat(template);
    template = stateFormat(template, state);
    return template;
}

/**
 * 更新，数据发生变化时，模板需要更新
 * @param {*} statePool 
 * @param {*} key 
 * @param {*} value 
 */
export function update(statePool, key, value) {
    const allElement = document.querySelectorAll("*"); // 所有标签
    let oItem = null;

    statePool.forEach((item) => {
        if (item.state[item.state.length - 1] === key) {
            for (let i = 0; i < allElement.length; i++) {
                oItem = allElement[i];
                const _mark = parseInt(oItem.dataset.mark);

                if (item.mark === _mark) {
                    oItem.innerHTML = value;
                }
            }
        }
    });
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


### 1. reactive/index.js
```javascript
import { isObject } from "../shared/utils.js";
import { mutableHandler } from "./mutableHandler.js";

export function useReactive(target) {
  // 数据代理
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

  // 如果是一个对象, 就初始化 观察者
  const observer = new Proxy(target, baseHandler);
  return observer;
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
完整代码如下
```javascript
import { hasOwnProperty, isEqual, isObject } from "../shared/utils.js";
import { useReactive } from "./index.js";
import { update } from "../render";
import { statePool } from "../compiler/state";

/**
 * 创建get和set
 * createGetter() 和 createSetter()执行后返回函数
 */
const get = createGetter(),
    set = createSetter();

function createGetter() {
    // 返回一个函数
    return function get(target, key, receiver) { // receiver Proxy本身
        const res = Reflect.get(target, key, receiver); // 获得target[key]的值
        // target[key] 还是一个引用值
        if (isObject(res)) {
            return useReactive(res); // 深度代理
        }
        return res;
    };
}

function createSetter() {
    // 返回函数
    return function set(target, key, value, receiver) {
        const isKeyExist = hasOwnProperty(target, key), // 判断target中是不是有key
            oldValue = target[key], // 老的值
            res = Reflect.set(target, key, value, receiver);

        // 不存在
        if (!isKeyExist) {
            // 新增一个key
            // console.log('响应式新增：', key, value);
        } else if (!isEqual(value, oldValue)) { // 先对比久的值是否与新值相等
            // console.log('响应式修改：', key, value);
            // view update
            update(statePool, key, value);
        }
        return res;
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

## 模板编译
compiler
- event.js 处理事件
- state.js 处理state和{{}}

### 1. 事件处理event
事件处理函数的绑定，并且替换掉它本身。在事件的地方放一个"镖"`<button 镖>xxx</button>`，这个"镖"能够找到这个节点。因为绑定了事件处理函数也需要知道这个节点是什么。
数据结构
```javascript
// eventPool = []
{
  mark: random, // 表示唯一的当前的DOM
  handler: 'add(2)'， // 当前事件处理函数的字符串
  type: 'click' // 事件类型
}
```
可以通过当前的标识mark找到节点。
```javascript
const reg_onClick = /onClick="(.+?)"/g; // 匹配onClick="add(2)"
const eventPool = [];
/**
 * 替换模板中的obClick="add(2)"为mark值。并将节点的信息保存到eventPool中
 * @param {*} template 模板
 * @returns 
 */
export function eventFormat(template) {
  // 匹配模板中的事件
    return template.replace(reg_onClick, function(node, key) {
        // console.log(node); // onClick="add(2)"
        // console.log(key); // minus
        const _mark = randomNum();
        eventPool.push({
            mark: _mark,
            handler: key.trim(),
            type: "click",
        });
        return `data-mark="${_mark}"`; // return的字符替换 node。将标签中的onClick替换成_mark值
    });
}
```
绑定事件函数
```javascript
const reg_fnName = /^(.+?)\(/; // 函数名add。匹配反括号 ( 之前的字符
const reg_arg = /\((.*?)\)/; // 匹配函数的参数"(2)"

/**
 * 绑定事件处理函数。将methods中的方法与eventPool中handler进行匹配。
 * 在render时，当DOM树形成后，执行bindEvent。
 * @param {*} methods 
 */
export function bindEvent(methods) {
    // 所有元素读取出来
    const allElements = document.querySelectorAll("*");
    let oItem = null,
        _mark = 0;

    // 遍历eventPool，找到函数名，绑定methods中事件处理函数
    eventPool.forEach((event) => {
        for (let i = 0; i < allElements.length; i++) {
            oItem = allElements[i]; // DOM节点
            _mark = parseInt(oItem.dataset.mark); // 获取节点的data-mark属性值

            // DOM节点的mark与event.mark相等，绑定事件处理函数
            if (event.mark === _mark) {
                oItem.addEventListener(
                    event.type,
                    function() {
                        const fnName = event.handler.match(reg_fnName)[1]; // 找到函数名add
                        const arg = checkType(event.handler.match(reg_arg)[1]); // 函数里面的参数。判断参数的类型。
                        methods[fnName](arg); // 执行methods中的方法
                    },
                    false
                );
            }
        }
    });
}
```

完整代码event.js
```javascript
import { checkType, randomNum } from "../shared/utils.js";

const reg_onClick = /onClick="(.+?)"/g; // 匹配onClick="add(2)"
const reg_fnName = /^(.+?)\(/; // 函数名add。匹配反括号 ( 之前的字符
const reg_arg = /\((.*?)\)/; // 匹配函数的参数"(2)"

const eventPool = [];

/**
 * 替换模板中的obClick="add(2)"为mark值。并将节点的信息保存到eventPool中
 * @param {*} template 模板
 * @returns 
 */
export function eventFormat(template) {
    // console.log(template.match(reg_onClick));
    return template.replace(reg_onClick, function(node, key) {
        // console.log(node); // onClick="add(2)"
        // console.log(key); // minus
        const _mark = randomNum();
        eventPool.push({
            mark: _mark,
            handler: key.trim(),
            type: "click",
        });
        return `data-mark="${_mark}"`; // return的字符替换 node。将标签中的onClick替换成_mark值
    });
}

/**
 * 绑定事件处理函数。将methods中的方法与eventPool中handler进行匹配。
 * 在render时，当DOM树形成后，执行bindEvent。
 * @param {*} methods 
 */
export function bindEvent(methods) {
    // 所有元素读取出来
    const allElements = document.querySelectorAll("*");
    let oItem = null,
        _mark = 0;

    // 遍历eventPool，找到函数名，绑定methods中事件处理函数
    eventPool.forEach((event) => {
        for (let i = 0; i < allElements.length; i++) {
            oItem = allElements[i]; // DOM节点
            _mark = parseInt(oItem.dataset.mark); // 获取节点的data-mark属性值

            // DOM节点的mark与event.mark相等，绑定事件处理函数
            if (event.mark === _mark) {
                oItem.addEventListener(
                    event.type,
                    function() {
                        const fnName = event.handler.match(reg_fnName)[1]; // 找到函数名add
                        const arg = checkType(event.handler.match(reg_arg)[1]); // 函数里面的参数。判断参数的类型。
                        methods[fnName](arg); // 执行methods中的方法
                    },
                    false
                );
            }
        }
    });
}
```

### 2. 模板中{{}}替换state数据
声明statePool
```javascript
{
  mark: '123445',// 随机值
  state: 0 // 值
}
```
完整代码
```javascript
import { randomNum } from "../shared/utils";

const reg_html = /<.+?>{{(.+?)}}<\/.+?>/g; // 开始标签{{}}结束标签 <h1>{{ count }}</h1>
const reg_tag = /<(.+?)>/; // 标签 <h1>
const reg_var = /{{(.+?)}}/g; // 匹配变量 {{count}}

export const statePool = [];

/*
 * {
 *   mark: _mark,
 *   state: value
 * }
 * */
let o = 0;

export function stateFormat(template, state) {
    let _state = {};
    // 大括号和中间子表达式拿出来，标签以及大括号中的内容
    // 添加data-mark
    template = template.replace(reg_html, function(node, key) {
        // node: <h1>{{ count }}</h1>   key: count
        const matched = node.match(reg_tag); //
        // console.log(matched); // ['<h1>', 'h1', index: 0, input: '<h1>{{ count }}</h1>', groups: undefined]
        const _mark = randomNum();
        _state.mark = _mark;
        statePool.push(_state);

        _state = {};

        // 返回替换过的标签 <h1 data-mark="12345">{{ count }}</h1>
        return `<${matched[1]} data-mark="${_mark}">{{ ${key} }}</${matched[1]}>`;
    });

    // 处理{{ }}
    template = template.replace(reg_var, function(node, key) {
        // node: {{ count }}, key: count
        let _var = key.trim(); // 可能有state.a.b.c的情况
        const _varArr = _var.split(".");

        console.log(_varArr);
        let i = 0;
        while (i < _varArr.length) {
            _var = state[_varArr[i]]; // state['a']['b']['c']
            i++;
        }
        console.log(_var);

        _state.state = _varArr;
        statePool[o].state = _varArr;
        o++;
        return _var;
    });
    console.log(statePool);

    return template;
}
```
主要是更新使用。

