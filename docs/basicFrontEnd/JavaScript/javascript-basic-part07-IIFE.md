---
autoGroup-3: JavaScript基础
title: 立即执行函数
---

## 特点
立即执行函数（immediately-invoked functionexpression, IIFE）：自动执行，执行完成以后立即释放。功能性称为初始化函数。

## 写法
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
立即执行函数可以写函数名，也可以带参数。但是直接访问`test`会出现引用错误，这说明立即执行函数执行完后立即释放。
```js
(function test(a, b){
    console.log(a + b) // 3
}(1, 2));
```
可以`return`返回值
```js
var num = (function(){
    return a + b;
}(1, 2));
console.log(num); // 3
```
只有函数表达式才能被执行符号执行
```js
// 可以执行
(function test1(){
    console.log(1)
})()

// 可以执行
var test2 = function(){
    console.log(2)
}()

// 不能执行
function test3(){
    console.log(3)
}()
```
将函数声明转化为表达式后就可以使用执行符号立即执行该函数，并且该函数声明的函数名会自动被忽略掉。
函数声明变成表达式的方法：+ - ！ || &&
```js
+ function test(){  }()
- function test(){  }()
```
当括号中带有参数时，JS引擎会将下面写法解析为表达式
```js
function test(a){
    console.log(a)
}(6)
```
## 应用
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
当`i = 0`时，进入`for`循环，执行
```js
arr[i] = function(){
    document.write(i + ' ')
}
```
将匿名函数赋给`arr[0]`，但是函数没有执行。当`i = 9`的时候，再执行`arr[9]`再保存一个匿名函数，直到`i = 10`跳出循环，执行`return arr`，`arr`中保存了十个匿名函数，相当于`return`匿名函数出去了，此时形成了闭包。注意执行`return arr`的时候，此时对应的`i = 10`。
外部再次循环执行匿名函数时，获取`i`的值，此时`test`函数的`AO`中`i`已经变成`10`了。因为`test`函数执行结束，`test`函数的`AO`并没有被销毁，被`arr`中的匿名函数“拿着”，`test`的`AO`有一个变量`i`，当`return arr`时，`i`已经循环到`10`了，所以匿名函数执行时，查找的是`test`的`AO`中的变量`i`为`10`。

需要打印0~9：
- 第一种方式
```js
// 第一种
function test(){
    for(var i = 0 ; i < 10; i++){
        (function(){
            document.write(i + ' ')
        })();
    }
}
test();
```
- 第二种方式
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

- 第三种方式
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
- 逗号运算符
```js
var num = (1, 2)
console.log(num);// 2 逗号运算符只返回最后一个

var fn = (
    function test1(){
        return 1;
    },

    function test2(){
        return '2'
    }
)();
console.log(typeof(fn));
```
- 表达式
```js
var a = 10;
if(function b(){}){
    a += typeof(b)
}
console.log(a)
/**
 * (function b(){})是一个表达式，表达式忽略函数名，执行后立即释放了，函数不存在了。所以typeof(b)是undefined
*/
```
- 累加器
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
- 缓存器
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