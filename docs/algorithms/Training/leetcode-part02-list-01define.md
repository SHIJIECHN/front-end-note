---
autoGroup-1: Leetcode
sidebarDepth: 3
title: 链表
---

## 创建链表
创建链表的“骨架”类LinkedList
```js
export default class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0; 
    this.head = undefined; // 保存第一个元素的引用
    this.equalsFn = equalsFn
  }
}
```
工具函数defaultEquals
```js
export function defaultEquals(a, b){
  return a === b;
}
```

## 新建节点类
1. 新创建的节点Node类
```js
export class Node {
  constructor(element){
    this.element = element;
    this.next = undefined;
  }
}
```
Node类表示想要添加到链表中的项。它包含
- element属性，表示要加入链表元素的值；
- next属性，表示指向链表中下一个元素的指针，初始值为undefined

## 链表操作
- push(element)：向链表尾部添加一个元素。
- insert(element, position)：向链表的特定位置插入一个新元素。
- getElementAt(index)：返回链表中特定位置的元素。如果链表中不存在这样的元素，则返回undefined。
- remove(element)：从链表中移除一个元素。
- indexOf(element)：返回元素在链表中的索引。如果链表中没有该元素则返回-1。
- removeAt(position)：从链表的特定位置移除一个元素。
- isEmpty()：如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false。
- size()：返回链表包含的个数，与数组的length属性类似。
- toString()： 返回表示整个链表的字符串。

### 1. 向链表尾部添加元素
两种情况：
- 链表为空，添加的是第一个元素
- 链表不为空，向其追加元素

```js
push(element) {
    const node = new Node(element); // 创建node
    let current;
    // 如果head元素为undefined或null，则列表为空
    if (this.head == null) {
      this.head = node;
    } else { // 
      current = this.head; // 第一个元素的引用
      while (current.next != null) { // 获得最后一项
        current = current.next;
      }
      // 将其next赋为新元素，建立链接
      current.next = node;
    }
    this.count++;
  }
```

### 2. 从链表中移除元素
从链表中移除元素存在两种情况：
+ 移除第一个元素；
+ 移除第一个元素之外的元素。

有两种方式：
- 从特定位置移除一个元素(removeAt);
- 根据元素的值移除元素(remove)。

```js
removeAt(index) {
  // index是否是有效的
  if (index >= 0 && index < this.count) {
    let current = this.head;

    // 移除第一项
    if (index === 0) {
      current = current.next;
    } else {
      let pre;
      for (let i = 0; i < index; i++) {
        pre = current;
        current = current.next;
      }
      // pre与current的下一项链接起来：跳过current，从而移除它
      pre.next = current.next;
    }
    this.count--;
    return current.element;
  }
  return undefined
}
```
::: tip
current总是为对所循环列表的当前元素的引用
:::
采用getElemntAt(index)方法重构
```js
if(index === 0){
  current = current.next;
}else {
  let pre = this.getElementAt(index - 1);
  current = pre.next;
  pre.next = current.next;
}
```

### 3. 循环迭代链表直到目标位置
```js
 getElementAt(index){
    if(index >= 0 && index <= this.count){
      let current = this.head;
      for(let i = 0; i < index && current != null; i++){
        current = current.next;
      }
      return current;
    }
    return undefined
  }
```

### 4. 在任意位置插入元素
```js
insert(element, index) {
  if(index >= 0 && index <= this.count){
    let node = new Node(element);
    if (this.head != null) {
      if (index === 0) {
        let current = this.head;
        node.next = current;
        this.head = node;
      } else {
        let pre = this.getElementAt(index - 1);
        let current = pre.next;
        node.next = current;
        pre.next = node;
      }
      this.count++;
      return true;

    } else {
      this.head = node;
    }
  }
  return false;
}
```

### 5. 返回一个元素的位置
```js
indexOf(element) {
    if (this.count) {
      let current = this.head;
      if (current.element == element) {
        current = current.next;
      } else {
        for (let i = 0; i < this.count && current != null; i++) {
          if (this.equalsFn(element, current.element)) {
            return i;
          }
          current = current.next
        }
      }
    }
    return -1;
  }
```

### 6. 从链表中移除元素
```js
remove(element){
  const index = this.indexOf(element);
  return this.removeAt(index);
}
```

### 7. isEmpty、size和getHead
```js
size(){
  return this.count;
}

isEmpty(){
  return this.size === 0;
}

getHead(){
  return this.head;
}
```

### 8. toStrin方法
```js
toString(){
    if(this.head == null){
      return ''
    }

    let objStr = this.head.element;
    let current = this.head.next;
    for(let i = 0; i < this.count && current != null; i++){
      objStr = `${objStr}, ${current.element}`;
      current = current.next;
    }
    return objStr;
  }
```

## 双向链表

