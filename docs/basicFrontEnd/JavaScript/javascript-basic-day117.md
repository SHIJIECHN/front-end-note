---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: defineProperty
---

## 定义对象属性
```javascript
function defineProperty() {
    var _obj = {};

    // Object.defineProperty(_obj, 'a', {
    //     value: 1
    // })

    Object.defineProperties(_obj, {
        a: {
            value: 1
        },
        b: {
            value: 2
        }
    })

    return _obj;
}

var obj = defineProperty();
obj.a = 5; // 属性不可修改

console.log(obj);

for (var k in obj) {
    console.log(k + ':' + obj[k]);
    // 属性也不可能枚举
}

delete obj.a; // 属性不可删除
```
添加修改描述项
```javascript
function defineProperty() {
    var _obj = {};
    Object.defineProperties(_obj, {
        a: {
            value: 1,
            writable: true,
            enumerable: true,
            configurable: true
        },
        b: {
            value: 2
        }
    })

    return _obj;
}

var obj = defineProperty();

obj.a = 5; //writable = true
obj.b = 6;

console.log(obj);

for (var k in obj) {
  // enumerable = true
    console.log(k + ':' + obj[k]);
}

delete obj.a;  // configurable = true

console.log(obj);
```

## 数据劫持
给对象进行扩展，属性进行设置。
```javascript
function defineProperty() {
    var _obj = {};

    var a = 1;
    // 每一个属性定义的时候 getter setter机制
    Object.defineProperties(_obj, {
        a: {
            // 已经设置了get，set，不能再设置value和writable
            get() {
                return '"a" \'s value is ' + a + '.';
            },
            set(newVal) {
                console.log('The value "a" has been designed value' + newVal + '.');
            }
        },
        b: {
            value: 2
        }
    })

    return _obj;
}

var obj = defineProperty();
console.log(obj.a);
obj.a = 1;
/**
 * "a" 's value is 1.
 * The value "a" has been designed value1.
 */
```
数组
```javascript
function DataArr() {
    var _val = null, // obj
        _arr = [];

    Object.defineProperty(this, 'val', {
        get: function() {
            return _val;
        },
        set: function(newVal) {
            _val = newVal;
            _arr.push({ val: _val });
            console.log('A new value ' + _val + ' has been pushed to _arr');
        }
    });
    this.getArr = function() {
        return _arr;
    }
}

var dataArr = new DataArr();
dataArr.val = 123;
dataArr.val = 234;

console.log(dataArr.getArr());
```

## 练习
计算机