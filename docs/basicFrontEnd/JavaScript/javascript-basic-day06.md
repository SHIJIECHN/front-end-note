---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 6. 作用域、作用域链、预编译、闭包基础
---

## 预编译
### 1. AO/GO作用
AO GO（预编译）为了解决关于作用域、作用域相关所产生的一切问题   
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


### 2. 案例分析
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
#### 1. 全局执行
```js
function a(){}
var c = 3
```
**当函数`a`被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局执行期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`a`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain01.png')" alt="scope-chain01"> 

#### 2. `a`函数执行
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


**规律**
1. 当外层在执行的时候，内层被定义。
2. 函数b的GO会不会指向a？不会，GO只有一个，抓取的是GO的引用（地址）。
3. b函数在执行之前的环境是和a函数的环境是一样的，只有在执行之后才会有自己的AO。
4. 当函数被定义的时候，就已经形成`[[scope]]` -> `scope chain` -> `GO`，当函数在执行的时候才会生成自己的AO。
5. 每一次在执行一个函数的时候都会生成一个全新的AO。


#### 3. `b`函数执行
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

#### 4. `b`函数执行结束   
   
**当`b`函数被执行结束后**，`b`函数的`AO`被销毁，回归被定义时的状态。下图展示`b`函数的`AO`被销毁。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain05.png')" alt="scope-chain05"> 

#### 5. `a`函数执行结束  
**当`a`函数被执行结束时**，`a`函数的`AO`被销毁的同时，`b`函数的`[[scope]]`也将不存在。`a`函数回归到被定义时的状态。

### 3. 问题
1. b函数执行时包含的a的AO，和a函数执行时a的AO，是不是同一个AO？   
    是同一个AO，访问的是同一个地址。
2. 当函数b执行完成后会发生什么？函数a执行完成后发生什么？   
   当函数b执行完成后，b作用域链里面自己的AO会被销毁，执行上下文没有了，这种状态就回到了b函数被定义时的状态。a函数执行完成以后，它自己的AO也会被销毁，但是a函数里面存了b函数，当整个a的AO销毁后，b函数就不存在了，即b函数的`[[scope]]` 不存在了，作用域链不存在了。
3. 为什么外面无法访问到内部的变量？   
   因为外部函数没有内部函数执行时的AO环境，但是内部函数在执行的时候引用了外部函数的AO上下文。   



### 4. 案例
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
### 1. 理解闭包
1. 一个作用域可以访问另外一个函数的局部变量
2. 当内部函数被返回到外部并保存时，一定会产生闭包，闭包会使原来的作用域链不释放，过渡的闭包可能会导致内存泄漏，或加载过慢。

### 2. 案例分析
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
#### 1. 全局执行
```js
function test1(){}
var c = 3
var test3 = test1()
```

**当`test1`函数被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`test1`、`test3`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure01.png')" alt="closure01"> 

#### 2. `test1`函数执行
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

#### 3. `test1`执行结束
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

#### 4. `test3`执行
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

#### 5. `test3`执行结束   
    
**当`test3`执行结束后**，`test2`的`AO`被销毁，但是原来`test1`的`AO`仍然存在且被`test2`连着。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure05.png')" alt="closure05">

### 3. 问题：
1. 当再次执行test3的时候，会重新生成test2的AO，而test1的AO还是原来的AO。

## 例题
### 例一
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

### 例二
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

### 例三
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
