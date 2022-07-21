---
autoGroup-1: ES6
sidebarDepth: 3
title: 16. WeakMap与WeakSet、proxy与reflect
---

## Map数据类型结构的转换

### 1. map对象转为数组
因为map对象实例本身具有iterator接口，通过扩展运算符(...)进行map对象在数组中展开
```js
const map = new Map();
map.set(true, 7)
   .set({foo:3}, ['abc']);
console.log(map); // { true=>7, { {foo:3} => ['abc'] }}
console.log([...map]); // [[true, 7], [{foo:3}, ['abc']]]
```
### 2. 数组转为Map对象
```js
const arr = [[true, 7], [{foo:3},  ['abc']]];
const map = new Map(arr);
console.log(map);
```

### 3. Map转为对象
由于对象中的属性名是以字符串的形式存在的，所以导致引用数据类型当作键名的时候，需要toString()方法进行转为字符串的形式，所以出现\[object Object]的现象。
```js
const map = new Map();
map.set(true, 7)
   .set({foo:3}, ['abc']);
function mapToObj(strMap) {
  const obj = {};
  for(let [key, value] of strMap) {
    obj[key] = value;
  }
  return obj;
}
const res = mapToObj(map);
console.log(res); // {true: 7, [object Object]: Array(1)}
```

## Map、Set与其他数据类型的对比
### 1. Map对比Array
```js
let map = new Map();
let array = new Array();
// 增
map.set('t', 1);
array.push({
    't': 1
})
console.log('map: ', map); // {'t' => 1}
console.log('array: ', array); // [{ 't': 1}]

// 查
let map_exist = map.has('t'); // true
let arr_exist = array.find((val) => val.t);
console.log('map: ', map_exist); // true
console.log('array: ', arr_exist); // {'t': 1}

// 改
map.set('t', 2);
array.forEach(item => item.t ? item.t = 2 : '');
console.log('map: ', map); // {'t' => 2}
console.log('array: ', array); // [{ 't': 2}]

// 删
map.delete('t');
let idx = array.findIndex(item => item.t);
array.splice(idx, 1);
console.log('map: ', map); // {}
console.log('array: ', array); // []
```
总结：Map的增删改查都比Array操作简便。所以能够使用Map的时候尽量使用Map数据结构。

### 2. Set与Array
对数据结构具有唯一性的要求，就要使用Set进行操作。
```js
let set = new Set();
let array = new Array();
let o = {
    't': 1
};
// 增
set.add(o);
array.push(o)
console.log('set: ', set); // { {'t': 1} }
console.log('array: ', array); // [{ 't': 1}]

// 查
let set_exist = set.has(o);
let arr_exist = array.find((val) => val.t);
console.log('set: ', set_exist); // true
console.log('array: ', arr_exist); // {'t': 1}

// 改
set.forEach(item => item.t ? item.t = 2 : '');
array.forEach(item => item.t ? item.t = 2 : '');
console.log('set: ', set); // { {t: 2} }
console.log('array: ', array); // [{ 't': 2}]

// 删
set.forEach(item => item.t ? set.delete(item) : '');
let idx = array.findIndex(item => item.t);
array.splice(idx, 1);
console.log('set: ', set); // {}
console.log('array: ', array); // []
```

## WeakSet、WeakMap数据结构
### 1. WeakSet
WeakSet结构与Set结构类似，也是不重复值的集合；但是，它与Set有两个区别：
1. WeakSet的成员只能是对象，不能是其它的值；
2. WeakSet中的对象都是弱引用，即JS引擎的垃圾回收机制会自动回收WeakSet    

WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其它对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象是否还存在WeakSet结构；   
垃圾回收机制根据对象的可达性（reachability）来判断回收，如果WeakSet中的对象还能被访问到，垃圾回收机制就不释放这块内存。可能导致内存不释放，内存泄露的问题。WeakSet里面的对象引用，都不计入垃圾回收机制，所以不存在内存泄漏的问题；因此，WeakSet适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在WeakSet里面的引用就会自动消失。   

WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

### 2. WeakMap
WeakMap结构与Map结构类似，用于生成键值对的集合：
1. WeakMap只接受对象作为键名（null除外），不接受其它类型的值作为键名
2. WeakMap的键名所指向的对象，不计入垃圾回收机制；   

WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失；WeakMap结构有助于防止内存泄漏，WeakMap弱引用只是键名，而不是键值。键值依旧正常引用。


## Proxy（代理模式）
代理模式：在访问目标对象时，设置目标对象之间设置一层拦截层，当外界访问对象的时候，必须通过拦截层的拦截；从而实现对源对象基本操作的拦截和定义（如属性查找、赋值、枚举、函数调用等）。

### 1. 基本语法
```js
const p = new Proxy(target，handler);
```
- target：要使用Proxy包装的目标对象（可以是任何类型的对象，包括原生数组、函数、甚至是另一个代理）
- handler：一个通常以函数作为属性的对象，各种函数分别定义了在执行各种操作时Proxy的拦截行为（捕捉器）

```js
let star = {
    name: 'zhangsan',
    age: 25,
    phone: 'start 18822228888'
}

let agent = new Proxy(star, {
    // 读取操作：
    get: function(target, key) {
        if (key === 'phone') {
            return 'agent: 13355556666'
        }

        if (key === 'price') {
            return 120000;
        }

        return target[key];
    },

    // 赋值操作
    set: function(target, key, value) {
        if (value < 100000) {
            throw Error('价格太低！');
        } else {
            target[key] = value;
            return true;
        }

    },

    // has 拦截in操作符。不能拦截for...in循环
    has: function(target, key) {
        console.log('请联系agent：13355556666');
        if (key === 'customPrice') {
            return target[key];
        } else {
            return false;
        }
    },

});

// get
console.log(agent.phone); // agent: 13355556666
console.log(agent.price); // 120000
console.log(agent.name); // zhangsan
console.log(agent.age); // 25
// set
agent.customPrice = 150000;
console.log(agent.customPrice); // 150000
// has
console.log('customPrice' in agent); // true
```

### 2. Proxy中handler对象中的捕捉器
- target：目标对象
- propKey：被获取属性名
- value：新属性值
- descriptor：待定义或修改的属性描述符
- descriptors：待定义或修改的属性描述符集合
- proto：新原型或者null
- receiver：Proxy或者被继承Proxy的对象
- thisArg：被调用时的上下文对象
- argumentsList：被调用时的参数数组


1. 拦截对象属性的读取，比如 proxy.foo、proxy['foo']、Reflect.get()
```js
handler.get(target，propkey，receiver)
```
2. 拦截对象属性的设置，比如 proxy.foo = v、proxy['foo'] = v、Reflect.set()；返回一个布尔值，返回true表示设置属性值成功，返回false表示设置失败，严格模式下返回false抛出异常;
```js
handler.set(target，propKey，value，receiver)
```
3. 拦截in操作符的代理方法，比如 foo in proxy、foo in Object.create(proxy)、with(proxy) { (foo); }、Reflect.has()；返回一个布尔值，false表示不存在，true表示存在.
```js
handler.has(target，propKey)
```
4. 拦截对象属性的delete操作，比如 delete proxy[foo]、delete proxy.foo、Reflect.deleteProperty()；必须返回一个布尔值，表示该属性是否被成功删除.
```js
handler.deteleProperty()
```
5. 拦截Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Object.keys()、Reflect.ownKeys()，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性.
```js
handler.ownKeys()
```
6. 拦截Object.getOwnPropertyDescriptor(target，propKey)、Reflect.getOwnPropertyDescriptor(target，propKey)，方法必须返回一个属性的描述对象或者undefined.
```js
handler.getOwnPropertyDescriptor(target，propKey)
```
7. 拦截对象的Object.defineProperty(target，propKey，descriptor)、Object.defineProperties(proxy，descriptors)，返回一个布尔值，表示定义该属性的操作成功与否.
```js
handler.defineProperty(target，propKey，descriptor)
```
8. 拦截设置对象扩展Object.preventExtensions(proxy)、Reflect.preventExtensions()；返回一个布尔值.
```js
handler.preventExtensions(target)
```
9. 拦截Object.isExtensible(proxy)、Reflect.isExtensible(proxy)；必须返回一个Boolean值或者可转换成Boolean的值.
```js
handler.isExtensible(target)
```
10. 当读取代理对象的原型时，拦截Object.getPrototypeOf(proxy)、Reflect.getPrototypeOf(proxy)、__proto__、Object.prototype.isPrototypeOf()、instanceof，返回值必须是一个对象或者null.
```js
handler.getPrototypeOf(target)
```
11. 拦截Object.setPrototypeOf(proxy，proto)，Reflect.setPrototypeOf(proxy，proto)；返回一个布尔值，返回true修改原型成功，返回false修改原型失败.
```js
handler.setPrototypeOf(target，proto)
```
12. 拦截Proxy实例作为函数调用的操作，比如proxy(...args)，proxy.call(object，...args)，proxy.apply(...)
```js
handler.apply(target，thisArg，argumentsList)
```
13. 拦截new操作符，拦截Proxy实例作为构造函数调用的操作，比如 new proxy(...args)，Reflect.constructor()；返回值：必须返回一个对象
```js
handler.constructor(target，argumentsList)
```

## Reflect
Reflect对象与Proxy的handler参数对应的一致，也是为了ES6操作对象的新提供的API

### 1. Reflect目的意义
1. 将Object对象的一个明显属于JS语言内部的方法（如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上，也就是说，从Reflect对象上可以拿到语言内部的方法。
2. 修改某些Object返回的结果，让其变得合理性。如Object.defineProperty(obj,propkey,desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj,name,desc)则会返回false。

```js
// 旧写法
try {
  Object.defineProperty(target, property, attributes);
} catch(e) {
  
}

// 新写法
if(Reflect.defineProperty(target, property, attributes)){
  
} else {
  
}
```
3. Reflect对象的方法与Proxy对象的方法对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。