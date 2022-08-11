---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 11.原型与原型链深入、对象继承
---

## 原型
```javascript
// 1. 写一个构造函数
function Car() {}
// 2. 实例化Car
var car = new Car();

// 3. 打印原型
console.log(Car.prototype)
// 4. 打印构造函数
console.log(car);

// 原型本身也是一个对象
// Car.prototype = {}
// 实例化对象也是一个对象
// car = {}
```
总结：
1. 原型本身也是一个对象。
2. 所有的对象都有自己的原型，包括原型本身（也有自己的原型）。
3. `__proto__`是指向对象本身的原型（`__proro__`保存了原型）。
   

## 原型链
### 1. 定义
```javascript
Professor.prototype.tSkill = 'JAVA' // Professor的原型上挂载tSkill
function Professor(){} 
var professor = new Professor(); // 实例化professor

// 把实例化的professor对象赋给Teacher的prototype（原型）
Teacher.prototype = professor; 
function Teacher(){ // Teacher构造函数
  this.mSkill = 'JS/JQ'; // Teacher构造函数有一个mSkill属性
}
var teacher = new Teacher(); // 实例化teacher

// 把实例化的Teacher对象赋给Student的原型
Student.prototype = teacher;
function Student(){
  this.pSkill = 'HTML/CSS';
}
var student = new Student()
console.log(student);
console.log(student.pSkill); // HTML/CSS
console.log(student.mSkill); // JS/JQ
console.log(student.tSkill); // JAVA
```
原型链：沿着__proto__这条线往上去找相应原型的属性值，一层一层的去继承原型的属性的链条就叫原型链。原型链中最重要的一个属性__proto__。

### 2. 原型链的顶端
```javascript
console.log(Professor.prototype); 
```
总结：
1. 原型链的顶端是`Object.prototype`。`object`仍然是有原型的。
2. `Object.prototype`底下保存了一个`toString`的方法。

### 3. 原型链上的增删改
#### 例一
原型链上的增删改只能是它自己本身
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){} 
var professor = new Professor(); 

Teacher.prototype = professor; 
function Teacher(){ 
  this.mSkill = 'JS/JQ'; 
  this.success = { // 引用值
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

console.log(student.success); //{ alibaba: '28', tencent: '30'}
```
更改`student`的父级元素（就是`teacher`的属性）
```js
student.success.baidu = '100';
console.log(teacher, student); // teacher中success增加了属性baidu

student.success.alibaba = '29';
console.log(teacher); // teacher中alibab变成了29
```
`teacher.success`加上了`baidu`属性，不是赋值到`student`实例里，赋值到了`student`实例的原型里面。这是因为`teacher`赋值给了`Student.prototype`，`teacher`在`student`实例的原型对象里。  
**`student`可以修改`teacher`的引用属性**

#### 例二
```js
Professor.prototype.tSkill = 'JAVA'
function Professor(){}
var professor = new Professor();

Teacher.prototype = professor;
function Teacher(){
  this.mSkill = 'JS/JQ';
  this.students = 500; // 原始值
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

### 4. this指向
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
 *      brand: 'Benz',
        __proto__: Car.prototype
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

### 5. 实例化构造函数的返回值
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
console.log(person); // {weight: 129};
console.log(Person.prototype); // {weight: 130}
```
在`smoke`方法中执行`this.weight--`相当于
> this.weight = this.weight - 1  

取值`this.weight`, 原型里有，而`person`没有这个属性，`person`中添加`weight`属性。原型里面的`weight`属性值不变。

## 对象继承
### 1. 声明对象的方法
```js
// 1. 字面量方法
var obj1 = {}
console.log(obj1); // {}

// 2. 构造函数
var obj2 = new Object();
// 公司不用这种，因为它和字面量声明没有区别，添加属性什么的又麻烦、乱
console.log(obj2); // {}

// 3. 自定义构造函数
function Obj(){}
var obj3 = new Obj()
console.log(obj3); 
// 用自定义的构造函数构造的。它的构造器指向的是Obj()自定义的构造器
```
用字面量和系统自带的构造器去声明的对象，他们的构造器都是`Object`，他们两的原型都是原型链顶端的`Object.prototype`。 而自定义的构造函数构造器指向的就是自定义的构造函数。
除了写插件，尽量都用字面量去声明对象。

### 2. 原型的原型
```javascript
function Obj(){}
var obj = new Obj();

console.log(obj.__proto__);
```
原型的原型一定是系统自带的`Object`构造出来的

### 3. Object.create
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
```javascript
var test = {
    num: 2
}
// 把test对象作为原型传进去
var obj1 = Object.create(test);
console.log(obj1);// obj1.__proto__.__proto__ === Object.prototype
``` 
此时obj1原型的原型的构造器就是Object
总结：  
1. Object.creat(对象/null)作用：创建对象
2. Object.creat()提供了提定义原型的功能

::: tip
`new`的工作：
- 实例化`obj2`
- 调用构造函数`Obj`的初始化属性和方法
- 指定实例对象的原型`proto: Obj.prototype`
:::

### 4. Object.create构建空对象

```js
// 创建`obj1`空对象
var obj1 = Object.create(null); 
console.log(obj1);// 完全空的， 对象原型都没有__proto__

// 增加属性
obj1·num = 1;
// 把这个对象赋给一个新的对象的原型
// obj1作为obj2的原型传进来的
var obj2 = Object.create(obj1);
console.log(obj2);// obj1就会挂载到__proto__中
console.log(obj2.num); // 打印原型上的属性
```
`Object.create`的作用：
- 需要自定义`prototype`时候，可以使用`Object.create`来指定原型
- 把其他对象作为当前对象的原型（继承关系）

### 5. 面试题：不继承Object.prototype的对象
```javascript
var obj = Object.create(null);
obj.num = 1;
```
是不是所有的对象都应该继承 `Object.prototype` 呢？   
不是，`Object.create(null)`这种对象就不会继承。   
结论：当Object.create里原型传null的时候，是继承不到Object.prototype上面的方法的，说明不是所有的对象都继承于Object.prototype。

### 6. __proto__
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

### 7. `undefined`与`null`不能使用toString()方法
1. `undefined`与`null`不能使用`toString()`方法。
2. `undefined`和`null`不能经过包装类，且没有原型。
3. 原始值是没有属性的。
```js
console.log(undefined.toString()); // 报错
console.log(uull.toString()); // 报错

var num = 1;
// 原始值是没有属性的
console.log(num.toString()); // 1
// new Number(1) -> toString(); 经过了包装类
```
为什么`Number`有一个自己的`toString()`方法，而不是继承自`Object.prototype`里面的`toString()`？

### 8. document.write
```js
var num = 1;
var obj = {}; // 空对象
var obj2 = Object.create(null); // 空对象没有原型
document.write(num); // 1
document.write(obj); // [object Object]
document.write(obj2); // Cannot convert object to primitive value

// 手动添加toString()方法
obj2.toString = function(){
  return 'hello'
}
document.write(obj2.toString); // hello 
```
`document.write()`打印的时候有一个隐式转换，通过原型链找到`toSring()`方法，转换成`string`。但是`obj2`没有原型。

### 9. toString方法重写
Number、String、Boolean、Array都有toString方法
```js
Object.prototype.toString.call(1); // [object Number] 对象类型的Number构造函数
Number.prototype.toString.call(1); // '1'
```

## call和apply
### 案例一
```js
function test(){
  console.log('a');
}
test(); // test.call() 隐式添加了call

function Car(brand, color) {
    this.brand = brand;
    this.color = color;
}

var newCar = {
    displacement: '3.0'
};

Car.call(newCar, 'Benz', 'red');
console.log(newCar); // {brand: 'Benz', color: 'red', displacement: "3.0"}

Car.apply(newCar, ['Benz', 'red']); // apply后面参数是一个数组(arguments)
console.log(newCar); // {brand: 'Benz', color: 'red', displacement: "3.0"}

var car = new Car('Benz', 'red');
console.log(car); // Car{brand: 'Benz', color: 'red'}
```
更改this的指向。使用call和apply以后，newCar可以使用Car中的属性和方法。

### 案例二
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

compute.plus(1, 2); // 3
compute.minus(1, 2); // -1
compute.mul(1, 2); // 2
compute.div(1, 2); // 0.5
```

## bind基本使用
bind改变this指向后，返回一个新的函数，不执行。call改变this指向并立即执行。
```js
var p1 = {
    name: '张三',
    hobby: this.hobby,
    play: function(sex, age) {
        console.log('年龄为' + age + '岁，性别为' + sex + '的' + this.name + '喜欢' + this.hobby);
    }
}

var p2 = {
    name: '李四',
    hobby: '踢足球'
}

p1.play.call(p2, '男', 20);
p1.play.bind(p2, '男', 20)();
// 一般采用下面的方式
var fn = p1.play.bind(p2, '男', 20);
fn();
```

使用场景:    
事件处理函数改变this指向
```js
bindEvent: function() {
  var _self = this;
  // 使用call修改this指向，this.tabClick.call(this)是会直接执行的，
  // 改变了this指向以后立马执行tabClick，但是我并没有点击，就执行了，
  // 肯定是不对的。而事件处理函数，在没有click是不会执行的，所以使用
  // 一个匿名函数。
  this.tab.addEventListener('click', function() {
      _self.tabClick.call(_self); 
  }, false);

  // 使用bind，bind返回一个新的函数，不会立马执行。
  this.tab.addEventListener('click', this.tabClick.bind(this), false);
},
```

只要函数里面嵌套函数、事件处理函数，在面向对象的写法中都会涉及this指向.

bind挂载在Function.prototype，是无法直接访问到的。 
使用call和apply模拟bind方法：
```js
var p = {
    age: 18
}

function Person() {
    console.log(this);
    console.log(this.age);
}

Person.call(p); // {age: 18} 18
Person.apply(p); // {age: 18} 18
Person.bind(p)();
```

```js
var p = {
    age: 18
}

function Person() {
    console.log(this);
    console.log(this.age);
}

var person2 = Person.bind(p); // this指向失败
new person2(); // Person{} undefined
/**
 * bind仅仅是返回一个新的函数，把这个函数交给person2，在new person2()
 * 的时候this指向也发生了改变，此时的this指向了实例化后的对象本身：
 * var p2 = new person2()。这个bind失效了。因为new的时候，this指向
 * Person了。所以var person2 = Person.bind(p);等于没有用。
 * 
 * var person2 = Person.bind(p);  // person2实际上就是Person()
 * var p2 = new person2();
 * 等效于
 * var p2 = new Person()
 * 
 * 
 * function Person(){
 *      this -> window
 *      'use strict' =>  this -> null
 *  }
 * 
 * new Person(){
 *      this -> 实例对象
 *  }
 * 
 * function Person(){...}作为普通函数情况下，this指向window，使用
 * Person.bind(p)之后，相当于，修改了普通函数Person的this指向，把this
 * 从window修改为p。
 * 同时Person.bind(p)返回了一个新的函数Person()，person2和Person指向
 * 同一个引用，使用new的时候是将person2中的this指向实例对象。只要使用
 * new，person2就是一个构造函数，它里面的this就指向实例对象。
*/
```
### bind模拟实现

bind模拟实现的两个特点：
1. 不执行。
2. 接收传入参数。
3. 实例化失效。

#### 1. 不执行
```js
var p = {
    age: 20
}

function Person() {
    console.log(this);
    console.log(this.age);
}

// 更改this指向，实际上更改执行器上下文->context
Function.prototype.bindy = function(context) {
    // 使用的this肯定是指向调用bindy的function，但是return函数中this指向的是window
    var _self = this; // 调用bindy的function

    // 不执行，肯定return一个函数。因为this.apply(context);会直接执行，而bind不执行
    return function() {
        _self.apply(context);
    }
}
Person.bind(p)();
Person.bindy(p)();
```

#### 2. 传入参数：
```js
// 传入参数第一种情况
Person.bind(p, '张三', 'male')();
// 传入参数第二种情况
var p1 = Person.bind(p, '张三');
p1('male');
```
实现：
```js
var p = {
    age: 20
}

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex); // 1.新增
}

Function.prototype.bindy = function(context) {
    var _self = this;
    // 返回一个数组。第一个参数是this，去掉第一个参数，后面才是需要的参数。
    args = Array.prototype.slice.call(arguments, 1); 
    console.log(args);
    return function() {
        // 匿名函数的参数列表
        var newArgs = Array.prototype.slice.call(arguments); 
        console.log(args, newArgs);
        _self.apply(context, args.concat(newArgs));
    }
}
Person.bindy(p, '张三')('male');
```
#### 3. 实例化失效

```js
// 要求
// 1. new时，this指向构造函数（Person）的实例对象
var p2 = Person.bind(p, '张三');
new p2('male'); // 

// 2. 直接执行，this指向p
var p1 = Person.bind(p, '张三')('male');
```
实际上，此时的this指向p对象。
```js
Function.prototype.bindy = function(context) {
    var _self = this;
    args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var newArgs = Array.prototype.slice.call(arguments);
        console.log(this); // 实例化对象，因为new了
        console.log(_self); // 构造函数Person
        console.log(this instanceof _self);// false。
        // 因为_self在bindy时已经改变了this指向， 那怎么样让它是_self构造出来的呢？

        // this如果是构造函数构造出来的，也就是new出来的，那么原本的context就要指向this；
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }
}

var p2 = Person.bindy(p, '张三');
new p2('male'); // this指向p
```
想让匿名函数里面的this是_self构造出来的，
```js
var p = {
    age: 20
}

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex);
}

Function.prototype.bindy = function(context) {
    var _self = this;
    args = Array.prototype.slice.call(arguments, 1);
    // 实现
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        console.log(this); // fn()
        console.log(this instanceof _self); // true
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }
    console.log(this); // Person
    // fn和this指向一样，让他们构造器相等
    fn.prototype = this.prototype;
    return fn;
}
var p2 = Person.bindy(p, '张三');
new p2('male');
```
发现问题
```js
Function.prototype.bindy = function(context) {
    var _self = this,
        args = Array.prototype.slice.call(arguments, 1),
        tempFn = function(){};
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }

    fn.prototype = this.prototype;
    fn.prototype.num = 2; // 会修改Person.prototype.num的值
    return fn;
}
```

利用圣杯模式解决：
```js
var p = {
    age: 20
}

Person.prototype.num = 1;

function Person(name, sex) {
    console.log(this);
    console.log(this.age);
    console.log(name, sex);
}

Function.prototype.bindy = function(context) {
    var _self = this,
        args = Array.prototype.slice.call(arguments, 1),
        tempFn = function() {};
    var fn = function() {
        var newArgs = Array.prototype.slice.call(arguments);
        _self.apply(this instanceof _self ? this : context, args.concat(newArgs));
    }

    tempFn.prototype = this.prototype;
    fn.prototype = new tempFn();
    fn.prototype.num = 2; // 会修改Person.prototype.num的值
    return fn;
}
var p2 = Person.bindy(p, '张三');
p2('male');
```

## 练习
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
