---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day11
---

## 对象克隆
- 浅拷贝
- 深拷贝
  
## 浅拷贝
```js
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140,
    son: {
        first: 'Jucy',
        second: 'Marry'
    }
}

var person2 = {}

for(var key in person1){
    person2[key] = person1[key];
}
console.log(person2)
```
此时person2中的属性与person1相同，如果改变person2中son的值
```js
person2.son.third = 'Asha';
```
则person1中son属性的属性值也会发生改变。使用clone函数优化拷贝
```js
function clone(origin, target){
    for(var key in origin){
        target[key] = origin[key];
    }
}
```
当在对象原型上添加属性后再次拷贝
```js
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140,
    son: {
        first: 'Jucy',
        second: 'Marry'
    }
}
var person2 = {}
Object.prototype.num = 1;
clone(person1, person2);
consoe.log(person2);
```
此时原型上的属性num也会在person2属性中显示。要求不显示原型属性，再次优化
```js
function clone(origin, target){
    for(var key in origin){
        if(origin.hasOwnProperty(key)){
            target[key] = origin[key];
        }
    }
}
```
对clone优化
```js
function clone(origin, target){
    var tar = target || {};
    for(var key in origin){
        fi(origin.hasOwnProperty(key)){
            tar[key] = origin[key];
        }
    }
    return tar;
}

var person2 = clone(person1);
person2.son.third = 'Ben';
```
修改person2中son属性，也会导致person1中son的属性发生改变。这是浅拷贝本身的问题。

## 深拷贝
```js
Object.prototype.num = 1;
var person1 = {
    name: '张三',
    age: 18,
    sex: 'male',
    children: {
        first: {
            name: 'One',
            age: 13
        },
        second: {
            name: 'Two',
            age: 18
        },
        third: {
            name: 'Three',
            age: 20
        }
    },
    car: ['Benz', 'Mazda']
}

function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrType = '[object Array]';
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            if (typeof(origin[key]) === 'object' && origin[key] !== null) {
                if (toStr.call(origin[key]) === arrType) {
                    target[key] = [];
                } else {
                    target[key] = {}
                }
                deepClone(origin[key], target[key]);
            } else {
                target[key] = origin[key]
            }
        }
    }
    return target;
}

var person2 = deepClone(person1);
console.log(person2);
person2.children.forth = {
    name: 'Four',
    age: 20
}
console.log(person2);
```
可以使用JSON

### 练习
1. 例一
```js
function test(){
    console.log(foo);
    var foo = 2;
    console.log(foo);
    console.log(a);
}
test();
/**
 * undefined
 * 2
 * Uncaught ReferenceError: a is not defined
*/
```
2. 例二
```js
function a(){
    var test;
    test();
    function test(){
        console.log(1);
    }
}
a();
/**
 * 1
*/
```
3. 例三
```js
var name = '222';
var a = {
    name: '111',
    say: function(){
        console.log(this.name);
    }
}

var fun = a.say;
// var fun = function(){
//     console.log(thi.name)
// }
fun(); // '222'
a.say(); // '111'
var b = {
    name: '333',
    say: function(fun){
        fun();
    }
}
b.say(a.say); // '222'
b.say = a.say;
b.say(); // '333'
```
4. 例四
```js
function test(){
    var marty = {
        name: 'marty',
        printName: function(){
            console.log(this.name);
        }
    }

    var test1 = {
        name: 'test1'
    }
    var test2 = {
        name: 'test2'
    }
    var test3 = {
        name: 'test3'
    }
    test3.printName = marty.printName;
    marty.printName.call(test1); // test1
    marty.printName.apply(test2); // tets2
    marty.printName(); // marty
    test3.printName(); // test3
}
test();
```
5. 例五
```js
var bar = {
    a: '1'
};
function test(){
    bar.a = 'a';
    Object.prototype.b = 'b';
    return function inner(){
        console.log(bar.a); // a
        console.log(bar.b); // b
    }
}
test()();
```

### 作业
1. 写出下列输出结果
```js
function Foo(){
    getName = function(){
        console.log(1);
    }
    return this;
}
Foo.getName =function(){
    console.log(2);
}
Foo.prototype.getName = function(){
    console.log(3);
}
var getName = function(){
    console.log(4);
}
function getName(){
    console.log(5);
}
Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName();// 1
new Foo.getName();// new (Foo.getName())  2
new Foo().getName();// (new Foo()).getName()  3
new new Foo().getName();// 3
```

2. 请用`window.prompt`接受用户输入的年份，判断是否是闰年？请用三目运算来做
```js

var year = window.prompt('请输入年份');
/**
 * 1. 整除4 并且不能整除100
 * 2. 整除400
 */
console.log(isLeapYear(year));

function isLeapYear(year) {
    // if ((year % 4 === 0 && year % 100 !== 0) ||
    //     year % 400 === 0) {
    //     return '是闰年';
    // } else {
    //     return '不是闰年';
    // }

    return (year % 4 === 0 && year % 100 !== 0) ||
    (year % 400 === 0) ?
    '闰年' :
    '不是闰年';
}
```
