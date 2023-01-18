---
autoGroup-4: 正则
sidebarDepth: 3
title: 正则基础
---

# 转义
定义：转换意义，改变意义。

- 转义符号：\
- 转义字符：\字符

```javascript
var str = "我是一名'牛逼'的程序员"; // 可以
var str = '我是一名"牛逼"的程序员'; // 可以
// 外层双引号，里面是单引号；外层单引号，里面是双引号。这是可以的

// var str = "我是一名"牛逼"的程序员";
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

// 正则
// EegExp = regular expression
// 设定特定的规则，把某个字符符合规则的字符串匹配出来。
// 对字符串中的字符检索。

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


// 元字符，正则使用的转义字符
// \w === [0-9A-z_]  \W === [^\w]
var str = '234abc-%&',
  reg = /\wab/g; 

var result = str.match(reg); 
console.log(result);  // ['4ab']

//
var reg = /[\w][\w][\w]/g;
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

// 匹配全部字符
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