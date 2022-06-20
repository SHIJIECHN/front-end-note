---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 19. 变量生命周期、垃圾回收原理
---


## 变量生命周期
1. 存在声明周期的变量也就是局部变量。
2. 局部变量只在函数执行过程中存在，当函数之心完它就不存在了。
3. 函数执行过程中，局部变量它是在堆或栈中分配相应的空间存储的，比如说原始值存在栈里边，引用值存在堆里边，给一个地址，然后把这个线连起来。
4. 在函数中，变量声明在函数结束后就被回收掉了，函数结束以后局部变量就没有存在的必要了，释放它们占用的内存。
```javascript
function test1(){
    var a= 0;
    return function(){
        a++;
        console.log(a);
    }
}

var test = test1();
test(); // 1
test(); // 2
test(); // 3
```

## 垃圾回收机制
1. 找出不再使用的变量
2. 释放其占用内存
3. 固定的时间间隔进行

### 1. 标记清除
垃圾回收机制：mark and sweep。标记进入环境。离开环境时，排除全局变量和形成闭包的变量，然后清除。
```javascript
function test(){
    var a = 0; // 进入环境
}

test(); // a 离开环境
```

### 2. 引用计数
存在循环引用的时候，无法清除变量可能引发内存溢出。
```javascript
function test(){
    var a = new Object(); // a = 1
    var b = new Object(); // b = 1

    var c = a; // a++  = 2
    var c = b; // a--  = 1

    // 循环引用
    a.prop = b; // b = 2
    a.prop = a; // a = 2

    // 解除引用
    a = null;
    b = null;
}
```