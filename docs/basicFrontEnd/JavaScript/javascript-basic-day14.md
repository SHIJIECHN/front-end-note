---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 14. 对象克隆、浅拷贝、深拷贝
---

## 对象克隆
- 浅拷贝
- 深拷贝
  
## 浅拷贝

### 1. 对象拷贝
```js
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140
}

// person2 拥有person1 所有的内容
var person2 = person1;
person2.name = 'Asha';
//person2中的属性与person1相同，如果改变person2中son的值。
// 则person1中son属性的属性值也会发生改变 
console.log(person1);
```
解释：因为person2在栈中存储的是person1在堆内存中的引用地址。现在person2和person1指向的是同一个内存地址，所以任意改变一方，其他都会随之修改。

### 2. 浅拷贝
```js
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140
}

var person2 = {}

// 浅拷贝
for(var key in person1){
    person2[key] = person1[key];
}

person2.name = 'Asha';
console.log(person1, person2)
```
总结：将person2定义为空对象，此时person2和person1是独立的存储空间。修改person2，person1不会发生改变。

### 3. 浅拷贝没有处理引用值，只处理第一层的属性
```javascript
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140,
    son: {
        first: 'Jucy',
        second: 'Marry'
    }
}
var person2 = {}

// 浅拷贝
for(var key in person1){
    person2[key] = person1[key];
}

person2.name = 'Asha';
person2.son.first = 'Ben';
console.log(person1, person2)

function clone(origin, target){
    for(var key in origin){
        target[key] = origin[key];
    }
}
```
当在对象原型上添加属性后再次拷贝
```js
var person1 = {
    name: 'Tom',
    age: 20,
    height: 180,
    weight: 140,
    son: {
        first: 'Jucy',
        second: 'Marry'
    }
}
var person2 = {}
Object.prototype.num = 1;
clone(person1, person2);
consoe.log(person2);
```
此时原型上的属性num也会在person2属性中显示。要求不显示原型属性，再次优化
```js
function clone(origin, target){
    for(var key in origin){
        if(origin.hasOwnProperty(key)){
            target[key] = origin[key];
        }
    }
}
```
对clone优化
```js
function clone(origin, target){
    var tar = target || {};
    for(var key in origin){
        fi(origin.hasOwnProperty(key)){
            tar[key] = origin[key];
        }
    }
    return tar;
}

var person2 = clone(person1);
person2.son.third = 'Ben';
```
修改person2中son属性，也会导致person1中son的属性发生改变。这是浅拷贝本身的问题。

## 深拷贝
```js
Object.prototype.num = 1;
var person1 = {
    name: '张三',
    age: 18,
    sex: 'male',
    children: {
        first: {
            name: 'One',
            age: 13
        },
        second: {
            name: 'Two',
            age: 18
        },
        third: {
            name: 'Three',
            age: 20
        }
    },
    car: ['Benz', 'Mazda']
}

function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrType = '[object Array]';
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            if (typeof(origin[key]) === 'object' && origin[key] !== null) {
                if (toStr.call(origin[key]) === arrType) {
                    target[key] = [];
                } else {
                    target[key] = {}
                }
                deepClone(origin[key], target[key]);
            } else {
                target[key] = origin[key]
            }
        }
    }
    return target;
}

var person2 = deepClone(person1);
console.log(person2);
person2.children.forth = {
    name: 'Four',
    age: 20
}
console.log(person2);
```
可以使用JSON

### 练习
1. 例一
```js
function test(){
    console.log(foo);
    var foo = 2;
    console.log(foo);
    console.log(a);
}
test();
/**
 * undefined
 * 2
 * Uncaught ReferenceError: a is not defined
*/
```
2. 例二
```js
function a(){
    var test;
    test();
    function test(){
        console.log(1);
    }
}
a();
/**
 * 1
*/
```
3. 例三
```js
var name = '222';
var a = {
    name: '111',
    say: function(){
        console.log(this.name);
    }
}

var fun = a.say;
// var fun = function(){
//     console.log(thi.name)
// }
fun(); // '222'
a.say(); // '111'
var b = {
    name: '333',
    say: function(fun){
        fun();
    }
}
b.say(a.say); // '222'
b.say = a.say;
b.say(); // '333'
```
4. 例四
```js
function test(){
    var marty = {
        name: 'marty',
        printName: function(){
            console.log(this.name);
        }
    }

    var test1 = {
        name: 'test1'
    }
    var test2 = {
        name: 'test2'
    }
    var test3 = {
        name: 'test3'
    }
    test3.printName = marty.printName;
    marty.printName.call(test1); // test1
    marty.printName.apply(test2); // tets2
    marty.printName(); // marty
    test3.printName(); // test3
}
test();
```
5. 例五
```js
var bar = {
    a: '1'
};
function test(){
    bar.a = 'a';
    Object.prototype.b = 'b';
    return function inner(){
        console.log(bar.a); // a
        console.log(bar.b); // b
    }
}
test()();
```

### 作业
1. 写出下列输出结果
```js
function Foo(){
    getName = function(){
        console.log(1);
    }
    return this;
}
Foo.getName =function(){
    console.log(2);
}
Foo.prototype.getName = function(){
    console.log(3);
}
var getName = function(){
    console.log(4);
}
function getName(){
    console.log(5);
}
Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName();// 1
new Foo.getName();// new (Foo.getName())  2
new Foo().getName();// (new Foo()).getName()  3
new new Foo().getName();// 3
```

2. 请用`window.prompt`接受用户输入的年份，判断是否是闰年？请用三目运算来做
```js

var year = window.prompt('请输入年份');
/**
 * 1. 整除4 并且不能整除100
 * 2. 整除400
 */
console.log(isLeapYear(year));

function isLeapYear(year) {
    // if ((year % 4 === 0 && year % 100 !== 0) ||
    //     year % 400 === 0) {
    //     return '是闰年';
    // } else {
    //     return '不是闰年';
    // }

    return (year % 4 === 0 && year % 100 !== 0) ||
    (year % 400 === 0) ?
    '闰年' :
    '不是闰年';
}
```












## 数组基础
创建数组
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
创建对象
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
数组底层的机制就是继承对象而来的

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

## 数组方法(新数组)
### 1. concat
拼接数组
```js
var arr1 = ['a', 'b', 'c'];
var arr2 = ['d'];
var arr3 = arr1.concat(arr2);
console.log(arr3); // ['a', 'b', 'c', 'd']
```

### 2. toString
数组转换成字符串
```js
var arr = ['a', 'b', 'c', 'd'];
console.log(arr.toString()); // a,b,c,d
```

### 3. slice
截取数组：[start, end)
```js
var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
var arr1 = arr.slice(1); // 从下标为1的位置截取，并包含
console.log(arr1); //['b', 'c', 'd', 'e', 'f']

var arr2 = arr.slice(1, 3);
console.log(arr2); // ['b', 'c']

var arr3 = arr.slice(-3, 5);
console.log(arr3); // ['d', 'e']
```

### 4. join和split
```js
var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
var str1 = arr.join(); // 不传参数等同于toString()方法
console.log(str1); // a,b,c,d,e,f

var str2 = arr.join('-');
console.log(str2); //a-b-c-d-e-f

var arr1 = str2.split('-');
console.log(arr1); // ['a', 'b', 'c', 'd', 'e', 'f']

var arr2 = str2.split('-', 3);
console.log(arr2); // ['a', 'b', 'c']
```

## 类数组
```js
function test() {
    console.log(arguments);
}
test(1, 2, 3, 4, 5, 6)

var arr = [1,2,3,4,5,6];
console.log(arr); 
```
- 类数组没有数组方法，没有继承`Array.prototype`，但是有length属性。   
- 类数组其实是对象，只是有length属性。
- 类数组的__proto__是Object.prototype，数组的__proto__是Array.prototype。

模拟类数组
```js
var obj = {
    '0': 1,
    '1': 2,
    '2': 3,
    '3': 4,
    '4': 5,
    '5': 6,
    'length': 6
}
console.log(obj); // {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6}
```
此时obj最外层是{}，而想变成[]，只需要给对象添加splice属性。
```js
var obj = {
    '0': 1,
    '1': 2,
    '2': 3,
    '3': 4,
    '4': 5,
    '5': 6,
    'length': 6,
    'splice': Array.prototype.splice
}
console.log(obj); // [1, 2, 3, 4, 5, 6, splice: ƒ]
```
现在可以通过继承数组的方法，使用数组方法。
```js
Object.prototype.push = Array.prototype.push;
```
push方法的实现
```js
Array.prototype.push = function(elem){
    this[this.length] = elem;
    this.length++
}
```
例一
```js
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}

obj.push(1);
obj.push(2);
console.log(obj);
/**
 * obj = {
 *  2: 1,
 *  3: 2,
 *  length: 4
 * }
 */
```
分析：
执行`push`后，即
```js
obj[2] = 1;
obj[3] = 2;
```
此时的index 2和3分别变成了1、2，length变成4，而index 0和1 还是空的。   
例二
```js
var person = {
    '0': '张小一',
    '1': '张小二',
    '2': '张小三',
    'name': '张三',
    'age': 32,
    'weight': 140,
    'height': 180,
    'length': 3
}

Object.prototype.splice = Array.prototype.splice;
Object.prototype.push = Array.prototype.push;

console.log(person[1]);
console.log(person.weight);
console.log(person.length);

for (var key in person) {
    if (person.hasOwnProperty(key)) {
        console.log(key);
    }
}
```
类数组一定是有数组形式下标对应的属性值，而且必须有length属性。   
类数组转换成数组：
```js
Array.prototype.slice.call(arguments)
```

## 练习
1. 用`splice`方法重写数组原型上的`unshift`方法`myUnshift`
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

2. 请按照字节数排序下列数组。  
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

3. 在数组原型上写去重方法unique
```js
var arr = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 'a', 'a'];
Array.prototype.unique = function() {
    var temp = {},
        newArr = [];

    for (var i = 0; i < this.length; i++) {
        // 无法过滤0
        // if (!temp[this[i]]) {
        //     temp[this[i]] = this[i];
        //     newArr.push(this[i]);
        // }

        if (!temp.hasOwnProperty(this[i])) {
            temp[this[i]] = this[i];
            newArr.push(this[i]);
        }
    }
    return newArr;
}
console.log(arr.unique());
```
字符串去重
```js
var str = '111222000aabb';

String.prototype.unique = function() {
    var temp = {},
        newStr = '';

    for (var i = 0; i < this.length; i++) {
        if (!temp.hasOwnProperty(this[i])) {
            temp[this[i]] = this[i];
            newStr += this[i];
        }
    }
    return newStr
}

console.log(str.unique())
```

4. 封装typeof方法
   返回值：undefined, boolean, number, string, null, function, array, object, object-number, object-boolean, object-string
```js
/**
 * typeof 返回 number string boolean object function undefined -> String
 * Object.prototype.toString.call(val);
 */
function myTypeof(val) {
    var type = typeof(val);
    var toStr = Object.prototype.toString;
    var res = {
        '[object Array]': 'array',
        '[object Object]': 'object',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Boolean]': 'boolean'
    };

    if (val === null) {
        return 'null';
    } else if (type === 'object') {
        var ret = toStr.call(val);
        return res[ret];
    } else {
        return type;
    }
}
console.log(myTypeof([]))
```
5. 返回字符串中，出现第一次的字符
```js
var str = 'trueadjljdodjajbdasdskcdkkvjvkjk';

function test(str) {
    var temp = {};
    for (var i = 0; i < str.length; i++) {
        if (temp.hasOwnProperty(str[i])) {
            temp[str[i]]++;
        } else {
            temp[str[i]] = 1;
        }
    }

    for (var key in temp) {
        if (temp[key] === 1) {
            return key;
        }
    }
    return temp;
}

console.log(test(str));
```

## 题目
1. 闭包
```js
function Test(a, b, c){
    var d = 0;
    this.a = a;
    this.b = b;
    this.c = c;

    function e(){
        d++;
        console.log(d);
    }

    this.f = e;
}

var test1 = new Test();
test1.f(); // 1
test1.f(); // 2

var test2 = new Test();
test2.f(); // 1

/**
 * 1. 当函数Test被定义的时候产生AO
 * AO = {
 *  d: undefined
 * }
 * 2. 当函数被new Test()执行后
 * AO = {
 *  d: 0
 * }
 * 并且隐式创建
 * var this = {
 *  f: function(){}
 * }
 * return this
 */
```

2. 数据类型
```js
function test() {
    console.log(typeof(arguments)); //类数组
}
test(); //  object

/*************************/
var test = function a() {
    return 'a';
}

console.log(typeof(a)); // undefined typeof没有声明的变量就是string类型的undefined
console.log(a); //Uncaught ReferenceError: a is not defined
/**
 * 函数表达式忽略函数名，即外界打印是不存在的，在外界调用a()，会报错，在函数里面可以执行
 */

```

3. 简化代码
```js
function test(day) {
    switch (day) {
        case 1:
            console.log('Mon');
            break;
        case 2:
            console.log('Tue');
            break;
        case 3:
            console.log('Wed');
            break;
        case 4:
            console.log('Thu');
            break;
        case 5:
            console.log('Fir');
            break;
        case 6:
            console.log('Sat');
            break;
        case 7:
            console.log('Sun');
            break;
        default:
            console.log('I don\'t kown');
    }
}
// 简化
function test(day) {
    var weekday = ['Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'];
    weekday[day - 1] !== undefined ?
        console.log(weekday[day - 1]) :
        console.log('I don\'t kown');
}
// 去掉day - 1  优化
function test(day) {
    var weekday = [, 'Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'];
    weekday[day] !== undefined ?
        console.log(weekday[day]) :
        console.log('I don\'t kown');
}
```
