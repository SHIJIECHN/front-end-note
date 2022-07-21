---
autoGroup-1: ES6
sidebarDepth: 3
title: 17. class与对象
---

## class
### 1. 构造函数原型
```js
function Person(name = 'zhangsan', age = '18') {
    this.name = name;
    this.age = age;
}

Person.prototype.say = function() {
    console.log(`my name is ${this.name}, my age is ${this.age}`);
}

const person = new Person();
// 访问原型
console.log(Object.getPrototypeOf(person));
console.log(Object.getPrototypeOf(person).constructor === Person); // true
console.log(Person.prototype === Object.getPrototypeOf(person)); // true
```
使用class定义Person，可以看做构造函数的另一种写法
```js
class Person {
    // 构造器
    constructor(name = 'zhangsan', age = '18') {
        //  实例化的属性配置：私有属性
        this.name = name;
        this.age = age;
    }

    // 公有属性。
    say() {
        console.log(`my name is ${this.name}, my age is ${this.age}`);
    }
}

console.log(typeof Person); // "function"
console.log(Person === Person.prototype.constructor); // true

const p = new Person();
```
1. 类的数据类型就是函数，类本身就是指向构造函数。   
2. 使用的时候，直接对类使用new命令。    
3. this关键字代表实例对象。    

### 2. 特征
1. 类的所有方法都定义在类的prototype属性上面。
```js
class Person{
    constructor(){
        //...
    }
    say(){
        // ...
    }
}
// 等同于
Person.prototype = {
    constructor(){},
    say(){}
}
```
2. 由于类的所有方法都定义在prototype对象上，所以使用Object.assign()方法可以一次向类添加多个方法
```js
class Person{
    constructor(){ 
        // ... 
    }
}
Object.assign(Person.prototype, {
    eat(){},
    drink(){}
})
```
3. prototype对象的constructor()属性，直接指向类自身
```js
Person.prototype.constructor === Person; // true
```
类的内部定义的所有方法，都是不可枚举的。


### 3. constructor方法
没有写构造器，会默认添加。通过new命令生成实例时，自动调用该方法
```js
class Person(){

}
// 等同于
class Person(){
    constructor(){}
}
```
constructor()方法默认返回实例对象（即this），完全可以指定返回另一个对象
```js
class Person {
    constructor() {
        return Object.create(null);
    }
}

console.log(new Person() instanceof Person); // false
```
类必须使用new的方式执行，否则会报错
```js
class Person {
    constructor() {
        return Object.create(null);
    }
}

Person(); // Class constructor Person cannot be invoked without 'new'
```
### 4. 类的实例
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        console.log(`(${this.x},${this.y})`);
    }
}
let point = new Point(2, 3);
point.toString(); // (2, 3)

console.log(point.hasOwnProperty('x')); //  true
console.log(point.hasOwnProperty('y')); // true

console.log(point.hasOwnProperty('toString')); // false
console.log(Object.getPrototypeOf(point).hasOwnProperty('toString')); // true
```
1. x和y都是实例对象自身的属性（定义在this对象上）。
2. 实例的属性除非显示定义在其本身（即定义在this对象上），否则都是定义在原型上。
3. 类的所有实例都共享一个原型对象。

### 5. 取值函数和存值函数
```js
class MyClass {
    constructor() {}

    get prop() {
        console.log('getter');
    }

    set prop(value) {
        console.log('setter: ', value);
    }
}

let inst = new MyClass(); // 实例化

inst.prop = 123; // setter: 123
inst.prop; // getter
```
赋值和取值行为被自定义了。

### 6. Class表达式
```js
const MyClass = class Me {
    getCLassName() {
        return Me.name;
    }
}
```
类名为Me，只能在Class的内部可用。在Class外部，这个类只能用MyClass引用。也可以省略Me。
```js
const MyClass = class { 
    // ...
}
```
立即执行Class
```js
let person = new class {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}('张三');
person.sayName(); // 张三
```

注意：
1. 类和模块的内部，默认就是严格模式
2. 不存在变量提升

### 7. static静态方法
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在方法前加static关键字，就表示该方法不会被实例继承，而是直接通过类来调用。
```js
class Person {
    static a() {
        console.log(1);
    }
}

Person.a(); // 1
```
静态方法中有this，这个this指向的是类，而不是实例。

### 8. Class的继承
```js
class Parent {
    constructor(name = 'zhangsan') {
        this.name = name;
    }
    say() {
        console.log(this.name);
    }

    static a() {
        console.log('a');
    }
}

// 子类
class Child extends Parent {
    constructor(name = 'lisi', age = '19', type) {
        super(name); // 必须要写，调用父类的constructor(name)
        this.age = age;
        this.type = type
    }

    say() {
        return this.type + '' + super.say(); // 调用父类的say()方法
    }
}
```
super在这里标识父类的构造函数，用来新建一个父类的实例对象。子类必须在constructor()方法中调用super()，否则就会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完全塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。如果不调用super()方法，子类就得不到自己的this对象。    
只有调用super()之后，才可以使用this关键字。    
如果子类没有定义constructor()方法，会默认添加，并且里面会调用super().
```js
class Child extends Parent{
    
}
// 等同于
class Child extends Parent{
    constructor(...args){
        super(...args)
    }
}
```


## Class源码实现


## 修饰器模式