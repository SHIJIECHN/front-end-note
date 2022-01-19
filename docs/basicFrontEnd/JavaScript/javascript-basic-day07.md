---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day07 
---

## 目标

## 原型对象`prototype`
- 原型`prototype`是`function`对象的一个属性，打印出来看一下，结果它也是一个对象
- 定义构造函数构造出的每个对象的**公共祖先**
- 所有被构造函数构造出的对象都可以继承原型上的属性和方法
```js
function Handphone(color, brand){
  this.color = color;
  this.brand = brand;
  // this.screen  = '18:9';
  // this.system = 'Android'
}

Handphone.prototype.rom = '64G';
Handphone.prototype.ram = '6G';
Handphone.prototype.screen = '16:9'
Handphone.prototype.system = 'Android';
Handphone.prototype.call = fuinction(){
  console.log('I am calling somebody.');
}

var hp1 = new Handphone('red', '小米');
var hp2 = new Handphone('black', '华为');
console.log(hp1.rom);
console.log(hp1.ram);

console.log(hp1.screen); // 18:9 自己有的属性就不会到原型上去找属性了

chp1.call()
```
原型的作用：我们在实例化对象的时候总有一些写死的值，这些写死的值，在每次new的时候我们都需要去走一遍这个流程，这种代码对于实例化来说是一种代码冗余，也是一种耦合（重复了）在这种情况下，我们得想一个办法能不能让它继承谁，在这种时候，我们把要写死的内容挂到原型上去，当我们需要参数去传值的这些，我们就写到this里面去，当我们需要写死的这些，我们就写到原型上去直接继承就可以了。

经验：一个插件，方法往往被写到原型上去，部分属性写到构造函数内部。因为属性往往都是配置项，需要传参去配置的，而方法否是一样的

```js
function Test(){ }
Test.prototype.name = 'prototype';

var test = new Test();

console.log(test.name); // 查

test.num = 1;
console.log(Test.prototype); // 不能增

delete test.name
console.log(Test.prototype); // 不能删

test.name = 'proto'
cosnole.log(Test.prototype); // 不能改
```
通过实例化对象来更改prototype，更改祖先上面的东西更改不了。

## constructor构造器
```js
function Telephone(){}
function Handphone(color, brand, system){
  this.color = color;
  this.brand = brand;
  this.system = system;
}

Handphone.prototype = {
  constructor: Telephone
}

// Handphone.prototype = {
//   rom: '64G',
//   ram: '6G',
//   screen: '18:9',
//   system: 'Android',
//   call: function(){
//     console.log('I am calling somebody.');
//   }
// }

var hp1 = new Handphone('red', 'iPhone', 'iOS');
console.log(hp1.constructor); // 是一个函数 ƒ Object() { [native code] }
console.log(Handphone.prototype)
```
- `constructor`指向构造函数本身
- 可以通过`Handphone.prototype.constructor`修改构造器指向别的

## \_\_proto__
```js
function Car(){
  // new实例化以后，隐式的var了一个this的一个空对象
  var this = {
    __proto__: Car.prorotype
  }
}
Car.prototype.name = 'Banz';

var car = new Car();
console.log(car); // Banz
```

实例化对象中有`__proto__`，指向构造函数的`prototype`原型对象，我们对象可以使用构造函数`prototype`原型对象的属性和方法，是因为对象有`__proto__`原型的存在。

`__proto__`属于每个实例化对象。每个实例对象原型的容器，它就是装`prototype`的。

当构造函数被new的时候，就产生了this，this并不是空对象，但你就把它当成空对象，this中有一个__proto__，这个__proto__默认就装的是实例化对象以后的原型。当this中没有自己的name属性，就会到__proto__里面去找name属性。

```js
function Person(){ }
Person.prototype.name = '张三'
var p1 = {
  name: '李四'
};

var person = new Person();
console.log(person.__proto__); // {name: '张三', constructor: ƒ}
console.log(person.name); // 张三
/***********************************/
person.__proto__ = p1
console.log(person.name); // 李四
```
__proto__可以修改。

原型一定是属于实例化对象的而不是构造函数的。
```js
function Car(){}
Car.prototype.name = 'Mazda';
var car = new Car();

Car.prototype.name = 'Banz';
console.log(car.name); // Benz

/****************************/
Car.prototype.name = 'Mazda';
function Car(){}
var car = new Car();

Car.prototype.name = 'Banz';
console.log(car.name); // Benz

/***************************/
Car.prototype.name = 'Mazda';
function Car(){}
Car.prototype.name = 'Banz';
var car = new Car();

console.log(car.name); // Benz

```
以上都是对属性的重写。

```js
Car.prototype.name = 'Benz';
function Car(){}
var car = new Car();

Car.prototype = {
  name: 'Mazda'
}

var car1 = new Car()

console.log(car.name); // Benz
console.log(car1.name); // Mazda
```
分析：  
重新写了prototype
```js
Car.prototype = {
  name: 'Mazda'
}
```
它是在实例化之后写的，实例化之后写的，跟我创建这个实例的__proto__对应的prototype已经没有关系了
```js
function Car(){
  var this = {
    __proto__: Car.prototype = {
      name: 'Benz'
    }
  }
}
```

```js
Car.prototype.name = 'Banz';
function Car(){}

var car = new Car()

Car.prototype = {
  name: 'Mazda'
}
var ca1 = new Car();
console.log(car.name); // Banz
console.log(car1.name); // Mazda
```

在没有实例化之前Car()底下有一个属性prototype，在prototype中有一个构造器constructor，构造器指向的就是构造函数Car本身，在构造函数Car()本身又有一个prototype属性，存放的是name: 'Banz'
> Car.prototype.constructor -> Car() -> prototype -> name:'Banz'
当你实例化了以后，this存在了，this存放有__proto__，__proto__对应它实例相对应的prototype，prototype会从constructor里面去拿值，所以实例化的时候直接从构造器里面拿出来的属性
```js
function Car(){
  var this = {
    __proto__: Car.prototype {
      name: 'Banz'
    }
  }
}
```
但是在实例化以后重新写了prototype，重写的是构造器constructor里面的。
