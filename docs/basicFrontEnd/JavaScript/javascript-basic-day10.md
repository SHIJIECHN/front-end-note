---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 10.原型、原型链、闭包立即执行函数、插件开发
---

## 原型
### 1. 原型`prototype`
```javascript
function Handphone(){

}
console.log(Handphone.prototype); // {constructor: f
```
原型`prototype`是`function`对象的一个属性，也是一个对象。

### 2. 原型的作用
在实例化对象的时候总有一些写死的值，这些写死的值，在每次`new`的时候都需要去走一遍这个流程，这种代码对于实例化来说是一种代码冗余。原型的作用就是解除这种冗余，把要写死的内容挂到原型上去，需要参数去传值的属性就写到`this`里面去，把需要配置的方法或属性就写在属性中，固定的方法或属性就写在原型上。
```javascript
function Handphone(color, brand){
  this.color = color;
  this.brand = brand;
  this.screen  = '18:9';
  this.system = 'Android'
}

Handphone.prototype.rom = '64G';
Handphone.prototype.ram = '6G';
Handphone.prototype.call = fuinction(){
  console.log('I am calling somebody.');
}

var hp1 = new Handphone('red', '小米');
var hp2 = new Handphone('black', '华为');

console.log(hp1.rom);// 64G
console.log(hp2.ram);// 6G

console.log(hp1.screen); // 18:9  自己有的属性就不会到原型上去找属性了
```
总结：
1. `prototype`对象是定义构造函数构造出的每个对象的**公共祖先**。
2. 所有被构造函数构造出的对象都可以继承原型上的属性和方法。
3. 当我们需要参数传值时就写到this里去，需要写死这个值时就写到原型上面，直接继承就行了。
4. 为什么所有的方法都写在原型上面？为什么只有部分属性会写到构造函数内部？
   往往属性都是配置项，都是需要传参去配置的，而函数就是方法，都是一样的，所有的方法都会写在原型上面，而只有这种需要传参配置的我们会写在构造函数内部。


经验：一个插件，方法往往被写到原型上去，部分属性写到构造函数内部。因为属性往往都是配置项，需要传参去配置的，而方法是一样的。

### 3. 构造出来的对象对原型的增删改查问题
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
通过实例化对象来更改`prototype`，不能更改祖先上面的东西。

### 4. constructor构造器
```js
function Handphone(color, brand, system){
  this.color = color;
  this.brand = brand;
  this.system = system;
}

var hp1 = new Handphone('red', 'iPhone', 'iOS');
console.log(hp1.constructor); // 是一个函数 
console.log(Handphone.prototype.constructor); // 是一个对象 f Handphone(...)
```
结论：原型上的`constructor`指向构造函数本身

修改constructor指向
```javascript
function Telephone(){}
function Handphone(color, brand, system){
  this.color = color;
  this.brand = brand;
  this.system = system;
}

Handphone.prototype = {
  constructor: Telephone
}

var hp1 = new Handphone('red', 'iPhone', 'iOS');

console.log(Handphone.prototype.constructor); // 是一个对象 f Telephone(...)
```
 可以通过`Handphone.prototype.constructor`修改构造器指其他构造函数。

### 5. `__proto__`
```js
function Car(){
  // new实例化以后，隐式的var了一个this的一个空对象
  // var this = {
  //   __proto__: Car.prorotype
  // }
}
Car.prototype.name = 'Banz';

var car = new Car();
console.log(car); // Banz
```

实例化对象中有`__proto__`，指向构造函数的`prototype`原型对象，实例对象可以使用构造函数`prototype`原型对象的属性和方法，是因为对象有`__proto__`的存在。

当构造函数被`new`的时候，就产生了`this`，`this`并不是空对象，但你就把它当成空对象，`this`中有一个`__proto__`，这个`__proto__`默认就装的是实例化对象以后的原型。当`this`中没有自己的`name`属性，就会到`__proto__`里面去找`name`属性。

总结：
1. `__proto__`属于每个实例化对象的不是属于构造函数的。
2. `__proto__`是每一个容纳原型的容器，存的是原型的引用。
3. `__proto__`是this对象的一个键名，为了方便找到prototype设置的属性。

### 6. 修改`__proto__`的值
```js
function Person(){ }
Person.prototype.name = '张三';

var person = new Person();
console.log(person.__proto__); // {name: '张三', constructor: ƒ}
console.log(person.name); // 张三

var p1 = {
  name: '李四'
};

person.__proto__ = p1
console.log(person.name); // 李四
```

### 7. 原型的重新赋值
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
它是在实例化之后写的，实例化之后写的，跟我创建这个实例的`__proto__`对应的`prototype`已经没有关系了
```js
function Car(){
  var this = {
    __proto__: Car.prototype = {
      name: 'Benz'
    }
  }
}
```


分析下面的例子：
```js
Car.prototype.name = 'Banz';
function Car(){}

var car = new Car()

Car.prototype = {
  name: 'Mazda'
}
var car1 = new Car();
console.log(car.name); // Banz
console.log(car1.name); // Mazda
```

在没有实例化之前`Car()`底下有一个属性`prototype`，在`prototype`中有一个构造器`constructor`，构造器指向的就是构造函数`Car`本身，在构造函数`Car()`本身又有一个`prototype`属性，存放的是`name: 'Banz'`
> Car.prototype.constructor -> Car() -> prototype -> name:'Banz'

当你实例化了以后，`this`存在了，`this`存放有`__proto__`，`__proto__`对应它实例相对应的`prototype`，`prototype`会从`constructor`里面去拿值，所以实例化的时候直接从构造器里面拿出来的属性
```js
function Car(){
  var this = {
    __proto__: Car.prototype {
      name: 'Banz'
    }
  }
}
```
但是在实例化以后重新写了`prototype`，重写的是构造器`constructor`里面的。

## window和return问题
### 1. return 
```js
function test(){
  var a = 1;
  function plus1(){
    a++;
    console.log(a);
  }

  return plus1;
}

var plus = test();
plus();
plus();
plus();

```
分析：把plus1 return出去了，plus1死死的拽住testAO把它（testAO）带出去了，testAO里原本就有a，所以每次执行的时候a可以被改变，就是闭包。闭包拿出来以后把它赋值给了plus，形成了闭包以后把这个plus1 return出来，return到全局被plus保存，这个plus1相当于变成了全局函数了。

### 2. window
```javascript
// 使用window改造
function test(){
  var a = 1;
  function add(){
    a++;
    console.log(a);
  }

  window.add = add; // 定义了一个全局变量add，等于函数add
}

test();
add(); // 2
add(); // 3
add(); // 4
```
结论：window和return能实现同样的功能。

### 3. 立即执行函数
```javascript
// 立即执行函数 再次改造
var add = (function(){
  var a = 1;
  function add(){
    a++;
    console.log(a);
  }
  return add;
})();

add(); // 2
add(); // 3
add(); // 4
```
写立即执行函数的目的：防止变量、函数作用域的污染，为了隔离全局的作用域。    
结论：用立即执行函数把它包起来，这样我们作用域就被限制到这个执行函数内部。

## js插件开发    
立即执行函数里面写一个构造函数，将这个构造函数保存到window上的一个变量。   
标准写法：
```js
(function(){

  function Test(){

  }

  window.Test = Test
})();

var test = new Test();
```
:::tip
一个自启动函数，插件的标配
:::

## 练习
1. 写一个插件，任意传两个数字调用插件内部方法可进行加减乘除功能
```js
;(function(){
  function Compute(opt){
      this.firstNum = opt.firstNum;
      this.secondNum  = opt.secondNum;
  }
  Compute.prototype = {
    plus: function(){
      var sum = 0;
      sum = this.firstNum + this.secondNum;
      console.log(sum)
    },

    minus: function(){
      var res = 0;
      res = this.firstNum - this.secondNum
      console.log(res)
    },

    multiply: function(){
      var acc = 1
      acc = this.firstNum * this.secondNum
      console.log(acc);
    },

    divide: function(){
      var res = 1;
      res = this.firstNum / this.secondNum;
      console.log(res);
    }
  }

  window.Compute = Compute
})()

var compute = new Compute({
  firstNum: 10,
  secondNum: 2
})
compute.plus();
compute.minus();
compute.multiply();
compute.divide();
```
::: tip
参数可以在调用方法的时候传递，所以可不写在构造函数上，写在方法上
:::

```javascript
;(function() {
    function Compute() {}
    Compute.prototype = {
        plus: function(a, b) {
            console.log(a + b);
        },

        minus: function(a, b) {
            console.log(a - b);
        },

        mul: function(a, b) {
            console.log(a * b);
        },

        div: function(a, b) {
            console.log(a / b);
        }
    }

    window.Compute = Compute;
}());

var compute = new Compute();
compute.plus(1, 2); // 3
compute.minus(1, 2); // -1
compute.mul(1, 2); // 2
compute.div(1, 2); // 0.5
```
