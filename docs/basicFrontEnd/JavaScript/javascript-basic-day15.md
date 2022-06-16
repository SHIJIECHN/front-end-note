---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 15. 数组基础、数组方法、数组排序
---
## 数组基础
### 1. 声明数组的三种方式
创建数组
```js
// 数组字面量
var arr1 = [];
// 通过系统内置的Array构造函数声明数组
var arr2 = new Array(); // 不推荐
// 不使用
var arr3 = Array();

// 打印数组原型
console.log(arr1.__proto__); // [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …] 
console.log(arr2.__proto__); // [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]
console.log(arr3.__proto__); // [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]

// 所有数组都继续于Array.prototype
console.log(Array.prototype); // [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]
```
三种方式创建的数组原型都是`Array.prototype`，所有数组都继承于`Array.prototype`。所有`Array.prototype`下面的方法和属性，数组都可以使用。  
对比创建对象
```js
// 对象字面量
var obj1 = {};
// 通过系统内置的Object构造函数声明数组
var obj2 = new Object();
// 不使用
var obj3 = Object();
```
所有对象都继承于`Object.prototype`。

### 2. index索引
```js
var arr = [1, 2, 3, 4, 5];
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
数组底层的机制就是继承对象而来的，数组是对象的另一种形式。

### 3. 稀松数组
数组特性：
- 可以有空项
- 访问空项，返回undefined
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
总结：
1. 数组最后一个逗号可以忽略，不起作用。`new Array()`创建的数组不能带有空的逗号。
2. `new Array(5)`中传入一个数字参数，表示设置数组的长度。
3. 访问超出数组长度的下标值，返回`undefined`

## 数组方法(修改原数组)
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
reverse()方法将数组中元素的位置颠倒，并返回改数组。会改变原数组。
```js
var arr = ['a', 'b', 'c'];
arr.reverse();
console.log(arr); // ['c', 'b', 'a']
```

### 4. `splice`
arr.splice(开始项的下标，剪切长度，剪切以后最后一位开始添加数据); 返回被修改的内容。
```js
// 两个参数： 删除数组
var arr1 = ['a', 'b', 'c'];
arr1.splice(1, 2); // 下标为1开始剪切，剪切2位
console.log(arr1); // a

// 第三个参数
var arr2 = ['a', 'b', 'c', 'd']
arr2.splice(1, 2, 1, 2, 3); // 下标为1开始剪切，剪切2位，然后再拼接1,2,3
console.log(arr2); // ['a', 1, 2, 3, 'd']

// 添加元素
var arr3 = ['a', 'b', 'c', 'e'];
arr3.splice(3, 0, 'd'); // 下标为3的位置，增加一个 d
console.log(arr3); // ['a', 'b', 'c', 'd', 'e']

// 下标为负数
var arr4 = ['a', 'b', 'c', 'e'];
arr4.splice(-1, 0, 'd'); // 在下标为-1的位置增加 d
console.log(arr4); // ['a', 'b', 'c', 'd', 'e']
```
`splice`下标正值和负值底层原理
```js
function splice(arr, index){
    return index += index >= 0 ? 0 : arr.length;
}

var arr1 = ['a', 'b', 'c'];
console.log(arr[splice(arr, -1)]); // c
```

## 数组排序
### 1. `sort`
`sort()`方法：返回排序以后的数组。按照`ASCII`码表来排序的。   
自定义`sort`排序规则（冒泡排列）：
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
cosnole.log(Math.random()); // 0.201000891928

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
#### 数组随机排序
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
#### 数组对象根据某个属性排序
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

## 练习
### 1. 用`splice`方法重写数组原型上的`unshift`方法`myUnshift`
```js
// 方法一
var arr = ['d', 'e', 'f'];
Array.prototype.myUnshift = function() {
    var pos = 0;
    for (var i = 0; i < arguments.length; i++) {
        this.splice(pos, 0, arguments[i]);
        pos++;
    }
    return this.length;
}
arr.myUnshift('a', 'b', 'c');
console.log(arr); // ['a', 'b', 'c', 'd', 'e', 'f']

// 方法二
var arr = ['d', 'e', 'f'];
Array.prototype.myUnshift = function() {
    var argArr = Array.prototype.slice.call(arguments);
    var newArr = argArr.concat(this);
    return newArr;
}
var newArr = arr.myUnshift('a', 'b', 'c');
console.log(newArr); // ['a', 'b', 'c', 'd', 'e', 'f']
```

### 2. 请按照字节数排序下列数组。  
   arr = ['我爱你', 'OK', 'Hello', '你说WHAT', '可以']。
```js
/**
 * unicode 0-255 1个字节 256 -  2个字节
 */
var arr = ['我爱你', 'OK', 'Hello', '你说WHAT', '可以'];

function getBytes(str) {
    var btyes = str.length;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            btyes++;
        }
    }
    return btyes
}

arr.sort(function(a, b) {
    return getBytes(a) - getBytes(b);
})
console.log(arr)
```









