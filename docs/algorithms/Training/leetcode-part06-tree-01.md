---
autoGroup-6: 二叉树
sidebarDepth: 3
title: 二叉树
---

## 二叉树基础
### 1. 二叉树的种类
1. 满二叉树
2. 完全二叉树
3. 二叉搜索树
4. 平衡二叉搜索树

### 2. 二叉树的存储
二叉树可以链式存储，也可以顺序存储。

### 3. 二叉树的遍历方式
1. 深度优先遍历
   - 前序遍历
   - 中序遍历
   - 后序遍历
2. 广度优先遍历
   - 层次遍历

### 4. 二叉树的定义
JavaScript
```js
function TreeNode(val, left, right){
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}
```
Typescript
```ts
class TreeNode{
  public val: number;
  public left: TreeNode | null;
  public right: TreeNode | null;

  constructor(val?:number, left?: TreeNode, right?: TreeNode){
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}
```

## 二叉树的递归遍历
递归算法的三要素：
1. 确定递归函数的参数和返回值
2. 确定终止条件
3. 确定单层递归的逻辑

以下以前序遍历为例：
1. 确定递归函数的参数和返回值：因为要打印出前序遍历节点的数值，所以参数里需要传入res放节点的数值，除了这一点就不需要在处理什么数据了也不需要有返回值，所以递归函数返回类型就是void
```ts
function traverse(node: TreeNode | null, res: number[]): void{}
```
2. 确定总是条件：在递归的过程中，如何算是递归结束了呢，当然是当前遍历的节点是空了，name本层递归就要结束了，所以如果当前遍历的这个节点是空，就直接return。
```ts
 if (node === null) return;
```

3. 确定单层递归的逻辑：前序遍历是中左右的循序，所以在单层递归的逻辑，是要先取中节点的数值。
```ts
res.push(node.val); // 中
traverse(node.left, res); // 左
traverse(node.right, res); // 右
```

### 1. 前序遍历
```ts
function preorderTraversal(node: TreeNode | null): number[]{
  function traverse(node: TreeNode | null, res: number[]): void{
    if (node === null) return 
    res.push(node.val);
    traverse(node.left, res);
    traverse(node.right, res);
  }

  const res: number[] = [];
  traverse(node, res);
  return res;
}
```

### 2. 中序遍历
```ts
function preorderTraversal(node: TreeNode | null): number[]{
  function traverse(node: TreeNode | null, res: number[]): void{
    if (node === null) return 
    traverse(node.left, res);
    res.push(node.val);
    traverse(node.right, res);
  }

  const res: number[] = [];
  traverse(node, res);
  return res;
}
```

### 3. 后序遍历
```ts
function preorderTraversal(node: TreeNode | null): number[]{
  function traverse(node: TreeNode | null, res: number[]): void{
    if (node === null) return 
    traverse(node.left, res);
    traverse(node.right, res);
    res.push(node.val);
  }

  const res: number[] = [];
  traverse(node, res);
  return res;
}
```

## 二叉树的迭代遍历
### 1. 前序遍历
前序遍历是中左右，每次先处理的是中间节点，那么先将根节点放入栈中，然后将右孩子加入栈，再加入左孩子。

为什么要先加入 右孩子，再加入左孩子呢？ 因为这样出栈的时候才是中左右的顺序
```ts
function preorderTraversal(root: TreeNode | null): number[]{
  if(root === null) return []
  let res: number[] = [];
  let helpStack: TreeNode[] = [];
  let curNode: TreeNode = root;
  helpStack.push(root);
  while (helpStack.length > 0) {
    curNode = helpStack.pop()!;
    res.push(curNode.val);
    if (curNode.right !== null) helpStack.push(curNode.right);
    if (curNode.left !== null) helpStack.push(curNode.left);
  }
  return res;
}
```

### 2. 中序遍历
```ts
function inorderTraversal(root: TreeNode | null): number[]{
  let helperStack: TreeNode[] = [];
  let res: number[] = [];
  if (root === null) return res;
  let curNode: TreeNode | null = root;
  while (curNode !== null || helperStack.length > 0) {
    if (curNode !== null) {
      helperStack.push(curNode);
      curNode = curNode.left
    } else {
      curNode = helperStack.pop()!;
      res.push(curNode.val);
      curNode = curNode.right;
    }
  }
  return res;
}

```

### 5. 后序遍历
先序遍历是中左右，后续遍历是左右中，那么我们只需要调整一下先序遍历的代码顺序，就变成中右左的遍历顺序，然后在反转result数组，输出的结果顺序就是左右中了。
```ts
function postorderTraversal(root: TreeNode | null): number[]{
  let helperStack: TreeNode[] = [];
  let res: number[] = [];
  if (root === null) return res;
  let curNode: TreeNode;
  helperStack.push(root);
  while (helperStack.length > 0) {
    curNode = helperStack.pop()!;
    res.push(curNode.val);
    if (curNode.left !== null) helperStack.push(curNode.left);
    if (curNode.right !== null) helperStack.push(curNode.right);
  }
  
  return res.reverse();
}
```

## 二叉树的统一迭代法
把访问的节点放入栈中，把要处理的节点也当入栈中但是要做标记。如何标记呢？就是要处理的节点放入栈之后，紧接着放入一个空指针作为标记。
### 1. 前序遍历
```ts
function preorderTraversal(root: TreeNode | null): number[] {
  let helperStack: (TreeNode | null)[] = [];
  let res: number[] = [];
  let curNode: TreeNode | null;
  if (root === null) return res;
  helperStack.push(root);
  while (helperStack.length > 0) {
      curNode = helperStack.pop()!;
      if (curNode !== null) {
        if (curNode.right !== null) helperStack.push(curNode.right);
        if (curNode.left !== null) helperStack.push(curNode.left);
        helperStack.push(curNode);
        helperStack.push(null);
      } else {
          curNode = helperStack.pop()!;
          res.push(curNode.val);
      }
  }
  return res;
}
```

### 2. 中序遍历
```ts
function inorderTraversal(root: TreeNode | null): number[] {
  let helperStack: (TreeNode | null)[] = [];
  let res: number[] = [];
  let curNode: TreeNode | null;
  if (root === null) return res;
  helperStack.push(root);
  while (helperStack.length > 0) {
      curNode = helperStack.pop()!;
      if (curNode !== null) {
        if (curNode.right !== null) helperStack.push(curNode.right);
        helperStack.push(curNode);
        helperStack.push(null);
        if (curNode.left !== null) helperStack.push(curNode.left);
      } else {
          curNode = helperStack.pop()!;
          res.push(curNode.val);
      }
  }
  return res;
};
```

### 3. 后序遍历
```ts
function postorderTraversal(root: TreeNode | null): number[] {
  let helperStack: (TreeNode | null)[] = [];
  let res: number[] = [];
  let curNode: TreeNode | null;
  if (root === null) return res;
  helperStack.push(root);
  while (helperStack.length > 0) {
      curNode = helperStack.pop()!;
    if (curNode !== null) {
      helperStack.push(curNode);
      helperStack.push(null);
      if (curNode.right !== null) helperStack.push(curNode.right);
      if (curNode.left !== null) helperStack.push(curNode.left);
      } else {
        curNode = helperStack.pop()!;
        res.push(curNode.val);
      }
  }
  return res;
};
```