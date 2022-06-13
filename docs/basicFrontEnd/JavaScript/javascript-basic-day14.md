---
autoGroup-1: JavaScript基础篇
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

// 创建新的对象
var person2 = {}

// 浅拷贝
for(var key in person1){
    person2[key] = person1[key];
}

// 浅拷贝过程中，原始值赋值的是副本，两个人变量完全独立
person2.name = 'Asha';
// 浅拷贝引用值是指针，两个变量指向同一个对象。
person2.son.first = 'Ben';
console.log(person1, person2)
```
总结：
1. 将person2定义为空对象，此时person2和person1是独立的存储空间。
2. 修改person2的原始值，person1不会发生改变。
3. 修改引用值，person1也会改变。这是浅拷贝本身的问题。

### 3. 浅拷贝原型上的属性
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
// 在原型上添加属性
Object.prototype.num = 1;

clone(person1, person2);
consoe.log(person2);
```
原型上的属性num也会在person2属性中显示。   、

### 4. 浅拷贝封装
```js
function clone(origin, target){
    // 没传入target时，声明一个空对象
    var tar = target || {};
    for(var key in origin){
        // 过滤原型上的属性
        fi(origin.hasOwnProperty(key)){
            tar[key] = origin[key];
        }
    }
    return tar;
}
```

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
    // 没有传入target时，声明一个空对象
    var target = target || {},
        toStr = Object.prototype.toString, // 保存原型上toString方法
        arrType = '[object Array]';
    for (var key in origin) {
        // 过滤掉原型上的属性
        if (origin.hasOwnProperty(key)) {
            // 当属性是引用值且不为null时
            if (typeof(origin[key]) === 'object' && origin[key] !== null) {
                if (toStr.call(origin[key]) === arrType) {
                    // 声明一个空数组，进行递归
                    target[key] = [];
                } else {
                    // 声明一个对象，进行递归
                    target[key] = {}
                }
                // 要克隆的属性是引用值，需要递归
                deepClone(origin[key], target[key]);
            } else {
                // 原始值直接复制
                target[key] = origin[key]
            }
        }
    }
    return target;
}

var person2 = deepClone(person1);
console.log(person2);
// 修改对象的应用值
person2.children.forth = {
    name: 'Four',
    age: 20
}
console.log(person2);
```

## 练习
### 1. 例一：变量声明相关
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
### 2. 例二：函数声明相关
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
### 3. 例三：this指向
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
fun(); // '222' -> this指向window
a.say(); // '111' -> this 指向a
var b = {
    name: '333',
    say: function(fun){
        fun();
    }
}
b.say(a.say); // '222' 
// b.say()调用，里面执行fun();fun()的this指向window
// var b = {
//     name: '333',
//     say: function(fun){
//         fun();
//         + function(){
//             console.log(this.name)
//         }()
//     }
// }
b.say = a.say;
// var b = {
//     name: '333',
//     say: function (fun) {
//       console.log(this.name);
//     }
// }
b.say(); // '333'
```
### 4. 例四：call、apply的this指向
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
### 5. 例五
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
/**
 * GO = {
 *  bar: undefined -> {
 *          a: '1' -> 'a',
 *          Object.prototype.b = 'b'
 *      }
 *  test: function test(){...}
 * }
*/
```

## 作业
### 1. 构造函数相关
```js
function Foo(){
    getName = function(){
        console.log(1);
    }
    return this;
}
// 给Foo()添加一个getName函数
Foo.getName =function(){
    console.log(2);
}
// 在Foo的原型上添加getName函数声明
Foo.prototype.getName = function(){
    console.log(3);
}

var getName = function(){
    console.log(4);
}

// 全局getName()
function getName(){
    console.log(5);
}

// 执行1：Foo().getName(),执行的是Foo添加的getName(),Foo()函数并没有执行
Foo.getName(); // 2

// 执行2：执行的是全局的getName()方法
getName(); // 4

// 执行3：
/**
 * 1. Foo()执行，Foo()里面的getName函数声明没有var
 * 2. 所以它是全局（window）的getName，它的值会覆盖外面的函数声明（覆盖执行2的函数声明）
*/
Foo().getName(); // 1

// 执行4：执行3执行后，全局的getName已经被替换成Foo()里面的getName
getName();// 1

// 执行5
/**
 * 1. new Foo()后面没有跟执行符号(),所以是优先执行Foo.getName(),再执行new (Foo.getName())
 * 2. Foo.getName() -> 执行的是Foo添加的getName(), Foo()函数并没有执行，所以打印2
*/
new Foo.getName();// new (Foo.getName())  2

// 执行6
/**
 * 1. Foo后面跟了执行符号()，前面又有new；所以是new Foo()执行；
 * 2. 然后再执行实例化的Foo函数里面的getName()；
 * 3. new Foo()实例化后，this指向Foo()函数，相当于function Foo(){var this = {}}；
 * 4. Foo()本身的this里面没有getName()函数，所以回去访问原型上是否有getName();
 * 5. Foo的原型上有getName函数声明，所以打印3；
*/
new Foo().getName();// (new Foo()).getName()  3

// 执行7
/**
 * 1. 执行顺序： new Foo() -> new Foo()函数实例化后的getName(),然后再new
 * 2. new Foo().getName -> 执行6的结果 -> 3
 * 3. new 3 -> new 一个数组是没有意义的，所以还是3
*/
new new Foo().getName();// 3
```
考点：
1. 预编译GO：1）寻找变量声明。2）寻找函数声明，3）运行->赋值
2. 构造函数：构造函数必须实例化后（new），并且自身没有的属性和方法，才会去访问原型上的属性和方法。
3. 执行优先级：() > . > new 。xxx()前面有new->new xxx()

### 2. 请用`window.prompt`接受用户输入的年份，判断是否是闰年？请用三目运算来做
```js
/**
 * 闰年：
 * 1. 普通年判断方法：能被4整除且不能被100整除的为闰年
 * 2. 世纪年判断方法：能被400整除的是闰年
*/
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












