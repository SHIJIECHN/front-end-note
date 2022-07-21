---
autoGroup-2: ES6
sidebarDepth: 3
title: day03
---

## 箭头函数
普通this指向：
1. 默认绑定规则：函数function内部this指向window
```js
function a(){
    console.log(this); // window
}
```
严格模式，指向undefined。

2. 隐式绑定：谁调用this指向谁。
```js
var a = 1;
function foo(){
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
}

obj.foo(); // 2

var bar = obj.foo;
bar(); // 1
```

3. 显示绑定：call、apply、bind
4. new 


## rest运算符
箭头函数不存在arguments。使用rest运算符替代
```js
var sum = (...args) => {  // 收集
    console.log(args); // 参数数组
}
sum(1, 2);

/**************************************************/
function foo(x, y, z) {
    console.log(x, y, z);
}
foo(...[1, 2, 3]); // 展开数组

/***************************************************/
let a = [2, 3, 4];
let b = [1, ...a, 5]; // 展开，拼接数组
console.log(b); // [1,2,3,4,5]

/***************************************************/
// rest收集必须是最后一个参数
let fn = (a, b, ...c) => {
    console.log(a, b, c); // 1,2,[3,4,5,6]
}
fn(1, 2, 3, 4, 5, 6);

/***************************************************/
// 数组排序
// ES5
function sortNum() {
    return Array.prototype.slice.call(arguments).sort(function(a, b) {
        return a - b;
    })
}
// ES6
const sortNum = (...args) => args.sort((a, b) => a - b)

console.log(sortNum(12, 3, 45, 1, 2, 444, 12, 23, 4, 89, 3, 0));

/***************************************************/
```


## 箭头函数this
1. this根据d定义时外层的函数作用域来决定的
```js
function foo() {
    return (a) => {
        console.log(this.a);
    }
}

var obj1 = {
    a: 2
}
var obj2 = {
    a: 3
}
var bar = foo.call(obj1); // this根据外层函数的作用域决定的，此时foo的this已经绑定了obj1
bar.call(obj2); // 2

var baz = foo(); // this指向window
baz.call(obj2); // undefined 

/***********************************************/
const person = {
    eat() {
        console.log(this);
    },
    drink: () => {
        console.log(this);
    }
}

person.eat(); // person
person.drink(); // window

/************************************************/
function foo() {
    return () => {
        return () => {
            return () => {
                console.log('id: ', this.id);
            }
        }
    }
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
// this的指向只有一个，就是函数foo的this，这是因为所有的内层函数都是箭头函数，都没有自己的this，它们的this其实都是最外层foo函数的this。

function foo() {
    console.log('id: ', this.id);
    return function() {
        console.log('id: ', this.id);
        return function() {
            console.log('id: ', this.id);
            return function() {
                console.log('id: ', this.id);
            }
        }
    }
}


var f = foo.call({id: 1});
/**
    * 运行结果：1
    */
var t1 = f.call({id: 2})()();
/**
    * 运行结果：1， 2， undefined， undefined
    */
var t2 = f().call({id: 3})();
/**
    * 运行结果：1， undefined， 3， undefined
    * f是全局函数，this指向window
    */
var t3 = f()().call({id: 4});
/**
    * 运行结果：1， undefined， undefined，4
    */

```
2. 不能作为构造函数来使用
3. 没有arguments对象，用rest（扩展运算符）替代
```js
function foo() {
    setTimeout(() => {
        console.log(arguments);
    })
}

foo(1, 2, 3, 4)
// 箭头函数内部的变量arguments，其实就是函数foo的arguments变量
```
4. yield 命令不能生效，在generator函数中

## 不适合场合
1. 定义对象的方法，且该方法内部包括this。
```js
const cat = {
    lives: 9,
    jumps: () =>{
        this.lives--;
    }
}
```
调用cat.jumps()时，如果是普通函数，该方法内部的this指向cat；如果写成上面的那样的夹头函数，使得this指向全局对象，因此不会得到预期结果。这是因为对象不构成单独的作用域，导致jumps箭头函数定义时的作用域就是全局作用域。

2. 需要动态this的时候，也不应使用箭头函数。
```html
<body>
    <button id="press">点击</button>
    <script>
        var button = document.getElementById('press');
        button.addEventListener('click', () => {
            this.clickBtn();
        }, false);

        function clickBtn(e) {
            console.log(e);
        }
    </script>
</body>
```