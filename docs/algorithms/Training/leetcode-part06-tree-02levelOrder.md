---
autoGroup-6: 字符串
sidebarDepth: 3
title: 二叉树层序遍历
---

## 二叉树层序遍历
[力扣题目链接](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点

```md
示例 1：

输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]
示例 2：

输入：root = [1]
输出：[[1]]
示例 3：

输入：root = []
输出：[]
```

层序遍历：从左到右一层一层的去遍历二叉树。
思路：
1. 借用一个辅助数据结构即队列来实现
2. 队列先进先出，符合一层一层遍历的逻辑，而是用栈先进后出适合模拟深度优先遍历也就是递归的逻辑。
3. 层序遍历方式就是图论中的广度优先遍历，只不过我们应用在二叉树上

```ts
function levelOrder(root: TreeNode | null): number[][] {
  // /二叉树的层序遍历
  let res: number[][] = []
  if (root === null) return res;

  let helperQueue: TreeNode[] = [];
  let curNode: TreeNode;
  helperQueue.push(root);

  while (helperQueue.length > 0) {
    // 记录当前层级节点数
    let len = helperQueue.length;
    //存放每一层的节点 
    let curLevel: number[] = []
    while (len > 0) {
      curNode = helperQueue.shift()!;
      curLevel.push(curNode.val);
      // 存放当前层下一层的节点
      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
    //把每一层的结果放到结果数组
    res.push(curLevel)
  }
  return res;
};
```

## 二叉树的右视图
给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
```md
示例 1:
输入: [1,2,3,null,5,null,4]
输出: [1,3,4]

示例 2:
输入: [1,null,3]
输出: [1,3]

示例 3:
输入: []
输出: []
```

```ts
function rightSideView(root: TreeNode | null): number[] {
  let res: number[]= [];
  let helperQueue: TreeNode[] = [];
  let curNode: TreeNode;
  if (root == null) return [];
  helperQueue.push(root)
  // 处理这一层的节点
  while (helperQueue.length > 0) {
    let len = helperQueue.length;
    while (len > 0) {
      curNode = helperQueue.shift()!;
      // 如果是这一层的最后一个节点，也就是最右边的节点，放入res
      if (len === 1) {
        res.push(curNode.val);
      }
      // 收集下一层节点
      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
  }
  
  return res;
};
```
