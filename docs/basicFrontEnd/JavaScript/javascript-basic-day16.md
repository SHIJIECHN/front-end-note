---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 16. 数组方法、类数组
---

## 数组方法
String, slice, join, split方法不会修改原数组，而是浅拷贝一份新的数组作为返回值。
### 1. concat
拼接（合并）数组
```js
var arr1 = ['a', 'b', 'c'];
var arr2 = ['d'];
var arr3 = arr1.concat(arr2);
console.log(arr3); // ['a', 'b', 'c', 'd']
```

### 2. toString
数组转换成字符串。Array对象覆盖Object的toString方法。对于数组对象，toString方法连接数组并返回一个字符串，其中包含用逗号分割的每份数组元素。
```js
var arr = ['a', 'b', 'c', 'd'];
console.log(arr.toString()); // a,b,c,d

// 将数组扁平化
console.log(Array.prototype.toString.call([[1,2], [3,[4]]])); // 1,2,3,4

// join参数是分隔符：
// 带参数的话，只能将数组扁平化一层
console.log([1,[2,[3,4,5]]].join('-')); // 1-2,3,4,5

// 不带参数的话，直接数据扁平化，默认分割
console.log([1,[2,[3,4,5]]].join()); // 1,2,3,4,5
```

### 3. slice
截取数组：[start, end)。返回一个浅拷贝了元素组中的元素的一个新数组。
```js
var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// 省略end，截取数组元素从start开始至数组的结尾
var arr1 = arr.slice(1); // 从下标为1的位置截取，并包含
console.log(arr1); //['b', 'c', 'd', 'e', 'f']

var arr2 = arr.slice(1, 3);
console.log(arr2); // ['b', 'c']

// start为负值的情况
var arr3 = arr.slice(-3, 5);
console.log(arr3); // ['d', 'e']

// start和end都是负值的情况
var arr1 = ['a', 'b', 'c', 'd', 'e', 'f'];
var arr3 = arr1.slice(-3, -1); // ['d', 'e']

// 在参数都是负数的时候，start的索引值不能比end的索引值大，否咋返回截取的数组为[]
var arr1 = ['a', 'b', 'c', 'd', 'e', 'f'];
var arr3 = arr1.slice(-3, -5); // []

// slice的负值索引原理：负数索引值 + 数组长度
Array.prototype.mySlice = function(index){
    index += index >= 0 ? 0 : this.length;
}

// 类数组转换为数组对象
function list(){
    return Array.prototype.slice.call(arguments);
}
var arr = list(1,2,3); // [1,2,3]

function list(){
    return [].slice.call(arguments);
}
var arr = list(1,2,3); // [1,2,3]
```

### 4. join
1. join就是把数组中的所有元素放入一个字符串中，参数就是元素的分隔符。如果一个元素是undefined或null，它被转换为空字符串。
2. 参数：如果忽略，则用逗号分隔；如果是空字符串("")，则所有元素中间没有任何字符

```js
var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
var str1 = arr.join(); // a,b,c,d,e,f 不传参数等同于toString()
var str2 = arr.join('-');//a-b-c-d-e-f
var str3 = arr.join(""); // abcdef

var arr2 = ['a', undefined, 'b', null];
var str4 = arr2.join(''); // ab
```

### 5. split
split分隔字符串。split(a,b) a是分隔符，b是分隔的位数即新数组返回的长度。
```javascript
var str2 = 'a-b-c-d-e-f';
var arr1 = str2.split('-');
console.log(arr1); // ['a', 'b', 'c', 'd', 'e', 'f']

var arr2 = str2.split('-', 3);
console.log(arr2); // ['a', 'b', 'c']
```

## 类数组
类数组又叫做类数组对象，不仅具有数组的性质，还具有对象的性质。理论上是对象，有length属性，拥有属性从0开始连续的属性集合，类似数组的对象。

### 1. arguments
```js
function test() {
    console.log(arguments);
}
test(1, 2, 3, 4, 5, 6)
/**
实际参数列表也是类数组对象
Arguments: [
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    length: 6,
    __proto__: Object.prototype
]
*/

var arr = [1,2,3,4,5,6];
console.log(arr); 
```
- 类数组没有数组方法，没有继承`Array.prototype`，但是有length属性。   
- 类数组其实是对象，只是有length属性。
- 类数组的__proto__是Object.prototype，数组的__proto__是Array.prototype。

### 2. 将对象转为类数组对象
```js
// 按照数组的方式进行构造数组对象
var obj = {
    '0': 1,
    '1': 2,
    '2': 3,
    '3': 4,
    '4': 5,
    '5': 6,
    'length': 6
}
console.log(obj); // {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6} 很显然不像数组的形式
```
此时obj最外层是{}，而想变成[]，只需要给对象添加splice属性。
```js
// obj从Array.prototype上继承Array.prototype.splice方法，
// 将对象变成数组的形式
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
// 既然成为类数组对象了，那么有数组的方法吗？
console.log(obj.push(6)); // obj.push not is function 报错
```
通过继承数组的方法，使用数组方法。
```js
var obj = {
  '0':1,
  '1':2,
  '2':3,
  '3':4,
  '4':5,
  length:5,
  'splice':Array.prototype.splice,
  'push':Array.prototype.push
}
obj.push(6);
console.log(obj); // Object [1, 2, 3, 4, 5, 6, splice: ƒ, push: ƒ]

// 通过prototype添加属性，有length属性的对象都会变成类数组对象的形式
Object.prototype.splice = Array.prototype.splice;
Object.prototype.push = Array.prototype.push;
var obj = {
    length: 2
}
cosnole.log(obj); // Object [empty x 2] 具有稀松数组的特性
```
Array.prototype.push()方法在类数组对象的实现
```js
Array.prototype.push = function(elem){
    this[this.length] = elem;
    this.length++
}
```
#### 例一
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
执行`push`后，每次push都是从数组的第this.length开始插入，然后数组的长度length++，即
```js
obj.push(1)--> obj[length] = 1--> obj[2] = 1; obj.length++
obj.push(2)--> obj[length] = 2--> obj[3] = 2; obj.length++
```
此时的index 2和3分别变成了1、2，length变成4，而index 0和1 还是空的。  
```javascript
var obj = {
  	'0':empty,
    '1':empty,
    '2':1,
    '3':2,
    length:4,
    'splice':Array.protoype.splice,
    'push':Array.prototype.push
}
```

#### 例二： 类数组使用for in循环
类数组对象既有数组的特性又有对象特性。
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

console.log(person[1]); // 张小二
console.log(person.weight); // 140
console.log(person.length); // 3

for (var key in person) {
    if (person.hasOwnProperty(key)) {
        console.log(key); // 0 1 2 name age weight height length
    }
}
```
类数组一定是有数组形式下标对应的属性值，而且必须有length属性。  

类数组转换成数组：
```js
Array.prototype.slice.call(arguments)
```

## 练习
### 1. 在数组原型上写去重方法unique
```js
var arr = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 'a', 'a'];
Array.prototype.unique = function() {
    var temp = {},
        newArr = [];
    for (var i = 0; i < this.length; i++) {
        
        if (!temp[this[i]]) {
            temp[this[i]] = this[i];
            newArr.push(this[i]);
        }
    }
    return newArr;
}
console.log(arr.unique());

// 无法过滤0。重复的0无法去重
/******************************************/
var arr = [1, 1, 2, 3, 2, 3, '1', undefined, 'undefined', undefined];
Array.prototype.unique = function() {
    var temp = {},
        newArr = [];

    for (var i = 0; i < this.length; i++) {
        if (!temp.hasOwnProperty(this[i])) {
            temp[this[i]] = this[i];
            newArr.push(this[i]);
        }
    }
    return newArr;
}
console.log(arr.unique());

// 上述只能解决数字类型的数值,对于其他类型的数据并不能解决
/*******************************************/
var arr = [1, 3, 2, 3, undefined, 'undefined', undefined, NaN, NaN, null, null, 'null'];
Array.prototype.unique = function(){
    for(var i = 0; i < this.length - 1; i++){
        for(var j = i; j < this.length; j++){
            if(this[i] === this[j]){
                this.splice(i, 1);
            }else if(this[i]+ '' === 'NaN' && this[j]+'' === 'NaN'){
                this.splice(i, 1);
            }
        }
    }
    return this;
}
arr.unqiue();
console.log(arr); // [1, 2, 3, 'undefined', undefined, NaN, null, 'null']
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

### 2. 封装typeof方法
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

### 3. 返回字出现第一次的字符
一串随机的字符串中,找出出现次数为1次的第一个字符
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

### 4. 类数组转为数组的方法
for循环 splice concat slice方法实现
```javascript
// for循环实现类数组转为数组
function fn() {
  var newArr = [];
  for(var i = 0; i < arguments.length; i++) {
  	newArr.push(arguments[i]);
  }
  return newArr;
}
var newArr = fn(1, 2, 3, 4);
console.log(newArr); // [1, 2, 3, 4]

// splice实现类数组转为数组
function fn() {
	return Array.prototype.splice.call(arguments,0,arguments.length);
}
console.log(fn(1, 2, 3, 4)); // [1, 2, 3, 4]

// slice实现类数组转为数组
function fn() {
	return Array.prototype.slice.call(arguments); // [1, 2, 3, 4]
}
console.log(fn(1, 2, 3, 4));

// concat实现类数组转为数组
function fn() {
	return Array.prototype.concat.apply([], arguments);
}
console.log(fn(1, 2, 3, 4)); // [1, 2, 3, 4]
```














## 数组去重
1. for循环
```js
var arr = [1, 2, 6, 3, 5, 0, 3, 6, 8, 9, 4, 4, 2, 0, 9, 5, 2, 7, 4, 2, 3, 4, 6];

// for循环

function uniqueArr(array) {
    var _arr = [],
        isRepeat;

    for (var i = 0; i < array.length; i++) {
        isRepeat = false;
        for (var j = 0; j < _arr.length; j++) {
            if (_arr[j] == array[i]) {
                isRepeat = true;
                break
            }
        }
        if (!isRepeat) {
            _arr.push(array[i]);
        }
    }
    return _arr;
}

console.log(uniqueArr(arr).sort())
```
2. filter方法
```js
function uniqueArr(array) {
    return array.filter(function(item, index) {
        return array.indexOf(item) === index;
    })
}
```
解析
```js
var arr = [1,1,1];
console.log(arr.indexOf(1)); // 0
```
indexOf只会返回数值第一次出现的下标

3. sort方法
```js
// 方法一
function uniqueArr(array) {
    var _arr = [];
    array.sort();

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== array[i + 1]) {
            _arr.push(array[i]);
        }
    }

    return _arr;
}

// 方法二
function uniqueArr(array) {
    var _arr = [];
    array.sort();

    for (var i = 0; i < array.length; i++) {
        if (array[i] !== _arr[_arr.length - 1]) { //不同
            _arr.push(array[i]);
        }
    }

    return _arr;
}

```

5. includes    
includes与indexOf的区别：
- 返回值不同：indexOf返回具体位置或-1，includes返回true或false
- indexOf对NaN无效，includes可以判断NaN
```js
function uniqueArr(array) {
    var _arr = [];
    array.forEach(element => {
        if (!_arr.includes(element)) {
            _arr.push(element)
        }
    });

    return _arr;
}
```

6. sort与reduce
```js
function uniqueArr(array) {
    return array.sort().reduce(function(prev, item) {
        if (prev.length === 0 || prev[prev.length - 1] !== item) {
            prev.push(item);
        }
        return prev;
    }, [])

}
```

7. Map
```js
function uniqueArr(array) {
    var _arr = [],
        _temp = new Map();
    for (var i = 0; i < array.length; i++) {
        if (!_temp.get(array[i])) {
            _temp.set(array[i], 1);
            _arr.push(array[i]);
        }
    }

    return _arr;
}
```

8. Set
```js
function uniqueArr(array) {
    return Array.from(new Set(array));
}
```

## 数组扁平化
要求编写一个程序将数组扁平化并将扁平化后的数组去重，最终得到一个升序且不重复的一维数组.   
- 1. 扁平化 
- 2. 数组元素去重
- 3. 数组升序
  
1. 外部函数
```js
var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
    10
];

// 数组扁平化
function flatten(arr) {
    var _arr = arr || [],
        fArr = [],
        len = _arr.length,
        item;

    for (var i = 0; i < len; i++) {
        item = _arr[i];

        if (_isArr(item)) {
            fArr = fArr.concat(flatten(item)); // 主要部分
        } else {
            fArr.push(item)
        }
    }

    return fArr;

    function _isArr(item) {
        return {}.toString.call(item) === '[object Array]';
    }
}
```

2. 原型属性与forEach
```js
var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
    10
];


Array.prototype.flatten = function() {
    var _arr = this,
        toStr = {}.toString;

    if (toStr.call(_arr) !== '[object Array]') {
        throw new Error('只有数组才能使用flatten方法！')
    }

    var fArr = [];
    _arr.forEach(function(item) {
        toStr.call(item) === '[object Array]' ?
            fArr = fArr.concat(item.flatten()) :
            fArr.push(item);
    })

    return fArr;
}

console.log(arr.flatten())
```

3. 原型属性与reduce
```js
var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
    10
];

Array.prototype.flatten = function() {
    var _arr = this,
        toStr = {}.toString;

    if (toStr.call(_arr) !== '[object Array]') {
        throw new Error('只有数组才能使用flatten方法！')
    }

    return _arr.reduce(function(prev, item) {
        return prev.concat(
            toStr.call(item) === '[object Array]' ? item.flatten() : item
        )
    }, [])

}

console.log(arr.flatten())
```

4. es6与reduce
```js
var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
    10
];


const flatten = arr => {
    return arr.reduce((prev, item) => {
        return prev.concat({}.toString.call(item) === '[object Array]' ? flatten(item) : item)
    }, [])
}

console.log(flatten(arr))
```

## 对象扁平化 

### 1. 只嵌套对象
```javascript
const source = {
  a: {
    b: {
      c: 1,
      d: 2
    },
    e: 3
  },
  f: {
    g: 2
  }
};
```
实现：
```javascript
function flatten(item, preKey = '', res = {}) {
  // 获取item独享的所有[key, value]数组并且遍历，forEach的箭头函数用解构
  Object.entries(item).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      flatten(val, preKey + key + '.', res);
    } else {
      res[preKey + key] = val;
    }
  })
  return res;
}

const source = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } };
console.log(flatten(source));
/**
{ 
  'a.b.c': 1, 
  'a.b.d': 2, 
  'a.e': 3, 
  'f.g': 2 
}
 */
```

### 2. 有数组和对象，并且去掉null
```javascript
const input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
};
```
```javascript
function flatten(obj = {}, preKey = '', res = {}) {
  if (!obj) return; // 判断控制，如果obj为空，直接返回

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) { // 1. 数组
      // 如果obj是数组，则key就是数组的index，value就是对应的值。就用[]
      // 因为value是数组，数组后面不需要.号
      let temp = Array.isArray(obj)
        ? `${preKey}[${key}]`
        : `${preKey}${key}`;
      flatten(value, temp, res);
    } else if (typeof value === 'object') { // 2. 对象
      let temp = Array.isArray(obj)
        ? `${preKey}[${key}].`
        : `${preKey}${key}.`
      flatten(value, temp, res);
    } else {
      let temp = Array.isArray(obj) ? `${preKey}[${key}]` : `${preKey}${key}`
      res[temp] = value
    }
  })
  return res;
}

const input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
};
console.log(flatten(input));
/**
{
  a: 1,
  'b[0]': 1,
  'b[1]': 2,
  'b[2].c': true,
  'b[3][0]': 3,
  'd.e': 2,
  'd.f': 3
}
 */
```

## 数组对象转树状形



