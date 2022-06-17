---
autoGroup-2: 链表
sidebarDepth: 3
title: 两两交换链表中的节点
---

## 两两交换链表中的节点
[力扣题目链接](https://leetcode.cn/problems/swap-nodes-in-pairs/)

<img :src="$withBase('/algorithms/Theory/两两交换链表中的节点.png')" alt="两两交换链表中的节点" />

采用虚拟头节点。
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

const arr = [1, 2, 3];
const head = createLinkList(arr);
console.info(swapPairs(head));

function swapPairs(head: ListNode | null): ListNode | null {
  const dummyHead: ListNode = new ListNode(0, head);
  let temp: ListNode = dummyHead;
  // temp.next为第一个节点，temp.next.next为第二个节点
  while(temp.next !== null && temp.next.next !== null) {
    const pre: ListNode = temp.next;
    const cur: ListNode = temp.next.next;

    pre.next = cur.next;
    cur.next = pre;
    temp.next = cur;
    
    temp = pre;
  
  }
  return dummyHead.next;
}
```