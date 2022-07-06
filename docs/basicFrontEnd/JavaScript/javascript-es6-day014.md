---
autoGroup-2: ES6
sidebarDepth: 3
title: day04
---

## 函数名/对象扩展
函数名name属性
```js
// name
var f = function(){

}
console.log(f.name); // ES5返回空字符串，ES6 返回 f

// bind
function foo() {};
console.log(foo.bind({}).name); // bound foo

// Function
console.log((new Function()).name); // anonymous
```
对象扩展：属性名与变量相同可以简写
```js
const foo = 'bar';
const baz = {
    foo
};
console.log(baz);
```
属性名可以使用表达式
```js
var myObject = {};
myObject[true] = 'foo';
myObject[3] = 'bar';
myObject[myObject] = 'baz';

console.log(myObject);  // {3: 'bar', true: 'foo', [object Object]: 'baz'}
```
- true属性调用的Boolean.prototype.toString.call(true);    
- 3属性调用的Number.prototype.toString.call(3);   
- myObject属性调用的Object.prototype.toString.call(myObject);  // [object Object]    
属性默认的调用当前对象原型上的toString方法。
```js
const a = {
    a: 1
}
const b = {
    b: 1
}

const obj = {
    [a]: 'valueA',
    [b]: 'valueB'
}
console.log(obj); 
// {[object Object]: 'valueB'}
```

## 描述符
```js
let obj = {
    a: 2
}
console.log(Object.getOwnPropertyDescriptor(obj, 'a')); // 获取属性描述符
/**
    * configurable: true
    * enumerable: true
    * value: 2
    * writable: true
    */
```
configurable：可配置
enumerable：可枚举
value：值
writable：可写

defineProperty 修改一个已有的属性，添加一个新的属性
```js
let obj = {};
Object.defineProperty(obj, 'a', {
    value: 2,
    enumerable: true,
    writable: true,
    configurable: true
})
console.log(obj); //{ a: 2}

delete obj.a; // configurable: false 不能删除。
```


## getter/setter
```js
let obj = {
    log: ['example', 'test'],
    
    get lastest() {
        if (this.log.length === 0) {
            return undefined
        }
        return this.log[this.log.length - 1];
    }
}

console.log(obj.lastest); // test
```
通过get方式定义了属性lastest.     
通过defineProperty定义getter属性
```js
let myObject = {
    get a() {
        return 2;
    }
}

Object.defineProperty(myObject, 'b', {
    get: function() {
        return this.a * 2;
    },
    enumerable: true
})
console.log(myObject);
```
