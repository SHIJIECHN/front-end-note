---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: day16 
---

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

