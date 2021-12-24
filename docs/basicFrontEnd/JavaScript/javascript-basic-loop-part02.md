---
autoGroup-3: JavaScript基础(小野森森)
title: 循环、引用值与类型转换
---

## 循环
在JavaScript中有两种常用的循环：for循环与while循环。下文分别讨论这两个循环

### for、while循环
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
同while循环非常相似，所以也可以写成：
```javascript
var i = 0;
while(i < 10){
    console.log(i);
    i++
}
```
### 理解循环
不使用break终止循环
```javascript
var i = 0;
for(; i;){
    console.log(i)
    i++;

    if(i == 11){
        i = 0 // 当i为假时就终止循环
    }
}
```
