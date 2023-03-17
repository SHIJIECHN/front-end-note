---
autoGroup-2: Webpack5
sidebarDepth: 3
title: 抽象语法树
---

## 6. 抽象语法树

抽象语法树（AST）是源代码语法结构的一种出现表示，它以树状的形式表现编程语言的语法结构，树上每个节点都表示源代码中的一种结构。

通过JavaScript Parser把代码转化为一颗抽象语法树（AST），这棵树定义了代码的结构。

### 1. JavaScript Parse

- JavaScript Parser是把JavaScript源码转化为抽象语法树的解析器
- 浏览器会把JS源码通过解析器转为抽象语法树，在进一步转化为字节码或直接生成机器码
- 一般来说每个JS引擎都会有自己的抽象语法树格式，Chrome的V8引擎，Firefox的SpiderMonkey引擎

#### 1.1 常用的JavaScript Parse
- esprima
- traceur
- acorn
- shift

#### 1.2 esprima
- 通过esprima把源码转化为AST
- 通过estraverse遍历并更新AST
- 通过escodegen将AST重新生成源码
- [astexplorer](https://astexplorer.net/)AST的可视化工具

```javascript
npm i esprima@4.0.1 estraverse@5.3.0 escodegen@2.0.0 -S
```

```javascript
let esprima = require('esprima'); // 把源代码转成抽象语法树
let estraverse = require('estraverse');
let escodegen = require('escodegen');
// 原代码就是ascii字符串
let sourceCode = `function ast(){}`;
let ast = esprima.parseModule(sourceCode); // 生成ast
console.log(ast);

/**
 * 遍历语法树，遍历的方式采用的是深度优先的方式
 * 如果一个节点遍历完成后，它同时有儿子和弟弟，如果先遍历弟弟，就是广度，如果先遍历儿子在遍历弟弟就是深度
 */

let indent = 0; // 缩进几个空格
const padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
  enter(node) {
    // 在遍历语法树的时候可以对它进行转换
    console.log(padding() + "进入" + node.type);
    if (node.type === 'FunctionDeclaration') { // 可以做一些修改转换
      node.id.name = 'new' + node.id.name;
    }
    indent += 2
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + "离开" + node.type);
  }
})

/**
进入Program
  进入FunctionDeclaration
    进入Identifier
    离开Identifier
    进入BlockStatement
    离开BlockStatement
  离开FunctionDeclaration
离开Program
 */

/**
 * 重新生成代码
 */
let targetCode = escodegen.generate(ast);
console.log(targetCode);
/**
function newast() {
}
 */
```
模板
```javascript
let = esprima.parseModule(sourceCode); // 1. 生成ast
estraverse.traverse(ast, { // 2. 遍历ast
    enter(node){}
})
let targetCode = escodegen.generate(ast); // 3. 重新生成代码
```

### 2. babel插件

- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
- [babel-types](https://babeljs.io/docs/babel-types.html)
- [astexplorer](https://astexplorer.net/)

- 访问者模式Visitor对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- visitor的对象定义了用于AST中获取具体节点的方法
- visitor上挂载以节点type命名的方法，当遍历AST的时候，如果匹配上type，就会执行对应的方法
- @babel/core Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse

|属性|说明|
|---|:---|
|path|当前AST节点路径|
|node|当前AST节点|
|parent|父AST节点|
|parentPath|父AST节点路径|
|scope|作用域|
|get(key)|获取某个属性的path|
|set(key,node)|设置某个属性|
|is类型(opts)|判断当前节点是否是某个类型|
|find(callback)|从当前节点一直向上找到根节点（包括自己）|
|findParent(callback)|从当前节点一直向上找到根节点（不包括自己）|
|insertBefore(nodes)|在之前插入节点|
|insertAfter(nodes)|在之后插入节点|
|replaceWith(replacement)|用某个节点替换当前节点|
|replaceWithMultiple(nodes)|用多个节点替换当前节点|
|replaceWithSourceString(replacement)|把源代码转成AST节点再替换当前节点|
|remove()|删除当前节点|
|traverse(visitor,state)|遍历当前节点的子节点，第一个参数是节点，第二个参数是用来传递数据的状态|
|skip()|跳过当前节点子节点的遍历|
|stop()|结束所有的遍历|



#### 2.1 转换箭头函数
[babel-plugin-transform-es2015-arrow-functions](https://www.npmjs.com/package/babel-plugin-transform-es2015-arrow-functions)

```javascript
// 箭头函数
const sum = (a,b)=>a+b;
```
转换后
```javascript
// 转换后
var sum = function sum(a, b) {
  return a + b;
};
```

```javascript
npm i @babel/core@7.21.3 babel-types@6.26.0 -D
```

```javascript
let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a,b)=>{
  console.log(this);
  return a+b
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    // 属性就是节点的类型，babel在找到对应类型的节点的时候会调用此函数
    ArrowFunctionExpression(nodePath) { // 如果是箭头函数，就进入，参数是节点的路径
      let node = nodePath.node; // 获取当前路径上的节点
      // 处理this指针的问题
      const thisBinding = hoistFunctionEnviroment(nodePath); // 提升函数作用域
      node.type = 'FunctionExpression';
    }
  }
}

function findParent(fnPath) {
  do {
    if ((fnPath.isFunction() && !fnPath.isArrowFunctionExpression()) || fnPath.isProgram()) {
      return fnPath;
    }
  } while (fnPath = fnPath.parentPath);
}

/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} fnPath 
 */
function hoistFunctionEnviroment(fnPath) {
  // thisEnvFn=Program节点
  // const thisEnvFn = fnPath.findParent(p => { // 找父节点
  //   // 如果是函数则不能是箭头函数，或者是Program或者是类的属性
  //   return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  // });
  const thisEnvFn = findParent(fnPath);
  // thisPaths就是放着那些地方用到了this
  let thisPaths = getScopeInfoInformation(fnPath); // 找到作用域信息
  let thisBinding = '_this'; // 把this变量重定向的变量名
  // 如果有地方用到了，则需要在thisEnvFn环境上添加一个语句 let _this = this
  if (thisPaths.length > 0) {
    // 表示在this函数环境中添加一个变量id_this=初始值 this为thisExpression
    thisEnvFn.scope.push({
      id: types.identifier('_this'), 
      init: types.thisExpression()
    })
    // 遍历所有使用到this的路径节点，把所有thisExpression全变成_this标识符
    thisPaths.forEach(thisChild => {
      let thisRef = types.identifier(thisBinding);
      thisChild.replaceWith(thisRef);
    })
  }
}
function getScopeInfoInformation(fnPath) {
  let thisPaths = [];
  // 遍历当前的path的所有子节点，看谁的类型是ThisExpression
  fnPath.traverse({
    // 找到ThisExpression类型
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })
  return thisPaths;
}
/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions2]
});
console.log(targetCode.code);
```

#### 2.2 把类编译为Function

```javascript
npm i babel-plugin-transform-es2015-classes
```

```javascript
// 把一个类转成函数
let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformClasses = require('@babel/plugin-transform-classes')
const sourceCode = `
class Person {
  constructor(name) {
    this.name=name;
  }
  getName() {
    return this.name;
  }
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let BabelPluginTransformClasses2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    //nodePath代表路径，node代表路径上的节点
    ClassDeclaration(nodePath) {
      let { node } = nodePath;
      let { id } = node; // Person标识符 Identifier name:Person
      let classMethods = node.body.body;// 获取原来类上的方法 constructor getName。 Array<MethodDefinition>
      let body = [];
      classMethods.forEach(method => {
        if (method.kind === 'constructor') { // 如果方法的类型是构造函数的话
          // Person [name] this.name=name(body复用) 
          let construcorFunction = types.functionDeclaration(id, method.params, method.body, method.generator, method.async);
          body.push(construcorFunction)
        } else {// 其他的函数属于普通函数，需要放在原型上的
          // method.key=getName
          let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key);
          let right = types.functionExpression(null, method.params, method.body, method.generator, method.async);
          let assignmentExpression = types.assignmentExpression('=', left, right);
          body.push(assignmentExpression)
        }
      })
      // nodePath.replaceWith();// 替换成单节点
      nodePath.replaceWithMultiple(body); // 替换成多节点
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformClasses2]
});
console.log(targetCode.code);

/*
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
}
*/
```

#### 2.3 自动包裹trycatch

```javascript
let core = require('@babel/core');
let types = require('babel-types');
let template = require('@babel/template');
const sourceCode = `
function sum(a,b){
  return a+b+c;
}
`;

/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let TryCatchTransformClasses = {
  // 每个插件都会有自己的访问器
  visitor: {
    FunctionDeclaration(nodePath) {
      let { node } = nodePath; // 当前所在的节点
      let { id } = node;
      let blockStatement = node.body;
      // 如果次函数的对个语句已经是一个try语句了，就不要再处理了，否则会死循环
      if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return;
      }

      // 把一个JS字符串转成一个AST节点
      let catchStatement = template.statement('console.log(error)')();
      let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]));
      // node.body就是原来的函数里的语句，现在要放到try里面
      let tryStatement = types.tryStatement(node.body, catchClause);
      // 新的函数方法名不变sum，参数不变 a,b
      var func = types.functionDeclaration(id, node.params, types.blockStatement([
        tryStatement
      ]), node.generator, node.async);
      nodePath.replaceWith(func);
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [TryCatchTransformClasses]
});
console.log(targetCode.code);

/*
function sum(a,b){
  try{
    return a+b+c;
  }catch(error){
    console.log(error);
  }
}
*/
```

总结：插件框架
```javascript
let core = require('@babel/core');
let types = require('babel-types');
const sourceCode = `...`;

let BabelPlugin = {
  visitor: {
    // 处理转换
  }
}
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPlugin]
});
console.log(targetCode.code);
```

#### 2.4 写一个插件可以自动去除代码里的console.log


### 3. webpack babel插件
实现最简单的treeshaking。
```javascript
// 转换前
import { flatten as flat, concat as con } from 'lodash' 

// 转换后
import flat from 'lodash/flatten';
import con from 'lodash/concat';
```
因为下面的这种导入方式体积比较小。写法还是第一种，但是实际导入方式修改了

目录结构：

|-src    
|----index.js   
|-babel-plugin-import   
|----babel-plugins   
|-webpack.config.js     

:::: tabs
::: tab babel-plugin-import.js
```javascript
// babel-type是一个用来构建AST节点的工具库
const t = require('babel-types');
/**
 * 把那些importSpecifier变成importDefaultSpecifier
 * visitor.ImportDeclaration={enter(path, state){},leave(){}}
 * 等价于
 * const visitor = { ImportDeclaration(path, state){} }
 */
const visitor = {
  // 捕获ImportDeclaration节点
  ImportDeclaration: {
    // 当进入这个节点的时候，执行此函数 节点的路径path，state是节点的状态
    // opts就是webpack.config.js里面配置的options对象
    enter(path, state = { opts: {} }) { // state的默认值为{opts:{}}
      const { node } = path; // //获取节点
      const { libraryName, libraryDirectory = 'fp' } = state.opts;//获取选项中的支持的库的名称
      const specifiers = node.specifiers; ///获取批量导入声明数组 [ImportSpecifier,ImportSpecifier]
      const source = node.source; // lodash
      //如果当前的节点的模块名称是我们需要的库的名称，并且导入不是默认导入才会进来
      if (libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        // 把每个specifier变成默认导入 遍历批量导入声明数组specifiers
        const defaultImportDeclaration = specifiers.map(specifier => {
          //导入声明importDefaultSpecifier flatten
          const importDefaultSpecifier = t.importDefaultSpecifier(specifier.local);
          return t.importDeclaration(
            [importDefaultSpecifier],
            //导入模块source lodash/flatten
            t.stringLiteral(libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
            )
          );
        })
        path.replaceWithMultiple(defaultImportDeclaration);// 替换当前节点
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}
```
:::   
::: tab index.js
```js
import { flatten as flat, concat as con } from 'lodash';
// 将上面的表达式转成下面的形式
// import flat from 'lodash/flatten';
// import con from 'lodash/concat';
console.log(flat([1, [2, [3]]]));
console.log(con([1], [2]))
```
:::   
::: tab webpack.config.js
```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [path.resolve(__dirname, 'babel-plugins/babel-plugin-import.js'), {
                "libraryName": 'lodash',
                "libraryDirectory": 'fp'
              }]
            ]
          }
        }
      }
    ]
  }
}
```
:::   
::::