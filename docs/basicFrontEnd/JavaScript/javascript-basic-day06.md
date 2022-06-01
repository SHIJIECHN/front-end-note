---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 6. 作用域、作用域链、预编译、闭包基础
---

## 预编译
### 1. AO/GO作用
AO GO（预编译）为了解决关于作用域、作用于连相关所产生的一切问题   
AO -> function独立的仓库

### 2. 对象
用`.`语法来访问obj的属性。   
```javascript
var obj = {
    name: 'Tom',
    address: 'Beijing',
    teach: function(){}
}
```

### 3. 函数也是一种对象类型
1. 函数也是一种对象类型，也是一种引用类型，也是一种引用值。
2. JS本身提供给它的属性：`test.name`, `test.length`, `test.prototype`等。
3. 对象有一些属性是我们无法访问的 -> JS引擎内部固有的隐式属性 -> 这些隐式属性是不供外部访问的，也可以理解为内部的私有属性.
```javascript
function test(a, b){}
console.log(test.length); // 2
```

## 作用域`[[scope]]`
`[[scope]]`是什么？
1. 函数创建时，生成的一个JS内部隐式属性，这个属性只能是由JS引擎来读取。
2. 函数存储作用域链的容器

## 作用域链

### 1. 作用域链就是保存AO/GO的容器
1. AO，函数的执行期上下文，GO，全局的执行期上下文
2. 函数执行完成以后，AO是要销毁的。再次执行函数时会生成新的AO，而老的AO在函数执行完毕后就销毁了。
3. AO是一个即时的存储容器。它不是长时间保存的，它是根据函数的执行周期来保存的。    
作用域链就是将这些AO/GO形成链式从上到下排列起来，形成一个链式关系，这个链式关系就是作用域链。

```js
function a(){
    function b(){
        var b  =2;
    }
    var a = 1;
    b();
}
var c = 3;
a();
```

分步分析上面函数作用域链之间的关系：
1. 全局执行
```js
function a(){}
var c = 3
```
**当函数`a`被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局执行期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`a`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain01.png')" alt="scope-chain01"> 

2. `a`函数执行
```js
function a(){
    function b(){}
    var a = 1;
}
var c = 3;
a(); // 执行
```
**当`a`函数被执行时（前一刻）**，作用域链的顶端（第`0`位）存储`a`函数生成的函数执行期上下文`AO`，同时第`1`位存储`GO`。查找变量是到`a`函数存储的作用域链中从顶端开始依次向下查找。  
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain02.png')" alt="scope-chain02">   
在`a`函数执行时，`b`函数被定义。  
**当`b`函数被定义时**，是在`a`函数环境下，所以`b`函数这时的作用域链就是`a`函数被执行期的作用域链。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain03.png')" alt="scope-chain03"> 


规律：
* 当外层在执行的时候，内层被定义。
* 函数b的GO会不会指向a？不会，GO只有一个，抓取的是GO的引用（地址）。
* b函数在执行之前的环境是和a函数的环境是一样的，只有在执行之后才会有自己的AO。
* 当函数被定义的时候，就已经形成`[[scope]]` -> `scope chain` -> `GO`，当函数在执行的时候才会生成自己的AO。
* 每一次在执行一个函数的时候都会生成一个全新的AO。

3. `b`函数执行
```js
function a(){
    function b(){
        var b  =2;
    }
    var a = 1;
    b();            
}
var c = 3;
a();
```



**当`b`函数被执行时（前一刻）**，生成函数`b`的`[[scope]]`，存储函数`b`的作用域链，顶端第`0`位存储`b`函数的`AO`，`a`函数的`AO`和全局的`GO`依次向下排列。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain04.png')" alt="scope-chain04"> 

4. `b`函数执行结束   
   
**当`b`函数被执行结束后**，`b`函数的`AO`被销毁，回归被定义时的状态。下图展示`b`函数的`AO`被销毁。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain05.png')" alt="scope-chain05"> 

5. `a`函数执行结束  
**当`a`函数被执行结束时**，`a`函数的`AO`被销毁的同时，`b`函数的`[[scope]]`也将不存在。`a`函数回归到被定义时的状态。

问题：
1. b函数执行时包含的a的AO，和a函数执行时a的AO，是不是同一个AO？   
    是同一个AO，访问的是同一个地址。
2. 当函数b执行完成后会发生什么？函数a执行完成后发生什么？   
   当函数b执行完成后，b作用域链里面自己的AO会被销毁，执行上下文没有了，这种状态就回到了b函数被定义时的状态。a函数执行完成以后，它自己的AO也会被销毁，但是a函数里面存了b函数，当整个a的AO销毁后，b函数就不存在了，即b函数的`[[scope]]` 不存在了，作用域链不存在了。
3. 为什么外面无法访问到内部的变量？   
   因为外部函数没有内部函数执行时的AO环境，但是内部函数在执行的时候引用了外部函数的AO上下文。   



### 练习
```js
function a(){
    function b(){
        function c(){}
        c();
    }
    b();
}
a();
/**
 * a定义：a.[[scope]] -> 0: GO
 * a执行：a.[[scope]] -> 0: a -> AO
 *                      1: GO
 * b定义：b.[[scope]] -> 0: a -> AO
 *                      1: GO
 * b执行：b.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * c定义：c.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * c执行：c.[[scope]] -> 0: c -> AO
 *                      1: b -> AO
 *                      2: a -> AO
 *                      3: GO
 * c结束：c.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * b结束：b.[[scope]] -> 0: a -> AO
 *                      1: GO
 *       c.[[scope]] X
 * a结束：a.[[scope]] -> 0: GO
 *       b.[[scope]] X
*/
```
## 闭包基础
理解闭包：
1. 一个作用域可以访问另外一个函数的局部变量
2. 当内部函数被返回到外部并保存时，一定会产生闭包，闭包会使原来的作用域链不释放，过渡的闭包可能会导致内存泄漏，或加载过慢。

```js
function test1(){
  function test2(){
    var b  =2;
    cosnole.log(a)
  }
  var a  = 1;
  return test2
}
var c = 3
var test3 = test1()
test3()
```
逐步分析上面执行过程：
- 1. 全局执行
```js
function test1(){}
var c = 3
var test3 = test1()
```

**当`test1`函数被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`test1`、`test3`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure01.png')" alt="closure01"> 

- 2. `test1`函数执行
```js
function test1(){
  function test2(){}
  var a = 1
  return test2
}
var c = 3
var test3 = test1() // 执行
```

**当`test1`函数被执行时（前一刻）**，函数`test2`被定义，`test2`的`[[scope]]`生成，放的是和`test1`执行期一模一样的作用域链。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure02.png')" alt="closure02">

- 3. `test1`执行结束
```js
function test1(){
  function test2(){
    var b  =2;
    cosnole.log(a)
  }
  var a  = 1;
  return test2 // 执行
}
var c = 3
var test3 = test1()
test3()
```
**当`test1`被执行结束时**，因为`test2`被返回到外部，且被全局变量`test3`接收，这时`test1`的AO并没有销毁，只是把线剪断了，`test2`的作用域链还连着`test1`的`AO`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure03.png')" alt="closure03">

- 4. `test3`执行
```js
function test1(){
  function test2(){
    var b = 2;
    console.log(a);
  }
  var a = 1;
  return test2
}
var c = 3;
var test3 = test1();
test3(); // 执行
```

**当`test3`执行**，`test2`的作用域链增加自己的`AO`，当打印`a`的时候，在自己的`AO`上没有查找到，则向`test1`的`AO`查找，再次执行`test3`的时候，实际操作的仍然是`test1`的`AO`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure04.png')" alt="closure04">

- 5. `test3`执行结束   
    
**当`test3`执行结束后**，`test2`的`AO`被销毁，但是原来`test1`的`AO`仍然存在且被`test2`连着。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure05.png')" alt="closure05">

问题：
1. 当再次执行test3的时候，会重新生成test2的AO，而test1的AO还是原来的AO。

## 练习
1. 例一
```js
function test(){
  var n = 1;
  function add(){
    n++;
    console.log(n);
  }

  function reduce(){
    n--;
    console.log(n)
  }

  return [add, reduce];
}
var arr = test()
arr[0](); // 101
arr[1](); // 100
```
test的AO被返回到全局中

2. 例二
```js
function breadMgr(num){
  var breadNum = arguments[0] || 10;

  function supply(){
    breadNum += 10;
    console.log(breadNum);
  }

  function sale(){
    breadNum --;
    console.log(breadNum)
  }

  return [supply, sale];
}

var breadMgr = breadMgr(50);
breadMgr[0](); // 60
breadMgr[1](); // 59
breadMgr[1](); // 58
breadMgr[1](); // 57
```

3. 例三
```js
function sunSched(){
  var sunSched = '';

  var operation = {
    setSched: function(thing){
      sunSched = thing
    },
    showSched: function(){
      console.log('My schedule on sunday is '+ sunSched)
    }
  }

  return operation;
}

var sunSched = sunSched();

sunSched.setSched('studying');
sunSched.showSched() // My schedule on sunday is studying

```








## 立即执行函数 
特点
立即执行函数（immediately-invoked functionexpression, IIFE）：自动执行，执行完成以后立即释放。功能性称为初始化函数。

### 写法
立即执行函数是表达式
```js
// 第一种写法
(function(){
    // ...
})();

// 第二种写法
(function(){

}()); // W3C建议
```
立即执行函数可以写函数名，也可以带参数。但是直接访问`test`会出现引用错误，这说明立即执行函数执行完后立即释放。
```js
(function test(a, b){
    console.log(a + b) // 3
}(1, 2));
```
可以`return`返回值
```js
var num = (function(a, b){
    return a + b;
}(1, 2));
console.log(num); // 3
```
只有函数表达式才能被执行符号'()'执行。  
有括号() 包起来的，数字、函数等都是表达式，也可以转换成表达式。
```js
// 可以执行
(function test1(){
    console.log(1)
})()

// 可以执行
var test2 = function(){
    console.log(2)
}()

// 不能执行
function test3(){
    console.log(3)
}()
```
一定是表达式才能被执行符号执行。  
```js
var test = function(){
    console.log(1);
}()
console.log(test);// undefined
```
立即执行函数执行完就销毁。

转换成表达式方法：
- 将函数声明转化为表达式后就可以使用执行符号立即执行该函数，并且该函数声明的函数名会自动被忽略掉。
- 函数声明变成表达式的方法：+ - ！ || &&
```js
+ function test(){  }()
- function test(){  }()
undefined || function test(){  }()
1 && function test(){  }()
```
当括号中带有参数时，JS引擎会将下面写法解析为表达式
```js
function test(a){
    console.log(a); 
}(6)
```
不会报错，但是`test`函数不会执行。

### 应用
```js
function test(){
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = function(){
            document.write(i + ' ')
        }
    }
    return arr;
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
/**
 * 运行结果：
 * 10 10 10 10 10 10 10 10 10 10
*/
```
分析函数执行结果，对函数中`for`循环进行改造：
```js
function test(){
    var arr = [];
    var i = 0
    for(; i < 10; ){
        arr[i] = function(){
            document.write(i + ' ')
        }
        i++;
    }
    return arr;
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
```
当`i = 0`时，进入`for`循环，执行
```js
arr[i] = function(){
    document.write(i + ' ')
}
```
将匿名函数赋给`arr[0]`，但是函数没有执行。当`i = 9`的时候，再执行`arr[9]`再保存一个匿名函数，直到`i = 10`跳出循环，执行`return arr`，`arr`中保存了十个匿名函数，相当于`return`匿名函数出去了，此时形成了闭包。注意执行`return arr`的时候，此时对应的`i = 10`。
外部再次循环执行匿名函数时，获取`i`的值，此时`test`函数的`AO`中`i`已经变成`10`了。因为`test`函数执行结束，`test`函数的`AO`并没有被销毁，被`arr`中的匿名函数“拿着”，`test`的`AO`有一个变量`i`，当`return arr`时，`i`已经循环到`10`了，所以匿名函数执行时，查找的是`test`的`AO`中的变量`i`为`10`。

需要打印0~9：
- 第一种方式：立即执行函数
```js
function test(){
    for(var i = 0 ; i < 10; i++){
        (function(){
            document.write(i + ' ')
        })();
    }
}
test();
```
- 第二种方式：借助外界力量，传入参数
```js
function test(){
    var arr = []
    for(var i = 0; i < 10; i++){
        arr[i] = function(num){
            document.write(num + ' ');
        }
    }
    return arr
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j](j);
}
```

- 第三种方式：立即执行函数并传入参数。每次循环都讲i保存到匿名函数中
```js
function test(){
    var arr = []
    for(var i = 0; i < 10; i++){
        (function(j){
            arr[j]  = function(){
                document.write(j + ' ')
            }
        })(i)
    }
    return arr
}
var myArr = test();
console.log(myArr);

for(var j = 0; j < 10; j++){
    myArr[j]();
}
```

## 逗号运算符
```js
var num = (2 - 1, 6 + 5, 24 + 1);
console.log(num); // 25
```

## 练习
- 1. 逗号运算符
```js
var num = (1, 2)
console.log(num);// 2 逗号运算符只返回最后一个
/**********************************/
var fn = (
    function test1(){
        return 1;
    },

    function test2(){
        return '2'
    }
)();
console.log(typeof(fn)); // string
```
- 2. 表达式
```js
var a = 10;
if(function b(){}){
    a += typeof(b)
}
console.log(a)
/**
if语句执行，假的只有undefined null '' 0 false NaN
(function b(){})是一个表达式，表达式忽略函数名，执行后立即释放了，函数不存在了。所以typeof(b)是undefined
*/
```
- 3. 累加器
  初始值为0，写一个闭包，执行一次函数就增加1并打印。
```js
function test(){
    var num = 0;
    function add(){
        console.log(++num)
    }
    return add;
}
```
- 4. 缓存器
  一般班级，学生名字保存在一个数组里，两个方法写在函数中的一个对象中，第一个方法是加入班级，第二个方法是离开班级。每次加入或离开都需要打印新的学生名单。
```js
function myClass(){
    var studentsName = []

    var operations = {
        join: function (name){
            studentsName.push(name)
            console.log(studentsName)
        },
        leave: function(name){
            let index = studentsName.indexOf(name)
            if(index !== -1){
                studentsName.splice(index,1)
            }
            console.log(studentsName)
        }
    }
    return operations;
}

var obj = myClass();
```
