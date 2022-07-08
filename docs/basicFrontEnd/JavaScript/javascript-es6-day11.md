---
autoGroup-2: ES6
sidebarDepth: 3
title: 11. Symbol、iterator、forOf、typeArray
---

## 拓展运算符
```js
// 对象合并
let obj1 = {
    a: 1,
    b: 2,
    c: 3
}
let obj2 = {
    a: 4,
    d: 5,
    e: 6
}

// 方式一
Object.assign(obj1, obj2);
console.log(obj1); // {a: 4, b: 2, c: 3, d: 5, e: 6}

// 方式二
let obj = {
    ...obj1,
    ...obj2
}
console.log(obj); // {a: 4, b: 2, c: 3, d: 5, e: 6}
```
区别：Object.assign()合并对象，能够合并getter和setter操作函数

## iterator迭代器
迭代器用于我们迭代的一种工具，对数据结构的读取的一种方式，有序的，连续的，基于拉取的一种消耗数据的组织方式，一般迭代时数组是有序的，对象是无序的。
```js
let arr = [1, 2, 3, 4];
console.log(arr); // 原型中有一个迭代器方法
// 访问迭代器接口
let iter = arr[Symbol.iterator]();
console.log(iter.next()); // {value: 1, done: false}
console.log(iter.next()); // {value: 2, done: false}
console.log(iter.next()); // {value: 3, done: false}
console.log(iter.next()); // {value: 4, done: false}
console.log(iter.next()); // {value: undefined, done: true}
```
部署iterator的数据类型：Array, String, Map, Set, WeakMap, WeakSet, arguments, NodeList, TypedArray。

迭代器实现：
```js
function makeIterator(array) {
    let nextIndex = 0;
    return {
        next: function() {
            return nextIndex < array.length ? {
                value: array[nextIndex++],
                done: false
            } : {
                value: undefined,
                done: true
            }
        }
    }
}

let iter = makeIterator([1, 2, 3, 4]);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
```

## for...of
为能够部署iterator接口的数据类型提供简单统一的遍历方法。for...of实际上调用的就是当前的iterator。
```js
let arr = [1, 2, 3, 4];
for (let i of arr) {
    console.log(i); // 1, 2, 3, 4
}
```
对象是无序的，没有部署iterator接口，所以默认不能使用for...of迭代。但是可以通过手动部署iterator接口。
```js
let obj = {
    start: [1, 3, 2, 4],
    end: [5, 7, 6],
    [Symbol.iterator]: function() {
        let index = 0,
            arr = [...this.start, ...this.end],
            len = arr.length;
        return {
            next() {
                if (index < len) {
                    return {
                        value: arr[index++],
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    };
                }
            }
        }
    }
}

for (let i of obj) {
    console.log(i); // 1, 3, 2, 4, 5, 7, 6
}

// 扩展运算符
let arr = [...obj];
console.log(arr); // [1, 3, 2, 4, 5, 7, 6]
```

for...of 与 for...in的区别：
1. 主要区别在迭代方式上：for...in以任意顺序迭代对象的**可枚举属性**，for...of遍历可迭代对象定义要迭代的数据。
2. 迭代结果的区别：for...in通过in关键字的操作进行枚举，受可枚举对象属性是否可枚举(enumberale: false)的影响。for...of通过iterator底层的操作进行迭代，不受影响。
3. 迭代继承的属性：for...in可以枚举到继承的属性值，for...of并不能迭代到继承的属性值。

