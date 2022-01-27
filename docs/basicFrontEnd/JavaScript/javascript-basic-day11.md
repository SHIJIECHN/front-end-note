---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day11
---

## 对象克隆
- 浅拷贝
- 深拷贝
  
浅拷贝
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
此时原型上的属性num也会在person2属性中显示。再次优化
```js
function clone(origin, target){
    if(origin.hasOwn)
    for(var key in origin){
        target[key] = origin[key];
    }
}
```
