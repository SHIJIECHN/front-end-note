---
autoGroup-2: ES6
sidebarDepth: 3
title: Symbol
---

## Symbol
解决对象属性名重名问题。是原始值类型。不是构造函数，不能使用new命令。

相同参数的Symbol函数的返回值是不相等的
```js
let s1 = Symbol;
console.log(s1); // 构造函数

// 没有参数
let s1 = Symbol();
let s2 = Symbol();
console.log(s1 === s2); // false 

// 有参数
let s1 = Symbol('foo');
let s2 = Symbol('foo');
console.log(s1 === s2); // false

let obj = {
    a: 1
}
let s1 = Symbol(obj); // Object.prototype.toString();
console.log(s1); // Symbol([object Object])

console.log(Symbol(undefined)); // Symbol()
console.log(Symbol(null)); // Symbol(null)
// 与函数传参类似
```
1. 运算
```js
let s1 = Symbol(null);
console.log(s1 + 1); // Cannot convert a Symbol value to a number。报错，不能转Number类型。
console.log(String(s1)); // Symbol(null)
console.log(Boolean(s1)); // true
// 隐式转换
console.log(!s1); // false  隐式转换仅限于Boolean
console.log(s1 + ''); //  Cannot convert a Symbol value to a string 
```
## Symbol原型
- toString
```js
let s1 = Symbol(null);
console.log(s1); // Symbol(null)
console.log(Object.getPrototypeOf(s1));
console.log(s1.toString()); // Symbol(null)
```
- Symbol.for()
接收一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有就直接返回这个Symbol值，否则就新建一个以该字符串为名称的Symbol值
```js
let s1 = Symbol.for('foo'); // key = 'foo'
let s2 = Symbol.for('foo');
console.log(s1 === s2); // true
```
- Symbol.for()
```js
let s = Symbol();
let s1 = Symbol.for('foo'); // key = 'foo'
let s2 = Symbol.for('foo');
console.log(Symbol.keyFor(s1)); // foo
console.log(Symbol.keyFor(s1) === Symbol.keyFor(s2)); // true
console.log(Symbol.keyFor(s)); // undefined
```

## 作为属性名
Symbol值作为对象属性名时，不能用点运算符。
```js
let name = Symbol();
let person = {};
// 方式一
person[name] = 'zhangsan';

// 方式二
let person = {
    [name]: 'zhangsan'
};

// 方式三
Object.defineProperty(person, name, {
    value: 'zhangsan'
});

console.log(person); // {Symbol(): 'zhangsan'}

// 访问
console.log(person[name]); // zhangsan
console.log(person.name); // undefined  person.name->person['name']

/**************************************************/
// 方法名
let name = Symbol();
let eat = Symbol();
let person = {
    [name]: 'zhangsan',
    [eat]() {
        console.log(this[name]);
    }
}
person[eat](); // zhanhsan
```
## 遍历
Symbol作为属性名时，不会出现在for...in和for...of循环中，也不会被Obect.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。    
对象Symbol属性遍历：Object.getOwnPropertySymbols(obj) 返回数组。
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';
obj.c = 'c'

// for...in 循环不能遍历Symbol属性
for (let i in obj) {
    console.log(i);
}

// Object.assign可以复制
let obj1 = {}
Object.assign(obj1, obj);
console.log(obj1); // {c: 'c', Symbol(a): 'hello', Symbol(b): 'world'}

// Object.getOwnPropertySymbols遍历Symbol属性
let key = Object.getOwnPropertySymbols(obj);
console.log(key); // [Symbol(a), Symbol(b)]
```
练习
```js
const obj = {
    c: 1,
    d: 2
}
let a = Symbol('a');
let b = Symbol('b');
let _a = Symbol('_a');
let _b = Symbol('_b');

obj[a] = 'hello';
obj[b] = 'world';

Object.defineProperties(obj, {
    e: {
        value: 5,
        enumerable: true
    },
    f: {
        value: 6,
        enumerable: false
    },
    [_a]: {
        value: -1,
        enumerable: true
    },
    [_b]: {
        value: -2,
        enumerable: false
    }
})

let h = Symbol('h');
let i = Symbol('i');
let j = Symbol('j');

const obj1 = {
    g: 7,
    [h]: 8
}

Object.defineProperties(obj1, {
    [i]: {
        value: 9,
        enumerable: true
    },
    [j]: {
        value: 10
    },
    k: {
        value: 11
    }
})
Object.setPrototypeOf(obj, obj1);
console.log(obj);

// for...in 可以循环遍历自身和继承的可枚举属性（不包含Symbol类型的值）
for (let i in obj) {
    console.log(i); // c, d, e, g
}

// （遍历自身可枚举的）不包含Symbol类型的属性
let keys = Object.keys(obj)
console.log(keys); // ['c', 'd', 'e']

// (遍历自身)Symbol类型的属性
let s = Object.getOwnPropertySymbols(obj);
console.log(s); // [Symbol(a), Symbol(b), Symbol(_a), Symbol(_b)]

// 拷贝自身可枚举属性，包含Symbol类型的值
let obj3 = {}
Object.assign(obj3, obj);
console.log(obj3);

// JSON.stringify() 遍历自身可枚举属性
```