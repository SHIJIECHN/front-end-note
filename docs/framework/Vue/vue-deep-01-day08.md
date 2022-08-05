---
autoGroup-2: Vue
sidebarDepth: 3
title: 计算属性
---

## 应用场景
- 计算属性：解决模板中复杂的逻辑运算及复用的问题
- 计算属性只在内部逻辑依赖的数据发生变化的时候才会被再次调用
- 计算属性会缓存其依赖的上一次计算出的数据结果
- 多次复用一个相同值的数据，计算属性只调用一次
```javascript
const App = {
    data() {
        return {
            studentCount: 1
        }
    },
    /**
     * 需求：
     * 1. 模板逻辑样式尽可能绝对分离
     * 2. 逻辑运算结果需要被复用
     */
    template: `
        <h1>{{ studentCount > 0 ? ('学生数：'+studentCount) : '暂无学生'}}</h1>
        <h2>{{ studentCountInfo }}</h2>
        <h2>{{ studentCountInfo }}</h2>
        <button @click="addStudentCount">ADD STUDENT COUNT</button>
    `,
    computed: {
        studentCountInfo() {
            console.log('Invoked');
            return this.studentCount > 0 ? ('学生数：' + this.studentCount) : '暂无学生'
        }
    },
    methods: {
        addStudentCount() {
            this.studentCount += 1
        }
    }
}

const vm = Vue.createApp(App).mount('#app');
console.log(vm); //把计算属性的结果挂到了实例上
```

## 计算器
只要想到：   
1. 在模板中嵌入一个方法的时候都要想到使用计算属性；
2. 模板里面有复杂的计算逻辑
```javascript
const App = {
    data() {
        return {
            a: 1,
            b: 2,
            type: 'plus'
        }
    },
    template: `
        <div>
            <h1>计算属性结果：{{ result }}</h1>
            <h2>方法计算结果：{{ getResult() }}</h2>
            <p>
                <span>{{ a }}</span>
                <span>{{ sym }}</span>
                <span>{{ b }}</span>
                <span>=</span>
                <span>{{ result}}</span>
                <span>({{ getResult() }})</span>
            </p>
            <div>
                <input type="number" v-model="a" />
                <input type="number" v-model="b" />
            </div>
            <div>
                <button @click="compute('plus')">+</button>
                <button @click="compute('minus')">-</button>
                <button @click="compute('mul')">*</button>
                <button @click="compute('div')">/</button>
            </div>
        </div>
    `,
    computed: {
        // 默认为getter
        sym() {
            switch (this.type) {
                case 'plus':
                    return '+';
                case 'minus':
                    return '-';
                case 'mul':
                    return '*';
                case 'div':
                    return '/';
                default:
                    break;
            }
        },
        result: {
            get() {
                console.log('computed result');
                const a = Number(this.a);
                const b = Number(this.b);
                console.log(this.type);
                switch (this.type) {
                    case 'plus':
                        return a + b;
                    case 'minus':
                        return a - b;
                    case 'mul':
                        return a * b;
                    case 'div':
                        return a / b;
                    default:
                        break;
                }
            },
            set() {

            }
        },
        calData: {
            get() {
                return {
                    a: 'number a: ' + this.a,
                    b: 'number b: ' + this.b,
                    type: 'computed type: ' + this.type,
                    result: 'computed result: ' + this.result
                }
            },
            set(newValue) {
                this.a = Number(newValue.a.split(':')[1]);
                this.b = Number(newValue.b.split(':')[1]);
                this.type = newValue.type.split(':')[1];
            }
        }
    },
    methods: {
        compute(type) {
            this.type = type;
        },
        getResult() {
            console.log('methods result');
            const a = Number(this.a);
            const b = Number(this.b);
            switch (this.type) {
                case 'plus':
                    return a + b;
                case 'minus':
                    return a - b;
                case 'mul':
                    return a * b;
                case 'div':
                    return a / b;
                default:
                    break;
            }
        }
    }

}

const vm = Vue.createApp(App).mount('#app');
vm.calData = {
    a: 'number a: ' + 100,
    b: 'number b: ' + 200,
    type: 'computed type:div'
}
console.log(vm);
```


## 实现计算属性
main.js
```javascript
import Vue from '../modules/vue/index.js'

var vm = new Vue({
    el: '#app',
    template: `
    <span>{{ a }}</span>
    <span>+</span>
    <span>{{ b }}</span>
    <span> = </span>
    <span>{{ total }}</span>
    `,
    data() {
        return {
            a: 1,
            b: 2
        }
    },
    computed: {
        total() {
            console.log('computed total');
            return this.a + this.b;
        }
    }
});
console.log(vm);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
```
module/vue/index.js
```javascript
var Vue = (function() {
    /**
     * computedData:  computed里面的方法，不进入$data中，所以需要有单独的容器装computed相关的data。
     */
    var reg_var = /\{\{(.+?)\}\}/g,
        computedData = {},
        dataPool = {};
    /**
     * computedData
     * value: 函数执行返回的结果，结果给实例
     * get: 中间的依赖变了，就要执行get
     * dep：依赖 ['a', 'b']。
     * 
     * 监控依赖dep，如果发现有变化，则执行get，重新赋值给value
     * 
     * total: {
     *   value: 函数返回的结果,
     *   get: get,
     *   dep: ['a', 'b']
     * }
     * 
     * dataPool：每一个属性都能够对应上一个节点
     */
    var Vue = function(options) {
        // $el $data挂载到实例上的，computed和template不挂载到实例上，所以得在_init函数中传入
        this.$el = document.querySelector(options.el);
        this.$data = options.data();

        this._init(this, options.computed, options.template);
    }

    Vue.prototype._init = function(vm, computed, template) {
        // $data响应式处理
        dataReactive(vm);
        // computed响应式
        computedReactive(vm, computed);
        // 渲染
        render(vm, template);
        // data更新的时候，视图和computed都要更新
    }

    // 1.创建container; 2. 拿到el； 3.
    function render(vm, template) {
        var container = document.createElement('div'),
            _el = vm.$el;

        // 变成真实节点
        container.innerHTML = template;

        // 编译方法
        var domTree = _compileTemplate(vm, container);

        _el.appendChild(domTree);
    }

    function update(vm, key) {
        dataPool[key].textContent = vm[key]
    }

    // 编译模板
    function _compileTemplate(vm, container) {
        // 获取到所有的节点
        var allNodes = container.getElementsByTagName('*'),
            nodeItem = null;

        for (var i = 0; i < allNodes.length; i++) {
            nodeItem = allNodes[i];

            var matched = nodeItem.textContent.match(reg_var); // 匹配大括号{{ }}

            if (matched) {
                nodeItem.textContent = nodeItem.textContent.replace(reg_var, function(node, key) {
                    // 数据与视图对应起来，数据改变视图更新
                    dataPool[key.trim()] = nodeItem;
                    // 每一都要去将vm[key.trim()]替换掉，替换成vm[key.trim()]对应的那个值
                    return vm[key.trim()];
                })
            }
        }
        return container;
    }

    function dataReactive(vm) {
        var _data = vm.$data;
        for (var key in _data) {
            (function(k) {
                Object.defineProperty(vm, k, {
                    get: function() {
                        return _data[k];
                    },
                    set: function(newVal) {
                        _data[k] = newVal;
                        update(vm, k);
                        _updateComputedData(vm, key, function(key) {
                            update(vm, key);
                        })
                    }
                })
            })(key);
        }
    }

    function computedReactive(vm, computed) {
        _initComputedData(vm, computed);

        // 需要用vm去访问到computedData里面的value
        for (var key in computedData) {
            (function(key) {
                Object.defineProperty(vm, key, {
                    get: function() {
                        return computedData[key].value;
                    },
                    set: function(newValue) {
                        computedData[key].value = newValue;
                    }
                })
            })(key);
        }
    }

    // 初始化computed里面的函数，vm实例，因为要从实例上访问到computed里面的计算结果
    function _initComputedData(vm, computed) {
        // 枚举computed里面的属性
        for (var key in computed) {
            /**
             * 获取描述符descriptor
             * {
             *   configurable: true
             *   enumerable: true
             *   value: ƒ total() // 对应这属性值，执行它就可以获得结果
             *   writable: true
             * }
             * 
             * descriptorFn
             * 两种写法
             * total: {
             *   get: function(){},
             *   set: function(){}
             * }
             * 或者
             * total(){}
             *  */
            var descriptor = Object.getOwnPropertyDescriptor(computed, key),
                descriptorFn = descriptor.value.get ? descriptor.value.get : descriptor.value;
            computedData[key] = {}
            computedData[key].value = descriptorFn.call(vm); // this原本指向descriptor，需要修改this指向vm，因为里面用到this，要访问到实例
            computedData[key].get = descriptorFn.bind(vm);
            computedData[key].dep = _collectDep(descriptorFn); // 依赖收集
        }
    }

    // 收集依赖：找到当前fn有哪些依赖
    function _collectDep(fn) {
        // 变成字符串，找到this.xxx。需要变成['a', 'b']
        var _collection = fn.toString().match(/this.(.+?)/g); // ['this.a', 'this.b']
        if (_collection.length > 0) {
            for (var i = 0; i < _collection.length; i++) {
                _collection[i] = _collection[i].split('.')[1]
            }
        }
        return _collection;
    }


    function _updateComputedData(vm, key, update) {
        var _dep = null;

        for (var _key in computedData) {
            _dep = computedData[_key].dep;

            for (var i = 0; i < _dep.length; i++) {
                if (_dep[i] === key) {
                    vm[_key] = computedData[_key].get();
                    update(_key)
                }
            }
        }
    }
    return Vue;
})();

export default Vue;
```
