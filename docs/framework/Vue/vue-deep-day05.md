---
autoGroup-2: Vue
sidebarDepth: 3
title: data
---

## data
`data`必须是一个函数。`Vue`在创建实例的过程中调用`data`函数，返回数据对象。通过响应式包装后存储在实例的`$data`上，并且实例可以直接越过`$data`访问。
```javascript
const App = {
    data() {
        return {
            title: 'This is my TITLE'
        }
    },
    template: `
        <h1>{{ title }}</h1>
    `
}

const app = Vue.createApp(App)
const vm = app.mount('#app');

console.log(vm);
console.log(vm.$data.title); // This is my TITLE
console.log(vm.title); // This is my TITLE

vm.$data.title = "This is your TITLE";
console.log(vm.title); // This is your TITLE

vm.title = "This is my TITLE";
console.log(vm.$data.title); // This is my TITLE

// vm.$data.title和vm.title实际上是一份数据，只是在不同的地方
// vm实例增加属性
vm.author = 'Xiaoye';
console.log(vm); // 在$data中是没有author的。$data是响应式数据对象
```

`$`, `_`, `__` 这些都是`Vue`提供的内置`API`。开发者尽量避免用这些前缀命名自己的变量和方法名。   

## 数据响应式实现
`data`为什么必须要是一个函数?   
当`data`不是函数是就会报错： `dataOptions.call is not a function.`    
实现`data`：
```javascript
var vm = new Vue({
    data() {
        return {
            a: 1,
            b: 2
        }
    }
});
// 通过vm访问data中的a和b，并修改

console.log(vm.a); // 1
vm.b = 3;
console.log(vm.b); // 3

function Vue(options) {
    this.$data = options.data();

    var _this = this;

    // this.a => this.$data.a

    for (var key in this.$data) {
        (function(k) {
            // 独立的作用域
            // k -> 当前作用域的临时的局部变量
            Object.defineProperty(_this, k, {
                get: function() {
                    return _this.$data[k];
                },
                set: function(newValue) {
                    _this.$data[k] = newValue
                }
            })
        })(key);
    }
}
```
修改data为对象的形式
```javascript
var data = {
    a: 1,
    b: 2
};
var vm1 = new Vue({
    data: data
});

var vm2 = new Vue({
    data: data
});

vm1.b = 3;
console.log(vm1); // {a:1, b:3}
console.log(vm2); // {a:1, b:3} 修改vm1，vm2也发生了改变。因为data是同一个引用


function Vue(options) {
    this.$data = options.data; // 修改

    var _this = this;

    for (var key in this.$data) {
        (function(k) {
            Object.defineProperty(_this, k, {
                get: function() {
                    return _this.$data[k];
                },
                set: function(newValue) {
                    _this.$data[k] = newValue
                }
            })
        })(key);
    }
}
```
`Vue`需要确保每一次实例的引用，都是独一无二的，所以需要`data`是个函数，在内部驱动中`Vue`会执行`data`函数。   
假如`data`一定要使用对象呢？解决方法是深拷贝。
```javascript
var data = {
    a: 1,
    b: 2
};
var vm1 = new Vue({
    data: data
});

var vm2 = new Vue({
    data: data
});

vm1.b = 3;
console.log(vm1); // {a:1, b:3}
console.log(vm2); // {a:1, b:2} 


function Vue(options) {
    this.$data = deepClone(options.data); // 保证每一次data都是不同的引用

    var _this = this;

    for (var key in this.$data) {
        (function(k) {
            Object.defineProperty(_this, k, {
                get: function() {
                    return _this.$data[k];
                },
                set: function(newValue) {
                    _this.$data[k] = newValue
                }
            })
        })(key);
    }
}

function deepClone(origin, hasMap = new WeakMap()) {
    // origin: null, undefined 
    if (origin == undefined || typeof origin !== 'object') {
        return origin;
    }

    // Date RegExp -> instanceof
    if (origin instanceof Date) {
        return new Date(origin);
    }

    if (origin instanceof RegExp) {
        return new RegExp(origin);
    }

    const hasKey = hasMap.get(origin);
    if (hasKey) {
        return hasKey;
    }

    // {} [] 
    const target = new origin.constructor();
    hasMap.set(origin, target);

    for (let key in origin) {
        if (origin.hasOwnProperty(key)) {
            target[key] = deepClone(origin[key], hasMap);
        }
    }

    return target;
}
```
可以不使用`Object.defineProperty`，使用`Object.prorptype`上的方法：`__defineGetter__`与`__defineSetter__`
```javascript
for (var key in this.$data) {
    (function(k) {
        // Object.defineProperty(_this, k, {
        //     get: function() {
        //         return _this.$data[k];
        //     },
        //     set: function(newValue) {
        //         _this.$data[k] = newValue
        //     }
        // })
        _this.__defineGetter__(k, function() {
            return _this.$data[k];
        });
        _this.__defineSetter__(k, function(newValue) {
            _this.$data[k] = newValue;
        })
    })(key);
}
```