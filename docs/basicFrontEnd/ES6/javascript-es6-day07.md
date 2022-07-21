---
autoGroup-1: ES6
sidebarDepth: 3
title: 7. 箭头函数的实质、箭头函数的使用场景
---

## 箭头函数返回对象的省略写法
如果箭头函数体内只有一行代码，并且返回对象，则需要()进行包裹，不然ES6认为对象是个块级作用域，会抛出异常。
```js
// ES5写法
function fn(a, b) {
	return {
		a: 3,
		b: 4
	}
}

// ES6写法
(a, b) => ({
	a: 3,
	b: 4
})
```

## rest运算符
必须是函数的最后一个参数
```js
function fn(first, last, ...args) {

}
fn(1, 2, 3, 4, 5)
```

## 箭头函数的this指向问题
1. 箭头函数this由外层函数执行期环境或者全局作用域来决定的
2. 箭头函数不能作为构造函数来使用，函数的this不是自己决定的，所以实例化对象时存在问题。
3. 箭头函数没有arguments对象，用剩余参数rest运算符替代
4. yield命名不能生效，在generator函数中

### 1. 箭头函数this指向由外层函数或全局作用域决定
1. 先foo.call(obj1)，改变foo函数中的this指向，将foo函数中的this指向对象obj1，并且返回一个箭头函数bar；bar.call(obj2)改变箭头函数中的this指向，将箭头函数中的this指向改为对象obj2，但是由于箭头函数中的this指向是由外层函数的执行期环境决定，所以此时箭头函数的this指向应该是外层函数foo的执行期环境上下文（AO对象）；
```js
function foo() {
	return (a) => {
		console.log(this.a); // 2
	}
}
var obj1 = {a:2},
		obj2 = {a:3};
var bar = foo.call(obj1);
bar.call(obj2);
```

2. 首先eat是普通函数，drink是箭头函数；都是通过person.的形式进行调用，此时是this指向的隐式绑定规则，谁调用就指向谁，所以eat函数中的this指向person对象；但是drink是箭头函数，箭头函数的this由外层的执行期环境决定，此时外界的执行期环境是全局环境（GO对象），所以drink函数内部的this指向window对象。

```js
const person = {
	eat() {
		console.log(this);
	},
	drink: ()=> {
		console.log(this);
	}
}
person.eat(); // person
person.drink(); // window
```

3. 插件开发的时候通常遇到需要改变this指向的问题，例如：给按钮绑定事件监听处理函数，此时需要调用clickBtn方法，如果不改变this的指向，那么clickBtn中的this指向button元素，但是我们想让clickBtn方法内部的this指向实例化对象，所以需要利用bind方法进行改变this对象；ES6可以利用箭头函数处理这个问题。

```js
// ES5方法:
;(function(){
	var Plugin = function(){};
	Plugin.prototype = {
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			this.button.addEventListener('click', this.clickBtn.bind(this), false);
		},
		clickBtn:function(){
			console.log('button');
		}
	}
	new Plugin().init();
})();


// ES6方法
;(function(){
	var Plugin = function(){};
	Plugin.prototype = {
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			this.button.addEventListener('click', () => {
				this.clickBtn();
			}, false);
		},
		clickBtn:function(){
			console.log('button');
		}
	}
	new Plugin().init();
})();
```

### 2. 箭头嵌套时，this指向问题
嵌套时的this指向问题，箭头函数this指向是固化的；导致bind，call，apply没有办法实现，因为this指向是固化的，箭头函数本身内部的this是箭头函数在声明的时候就已经完成指定，所以箭头函数this在声明的时候通过外层作用域来获取this。

由于箭头函数中的this指向是固化的，所以内部的箭头函数this指向都是由外层函数执行期上下文对象决定的，所以可以看到foo函数内部的所有箭头函数的this指向，其实都是指向foo函数执行时的执行期上下文环境对象（AO对象）；因为foo.call({id:1})改变了foo函数中的this指向，将this指向为对象{id:1}，所以内部的箭头函数的this统统指向{id:1}，所以都会输出'id',1。

```js
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
// this的指向只有一个，就是函数foo的this，这是因为
// 所有的内层函数都是箭头函数，都没有自己的this，它们的this
// 其实都是最外层foo函数的this。

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

### 3. 箭头函数中不存在arguments
1. 箭头函数中不存在arguments.Uncaught ReferenceError: arguments is not defined

```js
var test = () => {
	console.log(arguments); // Uncaught ReferenceError: arguments is not defined
}
test();
```

2. 由于箭头函数中不存在arguments，但是在外层的函数作用域中存在arguments参数，所以虽然是在箭头函数中输出arguments，其实输出的foo函数中的arguments参数

```js
function foo() {
	setTimeout(()=>{
		console.log(arguments); // [1, 2, 3, 4, 5, 6]
	})
}
foo(1, 2, 3, 4, 5 , 6);
```

## 箭头函数的使用场景
### 1， 箭头函数适合的使用场景
1. 简单的函数表达式，得出唯一的return的计算值，函数内部没有this的引用。
2. 内层的函数表达式，需要调用this，用 var self = this， bind(this)，为了确保适当的this指向的时候，bindEvent() {this.button.addEventListener('click', (e) => this.clickBtn(e), false)}。
3. var args = Array.prototype.slice.call(arguments);

```js
function sortNumber() {
	return Array.prototype.slice.call(arguments).sort(function(a, b) {
		return a - b;
	})
}

// ES6
const  sortNumber = (...numbers) =>  numbers.sort( (a, b) => a - b );
```

### 2. 箭头函数不适合的使用场景
当你的执行语句比较多，还需要用到递归，需要引用函数名，事件绑定，解绑定，避免用箭头函数。

```js
// 封装数组插入功能,在指定的数组元素后插入其它元素。
function insert(value) {
	return {
		into:function(array) {
			return {
				after:function(afterValue) {
					array.splice(array.indexOf(afterValue) + 1, 0, value);
					return array;
				}
			}
		}
	}
}

// ES6改写,语义化不是很好,代码可读性低

let inset = (value) => ({ 
	into: (array) => ({
		after: (afterValue)=> {
			array.splice(array.indexOf(afterValue) + 1, 0, value);
			return array; 
		}
	})
})
console.log(insert(5).into([1, 2, 3, 4, 6, 7, 8]).after(4));
```