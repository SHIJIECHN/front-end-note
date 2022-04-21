---
autoGroup-2: ES6
sidebarDepth: 3
title: Map/Set
---

## Set
```js
const set = new Set(); // 成员是唯一的“数组”
const map = new Map(); // "对象"

set.add(1);
set.add(7);
console.log(set); // {1, 7}

// 参数是具备iterator接口的数据结构
const s = new Set([2, 4, 4, undefined, undefined, '5', 5, NaN, NaN, {}, {}]);
console.log(s);
// {2, 4, undefined, '5', 5, NaN, Object, Object} 不会有重复
```
在Set内部，两个NaN是相等的。两个对象总是不相等的。

### 遍历方法
```js
let set = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

console.log(set.keys()); // SetIterator
console.log(set.values()); // SetIterator
console.log(set.entries()); // SetIterator

// set 没有键名
for (let i of set.keys()) {
    console.log(i); // a,b,c,d,e,f,g 返回一个键名的迭代器
}

for (let i of set.values()) {
    console.log(i); // a,b,c,d,e,f,g 返回一个键值的迭代器
}

for (let i of set.entries()) {
    console.log(i); // 返回一个键值对的迭代器
    //  ['a', 'a']
    //  ['b', 'b']
    // ...
}

console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true  直接使用for...of循环，相当于访问的是values

set.forEach(function(value, index, arr) {
    console.log(value); // a
    console.log(index); // a
    console.log(arr); // Set(7) {'a', 'b', 'c', 'd', 'e', 'f', 'g'}
})
```

### 操作Set
```js
const s = new Set();
const x = {
        id: 1
    },
    y = {
        id: 2
    };

// 链式调用：添加值，返回的是set结构本身
s.add(x).add(y);
console.log(s);

console.log(s.has(x)); //true

console.log(s.delete(y)); // true
console.log(s);

console.log(s.clear()); // undefined 清空
console.log(s);
```

### 应用
1. 数组去重
```js
let arr = [1, 2, 2, 4, 4, 2, 3, 7, 9, 9];
console.log([...new Set(arr)]); // [1, 2, 4, 3, 7, 9]
```

2. 交集、并集、差集
```js
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4]);

// 并集
let union = new Set([...a, ...b]);
console.log(union); // {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); // {2, 3}

// 差集
let different = new Set([...a].filter(x => !b.has(x)));
console.log(different); // {1}
```

3. 映射出一个新的结构
```js
let set = new Set([1, 2, 3, 4, 5]);
let s = new Set([...set].map(x => x * 2))
console.log(s); // {2, 4, 6, 8, 10}
// 等同于
let set1 = new Set(Array.from(set, value => value * 2));
console.log(set1); // {2, 4, 6, 8, 10}


let arr = [1, 2, 3, 4, 5];
let arr1 = arr.map(parseInt);
// 1) parseInt(1, 0)  value：1, index：0
// 2) parseInt(2, 1)  value: 2, index: 1
// ...
console.log(arr1); // [1, NaN, NaN, NaN, NaN]

console.log(parseInt(10101010101, 2)); //parseInt 可以传入第二个参数
console.log(parseInt(2, 1)); // NaN
```

## Map
功能：键值一一对应。
```js
let m = {};
let x = {
        id: 1
    },
    y = {
        id: 2
    };
m[x] = 'foo';
m[y] = 'bar'; // Object.prototype.toString()
console.log(m); // {[object Object]: 'bar'}
console.log(m[x]); // bar
console.log(m[y]); // bar

let map = new Map();
map.set(x, 'foo');
map.set(y, 'bar');
console.log(map);
console.log(map.get(x)); // foo
console.log(map.get(y)); // bar
```
具备iterator接口的数据结构。
```js
// 数组作为参数，该数组的成员是一个个标识键值对的数组
let m = new Map([
    ['name', 'zhangsan'],
    ['age', 20]
]);
console.log(m); // {'name' => 'zhangsan', 'age' => 20}
```
如果同一个键多次赋值，后面的值将覆盖前面的值
```js
let map = new Map();
map.set(1, 'foo');
map.set(1, 'bar');
console.log(map); // {1 => 'bar'}
```
只有对同一个对象的引用，Map结构才视为同一个键。
```js
let map = new Map();
map.set(['a'], 555);
console.log(map.get(['a'])); // undefined 两个不同的数组实例
```
同样的值的两个实例，在Map结构中被视为两个键
```js
let map = new Map();
const k1 = ['a'];
const k2 = ['a'];
map.set(k1, 111).set(k2, 222);
console.log(map.get(k1)); // 111
console.log(map.get(k2)); // 222
```

### 遍历
```js

```
### 实例操作方法
```js
let m = new Map();
let x = {
        id: 1
    },
    y = {
        id: 2
    };
m.set(x, 'foo');
m.set(y, 'bar');

console.log(m.size); // 2
console.log(m.has(x)); // true
console.log(m.delete(x)); // true
m.clear();
console.log(m);
```