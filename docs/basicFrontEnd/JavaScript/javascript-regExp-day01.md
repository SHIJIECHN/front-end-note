---
autoGroup-4: 正则
sidebarDepth: 3
title: 正则基础
---

# 转义
定义：转换意义，改变意义。

- 转义符号：\
- 转义字符：\字符

## 1. 转义字符的使用
```javascript
var str = "我是一名'牛逼'的程序员"; // 可以
var str = '我是一名"牛逼"的程序员'; // 可以
// 外层双引号，里面是单引号；外层单引号，里面是双引号。这是可以的

var str = "我是一名"牛逼"的程序员";
// Uncaught SyntaxError: Unexpected identifier '牛逼'。语法错误
// 字符串: "我是一名"
// 变量：牛逼
// 字符串："的程序员"
// 没有使用加号 + 
// 先语法分析，后文本输出

var v = '牛逼';
var str = "我是一名"+v+"的程序员"; // 字符串与变量拼接需要 加号+

// 问题：如果一定要使用双引号呢？
var str = "我是一名\"牛逼\"的程序员"

// 转义：\n \r \t
// \n
var str = "我是一名\n牛逼\n的程序员";
document.write(str); // \n 被识别成一个空格 \n是给编辑器用的，不是给HTML

// windows  回车 \r\n
// Mac  回车  \r
// Linux  回车  \n

// \t 制表符  4个空格

// \ 转义了回车换行
var str = '<h1>我是小野老师</h1>\
          <h2>我主要教你JavaScript系列课程</h2>\
          <h3>我会帮助你称为牛逼的程序员</h3>';
var wrap = document.getElementsByTagName('div')[0];

wrap.innerHTML = str;

// 问题：如何写模板？<script type="text/html" id="tpl">
```

## 2. 正则基础
正则EegExp = regular expression

设定特定的规则，把某个字符符合规则的字符串匹配出来。

对字符串中的字符检索。
```javascript
// RegExp():
// 参数1：需要匹配的正则表达式。正则匹配要求：必须是字符串片段，对大小写敏感，并且是连续的
// 参数2：i -> ignore case 忽略大小写, g -> global 全局匹配, m -> multi-line 多行匹配

var reg = new RegExp('Test', 'gi');
var str = 'This is a test';

var result = reg.test(str); 
console.log(result);

// 正则直接量
var reg = /test/gim;
var str = 'This is a test. Test is important.'

var result = str.match(reg);
console.log(result); // ['test', 'Test']

// 三种声明方式
var reg1 = /test/;
var reg2 = RegExp(reg1);
var reg3 = new RegExp(reg1);

reg1.a = 1;

console.log(reg2.a); // 1
console.log(reg3.a); // undefined

// RegExp 实际上直接拿了reg1的引用， 而new RegExp()直接生成新的对象

var str = 'This is a test. Test us important.'

// match 
var reg = /Test/i; // 有i和没有i返回的结果都是一个类似的数组解构
var result = str.match(reg);
console.log(result); // ['test', index: 10, input: 'This is a test. Test us important.', groups: undefined]

var reg = /Test/ig; 
var result = str.match(reg);
console.log(result); // ['test', 'Test']

// 表达式 [] 可匹配的范围，选取其中的一位
var str = '0997wejghxsnjfof-938c8fdjf9',
  reg = /[123456789][123456789][1234567890]/g;
var result = str.match(reg);
console.log(result); // ['997', '938'] 
// 为什么没有匹配处 997 ？ 
// 匹配过的字符且匹配成功的，不会再次匹配

var reg = /[wx][xy][z]/g, // [wx]可匹配的范围，选择其中的一个 w 或者 x
  str = 'wxyz';
var result = str.match(reg);
console.log(result); // ['xyz']
// 匹配过程：
// 1. 首先看[wx]，是中间的字符，选中w或x，两者中的一个。[wx]选w，匹配处w，[xy]选x，有结果x，最后z，匹配不到。
// 2. [wx]选x，可以匹配到x，[xy]中可以匹配到y，[z]可以匹配到z
// 3. 结果为 xyz

// 正则区间: [A-Z]。顺序的范围按照ASCII码排列
//相匹配第一位是数字，第二为大写字母、第三位小写字母
var str = 'dklfihJd5kdK5DjfKKWSiddikdD',
  reg = /[0-9][A-Z][a-z]/g;

var result = str.match(reg);
console.log(result); // ['5Dj']

// 第一个是大写、小写或数字
var reg = /[0-9A-Za-z][A-Z][a-z]/g;
// 或者
var reg = /[0-9A-z][A-Z][a-z]/g;

// [0-9A-Za-z] [0-9A-z] [0-z] [0-Z]

// [^0] 第一位不是0，在表达式内部写 ^ 表示非.


// | : 或。匹配某一个字符串
var str = '234kdjg8f123ufnskf-f0g9ske-94',
  reg = /123|234/g;

var result = str.match(reg); 
console.log(result); // ['234', '123']

// 匹配的是123 或 234[a-z]
var reg = /123|234[a-z]/g;
var result = str.match(reg); 
console.log(result); // ['234k', '123']

// () 优先级变高
var reg = /(123|234)[a-z]/g;
var result = str.match(reg); 
console.log(result); // ['234k', '123u']
```

## 3. 元字符
- `\w`: `[0-9A-z_]`  `\W === [^\w]`
- `\d`: `[0-9]`  `\D === [^\d]`
- `\s`: `[\r\n\t\v\f]`  `\S === [^\s]`
- `\b`: 单词边界  \B 非单词边界
- `\.`: 可以匹配除了回车和换行的所有字符


```javascript
// 元字符，正则使用的转义字符
// \w === [0-9A-z_]  \W === [^\w]
var str = '234abc-%&',
  reg = /\wab/g; 
var result = str.match(reg); 
console.log(result);  // ['4ab']

var str = '234abc-%&',
  reg = /[\w][\w][\w]/g;
var result = str.match(reg); 
console.log(result); // ['234', 'abc']

// \d === [0-9]  \D === [^\d]
var str = '234abc-%&';
var reg = /\dab/g;
var result = str.match(reg);
console.log(result); // ['4ab']

// \s === [\r\n\t\v\f]  \S === [^\s]
// \r 回车  \n 换行  \t 制表  \v 垂直换行  \f 换页
var str = '23 ab-%sd', 
  reg = /\sab/g;
var result = str.match(reg);
console.log(result); // [' ab']

// \b 单词边界   \B 非单词边界
var str = 'This is a test',
  reg = /\bThis\b/g;
var result = str.match(reg);
console.log(result); // ['This']

// . 可以匹配除了回车和换行的所有字符
var str = 'This\ris\na\ttest',
  reg = /./g;
var result = str.match(reg);
console.log(result);  // ['T', 'h', 'i', 's', 'i', 's', 'a', '\t', 't', 'e', 's', 't']

// 匹配所有任意的字符
var str = 'abcdefg',
  reg = /[\w\W][\s\S][\d\D]/g;
var result = str.match(reg);
console.log(result); // ['abc', 'def']

// 一个元字符代表只匹配一位
var str = '0JDkw1234cFoe0-dkdD',
    reg = /\w\W/g; // 相当于[\w][\W]
var result = str.match(reg);
console.log(result); // ['0-']
```

## 4. 正则量词
- n+: {1,正无穷} 出现1次到正无穷
- n*: {0,正无穷} 出现0次到正无穷
- n?: {0,1} 出现0次到1次
- n{x,y} {x,正无穷}


```javascript
// n+ {1, 正无穷}
var reg = /\w+/g, // \w  0-9A-z_
  str = 'abcdefg';
var result = str.match(reg);
console.log(result); // ['abcdefg']

// 正则匹配的原则：1.不回头  2.贪婪模式

// n* {0, 正无穷}
var reg = /\w*/g, 
  str = 'abcdefg';
var result = str.match(reg);
console.log(result); // ['abcdefg'， '']

var reg = /\d*/g, 
  str = 'abcdefg';
var result = str.match(reg);
console.log(result); // ['', '', '', '', '', '', '', '']

// 字符串从左到右，依次先匹配多，在匹配少，如果一旦匹配上就不回头匹配
// 贪婪匹配原则：如果匹配上多个，绝不匹配少个

// n? {0,1}
var reg = /\w?/g, 
  str = 'abcdefg';
var result = str.match(reg);
console.log(result); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', '']

// n{x,y} {x,正无穷}  {1,正无穷}=== n+ {0,正无穷}=== n*  {0,1}=== n?
var reg = /\w{1,2}/g, 
  str = 'abcdefg';
var result = str.match(reg);
console.log(result);// ['ab', 'cd', 'ef', 'g']

// ^n 匹配任何以n开头的字符串
var reg = /^ab/g,
  str = 'abcdabcd';
var result = str.match(reg);
console.log(result); // ['ab'] 以ab开头  多行匹配仍然生效

// n$ 匹配任何以n结尾的字符串
var reg = /cd$/g,
  str = 'abcdabcd';
var result = str.match(reg);
console.log(result); // ['cd']

// 问题：检查字符串是否以abcd开头和以abcd结尾？
var str = 'abcd123123abcd',
  reg = /^abcd[\d\D]*abcd$/g; // 任意的字符 [\d\D] 或者 /^abcd.*abcd$/g
var result = str.match(reg);
console.log(result); // ['abcd123123abcd']

// 以abcd开头或以abcd结尾
var str = 'abcd123123abcd',
  reg = /^abcd|abcd$/g; 
var result = str.match(reg);
console.log(result); // ['abcd', 'abcd']

// 检查字符串是否以abcd开头和以abcd结尾，并且开头结尾之间是数字
var str = 'abcd123123abcd',
  reg = /^abcd\d+abcd$/g; 
var result = str.match(reg);
console.log(result); // ['abcd123123abcd']

// 匹配以138开头的11为手机号码
var str = '13812345678',
  reg = /^138[\d]{8}/g;
var result = str.match(reg);
console.log(result); // ['13812345678']

// ?=n 匹配任何其后紧接着字符串n的字符串
// ?!n 不是紧跟着
var str = 'abcdabcd',
  reg = /a(?=b)/g;
var result = str.match(reg);
console.log(result); // ['a', 'a']

var str = 'abcdccda',
  reg = /a(?!b)/g;
var result = str.match(reg);
console.log(result);// ['a']

// 匹配xxxx或xxyy格式的
// 子表达式， 反向引用
var str = 'bbaaaaccaaaaidddbaaaa',
  reg = /(a)\1\1\1/g ; // 匹配aaaa (a)\1\1\1 方向引用子表达式(a)三次，所以有4个
var result = str.match(reg);
console.log(result); // ['aaaa', 'aaaa', 'aaaa']

// \1  \2 表示反向引用第几个表达式

var str = 'bbaaaaccaaaaiddddbaaaa',
  reg = /(\w)\1\1\1/g; // 反向引用第一个表达式中的字符三次
var result = str.match(reg);
console.log(result); // ['aaaa', 'aaaa', 'dddd', 'aaaa']

// xxyy
var str = 'aabbccddddddccceevv',
  reg = /(\w)\1(\w)\2/g; 
var result = str.match(reg);
console.log(result); // ['aabb', 'ccdd', 'dddd', 'ccee']
```


## 5. 正则属性

- reg.global: 判读是否用g
- reg.igboreCase: 判断是否用忽略大小写i
- reg.multiline: 判断是否用换行m
- reg.resource: 正则本体，如(/\w/)
- reg.lastIndex:查到跟exec()执行后类数组里面的index一样的值，可更改值，还能调整下标


## 6. 正则方法
-  reg.test(str): 判断是否能匹配出来
-  reg.exec(str): 执行

```javascript
var reg = /123/g,
  str = '123123123123123';
var result = reg.exec(str);
console.log(result); //类数组
// ['123', index: 0, input: '123123123123123', groups: undefined]

// exec()方法每次执行的时候,将子表达式字符串输出出来
var reg = /(\w)\1(\w)\2/g,
    str = 'aabbccddddddccceevvv';
reg.exec(); // ['aabb', 'a', 'b']; 
reg.exec(); // ['ccdd', 'c', 'd'];
reg.exec(); // ['dddd', 'd', 'd'];
reg.exec(); // ['ccee', 'c', 'e'];
reg.exec(); // null;
```