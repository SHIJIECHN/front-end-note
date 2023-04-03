---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  fs
---

## fs模块
- fs模块中基本上有两种api（同步、异步）。同步：运行之前想把文件都操作完。异步：代码运行执行都用异步。
- 读取文件
  - 异步读取`fs.readFile(path[,options], callback)`
  - 同步读取`readFileSync(path[,options])`
- 写入文件
  - 异步写入`fs.writeFile(file,data[,options], callback)`
  - 同步写入`fs.writeFileSync(file, data[,options])`
- 拷贝文件：先使用fs.readFile读取文件，然后使用fs.writeFile写入文件
- 追加文件`fs.appendFile(file, data[.options], callback)`
- fs.existsSync：同步判断文件是否存在
- fs中readFile会出现读取占用内存问题，不能实现控制读取速率，不能控制精确读取文件某个部分内容
- 从执行位置处开始读取文件，开发中不常用：
  - `fs.open(filename, flag,[mode],callback)`：打开文件
  - `fs.read(fd,buffer,offset,length, position,callback(err, byteRead, buffer))`：读取文件
  - `fs.write(fs,buffer[,offset[,length[,position]]], callback)`：写入文件

```javascript
// 拷贝文件
// 如果采用嵌套的写法，就只能读取完毕后再写入，能不能边读边写
// 大文件用此方法会导致淹没可用内存。此方式适合小文件
fs.readFile(path.resolve(__dirname, 'package.json'), function (err, data) {
  // console.log(data); // <Buffer 7b 0a 20 20 22 ... 231 more bytes>
  if (err) return console.log(err);
  fs.writeFile(path.resolve(__dirname, './test.js'), data, function (err, data) {
    // console.log(data);
  })
})

// 拷贝文件
let buf = Buffer.alloc(3);// [0,0,0]
fs.open(path.resolve(__dirname, 'a.txt'), 'r', function (err, fd) {
  // fd file descriptor 是一个number类型
  // console.log(fd);
  // 读取a.txt 将读取到的内容写入到buffer的第0个位置写3个，从文件的第六个位置开始写入
  fs.read(fd, buf, 0, 3, 6, function (err, bytesRead) { // bytesRead是读取到的真实个数
    console.log(buf); // <Buffer 37 38 39>
    fs.open(path.resolve(__dirname, 'b.txt'), 'w', function (err, wfd) {
      // 将buffer的数据从0开始读取3个 写入到文件的第0个位置
      fs.write(wfd, buf, 0, 3, 0, function (err, written) {
        console.log(written); // 3
        fs.close(fd, () => { });
        fs.close(wfd, () => { })
      });
    })
  })
})
```

## 二叉树操作

- 数组变成二叉树
- 遍历树：
  - 先序：遇到节点先处理节点，先处理左边，左边处理结束再处理右边
  - 中序
  - 后序
  - 层序
- 将当前节点给你传递过来，使用回调
- 实现二叉树的反转

```javascript
class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent; // 
    this.left = null;
    this.right = null;
  }
}

class Tree { // 二插搜索树 我们考虑相同值的情况
  constructor() {
    this.root = null;
  }

  add(element) {
    if (this.root === null) {
      this.root = new Node(element);
      return;
    }
    // 可以用递归，也可以用循环
    let currentNode = this.root;
    // 更新当前节点
    let parent;
    let compare;
    while (currentNode) {
      compare = currentNode.element < element; // 放左还是放右
      parent = currentNode;// 遍历之前先记录节点
      if (compare) {
        // 以右边的为根节点
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }
    // compare;// 放在左边还是右边
    // parent; // 放到谁身上

    let node = new Node(element, parent);
    if (compare) {
      parent.right = node;
    } else {
      parent.left = node;
    }

  }

  // 前序
  preOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      console.log(node.element); // 先遍历自己 
      traverse(node.left); // 先处理左边
      traverse(node.right); // 再处理右边
    }
    traverse(this.root);
  }
  // 中序
  inOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      traverse(node.left); // 先处理左边
      console.log(node.element); // 再遍历自己 
      traverse(node.right); // 再处理右边
    }
    traverse(this.root);
  }

  // 后序
  postOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      traverse(node.left); // 先处理左边
      traverse(node.right); // 再处理右边
      console.log(node.element); // 最后遍历自己 
    }
    traverse(this.root);
  }
  // 层序
  levelOrderTraversal(callback) {
    let stack = [this.root];
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      callback(currentNode);
      if (currentNode.left) {
        stack.push(currentNode.left);
      }
      if (currentNode.right) {
        stack.push(currentNode.right);
      }
    }
  }

  reverse(cb) {
    let stack = [this.root];
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      cb(currentNode);
      let temp = currentNode.left;
      currentNode.left = currentNode.right;
      currentNode.right = temp;
      if (currentNode.left) {
        stack.push(currentNode.left);
      }
      if (currentNode.right) {
        stack.push(currentNode.right);
      }
    }
  }
}

let tree = new Tree();
[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item)
})

// console.dir(tree, { depth: 1000 });

// webpack ast babal树的遍历，需要在遍历的过程中将当前节点给你传递过来，你来使用。使用回调函数
// tree.levelOrderTraversal((node) => {
//   // 操作更改节点
//   node.element *= 2;
// });
// console.dir(tree, { depth: 1000 });

// 实现二叉树的反转
tree.reverse((node) => { });
console.dir(tree, { depth: 1000 });
```

## 目录操作

### 1. 目录创建

1. fs.mkdirSync fs.mkdir 目录创建是一层一层的创建
2. 多层级目录创建，fs.mkdir不支持不层级目录创建
3. fs.stat()可以用于描述文件的状态，如果不存在文件或文件夹就发生错误。fs.existsSync是同步的，异步的被废弃了。

创建一级目录：
```javascript
fs.mkdir('a', function (err) {
  if (err) return console.log(err);
  console.log('创建成功')
})
```

创建多级目录：

- 异步递归创建目录
- promise

:::: tabs 
::: tab 异步递归创建.js
```javascript
// 异步递归创建目录
const fs = require('fs');
function mkdir(pathStr, cb) {
  let pathList = pathStr.split('/');
  let index = 1;

  function make(err) { // co模型
    if (err) return cb(err);
    if (index === pathList.length + 1) return cb(err);
    let currentPath = pathList.slice(0, index++).join('/'); // [a] [a,b]
    fs.stat(currentPath, function (err) {
      if (err) { // 文件夹不存在，就创建
        fs.mkdir(currentPath, make);
      } else {
        // 文件夹存在
        make()
      }
    });
  }
  make();
}

mkdir('a/b/c/d', function (err) {
  if (err) return console.log(err);
  console.log('创建成功')
})
```
:::   
::: tab promise创建.js
```javascript
const fs = require('fs').promises; // node 11 后可以直接 .promises
const { existsSync } = require('fs');
async function mkdir(pathStr) {
  let pathList = pathStr.split('/');

  // 循环路径
  for (let i = 1; i <= pathList.length; i++) {
    let currentPath = pathList.slice(0, i).join('/'); // 获取路径
    if (!existsSync(currentPath)) { // 如果当前路径不存在
      await fs.mkdir(currentPath); // 创建目录
    }
  }
}

mkdir('a/b/c/d').then(() => {
  console.log('创建成功')
}).catch(err => {
  console.log(err)
})

```
:::   
:::: 

### 2. 目录删除

- fs.rmdir  fs.rmdirSync
- fs.readdir 查看目录中的儿子列表，数组
- fs.stat 文件状态，目录状态（isFile，isDirectory）
- fs.unlink 删除文件 （fs.rename 重命名）

```javascript
const fs = require('fs');
fs.rmdir('a', function (err) {
  console.log(err);
})
```

多层级目录无法删除，所以需要封装改写。

#### 串行

```js
const fs = require('fs');
const path = require('path');
function rmdir(dir, cb) { // 写递归先不要考虑多层，先把两层处理完毕
  fs.stat(dir, function (err, statObj) {
    if (statObj.isDirectory()) {
      fs.readdir(dir, function (err, dirs) { // dirs => [a.js, b]
        dirs = dirs.map(item => path.join(dir, item)); // [ 'a\\a.js', 'a\\b' ]
        // 把目录里面的拿出来，1个删除完毕后删除第二个
        let index = 0;
        function step() {
          // 将儿子都删除完毕后，删除自己
          if (index === dirs.length) return fs.rmdir(dir, cb);
          //删除第一个成功后继续调用step继续删除，直到全部删除完毕后删除自己
          rmdir(dirs[index++], step);
        }
        step();
      })
    } else {
      // 如果是文件直接删除即可
      fs.unlink(dir, cb);
    }
  })
}

rmdir('a', function () {
  console.log('删除成功')
})
```

#### 并发

```javascript
const fs = require('fs');
const path = require('path');
function rmdir(dir, cb) {
  fs.stat(dir, function (err, statObj) {
    if (statObj.isDirectory()) {
      // 读目录
      fs.readdir(dir, function (err, dirs) {
        dirs = dirs.map(item => path.join(dir, item));
        if (!dirs.length) {
          // 当前目录什么都没有
          return fs.rmdir(dir, cb);
        }
        let index = 0;
        function done() {
          //当index等于文件长度，说明已经遍历执行结束了，就删除目录
          if (++index === dirs.length) {
            return fs.rmdir(dir, cb);
          }
        }
        for (let i = 0; i < dirs.length; i++) { // 遍历目录
          rmdir(dirs[i], done); // 对目录中的文件分别执行
        }
      })
    } else {
      // 当前是文件
      fs.unlink(dir, cb);
    }
  })
}
rmdir('a', function () {
  console.log('删除成功')
})
```

#### async + await

```javascript
const fs = require('fs').promises;
const path = require('path');
async function rmdir(dir) { // 如果用async await 就按照同步的逻辑来写
  let statObj = await fs.stat(dir);// 获取目录信息
  if (statObj.isDirectory()) {
    let dirs = await fs.readdir(dir);
    // 对每个文件都执行rmdir
    dirs = dirs.map(item => rmdir(path.join(dir, item),));
    await Promise.all(dirs);// 所有文件都执行成功
    await fs.rmdir(dir); // 删除自己
  } else {
    return fs.unlink(dir);// 删除文件
  }

}
rmdir('a').then(() => {
  console.log('删除成功')
}).catch(e => {
  console.log(e);
})
```