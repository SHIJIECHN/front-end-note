---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: day02
---
## 循环
在JavaScript中有两种常用的循环：for循环与while循环。下文分别讨论这两个循环
```js
for(var i = 0; i < 100; i++){
    console.log(i)
} 
```
将上面循环进行分解，步骤：
* 1、声明变量 i = 0
* 2、if(i < 10){
        console.log(i)
    }
* 3、i++
* 4、if(i < 10){  不满足条件 停止循环
        console.log(i)
    }

`i`的声明可以单独提到外面，即：
```javascript
var i = 0;
for(; i < 10;){
    console.log(i)
    i++
}
```
同`while`循环非常相似，所以也可以写成：
```javascript
var i = 0;
while(i < 10){
    console.log(i);
    i++
}
```
所以`for`循环可以转换成`while`循环。  
不使用break终止循环。
```js
var i = 1;
for(; i;){
    console.log(1);
    i++;
    if(i == 10){
        i = 0; // 当i为假时就终止循环
    }
}
```
从0开始做加法，加到什么时候总和是小于100的
```js
var sum = 0;
for(var i = 0; i < 100; i++){
    sum += i;
    
    if(sum > 100){
        break;
    }
    console.log(i, sum);
}
```
100以内的数跳过可以被7整除，或个位数是7的数
```js
for(var i = 0; i <= 100; i++){
    if(i % 7 == 0 || i % 10 == 7){
        continue;
    }
    console.log(i);
}
```
打印0-99的数，（）只能有一句，不能写比较，{}不能出现i++或i--
```js
var i = 100;
for(; i--;){
    console.log(i);
}
```
10的n次方
```js
var n = 5;
var num = 1;
for(var i = 0; i < n; i++){
    num *= 10;
}
console.log(num);
```
n的阶乘
```js
var n = 5;
var res = 1;
for(var i = 1; i <= 5; i++){
    res *= i;
} 
console.log(res);
```
789打印出字符串987
```js
var num = 789;
var a = num % 10;
var b = (num - a) % 100 /10;
var c = (num - a - b * 10) / 100;
console.log(''+ a + b + c);
```
打印三个数中的最大数
```js
var a = 1,
    b = 2,
    c = 3;
if(a > b){
    if(a > c){
        console.log(a);
    }else {
        console.log(c);
    }
}else{
    if(b > c){
        console.log(b);
    }else{
        console.log(c);
    }
}
```
打印100以内的质数（仅能被1和自己整除的数）
```js
var c = 0;
for(var i = 2; i < 100; i++){
    for(var j = 1; j <= i; j++){
        if(i % j == 0 ){
            c++;
        }
    }
    if(c == 2){
        console.log(i);
    }

    c = 0;
}
```
## 引用值
object、array、function、date、RegExp
### array数组

## typeof
number string boolean function undefined    
object = 引用类型 object/array/null/
```js
console.log(a);// 报错
console.log(typeof(a)); // undefined
console.log(typeof(typeof(a))); // string
```
typeof(typeof(...))一定是string

## 类型转换
### 显示类型转换
- 1. Number
```js
var a = '123';
console.log(Number('123'));// 123
console.log(Number(true));// 1
console.log(Number(false));// 0
console.log(Number(null));// 0
console.log(Number(undefined));// NaN
console.log(Number('a'));// NaN
console.log(Number('1a'));// NaN
console.log(Number(3.14));// 3.14
```
- 2. parseInt 一定是和数字相关
```js
var a = '123';
console.log(parseInt('123'));// 123
console.log(parseInt(true));// NaN
console.log(parseInt(false));// NaN
console.log(parseInt(null));// NaN
console.log(parseInt(undefined));// NaN
console.log(parseInt(3.14)); // 3
console.log(parseInt('abc123')); // NaN
console.log(parseInt('123abc')); // 123
console.log(parseInt('3.99')); // 3 不会四舍五入
```
parseInt(a, radix) radix基数
- parsFloat
```js
console.log(parseFloat('3.1465').toFixed(2)); // 3.15 四舍五入
```
- String/toString
```js
console.log(String(123)); // '123'
```
### 隐式类型转换
```js
var a = '123'; // Number(a)
a++;
console.log(a); // 124
/*************************/
var a = 'a' + 1; // String(1)
console.log(a);// a1
/*************************/
var a = '1' * 2; // * / - % str->number
console.log(a); // 2
/*************************/
var a = '1' > 2; // number > < >= <=
console.log(a); // false
var b = 'a' > 'b'; // ASCII码
console.log(b); // false
/*************************/
var a1 = 2 > 1 > 3; // 2 > 1 => true => 1, 1 > 3 => false
var a2 = 2 > 1 == 1; // 2 > 1=> true => 1, 1 == 1 => true
console.log(a1, a2);// false, true
/*************************/
var a1 = undefined > 0; //
var a2 = null > 0;
console.log(a1, a2); // false, false
/*************************/
console.log(undefined == null); // true
console.log(undefined === null); // false
/*************************/
```
isNaN方法
```js
console.log(isNaN(NaN));// true
console.log(isNaN(123)));// false
console.log(isNaN('a')));// true
console.log(isNaN(null)));// true
console.log(isNaN(undefined)); // true
```
 Number(值) -> NaN -> bool

## 练习
1. 斐波那契数列
```js
var n = parseInt(window.prompt('请输入第几位'));
    if(n <=0){
        console.log('输入错误');
    }else{
        var n1 = 1, 
        n2 = 2,
        n3;
        if(n <= 2){
            console.log(1)
        }else{
            for(var i = 2; i < n; i++){
                n3 = n1 + n2;
                n1 = n2;
                n2 = n3;
            }
            console.log(n3);
        }
    }
```