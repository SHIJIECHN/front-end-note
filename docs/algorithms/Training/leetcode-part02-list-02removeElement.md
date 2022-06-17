---
autoGroup-2: 链表
sidebarDepth: 3
title: 移除链表元素
---

## 移除链表元素
[力扣题目链接](https://leetcode-cn.com/problems/remove-linked-list-elements/)

### 1. JavaScript版
```js
import { array2list, list2array } from "./list.js";

class ListNode{
  constructor(val, next){
    this.val =  val;
    this.next = next;
  }
}

var removeElements = function(head, val) {
  let ret = new ListNode(0, head);
  let cur = ret;
  while(cur.next){
    if(cur.next.val === val){
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return ret.next;  
};


let head = [7,7,7,7];
let val = 7;

head = array2list(head);
list2array(removeElements(head, val));
```
list.js为方便vscode调试显示：链表转换为数组展示和数组转换为链表展示
```js
/**
 * 调试LeetCode中链表类型题目
 * 将输入的数组转换为链表
 */

/**
 * 
 * @param {*} arr 需要转换的数组
 * @param {*} type 转换的类型， 0为单链表，1为循环链表
 * @returns 
 */
export function array2list(arr, type = 0) {
    if (arr.length === 0) {
        return null;
    }
    // 第一个节点
    let head = {
        val: arr[0],
        next: null
    };
    let p = head, // 临时变量，在循环中存储上一个节点
        node = {}; // 存储当前节点
    for (let i = 1; i < arr.length; i++) {
        // 构建当前节点
        node = {
            val: arr[i],
            next: null
        }
        p.next = node; // 将当前节点与之前节点连接

        /**
         * p 是临时变量，之前和head共同指向同一个内存地址，
         * 这里p被重新赋值了，和node共同指向同一个内存地址
         * 设置当前节点为之前节点
         */
        p = node
    }

    if(type){
        p.next = head
    }
    
    console.log('list: ' + JSON.stringify(head, null, arr.length))
    return head;
}

/**
 * 链表转换为数组
 */
export function list2array(head) {
    if (!head) {
        console.log('array: []');
        return [];
    }
    let result = [],
        p = head;
    while (p) {
        result.push(p.val);
        p = p.next;
    }
    console.log('array: ' + result);
    return result;
}
```

### 2. Typscript版
```ts
class ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
  }
}

function createLinkList(arr: number[]) : ListNode{
  const length = arr.length;
  if (length == 0) throw new Error('arr is empty');

  // 数组的最后一个元素，从后往前
  let curNode = new ListNode(arr[length - 1]);

  if (length === 1) return curNode;

  // 从倒数第二个元素开始，向前遍历数组
  for (let i = length - 2; i >= 0; i--){
    curNode = new ListNode(arr[i], curNode);
  }
  // 返回头结点
  return curNode; 
}

const arr = [7,7,7,7];

const head = createLinkList(arr);
const val = 7;
console.info(removeElements(head, val));

function removeElements(head: ListNode | null, val: number): ListNode | null {
  let prevNode: ListNode = new ListNode(0, head), // 虚拟头结点
    curNode: ListNode | null = head;
  
  // 让头结点到虚拟节点上去
  head = prevNode;

  while (curNode) {
    if (curNode.val == val) {
      prevNode.next = curNode.next;
    } else {
      prevNode = curNode;
    }
    curNode = curNode.next;
  }

  return head.next;
};
```
