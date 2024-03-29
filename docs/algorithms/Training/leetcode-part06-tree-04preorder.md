---
autoGroup-6: 二叉树
sidebarDepth: 3
title: N叉树的前序、后序遍历
---

## N叉树的前序遍历
[力扣题目链接](https://leetcode.cn/problems/n-ary-tree-preorder-traversal/)

给定一个 n 叉树的根节点  root ，返回 其节点值的 前序遍历 。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 null 分隔。

```md
示例 1：
输入：root = [1,null,3,2,4,null,5,6]
输出：[1,3,5,6,2,4]

示例 2：
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[1,2,3,6,7,11,14,4,8,12,5,9,13,10]
```

递归法
```ts
function preorder(root: Node | null): number[] {
  
  function pre(root: Node | null, res: number[]): void{
    if (root === null) return 
    res.push(root.val);
    for (let i = 0; i < root.children.length; i++){
      let item = root.children[i]
      pre(item, res);
    }
  }
  let res: number[] = []
  pre(root, res);
  return res;
};
```


## N叉树的后序遍历