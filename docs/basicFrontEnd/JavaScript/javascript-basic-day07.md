---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 7.立即执行函数、闭包深入、逗号运算符 
---

## 立即执行函数 
### 1. 介绍
立即执行函数（immediately-invoked functionexpression, IIFE）也叫做初始化函数：自动执行，执行完成以后立即释放（也就是立即销毁）

### 2. 写法
立即执行函数是表达式
```js
// 第一种写法
(function(){
    // ...
})();

// 第二种写法
(function(){

}()); // W3C建议
```

### 3. 匿名函数的参数和返回值
立即执行函数可以写函数名，也可以带参数。但是直接访问`test`会出现引用错误，这说明立即执行函数执行完后立即释放。
```js
(function test(a, b){
    console.log(a + b) // 3
}(1, 2));
```
可以`return`返回值。
```js
var num = (function(a, b){
    return a + b;
}(1, 2));
console.log(num); // 3
```
立即执行函数也是有返回值的，要接收它的返回值就要把这个立即执行函数交给一个变量存。

### 4. 执行符号()的作用
1. 加上执行符号()。   
打印一个匿名函数，把匿名函数赋给了test就变成表达式了，将函数声明变成函数表达式，加上执行符号()，就可以立即执行。
```js
// 可以执行（1）
(function test1(){
    console.log(1)
})(); // 1

// 可以执行（2）
var test2 = function(){
    console.log(2)
}(); // 2

// 不能执行（3）
function test3(){
    console.log(3)
}()
```
结论：
- ()括号里面括任何东西都是表达式。包起来的数字、函数等都是表达式如上例（1），也可以转换成表达式
- 一定是表达式才能被执行符号()执行。

2. 没有执行符号()
```javascript
 var test = function() {
     console.log(1);
}
console.log(test); // ƒunction(){...}
```
打印一个匿名函数，没有执行符号()，就相当于把匿名函数赋给了test。
 
```js
var test = function(){
    console.log(1);
}(); // 1
console.log(test);// undefined
```
立即执行函数执行完就销毁。

### 5. 立即执行函数函数名
```javascript
(function test(){
    console.log(123);
})();

(function(){
    console.log(123);
})()
```
将函数声明转化为表达式后就可以使用执行符号立即执行该函数，并且该函数声明的函数名会自动被忽略掉，所以立即执行函数加不加函数名都一样。

## 函数声明变成表达式的方法
函数声明变成表达式的方法：+ - ！ || &&。||和&&前面要加东西。
```js
+ function test(){  }()
- function test(){  }()
undefined || function test(){  }()
1 && function test(){  }()

```
## 面试题
### 题目一： ()运算符
当括号中带有参数时，JS引擎会将下面写法解析为表达式
```js
function test(a){
    console.log(a); 
}(6); // 不会报错，但是`test`函数不会执行。

// 如果不传的话它就报错
function test(a) {
    console.log(1);
}(); // 报错

// ,是一个运算符
function test(a,b) {
    console.log(1);
}(6,5); // 不报错
```
结论：
- 不报错的原因：JS引擎认为它是表达式，所以它一看也是知道这个地方是立即执行一下，但是它一看里边有传值，还是优先把它解析为一个表达式，这个函数是不执行的，没有执行这个test。
- 如果没有传值的话它就会报错

### 题目二：逗号运算符
```javascript
var num = (2 - 1, 6 + 5, 24 + 1);
cosnole.log(num); // 结果：25 只返回最后一个
```
结论：逗号运算符只返回最后一个值

### 题目三：函数声明+立即执行符号()
1. 不报错
```javascript
function test(a) {

}(6); // 不报错
```
原因：
- 1. 函数声明不是表达式，所以不能立即执行。
- 2. 把括号理解成一个表达式

2. 报错
```javascript
function test(a) {

}(); // Uncaught SyntaxError: Unexpected token ')'
```
原因：如果()里什么都没写，它认为test函数声明后面跟一个人立即执行符号，它认为你这语法错误，就会报错。


## 闭包深入
### 问题
为什么会打印10个10，怎么解决？
```js
function test(){
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = function(){
            document.write(i + ' ')
        }
    }
    return arr;
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
/**
 * 运行结果：
 * 10 10 10 10 10 10 10 10 10 10
*/
```
分析函数执行结果，对函数中`for`循环进行改造：
```js
function test(){
    var arr = [];
    var i = 0
    for(; i < 10; ){
        arr[i] = function(){
            document.write(i + ' ')
        }
        i++;
    }
    return arr;
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
```
解释：
1. 当`i = 0`时，进入`for`循环，执行
```js
arr[i] = function(){
    document.write(i + ' ')
}
```
将匿名函数赋给`arr[0]`，但是函数没有执行。  
2. 当`i = 9`的时候，再执行`arr[9]`再保存一个匿名函数。   
3. 直到`i = 10`跳出循环，执行`return arr`，`arr`中保存了十个匿名函数，相当于`return`匿名函数出去了，此时形成了10个闭包, `arr[0]~arr[9]`。注意执行`return arr`的时候，此时对应的`i = 10`。    
4. 外部再次循环执行匿名函数时，获取`i`的值，此时`test`函数的`AO`中`i`已经变成`10`了。因为`test`函数执行结束，`test`函数的`AO`并没有被销毁，被`arr`中的匿名函数“拿着”，`test`的`AO`有一个变量`i`，当`return arr`时，`i`已经循环到`10`了，所以匿名函数执行时，查找的是`test`的`AO`中的变量`i`为`10`。

### 需要打印0~9，解决方案
- 第一种方式：立即执行函数
```js
function test(){
    for(var i = 0 ; i < 10; i++){
        (function(){
            document.write(i + ' ')
        })();
    }
}
test(); // 0 1 2 3 4 5 6 7 8 9 
```
- 第二种方式：借助外界力量，传入参数
```js
function test(){
    var arr = []
    for(var i = 0; i < 10; i++){
        arr[i] = function(num){
            document.write(num + ' ');
        }
    }
    return arr
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j](j);
}
```

- 第三种方式：立即执行函数并传入参数。每次循环都将i保存到匿名函数中（常用）
```js
function test(){
    var arr = []
    for(var i = 0; i < 10; i++){
        (function(j){
            arr[j]  = function(){
                document.write(j + ' ')
            }
        })(i)
    }
    return arr
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
```

## 练习
### 1. 立即执行函数 + 逗号运算符
```js
var num = (1, 2)
console.log(num);// 2 逗号运算符只返回最后一个
/**********************************/
var fn = (
    function test1(){
        return 1;
    },

    function test2(){
        return '2'
    }
)();
console.log(typeof(fn)); // string
```
### 2. 表达式
```js
var a = 10;
if(function b(){}){
    a += typeof(b)
}
console.log(a); // 10undefined
/**
if语句执行，假的只有undefined null '' 0 false NaN
*/
```
(function b(){})是一个表达式，表达式忽略函数名，执行后立即释放了，函数不存在了。所以打印函数名b的时候函数就不存在了，又因为b放在typeof里面所以不会报错，所以typeof(b)是undefined。


### 3. 累加器
  初始值为0，写一个闭包，执行一次函数就增加1并打印。
```js
function test(){
    var num = 0;
    function add(){
        console.log(++num)
    }
    return add;
}
```
### 4. 缓存器
  一般班级，学生名字保存在一个数组里，两个方法写在函数中的一个对象中，第一个方法是加入班级，第二个方法是离开班级。每次加入或离开都需要打印新的学生名单。
```js
function myClass(){
    var studentsName = []

    var operations = {
        join: function (name){
            studentsName.push(name)
            console.log(studentsName)
        },
        leave: function(name){
            let index = studentsName.indexOf(name)
            if(index !== -1){
                studentsName.splice(index,1)
            }
            console.log(studentsName)
        }
    }
    return operations;
}

var obj = myClass();
```
