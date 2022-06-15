---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 16. 数组方法、类数组
---

## 数组方法(新数组)
### 1. concat
拼接（合并）数组
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
1. join就是把数组中的所有元素放入一个字符串中，参数就是元素的分隔符。
2. split分隔字符串。split(a,b) a是分隔符，b是分隔的位数
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
### 1. 在数组原型上写去重方法unique
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
### 3. 返回字符串中，出现第一次的字符
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

