---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day12
---
## 数组基础
声明数组
```js
// 数组字面量
var arr1 = [];
// 通过系统内置的Array构造函数声明数组
var arr2 = new Array();
// 不使用
var arr3 = Array();

console.log(arr1.__proto__);
console.log(arr2.__proto__);
console.log(arr3.__proto__);
```
三种方式创建的数组原型都是`Array.prototype`，所有数组都继承于`Array.prototype`。所有`Array.prototype`下面的方法和属性，数组都可以使用。  
对象
```js
// 对象字面量
var obj1 = {};
// 通过系统内置的Object构造函数声明数组
var obj2 = new Object();
// 不使用
var obj3 = Object();
```
所有对象都继承于`Object.prototype`。

```js
var arr = [1,2,3,4,5];
// index 数组元素的下标（索引值）
var obj = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5 
}
console.log(arr[2]); // 3
console.log(obj[2]); // 3
```
数组底层的机制就是继承对象而来的

```js
var arr = [,,]; 
console.log(arr); // [empty x 2];
console.log(arr.length); // 2

var arr1 = [,1,3,,,5,7,]; // -> 稀松数组
console.log(arr1); // [empty, 1, 3, empty × 2, 5, 7]
console.log(arr1.length); // 7

var arr2 = new Array(,1,2,3,); // Uncaught SyntaxError: Unexpected token ','
var arr3 = new Array(5); 
console.log(arr3);// [empty × 5]

var arr4 = [1,2,3,4,5,6,7,8,9,10];
console.log(arr4[10]); // undefined
```
1. 数组最后一个逗号可以忽略，不起作用。`new Array()`创建的数组不能带有空的逗号。
2. `new Array(5)`中传入一个数字参数，表示设置数组的长度。
3. 访问超出数组长度的下标值，返回`undefined`

## 数组方法
**数组的方法都是继承自`Array.prototype`来的**
### 1. `push/unshift`
返回值，都是**执行了方法以后**数组的长度.
- `push` 数组最后追加元素
- `unshift` 数组前面追加元素
```js
var arr  = [2,3,4];
arr.push(5);
console.log(arr);// [2,3,4,5]
arr.push(6,7);
console.log(arr); // [2,3,4,5,6,7]

arr.unshift(1,2);
console.log(arr); // [1,2,2,3,4,5,6,7]
```
实现`myPush`方法
```js
var arr = [2,3,4];
Array.prototype.myPush = function(){
    for(var i = 0; i < arguments.length; i++){
        // arr[arr.length] = arguments[i];
        this[this.length] = arguments[i];
    }
    return this.length;
}
arr.myPush(5,6,7);

```

### 2. `pop/shift`
- `pop` 剪切数组的最后一位，并返回剪切的字符
- `shift` 剪切数组的第一位，并返回剪切的字符
```js
var arr = ['a', 'b', 'c'];
arr.pop(); // c

arr.shift(); // a
```

### 3. `reverse`倒序
```js
var arr = ['a', 'b', 'c'];
arr.reverse();
```

### 4. `splice`
arr.splice(开始项的下标，剪切长度，剪切以后最后一位开始添加数据)
```js
// 两个参数
var arr1 = ['a', 'b', 'c'];
arr1.splice(1, 2);
console.log(arr1); // a
// 第三个参数
var arr2 = ['a', 'b', 'c', 'd']
arr2.splice(1, 2, 1, 2, 3);
console.log(arr2); // ['a', 1, 2, 3, 'd']
// 添加元素
var arr3 = ['a', 'b', 'c', 'e'];
arr3.splice(3, 0, 'd')
console.log(arr3); // ['a', 'b', 'c', 'd', 'e']
// 下标为负数
var arr4 = ['a', 'b', 'c', 'e'];
arr4.splice(-1, 0, 'd')
console.log(arr4); // ['a', 'b', 'c', 'd', 'e']
```
`splice`下标正值和负值底层原理
```js
function splice(arr, index){
    return index += index >= 0 : arr.length;
}
```

## 数组排序
### 1. `sort`
`sort()`方法：返回排序以后的数组。按照`ASCII`码表来排序的。   
自定义`sort`排序规则：
1. 参数`a`, `b`
2. 返回值:
   1. 负值 -> `a`排在前面
   2. 正值 -> `b`排在前面
   3. `0` -> 保持不变   
   
自定义升序排列规则：
```js
sort(function(a, b) {
    if (a > b) {
        return 1;
    } else {
        return -1
    }
})
// 优化
sort(function(a, b){
    return a - b;
})
```
关键在于`sort`的返回值规则。

```js
var arr1 = [-1, -5, 0, 2, 8];
arr1.sort();
console.log(arr1); // [-1, -5, 0, 2, 8]

var arr2 = [27, 49, 5, 7];
arr2.sort(function(a, b) {
    if (a > b) {
        return 1;
    } else {
        return -1
    }
})
console.log(arr2); // [5, 7, 27, 49]
```

### 2. 随机排序
`Math.random()`：返回`0`到`1`的随机数。不包含`0`和`1`。返回的值大于`0.5`和小于`0.5`的概率是相同的
```js
sort(function(a, b){
    var rand = Math.random();
    if (rand - 0.5 > 0) {
        return 1;
    } else {
        return -1;
    }
})
// 优化
sort(function(a, b){
    return Math.random() - 0.5;
})
```
数组随机排序
```js
var arr = [1, 2, 3, 4, 5, 6];
arr.sort(function(a, b) {
    var rand = Math.random();
    if (rand - 0.5 > 0) {
        return 1;
    } else {
        return -1;
    }
})
console.log(arr)
```
根据某个属性排序
```js
var arr = [{
        son: 'Jenny',
        age: 18
    },
    {
        son: 'Jone',
        age: 10
    },
    {
        son: 'Ben',
        age: 3
    },
    {
        son: 'Lucy',
        age: 11
    }
];
arr.sort(function(a, b) {
    if (a.age > b.age) {
        return 1;
    } else {
        return -1;
    }
})
console.log(arr)
```

## 总结
修改原数组：`push/unshift`, `pop/shift`, `reverse`, `splice`, `sort`

## 练习
1. 用`splice`方法重写数组原型上的`unshift`方法`myUnshift`
2. 请按照字节数排序下列数组。  
   arr = ['我爱你', 'OK', 'Hello', '你说WHAT', '可以']。
