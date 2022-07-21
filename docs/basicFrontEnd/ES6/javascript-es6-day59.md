---
autoGroup-2: ES6
sidebarDepth: 3
title: 数组扩展
---

## 新增方法
构造器上新增方法：Array.of(), Array.from()

- Array.of()
```js
// Array.of() 是取代new Array()而产生的
console.log(Array(3)); // [empty × 3]
console.log(Array.of(3)); // [3]
console.log(Array.of(3, 4, 5)); // [3, 4, 5]
```

- Array.from() 将部署了iterator接口的数据结构转为数组。
```html
<body>
    <p>1</p>
    <p>2</p>
    <p>3</p>
    <script>
        let oP = document.getElementsByTagName('p');
        console.log(oP);
        console.log(Array.prototype.slice.call(oP)); // [p, p, p]
        console.log(Array.from(oP)); // [p, p, p]
        console.log([...oP]); // [p, p, p]
    </script>
</body>
```
Array.from(arrayLike, mapFn, thisArg)：第二个参数类似于数组map()方法，用来对每个元素处理，将处理后的值放入返回的数组。
```js
Array.from(arrayLike, x => x * 2);
Array.from([1, 2, 3], (x) => x * x);// [1,4,9]
Array.from({ length: 2 }, () => 0); // [0, 0] 返回长度为2的数组
```

原型新增方法：fill, copyWithin, entries, find/findIndex, includes  
- arr.fill()：填充值。
arr.fill(value, start, end)：指定填充的起始位置和结束位置
```js
let arr = [1, 2, 3, 4];
let arr1 = arr.fill(5);
console.log(arr); // [5,5,5,5] 原数组发生改变

console.log(arr.fill(6, 1)); // [5, 6, 6, 6]
console.log(arr.fill(7, 1, 2)); // [5, 7, 6, 6]
console.log(arr.fill(8, -3, -2)); // [5, 8, 6, 6]

console.log([].fill.call({length: 3}, 4));// {0: 4, 1: 4, 2: 4, length: 3}
```
- arr.entries()
```js
// 对象
let obj = {
    a: '1',
    b: '2',
    c: '3'
}

console.log(Object.keys(obj)); // ['a', 'b', 'c']

let objKeys = Object.keys(obj);

for (let i = 0; i < objKeys.length; i++) {
    console.log(objKeys[i]); // a, b, c
}

for (let key of objKeys) {
    console.log(key); // a, b, c
}

// 数组
let arr = ['a', 'b', 'c'];
console.log(arr.keys()); // Array Iterator {} 迭代器对象
console.log(arr.values()); // Array Iterator {} 迭代器对象
console.log(arr.entries()); // Array Iterator {} 迭代器对象

let iter = arr.values();
console.log(iter.next()); // {value: 'a', done: false}
console.log(iter.next()); // {value: 'b', done: false}
console.log(iter.next()); // {value: 'c', done: false}
console.log(iter.next()); // {value: undefined, done: false}

// 不能使用for循环，因为iter没有length属性。要是用for...of
for (let val of arr.values()) {
    console.log(val); // a, b, c
}
```
- arr.find()/arr.findIndex()
arr.find()：找出第一个复合条件的数组成员。   
arr.findIndex()：返回第一个符合条件的数组成员的位置。没有符合条件的返回-1。
```js
let arr = [1, 4, 3, -4, 5, 0];
let arr1 = arr.find(function(val, idx, arr) {
    return val > 3
})

console.log(arr1); // 4

let index = arr.findIndex(function(val, idx, arr) {
    return val > 3
})

console.log(index); // 1

// 与indexOf区别
console.log([NaN].indexOf(NaN)); // -1
console.log([NaN].findIndex(y => Object.is(NaN, y))); // 0
```
- arr.includes()
```js
let arr = [1, 4, 3, -4, 5, NaN, 0];
console.log(arr.includes(1)); // true
console.log(arr.includes(NaN)); // true
```
