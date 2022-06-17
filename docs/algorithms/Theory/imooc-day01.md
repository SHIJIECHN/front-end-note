---
autoGroup-1: 算法
sidebarDepth: 3
title: 1. 常见数据结构、时间复杂度
---

## 考察重点
- 算法复杂度：空间，时间
- 算法思维：贪心、二分、动态规划

## 注意事项
- 本章有点难度（大厂面试标准），要耐心学习
- 一个问题的解决方案有很多，要找出最优解（重要）
- 不仅关注题目本身，还要关注分析解决问题的思路和方法

题目1：将一个数组旋转k步
- 输入一个数组[1,2,3,4,5,6,7]
- k=3，即旋转3步
- 输出[5,6,7,1,2,3,4]
快速高效实现。

题目2：快速排序
- 用JavaScript实现快速排序，并说明时间复杂度

题目3：判断字符串是否是括号匹配
- 一个字符串s可能包含{}()[]三种括号
- 判断s是否是括号匹配的
- 如(a{b}c)匹配，而{a(b或{a(b}c)就不匹配

题目4：反转单向链表
- 输入一个单向链表，输出它的反转（头变尾，尾变头）

## 常见数据结构

前端开发中常见的数据结构

### 栈 Stack

栈 Stack 是一种“先进后出”的数据结构。

<img :src="$withBase('/algorithms/Theory/栈.png')" alt="栈" />

```js
// 数组实现 栈
const stack = []
stack.push(100) // 压栈
stack.pop() // 出栈
```

### 队列 Queue

队列 Queue 是一种“先进先出”的数据结构。

<img :src="$withBase('/algorithms/Theory/队列.png')" alt="队列" />

```js
// 数组实现 队列
const queue = []
queue.push(100) // 入队
queue.shift() // 出队
```

### 链表 Linked list

链表不是连续的数据结构，而是由一系列的节点组成，节点之间通过指针连接。
<img :src="$withBase('/algorithms/Theory/链表.png')" alt="链表" />

```ts
// 链表节点的数据结构
interface IListNode {
    data: any
    next: IListNode | null
}
```

### 树 Tree

树，是一种有序的层级结构。每个节点下面可以有若干个子节点。例如常见的 DOM 树。
<img :src="$withBase('/algorithms/Theory/dom-tree.png')" alt="dom-tree" />

```ts
// 树节点的数据结构
interface ITreeNode {
    data: any
    children: ITreeNode[] | null
}
```

### 二叉树 Binary Tree

二叉树，首先它是一棵树，其次它的每个节点，最多有两个子节点，分别为 `left` 和 `right`

<img :src="$withBase('/algorithms/Theory/二叉搜索树.png')" alt="二叉搜索树" />

```ts
// 二叉树节点的数据结构
interface IBinaryTreeNode {
    data: any
    left: IBinaryTreeNode | null
    right: IBinaryTreeNode | null
}
```


## 算法复杂度
什么是复杂度?
1. 程序执行时需要的计算量和内存空间（和代码是否简介无关）
2. 复杂度是数量级（方便记忆、推广），不是具体的数字
3. 一般针对一个具体的算法，而非一个完整的系统


## 时间复杂度

复杂度用 `O` 表示，说的是**数量级**，而不是具体的数字，如
- `O(2)` `O(3)` `O(100)` 其实都是 `O(1)`
- `O(n)` `O(2 * n)` 其实都是 `O(n)`

常见的时间复杂度
- `O(1)` 无循环。
- `O(logn)` 二分法。
- `O(n)`单次循环。
- `O(n*logn)` 单次循环 & 二分法
- `O(n^2)` 嵌套循环

<img :src="$withBase('/algorithms/Theory/时间复杂度.png')" alt="时间复杂度" />

### O(1)

代码就是平铺直叙的执行，没有任何循环。

### O(logn)

有循环，但其中使用了二分法，例如：二分查找算法<br>
二分法是非常重要的算法思维，它可以极大的减少复杂度，而且计算量越大、减少的越明显。可以看看本文上面的图。

### O(n)

普通的循环。

### O(n*logn)

嵌套循环，一层是普通循环，一层有二分算法。例如：快速排序算法。

### O(n^2)

两个普通循环的嵌套，例如常见的冒泡排序。

```javascript
function fn(obj = {}) {
    // O(1) 
    // return obj[key]; // 1
    return obj.a + obj.b + obj.c; // 4-5
}

function fn(arr = []){
    // O(n) 
    for(let i = 0; i < arr.length; i++){
        console.log(arr[i]);
    }

    // O(n^2)
    for(let i = 0; i < arr.length; i++){
        for(let i = 0; i < arr.length; i++){
            console.log(arr[i]);
        }
    }

    // O(logn) 二分

    // O(n*logn)
    for(let i = 0; i < arr.length; i++){
        // 二分
    }
}
```

## 空间复杂度

算法需要额外定义多少变量？

- `O(1)` 定义了为数不多的变量，和 `n` 无关
- `O(n)` 需要定义和 `n` 级别的变量，如额外复制一个同样的数组
- 其他不常见

前端算法通常不太考虑空间复杂度，或者它比时间复杂度要次要的多。<br>
因为前端环境，通常内存都是足够的，或者内存不够通常也是其他因素（如媒体文件）。
```javascript
function fn(arr = []) {
    // O(1)
    const a = arr[1];
    const b = arr[2];

    // O(n) 执行时传入的数据量和占用的空间是有关系的
    const arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        arr2[i] = arr[i] + 10;
    }
}
```

必须掌握算法复杂度
- 如果你没有复杂度的概念和敏感度，写程序是非常危险的
- 例如，代码功能测试正常，但数量大了，程序就会崩溃
- 对于前端开发，尤其是时间复杂度

尽量保证算法在O(logn)

## 划重点
1. 算法复杂度是学习算法的基础，非常重要，理解不了就背诵
2. 复杂度是数量级，用O(...)标识，内部是一个函数表达式。
3. 前端开发：重时间，轻空间。

必须要先掌握复杂度，再学习算法。如果无法掌握就背诵。知道时间复杂度的图，一定要把图画出来，每个时间复杂度和代码的关系比如没有循环、一次循环、嵌套循环与时间复杂度的关系