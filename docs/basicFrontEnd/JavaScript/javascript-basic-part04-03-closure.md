---
autoGroup-3: JavaScript基础
title: 闭包
---

## 闭包
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
```js
function test1(){}
var c = 3
var test3 = test1()
```

**当`test1`函数被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`test1`和全局变量`c`。

```js
function test1(){
  function test2(){}
  var a = 1
  return test2
}
var c = 3
var test3 = test1() // 执行点
```

**当`test1`函数被执行时（前一刻）**，函数`test2`被定义，`test2`的`[[scope]]`生成，放的是和`test1`执行期一模一样的作用域链。

```js
function test1(){
  function test2(){
    var b  =2;
    cosnole.log(a)
  }
  var a  = 1;
  return test2 // 执行点
}
var c = 3
var test3 = test1()
test3()
```

**当`test1`被执行结束时**，因为`test2`被返回到外部，且被全局变量`test3`接收，这时`test1`的AO并没有销毁，只是把线剪断了，`test2`的作用域链还连着`test1`的`AO`。

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
test3(); // 执行点
```

**当`test3`执行**，`test2`的作用域链增加自己的`AO`，当打印`a`的时候，在自己的`AO`上没有查找到，则向`test1`的`AO`查找，再次执行`test3`的时候，实际操作的仍然是`test1`的`AO`。

**当`test3`执行结束后**，`test2`的`AO`被销毁，但是原来`test1`的`AO`仍然存在且被`test2`连着。

总结：当内部函数被返回到外部并保存时，一定会产生闭包。闭包会产生原来的作用域链不释放，过渡的闭包可能会导致内存泄漏，或加载过慢。


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

var breadMgr = breadMgr();
breadMgr[0](50); // 60
breadMgr[1](); // 59
```

3. 例三
```js
function sunSched(thing){
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