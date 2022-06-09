---
autoGroup-2: 链表
sidebarDepth: 3
title: 翻转链表
---

## 翻转链表
[力扣题目链接](https://leetcode-cn.com/problems/reverse-linked-list/)

### 双指针法
```js
import { array2list, list2array } from "./list.js";

class ListNode{
  constructor(val, next){
    this.val =  val;
    this.next = next;
  }
}

var reverseList = function(head) {
  if(!head || !head.next) return head;
  let cur = head;
  let pre = null;
  while(cur){
    let temp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = temp;
  }
  return pre;

};


let head = [];

head = array2list(head);
list2array(reverseList(head));
```

### 递归
从前往后翻
```js
var reverse = function(pre, head){
  if(!head){
    return pre;
  }
  let temp = head.next;
  head.next = pre;
  pre = head;
  return reverse(pre, temp)
}

var reverseList = function(head) {
  return reverse(null, head);
};
```
从后往前翻
```js

```