---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day11
---

## 对象克隆
- 浅拷贝
- 深拷贝
  
## 浅拷贝
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

for(var key in person1){
    person2[key] = person1[key];
}
console.log(person2)
```
此时person2中的属性与person1相同，如果改变person2中son的值
```js
person2.son.third = 'Asha';
```
则person1中son属性的属性值也会发生改变。使用clone函数优化拷贝
```js
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
    sex: male,
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
    car: ['Benz', 'Mazda'];
}

function deepClone(origin, target){
    var target = target || {},
        toStr = Object.prototype.toString;
        arrType = '[object Array]';
    for(var key in origin){
        if(origin.hasOwnProperty(key)){
            if(typeof(origin[key] === 'object') && origin[key] !== null){
                if(toStr.call(origin[key]) === arrType){
                    target[key] = [];
                }else{
                    target[key] = {}
                }
                deepClone(origin[key], target[key]);
            }else {
                target[key] = origin[key]
            }
        }
    }
    return target;
}

var person2 = deepclone(person1);
console.log(person2);
person2.son.forth = {
    name: 'Four';
    age: 21
}
console.log(person2)
```

