---
autoGroup-6: 二叉树
sidebarDepth: 3
title: 翻转二叉树
---

## 二叉树层序遍历
[力扣题目链接](https://leetcode.cn/problems/invert-binary-tree/)

给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。
```md
示例 1：
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]

示例 2：
输入：root = [2,1,3]
输出：[2,3,1]

示例 3：
输入：root = []
输出：[]
```

递归法
```ts
function invertTree(root: TreeNode | null): TreeNode | null {
  function invert(node: TreeNode | null) {
    if (node === null) return 
    let left = node.left;
    let right = node.right;
    node.right = left;
    node.left = right;
    invert(node.left);
    invert(node.right);
  }
  invert(root);

  return root;
};
```

迭代法
```ts
function invertTree(root: TreeNode | null): TreeNode | null {
  if(root === null) return null;

  let helperStack: TreeNode[] = [],
    curNode: TreeNode,
    tempNode: TreeNode;

  helperStack.push(root);
  while(helperStack.length > 0){
    curNode = helperStack.pop()!;
    if(curNode.right) helperStack.push(curNode.right);
    if(curNode.left) helperStack.push(curNode.left);

    tempNode = curNode.left;
    curNode.left = curNode.right;
    curNode.right = tempNode;
  }

  return root;
};
```
