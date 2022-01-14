---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day06
---

## 目标
- 掌握包装类型属性访问
- 字符串`length`属性访问原理
- 数组使用`length`截断
- `charCodeAt`获取字符位置

## 包装类
原始值没有自己的属性和方法
- `new Number`
- `new String`
- `new Boolean`

```js
var a = 1; // 原始值
console.log(a); // 1

var b = new Number(a);
b.len = 1;
b.add = function(){
  console.log(1);
}

var d = b + 1;
console.log(d); // 2 参与运算，返回的是原始值

console.log(b); // 对象
```
当一个数字经过`new Number()`以后，就会变成一个对象，成为对象后就可以给它设置属性和方法。

```js
consoole.log(new Number(undefined)); // 对象 NaN
consoole.log(new Number(null)); // 0

console.log(new String(undefined)); // "undefined"
console.log(new String(null)); // "null"

console.log(undefined.length); // Uncaught TypeError: Cannot read properties of undefined
console.log(null.length); // Uncaught TypeError: Cannot read properties of null
```
`undefined` 和 `null` 是不可以设置任何属性和方法的。

为什么`string`可以有`length`？-->通过包装类来访问（或者说字符对象即`new String()`, 有这个属性）
```js
var str = 'abc';

str.length = 1; // 原始值，new String(str).length = 1; (执行后发现没地方保存)
//delete 

// 又重新包装了一次  new String(str).length 经过包装类来访问
console.log(str.length);
```

数组可以通过`length`属性来截断
```js
var arr = [1, 2, 3, 4, 5];
arr.length = 3;
console.log(arr); // [1, 2, 3]

arr.length = 6;
console.log(arr); // [1, 2, 3, empty, empty, empty]
```

### 练习
1. 例一（笔试题）
```js
var name = 'languiji';
name += 10;  // languiji10

var type = typeof(name); // 'string'
if(type.length === 6){
  type.text = 'string'; // type是原始值，那你是顾客你要求的所以只能给你操作一遍
  // new String(type).text = 'string'; 执行完之后发现没有地方储存，所以自动删除
  // delete
}

console.log(type.text); // undefined
```
偏要让你输出type.text，怎么办？
```js
var type = new String(typeof(name));
```

2. 例二
```js
function Car(brand, brand){
  this.brand = 'Benz';
  this.color = 'red';
}

var car = new Car('Mazda', 'blank');
console.log(car); // Car {brand: 'Benz', color: 'red'}  没有把参数赋值，所以还是原来写好的值
```

3. 例三（笔试题）
```js
function Test(a, b, c){
  var d = 1;
  this.a = a;
  this.b = b;
  this.c = c;

  function f(){
    d++;
    console.log(d); // 先d++再打印的d, 所以加了1
  }

  this.g = f;
  // return this; -> 闭包。把Test构造函数的AO带出去了
}

var test1 = new Test();
test1.g(); // 2
test1.g(); // 3

var test2 = new Test();
test2.g(); // 2
```
4. 例四（笔试题）
```js
var x = 1,
    y = z = 0;
function add(n){
  return n = n + 1;
}

y = add(x);

function add(n){
  return n = n + 3;
}

z = add(x);

console.log(x, y, z); // 1  4  4

/**
GO = {
  x: undefined -> 1,
  y: undefined -> 0 -> 4,
  add: function add(){n+1} -> function add(){n+3},
  z: 0 -> 4,
}

AO = {
  n: undefined -> 1
}
*/
```

5. 例五（笔试题）：下列函数哪个能输出1,2,3,4,5
```js
function foo1(x){
  console.log(arguments); 
  return x;
}
foo1(1,2,3,4,5)

function foo2(x){
  console.log(arguments); 
  return x;
}(1,2,3,4,5); // 这个函数没有执行，被看成函数 + 一个表达式
// function foo2(x){
//   console.log(arguments); 
//   return x;
// } 
// (1,2,3,4,5)

(function foo3(x){
  console.log(arguments); 
  return x;
})(1,2,3,4,5)
```
foo1和foo3
> arguments存储传递的所有实参，不管你形参有几个，你实参传了几个都会被存储进去

6. 例六（面试题）
```js
function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 实参

  // 另一种
  arguments[2] = 10;
  console.log(a); // 映射关系
}
b(1,2,3); // 10
```

- ASCII码：表1（0 - 127），表2（128 - 255） 所有字符都是1个字节 byte
- Unicode码 涵盖ASCII码  256以后是2个字节.  

打印在Unicode中的位置：
```js
var str = 'a'
var pos = str.charCodeAt(0);
console.log(pos); // 97
```

### 作业
1. 写一个函数，接受任意一个字符串，算出这个字符串的总字节数
```js
function calculateByte(str){
  var totalByte = 0;
  for(var i = 0; i < str.length; i++){
    var pos = str.charCodeAt(i)
    if(pos < 256){
      totalByte += 1;
    }else {
      totalByte += 2;
    }
  }
  return totalByte;
}
console.log(calculateByte('123456是'))
```