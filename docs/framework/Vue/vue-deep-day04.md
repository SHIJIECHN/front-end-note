---
autoGroup-2: Vue
sidebarDepth: 3
title: ES6深拷贝
---


## 深拷贝
ES5实现
```javascript
var obj = {
    name: 'xiaoyesensen',
    age: 34,
    info: {
        hobby: ['travel', 'piano', {
            a: 1
        }],
        career: {
            teacher: 4,
            engineer: 9
        }
    }
}

// ES5
function deepClone(origin, target) {
    var tar = target || {};

    var arrType = '[object Array]',
        toStr = Object.prototype.toString;
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            if (typeof origin[key] === 'object' && origin[key] !== null) {
                if (toStr.call(origin[key]) === arrType) {
                    tar[key] = []
                } else {
                    tar[key] = {}
                }
                deepClone(origin[key], tar[key]);
            } else {
                tar[key] = origin[key];
            }
        }
    }
    return tar;
}

var newObj = deepClone(obj);
newObj.info.hobby[2].a = 123;
console.log(newObj);
```

WeakMap的理解:  
WeakMap 键名只能是对象；Map键名可以是任意类型
```javascript
// 案例
const oBtn1 = document.querySelector('#btn1');
const oBtn2 = document.querySelector('#btn2');

oBtn1.addEventListener('click', handleBtnClick1, false);
oBtn2.addEventListener('click', handleBtnClick2, false);

function handleBtnClick1() {}

function handleBtnClick2() {}

oBtn1.remove();
oBtn2.remove(); // handleBtnClick2不能被自动回收
// 手动回收
handleBtnClick1 = null;
handleBtnClick2 = null;
```
弱引用(指的是键名)：当`oBtn1.remove()`，即被删除，则在`oBtnMap`中也会被移除。`oBtn1`在外面没有引用了，在`WeakMap`中也会被移除，则`handleBtnClick1`也会被垃圾回收机制回收掉。
```javascript
// WeakMap
const oBtnMap = new WeakMap();
oBtnMap.set(oBtn1, handleBtnClick1);
oBtnMap.set(oBtn2, handleBtnClick2);

oBtn1.addEventListener('click', oBtnMap.get(oBtn1), false);
oBtn2.addEventListener('click', oBtnMap.get(oBtn2), false);

oBtn1.remove();
oBtn2.remove();
```

ES6实现:    
了解constructor
```javascript
const obj = {};
console.log(obj); // {}
const newObj = new obj.constructor();
newObj.a = 1;
console.log(newObj); // { a: 1} 与原数组obj没有任何关系

const arr = [];
console.log(arr); // []
const newArr = new arr.constructor();
newArr.push(1);
console.log(newArr); // [1] 新数组与arr没有任何关系了
```
实现深拷贝
```javascript
function deepClone(origin) {
    // origin: null, undefined 
    if (origin == undefined || typeof origin !== 'object') {
        return origin;
    }

    // Date RegExp -> instanceof
    if (origin instanceof Date) {
        return new Date(origin);
    }

    if (origin instanceof RegExp) {
        return new RegExp(origin);
    }

    // {} [] 
    const target = new origin.constructor();

    for (let key in origin) {
        if (origin.hasOwnProperty(key)) {
            target[key] = deepClone(origin[key]);
        }
    }

    return target;
}
```
当是下面情况时拷贝就会死循环
```javascript
let test1 = {};
let test2 = {};
test2.test1 = test1;
test1.test2 = test2

console.log(test2);
```
所以需要有记录`test1`拷贝过后就不能再拷贝了。
```javascript
function deepClone(origin, hasMap = new WeakMap()) {
    // origin: null, undefined 
    if (origin == undefined || typeof origin !== 'object') {
        return origin;
    }

    // Date RegExp -> instanceof
    if (origin instanceof Date) {
        return new Date(origin);
    }

    if (origin instanceof RegExp) {
        return new RegExp(origin);
    }

    const hasKey = hasMap.get(origin);
    if (hasKey) {
        return hasKey;
    }

    // {} [] 
    const target = new origin.constructor();
    hasMap.set(origin, target);

    for (let key in origin) {
        if (origin.hasOwnProperty(key)) {
            target[key] = deepClone(origin[key], hasMap);
        }
    }

    return target;
}
```