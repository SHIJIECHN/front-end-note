---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: Proxy
---

## 用法
对象
```javascript
/**
 * Proxy ES6的构造函数
 * let obj = new Proxy(target, handler);
 * target 目标对象，你要进行处理的对象
 * handler 容器，无数可以处理对象属性的方法
 * let target = {
 *      a: 1,
 *      b: 2
 *   }
 * 
 * Proxy不会管增不增加属性，而是对现有的属性进行处理。
 * 
 * 自定义对象属性的获取、赋值、枚举函数调用等功能
 */

let target = {
    a: 1,
    b: 2
}

let proxy = new Proxy(target, {
    get(target, prop) {
        return 'This is property value ' + target[prop];
    },
    set(target, prop, value) {
        target[prop] = value;
        console.log(target[prop]);
    }
});

console.log(proxy.a); // This is property value 1
console.log(target.a); // 1

proxy.b = 3; // 3
```
数组
```javascript
let arr = [
    { name: '小明', age: 18 },
    { name: '小王', age: 12 },
    { name: '小李', age: 24 },
    { name: '小红', age: 27 },
]

let person = new Proxy(arr, {
    get(arr, prop) {
        return arr[prop];
    },
    set(arr, prop, value) {
        arr[prop] = value;
    }
})

console.log(person[0]);

person[1] = { name: '小张', age: 33 };
console.log(person, arr);
```
函数
```javascript
let fn = function() {
    console.log('I am a function.');
}

fn.a = 123;

let newFn = new Proxy(fn, {
    get(fn, prop) {
        return fn[prop] + ' This is a Proxy return'
    }
})

console.log(newFn.a); // 123 This is a Proxy return
```

## 对象操作的14中方法
```javascript
var obj = {
    a: 1,
    b: 2
}
```
任何语法与对象相关的内建函数方案都是根据以下14中内部方法构建出来的。
1. 获取原型 [[GetPrototypeOf]]
```javascript
var proto = Object.getPrototypeOf(obj);
console.log(proto);
console.log(obj.__proto__);
console.log(Object.prototype);
```
2. 设置原型 [[SetPrototypeOf]]
```javascript
Object.setPrototypeOf(obj, { c: 3, d: 4 });
console.log(obj);
```
3. 获取对象的可扩展性 [[IsExtensible]]
```javascript
var extensible = Object.isExtensible(obj);
console.log(extensible); // true

Object.freeze(obj);
var extensible2 = Object.isExtensible(obj);
console.log(extensible2); // false

// freeze
Object.freeze(obj); // 冻结对象
obj.c = 3; // 不可修改的
console.log(obj);

delete obj.a; // 不可删除
console.log(obj);

obj.b = 3; // 不可写
console.log(obj);

// 可枚举
for (var key in obj) {
    console.log(key);
}

// seal
Object.seal(obj); // 封闭对象
obj.c = 3; // 不可修改的
console.log(obj);

delete obj.a; // 不可删除
console.log(obj);

obj.b = 3; // 可写
console.log(obj);

// 可枚举
for (var key in obj) {
    console.log(key);
}
```
4. 获取自有属性[[GetOwnProperty]]
```javascript
Object.setPrototypeOf(obj, { c: 3, d: 4 });
console.log(Object.getOwnPropertyNames(obj)); // ['a','b']
```
5. 禁止扩展对象[[PreventExtensions]]
```javascript
Object.preventExtensions(obj);
obj.c = 3; // 禁止增加属性
console.log(obj); // {a: 1, b: 2}
delete obj.a; // 可删除属性
console.log(obj); // {b:2}
```
6. 拦截对象操作 `[[DefineOwnProperty]]`
```javascript
Object.defineProperty()
```
7. 判断是否是自身属性`[[HasProperty]]`
```javascript
console.log(obj.hasOwnProperty('a')); // true
```
8. `[[GET]]` 
```javascript
console.log('c' in obj); // false
console.log(obj.a);
```
9. [[SET]]
```javascript
obj.a = 3;
obj['b'] = 4;
console.log(obj); // {a: 3, b: 4}
```
10. [[Delete]]
```javascript
delete obj.a;
console.log(obj); // {b: 2}
```
11. [[Enumberate]]
```javascript
for (var k in obj) {
    console.log(k);
}
```
12. 获取键集合 [[OwnPropertyKeys]]
```javascript
console.log(Object.keys(obj)); // ['a', 'b']
```
13. 函数调用
```javascript
function test(){}
test();

test.call();
test.apply();
```
14. new
```javascript
function Test(){}
new Test()
```
## 重写Proxy: set和get
```javascript
let target = {
    a: 1,
    b: 2
}

let proxy = new Proxy(target, {
    get(target, prop) {
        return target[prop];
    },
    set(target, prop, value) {
        target[prop] = value;
    }
})

console.log(proxy.a);
proxy.b = 4;
console.log(proxy.b);
```
实现
```javascript
function MyProxy(target, handler) {
    let _target = deepClone(target);
    Object.keys(_target).forEach(key => {
        Object.defineProperty(_target, key, {
            get() {
                return handler.get && handler.get(target, key);
            },
            set(newValue) {
                handler.set && handler.set(target, key, newValue);
            }
        })
    })

    return _target;


    // 深拷贝
    function deepClone(org, tar) {
        var tar = tar || {},
            toStr = Object.prototype.toString,
            arrType = '[object Array]';
        for (var key in org) {
            if (org.hasOwnProperty(key)) {
                if (typeof(org[key]) === 'object' && org[key] !== null) {
                    tar[key] = toStr.call(org[key]) === arrType ? [] : {};
                    deepClone(org[key], tar[key]);
                } else {
                    tar[key] = org[key]
                }
            }
        }
        return tar;
    }
}

let target = {
    a: 1,
    b: 2
}

let proxy = new MyProxy(target, {
    get(target, prop) {
        return "GET: " + prop + '=' + target[prop];
    },
    set(target, prop, value) {
        target[prop] = value;
        console.log('SET: ' + prop + "=" + value);
    }
})

console.log(proxy.a);
proxy.b = 3;
```

## Proxy属性
```javascript
let target = {
    a: 1,
    b: 2
}

let proxy = new Proxy(target, {
    get(target, prop) {
        return target[prop];
    },
    set(target, prop, value) {
        target[prop] = value;
    },
    has(target, prop) {
        console.log(target[prop]);
    },
    deleteProperty(target, prop) {
        delete target[prop];
    }
});

console.log('a' in proxy); // false
delete proxy.b;
console.log(proxy);

/**
 * Proxy 内部方法 -> target的方法
 */
```
通过Proxy对象来代理target，然后通过handler重写Proxy对象的操作方式来间接的操作target，这种方式我们叫做代理操作。Proxy的方法在handler里面是可以重写的，当重写的时候，所有target的操作都会通过Proxy进入到相对应的handler里面进行操作。    
defineProperty与Proxy: defineProperty是给对象增加属性用，在修改数组的长度，用索引去设置元素的值，数组的push，pop等方法是无法触发defineProperty的setter方法。而Proxy可以触发setter。   
Vue2.x的时候是采用defineProperty实现的，Vue里面设置的对数组方法都是Vue自己重新写的，而不是原生的push，pop等方法。所以就导致大量的代码，但是Proxy没有这个问题。   

为什么Vue2.x并没有使用Proxy呢？  
因为Proxy是ES6的构造函数，考虑到兼容性问题，就没有使用Proxy。   

Proxy不是数据劫持，仅仅是代理了数据进行操作，而数据劫持是在进行访问源对象的时候，就要进行拦截，对源对象进行操作的时候就进行拦截，如访问target，defineProperty直接对target进行处理了以后，只要访问target.a，就要经过get方法。而Proxy不是拦截，它是代理target去处理问题，直接操作target，不起作用，必须操作proxy。使用Proxy就不是操作源对象，相当于Vue中的data在defineProperty的时候是直接操作data，所以需要写成函数的形式data(){return {} }，一是为了防止引用值对象的重写，二是defineProperty是直接操作return里面的对象的，直接对return中的对象进行包装的。而Proxy就不存在这些问题，data: {}。

## Reflect反射
ES6定义的内置对象，就是方法集合的容器。ES6全局内置对象，直接保存静态方法，不需要实例化
```javascript
let target = {
    a: 1,
    b: 2
}

let proxy = new Proxy(target, {
    get(target, prop) {
        // return target[prop];
        return Reflect.get(target, prop); // 方法式操作对象
    },
    set(target, prop, value) {
        // target[prop] = value;
        Reflect.set(target, prop, value);

        /********************************/
        // 还可以通过这种方式获取结果
        const isOk = Reflect.set(target, prop, value);

        if (isOk) {
            console.log('SET successfully');
        }
    }
});

console.log(proxy.a);
proxy.b = 4;
console.log(proxy);
```

好处：统一管理方法；合理的返回值；   

