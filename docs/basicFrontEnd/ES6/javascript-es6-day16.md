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
