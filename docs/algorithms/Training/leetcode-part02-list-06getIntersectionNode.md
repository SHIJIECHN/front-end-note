---
autoGroup-2: 链表
sidebarDepth: 3
title: 链表相交
---

## 链表相交
[力扣题目链接](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)

```js
function getListLength(head){
  let size = 0;
  while(head){
    size++;
    head = head.next;
  }
  return size;
}
var getIntersectionNode = function(headA, headB) {
    let curA = headA;
    let curB = headB;

    let sizeA = getListLength(headA);
    let sizeB = getListLength(headB);

    curA = headA;
    curB = headB;

    if(sizeB > sizeA){
      [curA, curB] = [curB, curA];
      [sizeA, sizeB] = [sizeB, sizeA];
    }

    let n = sizeA - sizeB;

    while(n--){
      curA = curA.next;
    }
    debugger

    while(curA){
      if(curA == curB){
        return curA
      }
      curA = curA.next;
      curB = curB.next;
    }
    return null;
};

```