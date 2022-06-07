---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 3.循环、引用值初识、显示及隐式类型转换
---

## 循环
在JavaScript中有两种常用的循环：for循环与while循环。下文分别讨论这两个循环.
### 1. for循环
```js
for(var i = 0; i < 10; i++){
    console.log(i)
} 

/**
将上面循环进行分解，步骤：
1、声明变量 i = 0
2、if(i < 10){
        console.log(i)
    }
3、i++
4、当i=10，if(i < 10){  不满足条件 停止循环
        console.log(i)
    }
*/
```
`i`的声明可以单独提到外面，即：
```javascript
var i = 0;
for(; i < 10;){
    console.log(i)
    i++
}
```
### 2. while循环
上例同`while`循环非常相似，所以也可以写成：
```javascript
var i = 0;
while(i < 10){
    console.log(i);
    i++
}
```
所以`for`循环可以转换成`while`循环。  

### 2. 死循环
```javascript
// for的死循环
var i = 0;
for(; 1;){
  console.log(i);
  i++;
}

// while的死循环
while(1){
  console.log(i);
  i++;
}
```
如果条件永远满足，那它就一直执行，进入死循环。

不使用break终止循环。
```js
var i = 1;
for(; i;){
    console.log(1);
    i++;
    if(i == 10){
      // break;
      i = 0; // 当i为假时就终止循环
    }
}
```

### 3. 案例
案例1：从0开始做加法，加到什么时候总和是小于100的
```js
var sum = 0;
for(var i = 0; i < 100; i++){
    sum += i;
    
    if(sum >= 100){
        break;
    }
    console.log(i, sum);
}
```
案例2：100以内的数跳过可以被7整除，或个位数是7的数
```js
for(var i = 0; i <= 100; i++){
    if(i % 7 == 0 || i % 10 == 7){
        continue; // 跳过这一次循环，进行下一次循环
    }
    console.log(i);
}
```

案例3：可以被4，5，6整除的数
```javascript
for(var i = 0; i < 100; i++){
  if(i % 4 ==0 || i % 5 == 0 || i % 6 == 0){
    console.log(i);
  }
}
```

案例4：打印0-99的数，（）只能有一句，不能写比较，{}不能出现i++或i--
```js
var i = 100;
for(; i--;){
    console.log(i);
}
```

案例5：10的n次方
```js
var n = 5;
var num = 1;
for(var i = 0; i < n; i++){
    num *= 10;
}
console.log(num);
```
案例6：n的阶乘
```js
var n = 5;
var res = 1;
for(var i = 1; i <= 5; i++){
    res *= i;
} 
console.log(res);
```
案例7：789打印出字符串987
```js
var num = 789;
var a = num % 10;
var b = (num - a) % 100 /10;
var c = (num - a - b * 10) / 100;
console.log(''+ a + b + c);
```
案例8：打印三个数中的最大数
```js
var a = 1,
    b = 2,
    c = 3;
if(a > b){
    if(a > c){
        console.log(a);
    }else {
        console.log(c);
    }
}else{
    if(b > c){
        console.log(b);
    }else{
        console.log(c);
    }
}
```
案例9：打印100以内的质数（仅能被1和自己整除的数）
```js
var c = 0;
for(var i = 2; i < 100; i++){
    for(var j = 1; j <= i; j++){ // 除数j，肯定要小于被除数i
        if(i % j == 0 ){
            c++;
        }
    }
    if(c == 2){
        console.log(i);
    }

    c = 0;
}
```

## 引用值
array, object, function, date, RegExp
### 1. array数组
```javascript
var arr = [1, 2, 3, 4, 5];
// 数组以索引的方式来取值
console.log(arr[5]); // undefined
arr[3] = null;
console.log(arr); // [1, 2, 3, null, 5]
console.log(arr.length); // 4

// 循环
for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]); // 1, 2, 3, null, 5
}
```

### 2. object对象
```javascript
var person = {
    name: 'xiaoxia',
    // 属性名/键名：属性值/键值
    age: 18,
    height: 180,
    weight: 140,
    job: 'Web开发工程师'

}
console.log(person.name);

person.name = 'xiaowang';
console.log(person);
```

### 3. typeof
number string boolean undefined object function    
```js
console.log(typeof(123)); // number
console.log(typeof(true)); // boolean

// Object = 引用类型 object/array
// 引用类型返回的都是object
console.log(typeof({})); // object 这里的object是引用类型，不是对象
console.log(typeof([])); // object
console.log(typeof(null)); // object null为引用类型 指针指向空
console.log(typeof(undefined)); // undefined
console.log(typeof(function() {})); // function

// 隐式转换
console.log(typeof(1 - '1')); // number 减法运算符加上数字字符串会隐式转换
console.log(typeof('1' - '1')); // number 
console.log(typeof(a)); // undefined (a未被声明)
console.log(typeof(typeof(a))); // string 数据类型名再typeof一定是string
```
typeof(typeof(...))一定是string

## 类型转换
### 1. Number
把对象的值转换为数字
```js
console.log(Number('123'));// 123
console.log(Number(true));// 1
console.log(Number(false));// 0
console.log(Number(null));// 0
console.log(Number(undefined));// NaN
console.log(Number('a'));// NaN
console.log(Number('1a'));// NaN
console.log(Number('3.14'));// 3.14
```
### 2. parseInt 
一定是和数字相关
```js
var a = '123';
console.log(parseInt('123'));// 123
console.log(parseInt(true));// NaN
console.log(parseInt(false));// NaN
console.log(parseInt(null));// NaN
console.log(parseInt(undefined));// NaN
console.log(parseInt(3.14)); // 3
console.log(parseInt('abc123')); // NaN
console.log(parseInt('123abc')); // 123
console.log(parseInt('3.99')); // 3 不会四舍五入
```
true, false, NaN, null, undefined都转为NaN。

parseInt(a, radix) radix基数。即进制，将进制的数转为十进制的值
```javascript
console.log(parseInt(11, 16)); // 17 将16进制的11转为10进制的值，输出为17
console.log(parseInt(11, 2)); // 3
```
### 3. parseFloat
```js
// toFiexd()：转小数保留两位，四舍五入
console.log(parseFloat('3.1465').toFixed(2)); // 3.15 四舍五入
```
### 4. String/toString
```js
// String()：把对象的值转为字符串
console.log(String(123)); // '123'

// toString(): 转为字符串
var str = 3.14;
console.log(str.toString()); // '3.14'
var str = undefined;
console.log(str.toString()); // 报错 undefined没有toString方法
var str = null;
console.log(str.toString()); // 报错 null没有toString方法

// toString(radix): 以十进制为基础转换为目标进制数
var str = '100';
console.log(parseInt(100, 2).toString(16));// 4
// 以二进制为基础转换为十进制，再以十进制为基础转换为16进制

// Boolean()
console.log(Boolean(1)); // true
console.log(Boolean(null)); // false
```
### 5. 隐式类型转换
1. 转成string：+ （字符串拼接）
2. 转成number：++/--(自增自减运算符) + - * / %(算术运算符) > < >= <= == != !=== (关系运算符) 字符串类型都会转换为number
3. 转成boolean：！（逻辑非运算符）
4. undefined， null：既不大于0，也不小于，也不等于0
```js
var a = '123'; // Number(a)
a++;
console.log(a); // 124

var a = 'a' + 1; // String(1)
console.log(a);// a1

var a = '1' * 2; // * / - % str->number
console.log(a); // 2

var a = '1' > 2; // number > < >= <=
console.log(a); // false

var b = 'a' > 'b'; // ASCII码
console.log(b); // false

var a1 = 2 > 1 > 3; // 2 > 1 => true => 1, 1 > 3 => false
var a2 = 2 > 1 == 1; // 2 > 1=> true => 1, 1 == 1 => true
console.log(a1, a2);// false, true

var a1 = undefined > 0; 
var a2 = null > 0;
console.log(a1, a2); // false, false

console.log(undefined == null); // true
console.log(undefined === null); // false

var num = '123'
console.log(+num); // 123 正负号 转Number类型
```
### 6. isNaN方法
```js
console.log(isNaN(NaN));// true
console.log(isNaN(123)));// false
console.log(isNaN('a')));// true
console.log(isNaN(null)));// true
console.log(isNaN(undefined)); // true
```
 Number(值) -> NaN -> bool

### 7. 复杂数据类型的隐式转换
先使用valueOf方法获取其原始值，如果原始值不是number类型，则使用toString方法转成string，再将string转成number计算。  
数组：将数组转成string，再和右边的string比较
```javascript
console.log([] == 0); // true  
// [].valueOf().toString() -> '' ==> Number('') -> 0

// 逻辑非：将其他数据类型使用Boolean()
console.log(![] == 0); // true
// Boolean([]) -> true ==> !true -> false ==> false -> 0
```

## 练习
1. 斐波那契数列
```js
/**
 * n1 n2 n3
 * 1  1  2  3  5  8
 *    n1 n2 n3
 *       n1 n2 n3
 *          n1 n2 n3 
*/
var n = parseInt(window.prompt('请输入第几位'));
    if(n <=0){
        console.log('输入错误');
    }else{
        var n1 = 1, 
        n2 = 2,
        n3;
        if(n <= 2){
            console.log(1)
        }else{
            for(var i = 2; i < n; i++){
                n3 = n1 + n2;
                n1 = n2;
                n2 = n3;
            }
            console.log(n3);
        }
    }
```