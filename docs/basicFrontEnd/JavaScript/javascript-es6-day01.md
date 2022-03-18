---
autoGroup-2: ES6
sidebarDepth: 3
title: day01
---

## let
let的特征：
1. 在同一作用域下不可重复声明
```js
function test(){
    let a = 1;
    var a = 1; // 报错 不能重复声明
}


function test(a){
    let a = 10; // Identifier 'a' has already been declared
    console.log(a);
}
test(1); // 报错
```
2. 不会提升会产生一个暂时性死区
```js
console.log(a); //  Cannot access 'a' before initialization
let a = 10;
/**************************************/
var a = a;
console.log(a); // undefined
/**************************************/
let b = b; // Cannot access 'b' before initialization
console.log(b);
/**************************************/
function test(x = y, y = 2) { // Cannot access 'y' before initialization
    console.log(x, y);
}
test();
/**************************************/
console.log(typeof a); // Cannot access 'a' before initialization
let a;
```
3. 只能在当前的作用域下生效
```js
{
    let a = 1;
}
console.log(a); // a is not defined

if(1){
    let a = 1;
}
console.log(a); // a is not defined

for(;1;){
    let a = 1;
    break;
}
console.log(a); // a is not defined

for(let i = 0; i < 10; i++){}
console.log(i); // i is not defined
/*******************************************/
var arr = [];
for (var i = 0; i < 10; i++) {
    arr[i] = function() {
        console.log(i);
    }
}

for (var k = 0; k < 10; k++) {
    arr[k]();
}
/**
运行结果： 10 10 10 10 10 10 10 10 10 10
*/
for (var i = 0; i < 10; i++) {
    arr[i]();
}
/**
运行结果：0 1 2 3 4 5 6 7 8 9
*/
// 因为后面的for循环再次声明了i，覆盖了前面for循环的i声明

/*******************************************/
for (var i = 0; i < 10; i++) {
    i = 'a';
    console.log(i); // a
}
// 分析：
var i = 0;
for (; i < 10;) {
    i = 'a';
    console.log(i); // a
    i++;
    console.log(i); // NaN
}
/*******************************************/
for (var i = 0; i < 10; i++) {
    var i = 'a';
    console.log(i); // 'a'
}
/*******************************************/
for (var i = 0; i < 10; i++) {
    let i = 'a';
    console.log(i); 
}
/*
运行结果：a a a a a a a a a a a
*/
/*******************************************/
for (let i = 0; i < 10; i++) {
    var i = 'a'; // Identifier 'i' has already been declared
    console.log(i);
}
// 用var会产生变量提升
/*******************************************/
for (let i = 0; i < 10; i++) {
    let i = 'a';
    console.log(i);
}
/*
运行结果：a a a a a a a a a a
{
    let i = 0;
    {
        let i = 'a';
        console.log(i);
    }
    i++;
}
*/
// for循环中小括号()的作用域类似与父级作用域
if (1) {
    let a = 1; 
    {
        let a = 10;
        console.log(a); // 10
    }
    console.log(a); // 1
}

if (1) {
    let a = 1; 
    {
        a = 10;
        console.log(a); // 10
    }
    console.log(a); // 10
}
// 相当于将a的值进行修改了
/*******************************************/
```
let本质上就是为js增加一个块级作用域。不建议在块级作用域中，采用函数声明的方式来声明函数，而用函数表达式的方式。

块级作用域是没有返回值的。
```js
if(1){
    return a;
}

var a = for(;1;1){
    return
}
```

函数提升，是提升到当前块级作用域上，不能提升到外面。
```js
{
    let a = 1;
    {
        function a(){}
    }
    console.log(a); // 1
}

```

## const
1. 一旦定义必须赋值，值不能被更改。
2. 有块级作用域，不能提升，有暂时性死区。
3. 与let一样不能重复声明。

冻结对象
```js
const obj = {};

Object.freeze(obj);
obj.name = 'zhangsan'; // // Cannot add property name, object is not extensible
console.log(obj); // {} 冻结的对象不能修改

/****************************************/
function myFreeze(obj) {
    Object.freeze(obj);
    for (var key in obj) {
        if (typeof(obj[key] === 'object') && obj[key] !== null) {
            Object.freeze(obj[key])
        }
    }
}

var person = {
    son: {
        name: 'zhangsan',
        age: 19
    },
    car: ['benz', 'mazda', 'BMW']
}

myFreeze(person);
person.son.weight = 140; //  Cannot add property weight, object is not extensible
person.car[3] = 'toyota';
console.log(person);
```

补充
```js
var a = 1; 
{
    let a = a; // Cannot access 'a' before initialization。 TDZ(Temporal Dead Zone)暂时性死区
    console.log(a);
}
```