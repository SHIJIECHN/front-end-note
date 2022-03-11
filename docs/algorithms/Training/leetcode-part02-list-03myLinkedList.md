---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 设计链表
---

## 设计链表
[力扣题目链接](https://leetcode-cn.com/problems/design-linked-list/)
```js
// 在链表类中实现这些功能：
// get(index)：获取链表中第 index 个节点的值。如果索引无效，则返回-1。
// addAtHead(val)：在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。
// addAtTail(val)：将值为 val 的节点追加到链表的最后一个元素。
// addAtIndex(index,val)：在链表中的第 index 个节点之前添加值为 val  的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果index小于0，则在头部插入节点。
// deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点。

import { list2array } from "./list.js";

class LinkNode {
    constructor(val, next) {
        this.val = val;
        this.next = next;
    }
}

var MyLinkedList = function() {
    this.count = 0;
    this.headhead = undefined;
    this.tail = undefined;
};

MyLinkedList.prototype.getNode = function(index){
  if(index < 0 || index >= this.count){
    return null;
  }

  let cur = new LinkNode(0, this.head); // 创建虚拟头结点
  while(index-- >= 0){
    cur = cur.next;
  }
  return cur;
}

/** 
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function(index) {
  if(index >= 0 && index < this.count){
    return this.getNode(index).val;
  }
  return -1;
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function(val) {
    const node = new LinkNode(val, this.head);
    this.head = node;
    this.count++;
    if(!this.tail){
      this.tail = node;
    }
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function(val) {
  let node = new LinkNode(val, null);
  this.count++;
  if(this.tail){
    this.tail.next = node;
    this.tail = node;
    return;
  }
  this.tail = node;
  this.head = node;
};

/** 
 * @param {number} index 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function(index, val) {
  if(index > this.count) return;
  if(index <= 0){
    this.addAtHead(val);
    return;
  }
  if(index == this.count){
    this.addAtTail(val);
    return;
  }
  // 获取目标的上一个节点
  const node = this.getNode(index - 1);
  node.next = new LinkNode(val, node.next);
  this.count++;
};

/** 
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function(index) {
  if(index < 0 || index >= this.count) return;

  // 如果是删除头结点
  if(index === 0){
    this.head = this.head.next;
    // 如果删除的这个节点同时是尾节点，要处理尾节点
    if(index === this.count - 1){
      this.tail = this.head;
    }
    this.count--;
    return;
  }

  // 删除中间节点
  const node = this.getNode(index - 1);
  node.next = node.next.next;

  // 删除尾节点
  if(index === this.count - 1){
    this.tail = node;
  }
  this.count--;
};

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */

var obj = new MyLinkedList()
console.log(obj.count)
obj.addAtHead(1);
obj.addAtTail(3);
obj.addAtIndex(1, 2)
let arr = list2array(obj.head);
console.log(arr);
console.log(obj.get(1));
obj.deleteAtIndex(1);
console.log(list2array(obj.head));
console.log(obj.get(1))

```
