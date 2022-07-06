---
autoGroup-2: ES6
sidebarDepth: 3
title: day06
---

## setPrototypeOf
```js
function Person() {
    this.name = 'zhangsan';
    this.age = '18';
}

let person = new Person();
person.__proto__ = {};
// 不使用原因：1. 内部属性；2. 访问效率慢； 3. 所有继承自该原型的对象都会影响到。

// 更改原型
Object.setPrototypeOf();

// 读取原型
Object.getPrototypeOf();

// 创建原型
Object.create(obj); 
```
指定原型
```js
let proto = {
    y: 20,
    z: 40
};
let obj = {
    x: 10
};

let obj1 = Object.setPrototypeOf(obj, proto); //obj为目标对象，proto为指定的原型
console.log(obj1 === obj);
console.log(obj);
```
参数：第一个参数不是对象，会自动转为对象，并返回第一个参数。由于undefined和null不能转为对象，所以放在第一个参数会报错。
```js
console.log(Object.setPrototypeOf(1, {}) === 1); // true
console.log(Object.setPrototypeOf('foo', {}) === 'foo'); // true
console.log(Object.setPrototypeOf(true, {}) === true); // true
```

Object.getPrototypeOf(obj)：读取一个对象的原型对象。如果参数不是对象，会被自动转为对象。
```js
console.log(Object.getPrototypeOf(1) === Number.prototype); // true
console.log(Object.getPrototypeOf('foo') === String.prototype); // true
console.log(Object.getPrototypeOf(true) === Boolean.prototype); // true
```

## 对象4种遍历方法
1. Object.keys()：返回一个数组
```js
var obj = {
    foo: 'bar',
    baz: 42
}
console.log(Object.keys(obj)); // ['foo', 'baz']

 // 返回可枚举属性（不含继承属性）
const foo = {
    a: 1,
    b: 2,
    c: 3
}
Object.defineProperties(foo, {
    d: {
        value: 4,
        enumerable: true
    },
    f: {
        value: 5,
    }
})

console.log(Object.keys(foo)); // ['a', 'b', 'c', 'd']
```
2. Object.values()：返回一个数组
```js
const obj = {
    foo: 'bar',
    baz: 42
};
console.log(Object.values(obj)); // ['bar', 42]

// 返回自身的可遍历属性
const obj = Object.create({}, {
    p: {
        value: 42
    }
});
console.log(Object.values(obj)); // []
// enumerable设置为true
const obj = Object.create({}, {
    p: {
        value: 42,
        enumerable: true
    }
});
console.log(Object.values(obj)); // [42]



// 会过滤Symbol值的属性
const obj = {
    [Symbol()]: 123,
    foo: 'abc'
}
console.log(Object.values(obj)); // ['abc']

// 参数为非对象，会先转为对象
// 字符串：转为类数组对象{0: 'f', 1: 'o', 2: 'o', 'length':3}
const arr = Object.values('foo');
console.log(arr); // ['f', 'o', 'o']

// 数值和布尔值：包装对象不能为实例添加非继承的属性
console.log(Object.values(42)); // []
console.log(Object.values(true)); // []
```
3. Object.entries()：返回一个数组
```js
const obj = {
    foo: 'bar',
    baz: 42
};
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
```
应用：
- 1. 遍历对象的属性
```js
let obj = {
    one: 1,
    two: 2
};
for (let [key, value] of Object.entries(obj)) {
    console.log(`${JSON.stringify(key)}: ${JSON.stringify(value)}`); //'one': 1, 'two': 2
}
```
- 2. 将对象转为真正的Map结构
```js
const obj = {
    foo: 'bar',
    baz: 42
};
const map = new Map(Object.entries(obj));
console.log(map); // Map(2) {'foo' => 'bar', 'baz' => 42}
```
4. Object.fromEntries()：将一个键值对数组转为对象
```js
const entries = new Map([
    ['foo', 'bar'],
    ['baz', 42]
]);
console.log(Object.fromEntries(entries)); // {foo: 'bar', baz: 42}
```
应用：配合URLSearchParams对象，将查询字符串转为对象
```js
const params = new URLSearchParams('foo=bar&baz=qux');
console.log(Object.fromEntries(params)); // {foo: 'bar', baz: 'qux'}
```
