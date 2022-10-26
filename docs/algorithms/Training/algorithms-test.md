---
autoGroup-1: 手写
sidebarDepth: 3
title: 手写代码题
---

## 手写Object.create
思路：将传入的对象作为原型
```javascript
function create(obj) {
  function F() { }
  F.prototype = obj;
  return new F();
}

/** Test */
const test = {
  a: 1
}
const o = create(test);
console.log(o);

const o1 = Object.create(test);
console.log(o1)
```

## 手写打乱数组的顺序的方法
思路：
1. 随机产生一个索引值
2. 遍历数组，交换当前值与随机产生的索引值对应值的位置

```javascript
function randomArr(arr) {
  // 循环遍历数组
  for (let i = 0; i < arr.length; i++) {
    // 每次遍历中产生一个0~length-1的数，该数代表本次循环要随机交换的位置
    const randomIndex = Math.floor(Math.random() * (arr.length - 1));
    // 交换位置
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr;
}
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(randomArr(arr));
```

## 手写instanceOf
判断构造函数的prototype属性是否出现在对象的原型链中的任何位置

思路：
1. 获取构造函数的原型
2. 获取对象的原型
3. 遍历对象的原型，判断对象的原型是否等于类型的原型，直到对象的原型为null
```javascript
/**
 * 判断对象是否是构造函数的实例
 * @param {*} target 对象
 * @param {*} origin 构造函数
 * @returns 
 */
function myInstanceof(target, origin) {
  // 非object直接返回false
  if (typeof target !== 'object' || target === null) return false;

  let proto = Object.getPrototypeOf(target); // 对象的原型
  while (proto) {
    if (proto == origin.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto)
  }
  return false;
}

function Car() { }
var car = new Car();
console.log(myInstanceof(car, Car)); // true
console.log(myInstanceof(car, Object));
```

## 实现数组的扁平化
### 1. 递归实现
通过循环递归的方式，一项一项的去遍历，如果每一项还是一个数组，那么久继续往下遍历，利用递归程序的方法，来实现数组的每一项的连接。
```javascript
var arr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
  10
];

function flatten(arr) {
  let _arr = arr || [],
    fArr = [],
    len = _arr.length,
    item;

  for (let i = 0; i < len; i++) {
    item = _arr[i];
    if (Array.isArray(item)) {
      fArr = fArr.concat(flatten(item))
    } else {
      fArr.push(item)
    }
  }
  return fArr;
}

console.log(flatten(arr))
```


## 手写new
思路：
1. 创建一个空对象
2. 这个对象的__proto__要指向构造函数的原型prototype
3. 执行构造函数，使用apply/call改变this的指向
4. 返回为object类型则作为new方法的返回值返回，否则返回上述全新对象

```javascript
function myNew(fn, ...args) {
  // 基于原型链，创建一个对象
  let newObj = Object.create(fn.prototype);
  // 添加属性到新对象上，并获取obj函数的结果
  let res = fn.apply(newObj, args); // 改变this指向

  // 如果执行结果有返回值并且是一个对象，返回执行的结果，否则，返回新创建的对象
  return typeof res === 'object' ? res : newObj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.say = function () {
  console.log(this.age);
}

let p1 = myNew(Person, 'poety', 18);
console.log(p1.name); // poety
console.log(p1); // Person { name: 'poety', age: 18 }
p1.say();// 18
```