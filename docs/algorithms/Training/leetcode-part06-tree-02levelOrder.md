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

## 二叉树的层平均值
[力扣题目链接](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)
给定一个非空二叉树的根节点 root , 以数组的形式返回每一层节点的平均值。与实际答案相差 10-5 以内的答案可以被接受。   
```md
示例 1：
输入：root = [3,9,20,null,null,15,7]
输出：[3.00000,14.50000,11.00000]
解释：第 0 层的平均值为 3,第 1 层的平均值为 14.5,第 2 层的平均值为 11 。
因此返回 [3, 14.5, 11] 。

示例 2:
输入：root = [3,9,20,15,7]
输出：[3.00000,14.50000,11.00000]
```
```ts
function averageOfLevels(root: TreeNode | null): number[] {
  let res: number[] = []
  if (root == null) return res;
  const helperQueue: TreeNode[] = [];
  let curNode: TreeNode;
  helperQueue.push(root);

  while (helperQueue.length > 0) {
    // 同层的总和
    let sum = 0;
    // 同层长度
    let len = helperQueue.length;
    let n = len;

    while (len > 0) {
      curNode = helperQueue.shift()!;
      sum += curNode.val;
      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
    let val: number = sum / n;
    res.push(val);

  }
  return res;
};

```

## N 叉树的层序遍历
[力扣题目链接](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)

```ts
function levelOrder(root: Node | null): number[][] {
  let res: number[][] = []
  if (root == null) return res;

  let helperQueue: Node[] = [];
  let curNode: Node;
  helperQueue.push(root);

  while (helperQueue.length > 0) {
    let len = helperQueue.length;
    let curLevel: number[] = []

    while (len > 0) {
      curNode = helperQueue.shift()!;
      // @ts-ignore
      curLevel.push(curNode.val!);
       // @ts-ignore
      if (curNode.children.length !== 0) helperQueue.push(...curNode.children);
      len--;
    }
    res.push(curLevel)
  }
  return res;
};
```

##  在每个树行中找最大值
[力扣题目链接](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)

给定一棵二叉树的根节点 root ，请找出该二叉树中每一层的最大值。
```md
示例1：
输入: root = [1,3,2,5,3,null,9]
输出: [1,3,9]

示例2：
输入: root = [1,2,3]
输出: [1,3]
```

```ts
function largestValues(root: TreeNode | null): number[] {
  let res: number[] = [];
  if (root === null) return res;

  let curNode: TreeNode;
  const helperQueue: TreeNode[] = []
  helperQueue.push(root);
  while (helperQueue.length > 0) {
    let len = helperQueue.length;
    let maxNum: number | undefined;
    while (len > 0) {
      curNode = helperQueue.shift()!;
      if (maxNum !== undefined) {
        maxNum = curNode.val > maxNum ? curNode.val : maxNum;
      } else {
        maxNum = curNode.val
      }

      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
    // @ts-ignore
    res.push(maxNum);
  }
  return res;
}
```

## 填充每个节点的下一个右侧节点指针
[力扣题目链接](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

给定一个 完美二叉树 ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：

struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL。

初始状态下，所有 next 指针都被设置为 NULL。

```md
示例 1：
输入：root = [1,2,3,4,5,6,7]
输出：[1,#,2,3,#,4,5,6,7,#]
解释：给定二叉树如图 A 所示，你的函数应该填充它的每个 next 指针，以指向其下一个右侧节点，如图 B 所示。序列化的输出按层序遍历排列，同一层节点由 next 指针连接，'#' 标志着每一层的结束。

示例 2:
输入：root = []
输出：[]
```

```ts
function connect(root: Node | null): Node | null {
  if (root === null) return root;
  const helperQueue: Node[] = [];
  let curNode: Node;
  helperQueue.push(root);

  while (helperQueue.length > 0) {
    let len = helperQueue.length;

    while (len > 0) {
      curNode = helperQueue.shift()!;
      // 本层的最后一个节点
      if (len == 1) {
        curNode.next = null;
      } else {
        curNode.next = helperQueue[0];
      }
      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
  }
  return root
};
```

## 二叉树的最大深度
[力扣题目链接](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

```md
给定二叉树 [3,9,20,null,null,15,7]
返回它的最大深度 3 
```
```ts
function maxDepth(root: TreeNode | null): number {
  let deep: number = 0
  if (root === null) return deep;

  const helperQueue: TreeNode[] = []
  let curNode: TreeNode;

  helperQueue.push(root);

  while (helperQueue.length > 0) {
    let len = helperQueue.length;
    deep++;

    while (len > 0) {
      curNode = helperQueue.shift()!;
      console.log(curNode);
      
      if (curNode.left !== null) helperQueue.push(curNode.left);
      if (curNode.right !== null) helperQueue.push(curNode.right);
      len--;
    }
  }
  return deep;
};
```
