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

### 2. 自定义构造函数与实例化
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
    }
    this.times = function(){
        res = 1;
        loop('mul', res);
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

var compute = new Compute();
compute.plus(1,2,4);
compute.times(2,3,4);
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

Tom.choose();
```