---
autoGroup-2: Vue
sidebarDepth: 3
title: v-if/v-show/生命周期函数
---

## v-if
1. 合理使用数据来保存视图信息，通过数据将视图和数据绑定在一起，在update的时候才能很好的操作。
```javascript
var showPool = new Map();
var eventPool = new Map();
```
2. 数据劫持的作用：更改数据就会走set，执行update
```javascript
for (var key in _data) {
    (function(key) {
        Object.defineProperty(vm, key, {
            get: function() {
                return _data[key]
            },
            set: function(newValue) {
                // this.isShowImg1 = true
                _data[key] = newValue;
                // update
                update(vm, key, showPool);
            }
        })
    })(key);
}
```
3. 如何保存数据，怎么设计
```javascript
showPool Map { dom: {}}
    [
        [
            dom,
            {
                type: if /show,
                prop: data
            }
        ]
    ]

eventPool
    [
        [
            dom,
            handler
        ]
    ]
```
4. 如何对事件处理函数循环绑定
```javascript
function bindEvent(vm, eventPool) {
    for (var [dom, handler] of eventPool) {
        vm[handler.name] = handler;
        dom.addEventListener('click', vm[handler.name].bind(vm), false);
    }
}
```
5. 怎么处理v-if能够让它删除节点和恢复
```javascript
switch (info.type) {
    case 'if':
        info.comment = document.createComment(['v-if']);
        !_data[info.prop] && dom.parentNode.replaceChild(info.comment, dom);
        break;
    case 'show':
        !_data[info.prop] && (dom.style.display = 'none');
        break;
    default:
        break;
}
```


## 实现
```javascript
// main.js
import Vue from '../modules/Vue/index.js'

const vm = new Vue({
    el: '#app',
    data() {
        return {
            isShowImg1: true,
            isShowImg2: true
                // data() -> $data -> vm
        }
    },
    template: `
        <div>
            <div>
                <img v-if="isShowImg1" width="200" src="..."/>
                <img v-show="isShowImg2" width="200" src="..."/>
            </div>
            <button @click="showImg1">显示图片1</button>
            <button @click="showImg2">显示图片2</button>
        </div>
    `,
    beforeCreate() {
        console.log('beforeCreate');
    },
    created() {
        console.log('created');
    },
    beforeMounted() {
        console.log('beforeMounted');
    },
    mounted() {
        console.log('mounted');
        this.isShowImg1 = false;
        this.isShowImg2 = false;
    },
    // 归纳容器
    methods: {
        showImg1() {
            this.isShowImg1 = !this.isShowImg1;
            // this -> vm -> showImg1
        },
        showImg2() {
            this.isShowImg2 = !this.isShowImg2;
        }
    }
})

console.log(vm);
```
modules/Vue/index.js
```javascript
/**
 * 1. 容器el, data
 * 2. init: 数据劫持
 * 
    showPool Map { dom: {}}
        [
            [
                dom,
                {
                    type: if /show,
                    prop: data
                }
            ]
        ]

    eventPool
        [
            [
                dom,
                handler
            ]
        ]

 */

var Vue = (function() {
    function Vue(options) {
        // 
        var recycles = {
            beforeCreate: options.beforeCreate.bind(this),
            created: options.created.bind(this),
            beforeMounted: options.beforeMounted.bind(this),
            mounted: options.mounted.bind(this)
        }

        recycles.beforeCreate();
        // el
        this.$el = document.querySelector(options.el);
        this.$data = options.data();

        this._init(this, options.template, options.methods, recycles);
    }

    Vue.prototype._init = function(vm, template, methods, recycles) {
        recycles.created();

        var container = document.createElement('div');
        container.innerHTML = template;

        var showPool = new Map();
        var eventPool = new Map();

        initData(vm, showPool);
        initPool(container, methods, showPool, eventPool);
        bindEvent(vm, eventPool);
        render(vm, showPool, container, recycles);
    }

    function initData(vm, showPool) {
        var _data = vm.$data;

        for (var key in _data) {
            (function(key) {
                Object.defineProperty(vm, key, {
                    get: function() {
                        return _data[key]
                    },
                    set: function(newValue) {
                        // this.isShowImg1 = true
                        _data[key] = newValue;
                        // update
                        update(vm, key, showPool);
                    }
                })
            })(key);
        }
    }

    function initPool(container, methods, showPool, eventPool) {
        var _allNodes = container.getElementsByTagName('*');
        var dom = null;

        for (var i = 0; i < _allNodes.length; i++) {
            dom = _allNodes[i];

            var vIfData = dom.getAttribute('v-if');
            var vShowData = dom.getAttribute('v-show');
            var vEvent = dom.getAttribute('@click');

            if (vIfData) {
                showPool.set(dom, {
                    type: 'if',
                    prop: vIfData
                });
                dom.removeAttribute('v-if')
            } else if (vShowData) {
                showPool.set(dom, {
                    type: 'show',
                    prop: vShowData
                });
                dom.removeAttribute('v-show')
            }

            if (vEvent) {
                eventPool.set(dom, methods[vEvent]);
                dom.removeAttribute('@click')
            }
        }
    }

    function bindEvent(vm, eventPool) {
        for (var [dom, handler] of eventPool) {
            vm[handler.name] = handler;
            dom.addEventListener('click', vm[handler.name].bind(vm), false);
        }
    }

    function render(vm, showPool, container, recycles) {
        var _data = vm.$data;
        var _el = vm.$el;

        for (var [dom, info] of showPool) {
            switch (info.type) {
                case 'if':
                    info.comment = document.createComment(['v-if']);
                    !_data[info.prop] && dom.parentNode.replaceChild(info.comment, dom);
                    break;
                case 'show':
                    !_data[info.prop] && (dom.style.display = 'none');
                    break;
                default:
                    break;
            }
        }

        recycles.beforeMounted();
        _el.appendChild(container);
        recycles.mounted();
    }

    function update(vm, key, showPool) {
        var _data = vm.$data;

        for (var [dom, info] of showPool) {
            if (info.prop === key) {
                switch (info.type) {
                    case 'if':
                        !_data[key] ? dom.parentNode.replaceChild(info.comment, dom) : info.comment.parentNode.replaceChild(dom, info.comment);
                        break;
                    case 'show':
                        !_data[key] ? (dom.style.display = 'none') : (dom.removeAttribute('style'));
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return Vue;

})();

export default Vue;
```