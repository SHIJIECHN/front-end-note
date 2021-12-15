---
autoGroup-3: JavaScript基础(小野森森)
title: JavaScript变量与值
---

## JavaScript的值
JavaScript有两种类型值：原始值和引用值

### 1. 原始值 -> 基本类型
5种：Number、String、Boolean、undefined、null。  
ES6新增Symbol和ES10新增BigInt类型。   
- Symbol代表创建后独一无二且不可变的数据类型。主要是为了解决可能出现全局变量冲突的问题。  
- BigInt是一种数据类型的数据，可以表示任意精度格式的整数。使用BigInt可以安全地存储和操作大整数，即使这个数已经超出了Number能够表示的完全整数范围。


### 2. 引用值
常用：object、array、function、date、RegExp

<!-- <img :src="$withBase('/basicFrontEnd/how-networks-work-1.jpg')" alt="how-networks-work-1"> -->

## 内存存储
两种值的存储方式不同。
- 原始值：存储在栈（stack）中
- 引用值：存储在堆（heap）中   

理解下面两种情况，并画出内存图。
### 1.基本值
```js
var a = 1,
    b = a;
a = 2;
console.log(b)
```


### 2.引用值：
```js
var arr1 = [1,2,3,4];
var arr2 = arr1;
arr1.push(5)
arr1 = [1,2]
console.log(arr2)
```