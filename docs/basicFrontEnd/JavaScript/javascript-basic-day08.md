---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 8.对象、构造函数、实例化
---

## 对象
### 1. 对象的用法
```javascript
var teacher = {
  name: 'Tom',
  weight: 130,
  height: 180,
  teach: function(){
      console.log('I am teaching JavaScript.')
  },
  smoke: function(){
      this.weight--;
      console.log(this.weight);
  },
  eat: function(){
      this.weight++;
      console.log(this.weight);
  }
}

// 查 调用属性
console.log(teacher.name); // Tom
// 执行方法
teacher.teach(); // I am teaching JavaScript

// 增 用 . 语法的形式赋值就能增加属性
teacher.address = '上海';
// 用 . 语法的形式赋值增加方法
teacher.drink = function(){
    console.log('I am drinking beer.')
};

// 修改属性（直接赋值就行）
teacher.height = 180;

// 删
delete teacher.address;
delete teacher.teach(); //能成功删除吗？ 不能，后边有个执行 (笔试题)
// 删除不能有括号
delete teacher.teach; 

// this的引入 在对象中this代表对象本身
// 执行一次smoke方法体重-1
teacher.smoke();
teacher.smoke();
// 执行一次eat方法体重+1
teacher.eat();
```

### 2. 数组的splice方法
#### 1. 案例一
```javascript
var attendance = {
    students: [],
    total: 6,
    join: function(name) {
        this.students.push(name);
        console.log(this.students);
    },
    leave: function(name) {
        // 数组的splice方法(有三个参数)  
        // 第一个参数是你要删除的是这个数组的第几位开始 
        // 第二个参数是你要删除从这一项开始的几项
         arr.splice(0,2)  //第0位开始 2项
    }
}
```
#### 2. 案例修改
```javascript
var attendance = {
  students: [],
  total: 6,
  join: function(){
    this.students.push(name);
    if(this.students.length === this.total) {
        console.log(name + '到课，学生已到齐');
    }else{
        console.log(name + '到课，学生未到齐');
    }
  },
  leave: function(name) {
    var index = this.students.indexOf(name);
    if(index !== -1) {
      this.students.splice(index, 1);
    }
    console.log(name + '早退');
    console.log(this.students);
  },
  classOver: function(){
    this.students = [];
    console.log('已下课');
  }
}
attendance.join('张三');
attendance.join('李四');
attendance.join('王五');
attendance.join('赵六');
attendance.join('吴七');
attendance.join('赵八');
attendance.leave('李四');
```
总结:
- splice、indexOf的使用
- 对象的方法可以传参数，在调用时传入实参。

### 3. 判断一个值有没有在当前数组中的方法
#### 方法一：数组的splice方法
```javascript
var num = 3;
var arr = [1,2,3,4];
for(var i = 0; i < arr.lenght; i++){
  if(arr[i] === num){
    arr.splice(i,1);
  }
}
console.log(arr); // [1,2,4]
```
总结：数组的splice方法有三个参数，第一个参数是你要删除的是这个数组的第几位开始，第二个参数是你要删除从这一项开始的几项。

#### 方法二：indexOf方法
```javascript
var num = 3;
var arr = [1,2,3,4];
console.log(arr.indexOf(num)); // 2

var num = 5;
var arr = [1,2,3,4];
console.log(arr.indexOf(num)); // -1
```
元素存在就返回对应的下标，不存在就返回-1

## 构造函数
### 1. 创建对象的方式
方式一：对象字面量
```javascript
var obj = {
  name: '张三',
  sex: 'male'
}
```
方式二：构造函数
```javascript
var obj = new Object();
```
总结：用系统内自带的构造函数，对象是通过实例化构造函数而创建的对象实例。

### 2. 自定义构造函数
#### 案例一
```javascript
function Teacher(){
  this.name = 'Tom'; 
  this.sex = 'male';
  this.weight = 130;
  this.smoke = function(){
      console.log('I am smoking');
  }
}

var teacher1 = new Teacher();
var teacher2 = new Teacher();
teacher1.name = '李四';
console.log(teacher1.name,teacher2.name); // 李四 张三 
```
总结：
1. 在构造函数中`this`指向谁？    
在构造函数还没有执行之前`this`根本就不存在。在`GO`中，不执行不看函数中内容。要让this存在必须要实例化它，谁用就是谁。`this`指向的是实例化对象本身。
```js
 var t = new Teacher(); // t = this
```
2. 当实例出来的多个对象，它们之间是不同的对象，当改变其中一个对象的属性时，其他对象不受到影响。

#### 案例二：传参
```javascript
function Teacher(name, sex, weight, course){
    this.name = name;
    this.sex = sex;
    this.weight = weight;
    this.course = course;
    this.smoke = function(){
        this.weight--;
        console.log(this.weight);
    },
    this.eat = function(){
        this.weight++;
        console.log(this.weight)
    }
}

var t1 = new Teahcer('Tom', 'male', 130, 'JavaScript');
var t2  =new Teacher('Alle', 'female', '100', 'HTML');
```

#### 优化传参：传一个对象进去
```js
function Teacher(opt){
    this.name = opt.name;
    this.sex = opt.sex;
    this.weight = opt.weight;
    this.course = opt.course;
    this.smoke = function(){
        this.weight--;
        console.log(this.weight);
    },
    this.eat = function(){
        this.weight++;
        console.log(this.weight)
    }
}

var t1 = new Teacher({
    name: 'Tom',
    sex: 'male',
    weight: '130',
    course: 'JavaScript'
})
```

## 练习
1. 写一个构造函数，接受数字类型的参数，参数数量不定，完成参数相加和相乘的功能。
```js
function Compute(opt){
    this.nums = opt.nums;
    this.add = function(){
        var sum = 0;
        for(var i = 0; i < this.nums.length; i++){
            sum += this.nums[i]
        }
        console.log(sum)
    }
    this.aMutiply = function(){
        var accumulate = 1;
        for(var i = 0; i < this.nums.length; i++){
            accumulate *= this.nums[i]
        }
        console.log(accumulate)
    }
}

var compute = new Compute({
    nums: [2,5,8,10]
});
compute.add()
compute.aMutiply()

// 老师写
function Compute(){
    var args = arguments,
        res;
    this.plus = function(){
        res = 0
         loop('add', res);
        // for(var i = 0; i < args.length; i++){
        //     var item = args[i];
        //     res += item;
        // }
        // console.log(res);
    }
    this.times = function(){
        res = 1;
        loop('mul', res);
        // for(var i = 0; i < args.length; i++){
        //     var item = args[i];
        //     res *= item;
        // }
        // console.log(res)
    }

    function loop(method, res){
        for(var i = 0; i < args.length; i++){
            var item = args[i];

            if(method === 'add'){
                res += item;
            }else if(method == 'mul'){
                res *= item;
            }
        }
        console.log(res);
    }
}
```

2. 写一个构造车的函数，可设置车的品牌，颜色，排量。再写一个构造消费者的函数，设置用户的名字，年龄，收入，通过选车的方法实例化该用户喜欢的车，在设置车的属性。
```js
function Car(opt){
    this.brand = opt.brand;
    this.color = opt.color;
    this.displacement = opt.displacement;
}

function User(opt){
    this.name = opt.name;
    this.age = opt.age;
    this.income = opt.income;
    this.choose = function(){
        var car = new Car(opt.car)
        console.log(this.name + '挑选了一辆排量为' + car.displacement + '的' + car.color + car.brand);
    }
}

var Tom = new User({
    name: 'Tom',
    age: 19,
    avenu: 10000,
    car:{
        brand: 'BYD',
        color: 'white',
        displacement: 5
    }
})

Tom.choose()
```

## 构造函数实例化原理
```js
function Car(opt){
    this.color = opt.color;
    this.brand = opt.brand;
    this.drive = function(){
        console.log("I am running");
    }
}

```
只定义构造函数，没有执行`this`不存在。  
当执行
```js
Car(); 
```
函数执行，可以在作用域链中找到函数`AO`，`AO`里面保存了`this`对象，`this`指向`window`。  
`this`什么时候存在呢？   
如果不实例化构造函数，`this`指向`window`。当实例化构造函数后，`this`的指向发生改变，指向实例化的对象。
```js
var car = new Car() // this = car
```

### `new`一个对象发生了什么  

当构造函数被实例化时，相当于`Car()`执行了，一旦要执行就会有AO，AO产生后自动默认保存`this`
```js
Ao = {
    this：{}
}
```
`this`保存为空对象，当`new`对象时，相当于把`Car()`中的内容都跑完了
```js
Ao = {
    this：{
        color: color,
        brand: brand
    }
}
```

总结：`new` 时相当于系统帮你把`this`指向实例化对象
- 1. 保存一个空的`this`对象
- 2. 执行构造函数内容，将 [this.属性] 赋给`this`
- 3. 隐式在最后`return this`

```js
/**
GO = {
    Car: (function),
    car: {
        color: 'red',
        brand: 'Benz'
    }
}

AO = {
    this: {
        color: color,
        brand: brand
    }
}
*/
function Car(){
    /**
    this: {
        color: color,
        brand: brand
    }
    */
    this.color = color;
    this.brand = brand;
    // return this;
}

var car1 = new Car('red', 'Benz');
```
模拟`new`操作：
```js
function Car(color, brand){
    var me = {};
    me.color = color;
    me.brand = brand;
    return me;
}
var car = Car('red', 'Mazda');
```


### return问题
```js
function Car(color, brand){
    this.color = color;
    this.brand = brand;

    //return 123; // 还是return this
    return {}; // {} []
}
var car = new Car('red', 'Benz');
```
构造函数里面，原本是隐式`return this`。
  - 如果`return`引用值，`car`就就是引用值
  - 如果`return`原始值，`car`不会改变还是`return this`。











## 目标
- 掌握包装类型属性访问
- 字符串`length`属性访问原理
- 数组使用`length`截断
- `charCodeAt`获取字符位置

## 包装类
原始值没有自己的属性和方法
- `new Number`
- `new String`
- `new Boolean`

```js
var a = 1; // 原始值
console.log(a); // 1

var b = new Number(a);
b.len = 1;
b.add = function(){
  console.log(1);
}

var d = b + 1;
console.log(d); // 2 参与运算，返回的是原始值

console.log(b); // 对象
```
当一个数字经过`new Number()`以后，就会变成一个对象，成为对象后就可以给它设置属性和方法。

```js
consoole.log(new Number(undefined)); // 对象 NaN
consoole.log(new Number(null)); // 0

console.log(new String(undefined)); // "undefined"
console.log(new String(null)); // "null"

console.log(undefined.length); // Uncaught TypeError: Cannot read properties of undefined
console.log(null.length); // Uncaught TypeError: Cannot read properties of null
```
`undefined` 和 `null` 是不可以设置任何属性和方法的。

```js
var a = 123;
a.len = 1;
// new Number(123).len = 3 保存不了，所以又删除
console.log(a.len);// undefined 原始值没有属性和方法

var str = 'abc';
console.log(str.length);
```
为什么`string`可以有`length`？-->通过包装类来访问（或者说字符对象即`new String()`, 有这个属性）
```js
var str = 'abc';

str.length = 1; // 原始值，new String(str).length = 1; (执行后发现没地方保存)
//delete 

// 又重新包装了一次  new String(str).length 经过包装类来访问
console.log(str.length);
```

数组可以通过`length`属性来截断
```js
var arr = [1, 2, 3, 4, 5];
arr.length = 3;
console.log(arr); // [1, 2, 3]

arr.length = 6;
console.log(arr); // [1, 2, 3, empty, empty, empty]
```

### 练习
1. 例一（笔试题）
```js
var name = 'languiji';
name += 10;  // languiji10

var type = typeof(name); // 'string'
if(type.length === 6){
  type.text = 'string'; // type是原始值，那你是顾客你要求的所以只能给你操作一遍
  // new String(type).text = 'string'; 执行完之后发现没有地方储存，所以自动删除
  // delete
}

console.log(type.text); // undefined
```
偏要让你输出type.text，怎么办？
```js
var type = new String(typeof(name));
```

2. 例二
```js
function Car(brand, brand){
  this.brand = 'Benz';
  this.color = 'red';
}

var car = new Car('Mazda', 'blank');
console.log(car); // Car {brand: 'Benz', color: 'red'}  没有把参数赋值，所以还是原来写好的值
```

3. 例三（笔试题）
```js
function Test(a, b, c){
  var d = 1;
  this.a = a;
  this.b = b;
  this.c = c;

  function f(){
    d++;
    console.log(d); // 先d++再打印的d, 所以加了1
  }

  this.g = f;
  // return this; -> 闭包。把Test构造函数的AO带出去了
}

var test1 = new Test();
test1.g(); // 2
test1.g(); // 3

var test2 = new Test();
test2.g(); // 2
```
4. 例四（笔试题）
```js
var x = 1,
    y = z = 0;
function add(n){
  return n = n + 1;
}

y = add(x);

function add(n){
  return n = n + 3;
}

z = add(x);

console.log(x, y, z); // 1  4  4

/**
GO = {
  x: undefined -> 1,
  y: undefined -> 0 -> 4,
  add: function add(){n+1} -> function add(){n+3},
  z: 0 -> 4,
}

AO = {
  n: undefined -> 1
}
*/
```

5. 例五（笔试题）：下列函数哪个能输出1,2,3,4,5
```js
function foo1(x){
  console.log(arguments); 
  return x;
}
foo1(1,2,3,4,5)

function foo2(x){
  console.log(arguments); 
  return x;
}(1,2,3,4,5); // 这个函数没有执行，被看成函数声明 和 一个表达式(1,2,3,4,5)
// function foo2(x){
//   console.log(arguments); 
//   return x;
// } 
// (1,2,3,4,5)

(function foo3(x){
  console.log(arguments); 
  return x;
})(1,2,3,4,5)
```
foo1和foo3
> arguments存储传递的所有实参，不管你形参有几个，你实参传了几个都会被存储进去

6. 例六（面试题）
```js
function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 实参

  // 另一种
  arguments[2] = 10;
  console.log(a); // 映射关系
}
b(1,2,3); // 10
```

- ASCII码：表1（0 - 127），表2（128 - 255） 所有字符都是1个字节 byte
- Unicode码 涵盖ASCII码  256以后是2个字节.  

打印在Unicode中的位置`charCodeAt`方法：
```js
var str = 'a'
var pos = str.charCodeAt(0);
console.log(pos); // 97
```

### 作业
1. 写一个函数，接受任意一个字符串，算出这个字符串的总字节数
```js
function calculateByte(str){
  var totalByte = 0;
  for(var i = 0; i < str.length; i++){
    var pos = str.charCodeAt(i)
    if(pos < 256){
      totalByte += 1;
    }else {
      totalByte += 2;
    }
  }
  return totalByte;
}
console.log(calculateByte('123456是'))

// 老师写
function getBytes(str){
  var bytes = str.length;
  for(var i = 0; i < str.length; i++){
    var pos = str.charCodeAt(i);
    if(pos > 255){
      bytes++
    }
  }
  return bytes;
}

console.log(getBytes("你好，世界！Hello world!"))
```
