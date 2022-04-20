---
autoGroup-2: ES6
sidebarDepth: 3
title: 对象拓展/iterator
---

## 拓展运算符
```js
// 拓展运算符
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

## iterator
迭代器。对数据结构的读取的一种方式，有序的，连续的，基于拉取的一种消耗数据的组织方式。
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
```