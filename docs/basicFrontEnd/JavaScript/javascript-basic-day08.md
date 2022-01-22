---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day08 
---

## 原型与原型链深入
- 原型链的顶端是`Object.prototype`。`object`仍然是有原型的。
- `Object.prototype`底下保存了一个`toString`的方法。
- 原型链上的增删改只能是它自己本身

例一
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){}
var professor = new Professor();

Teacher.prototype = professor;
function Teacher(){
  this.mSkill = 'JS/JQ';
  this.success = {
    alibaba: '28',
    tencent: '30'
  }
}
var teacher = new Teacher();

Student.prototype = teacher;
function Student(){
  this.pSkill = 'HTML/CSS';
}
var student = new Student()

// console.log(student)
console.log(student.success);
```
更改`studen`t的父级元素（就是`teacher`的属性）
```js
student.success.baidu = '100';
console.log(teacher, student);

student.success.alibaba = '29';
console.log(teacher);
```
`teacher.success`加上了`baidu`属性，不是赋值到`student`实例里，赋值到了`student`实例的原型里面。这是因为`teacher`赋值给了`Student.prototype`，`teacher`在`student`实例的原型对象里。  
**`student`可以修改`teacher`的引用属性**

例二
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){}
var professor = new Professor();

Teacher.prototype = professor;
function Teacher(){
  this.mSkill = 'JS/JQ';
  this.students = 500;
}
var teacher = new Teacher();

Student.prototype = teacher;
function Student(){
  this.pSkill = 'HTML/CSS';
}
var student = new Student()
console.log(student.students); // 500

student.students++;
console.log(teacher);
console.log(student);
```
`teacher`和`student`分别有什么变化？  
`teacher`没有变，`student`增加了一个`students`属性值为`501`。   
`student`不能去修改`teacher`的原始值属性，但是会将`teacher.students`复制下来，他认为你想给`student`增加一个`students`属性。
> student.students = student.students + 1  

`student.students`取值，因为往上找能找到为`500`，所以是`500+1`。   
**`student`不可以修改`teacher`的原始值，但是会复制一份到自己实例上再修改**   
但是不推荐这样修改继承的原型值。

例三（笔试题）
```js
function Car(){
  this.brand = 'Banz'
}

Car.prototype = {
  brand: 'Mazda',
  intro: function(){
    console.log('我是'+ this.brand + '车');
  }
}

var car = new Car()
car.intro(); // Benz

/**
 * function Car(){
 *    var this = {
 *      brand: 'Benz'
 *    }
 * }
 * Car.prototype --> intro()
*/
```
分析：实例化过程就是`this`产生的环节，在调用`intro()`的时候，`this`中没有，所以去`Car.prototype`原型里面找，在`intro()`里的`this`指向对象本身，在对象中有`brand`，那`this`就指向自己的`brand`了。

::: tip
谁在使用this，this就指向谁
:::

想要打印`Mazda`呢？
```js
Car.prototype.intro(); // Mazda
```

例四
- 普通函数不写返回值，默认返回`undefined`
- 构造函数通过实例化后，返回`this`

```js
function Person(){
  /**
   * this = {
   *    weight: 129;
   * }
  */
  this.smoke = function(){
    this.weight--;
  }
}

Person.prototype = {
  weight: 130;
}

var person = new Person();
person.smoke();
console.log(person);
```
在`smoke`方法中执行`this.weight--`相当于
> this.weight = this.weight - 1  

取值`this.weight`, 原型里有，而`person`没有这个属性，`person`中添加`weight`属性。原型里面的`weight`属性值不变。

## 声明对象
声明对象的方法
```js
var obj1 = {}
console.log(obj1);

var obj2 = new Object(); // 公司不用这种，因为它和字面量声明没有区别，添加属性什么的又麻烦、乱
console.log(obj2);

function Obj(){}
var obj3 = new Obj()
console.log(obj3); // 用自定义的构造函数构造的。它的构造器指向的是Obj()自定义的构造器
```
用字面量和系统自带的构造器去声明的对象，他们的构造器都是`Object`，他们两的原型都是原型链顶端的`Object.prototype`。 
- 除了写插件，尽量都用字面量去声明对象
- 原型的原型一定是系统自带的`Object`构造出来的

## Object.create
`Object.create(对象/null)` 创建对象。**括号里面可以指定对象原型，放你想要的原型**
```js
function Obj(){}
Obj.prototype.num = 1;
var obj1 = Object.create(Obj.prototype);
console.log(obj1);

var obj2 = new Obj();
console.log(obj2);
```
`obj1`与`obj2`就像双胞胎，他们的对象原型、构造函数是一样的。  
::: tip
`new`的工作：
- 实例化`obj2`
- 调用构造函数`Obj`的初始化属性和方法
- 指定实例对象的原型`proto: Obj.prototype`
:::


创建`obj1`空对象
```js
var obj1 = Object.create(null); 
console.log(obj1);// 完全空的， 对象原型都没有__proto__

obj1·num = 1;
var obj2 = Object.create(obj1);
console.log(obj2);// obj1作为obj2的原型传进来的，所以就会挂载到__proto__中
```
`Object.create`的作用：
- 需要自定义`prototype`时候，可以使用`Object.create`来指定原型
- 把其他对象作为当前对象的原型（继承关系）

::: tip
是不是所有的对象都应该继承 `Object.prototype` 呢？   
不是，`Object.create(null)`这种对象就不会继承
:::

```js
var obj = Object.create(null);
obj.num = 1;
var obj1 = {
  count: 2;
}
obj.__proto__ = obj1;
console.log(obj.count); // undefined
```
手动指定`__proto__`属性的值无效，`__proto__`必须是系统内置的，可以更改，但是不能自造。

## `undefined`与`null`
`undefined`与`null`不能使用`toString()`方法。原始值是没有属性的。`undefined`和`null`不能经过包装类，且没有原型。
```js
var num = 1;
num.toString(); // new Number(1) -> toString(); 经过了包装类
```
为什么`Number`有一个自己的`toString()`方法，而不是继承自`Object.prototype`里面的`toString()`？

```js
var num = 1;
var obj = {};
var obj2 = Object.create(null);
document.write(num);
document.write(obj); // [object Object]
document.write(obj2); // Cannot convert object to primitive value

// 手动添加toString()方法
obj2.toString = function(){
  return 'hello'
}
document.write(obj2.toString); // hello 
```
`document.write()`打印的时候有一个隐式转换，通过原型链找到`toSring()`方法，转换成`string`。但是`obj2`没有原型。

## toString方法重写
Number、String、Boolean、Array都有toString方法
```js
Object.prototype.toString.call(1); // [object Number] 对象类型的Number构造函数
Number.prototype.toString.call(1); // '1'
```

## call、apply
更改this的指向。
```js
function test(){
  console.log('a');
}

test(); // test.call() 隐式添加了call

/******************************/

function Car(brand, color){
  this.brand = brand;
  this.color = color;
}

var newCar = {};

Car.call(newCar, 'Benz', 'red');
Car.apply(newCar, ['Benz', 'red']);
console.log(newCar);
```
使用call和apply以后，newCar可以使用Car中的属性和方法。
案例分析
```js
function Compute(){
  this.plus = function(a, b){
    console.log(a + b);
  },
  this.minus = function(a, b){
    console.log(a - b);
  }
}

function FullCompute(){
  Compute.apply(this);

  this.mul = function(a, b){
    console.log(a * b);
  },

  this.div = function(a, b){
    console.log(a / b);
  }
}

var compute = new FullCompute();
compute.plus(1, 2);
compute.minus(1, 2);
compute.mul(1, 2);
compute.div(1, 2);
```

### 练习
1. 年龄为多少岁，姓名为xx，买了一辆排量为xx的xx颜色的xx牌子的车(使用call/apply)
```js
function Car(opt){
  console.log(opt)
  this.color = opt.color;
  this.brand = opt.brand;
  this.displacement = opt.displacement;
}
function Person(opt){
  // Car.apply(this, opt);
  Cars.call(this,opt);
  this.name = opt.name;
  this.age = opt.age;

  this.buy = function(){
    console.log(`年龄为${this.age}岁，姓名为${this.name}，买了一辆排量为${this.displacement}的${this.color}的${this.brand}的车`);
  }
}

var p1 = new Person({
  name: 'Tom',
  age: '20',
  color: 'red',
  brand: 'Benz',
  displacement: '3.0'
});
console.log(p1)
p1.buy();
```

