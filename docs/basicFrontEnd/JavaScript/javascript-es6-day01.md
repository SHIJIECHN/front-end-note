---
autoGroup-2: ES6
sidebarDepth: 3
title: day01
---

## let
与let相关的概念：块级作用域。    
```js
// 1. if
if(1){

}

// 2. for
for(;1;){

}

// 3. 括号{}
{

}
```
let的特征：
1. let在同一作用域下不可重复声明。
```js
// 全局作用域
let a = 1;
let a = 1; // Identifier 'a' has already been declared

// 函数作用域: let和var都不行
// 1) 重复let声明
function test(){
    let a = 1;
    let a = 2; // Identifier 'a' has already been declared
}
test(); 
// 2) 使用var声明
function test(){
    let a = 1;
    var a = 1; // 报错 不能重复声明
}
test();
// 3) 形参和let，形参变量a在预编译的时候已经定义了
function test(a){
    let a = 10; // Identifier 'a' has already been declared
    console.log(a);
}
test(1); // 报错

// 括号块级{}
function test(a){
    {
        let a = 10;
        console.log(a); // 10
    }
    console.log(a); //undefined 
}
test()
```
2. let不会声明提升，会产生一个暂时性死区
```js
// 全局环境
console.log(a); //  Cannot access 'a' before initialization
let a = 10;

// 函数作用域
function test(){
    console.log(a); //  Cannot access 'a' before initialization
    let a = 10;
}
test();
// 在let所对应的作用域范围内，let都不会提升。


/***************练习***********************/
var a = a;
console.log(a); // undefined

let b = b; // Cannot access 'b' before initialization
console.log(b);

function test(x = y, y = 2) { // Cannot access 'y' before initialization
    console.log(x, y);
}
test();

// typeof不再安全
console.log(typeof c); // Cannot access 'c' before initialization
let c;
```
3. let只能在当前的作用域下生效
```js
// 括号块级{}
{
    let a = 1;
}
console.log(a); // a is not defined

// if 
if(1){
    let a = 1;
}
console.log(a); // a is not defined

// for
for(;1;){
    let a = 1;
    break;
}
console.log(a); // a is not defined

for(let i = 0; i < 10; i++){
    //...
}
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
    i++; // 此时i = 'a'; i++为NaN
    console.log(i); //  NaN
}
/*******************************************/
for (var i = 0; i < 10; i++) {
    var i = 'a';
    console.log(i); // 'a'
}
// 分析：
var i = 0;
var i; // 声明提升
for(;i < 10; ){
    i = 'a';
    console.log(i); // a
    i++; // NaN
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
*/
// 等同于
{
    let i = 1; 
    {
        let i = 'a'; // 内部重新定义了变量i，和外面i没有关系
        console.log(i); // a
    }
    i++;
    console.log(i); // 2
}
// for循环中小括号()的作用域类似与父级作用域

for(let i = 0; i < 10; i++){
    i = 'a';
    console.log(i);
}
// 等同于
{
    let i = 1; 
    {
        i = 'a'; // 内部没有i，会向父级作用域查询，所以改变的是外部i的值
        console.log(i); // a
    }
    i++;
    console.log(i); // NaN
}
// 相当于将a的值进行修改了

var x = 1;
function foo(x, y = function(){ x = 2; console.log(x)}){
    var x = 3;
    y();
    console.log(x);
}
foo();
console.log(x);
/**
运行结果：2 3 1
*/
/*******************************************/
```
for循环设置循环变量的那部分是一个父作用域，而循环体内是一个单独的子作用域。    
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

函数声明提升，是提升到当前块级作用域上，不能提升到外面。
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