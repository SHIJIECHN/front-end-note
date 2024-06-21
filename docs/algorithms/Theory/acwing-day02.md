---
autoGroup-2: ACWing算法
sidebarDepth: 3
title: 2. 数据结构
---

## 1. 链表与邻接表

用数组来模拟链表：
1. 单链表：邻接表。应用：图和数的存储
2. 双链表：双向链表。应用：优化某些题


### 1.1 单链表

```js

const N = 100010;
let head; // 头结点的下标
let e = new Array(N).fill(0); // e[i]节点i的值
let ne = new Array(N).fill(0);// ne[i]节点i的next指针是多少
let idx; // 当前用到了哪个点

// 初始化
function init(){
    head = -1;
    idx = 0;
}

// 在头结点后插入一个节点
function add_to_head(x){
    e[idx] = x; // 当前节点的值是x
    ne[idx] = head;// 当前节点的next指针指向head
    head = idx; // head指向当前节点
    idx++; // 当前节点的下标+1
}

// 在下标k后插入一个节点
function add(k, x){
    e[idx] = x; // 当前节点的值是x
    ne[idx] = ne[k]; // 当前节点的next指针指向k的next指针
    ne[k] = idx; // k的next指针指向当前节点
    idx++; // 当前节点的下标+1
}

// 删除下标k后的节点
function remove(k){
    ne[k] = ne[ne[k]]// k的next指针指向k的next的next.ne[k]等于k的下一个节点的下标，所以ne[ne[k]]等于k的下一个节点的下一个节点的下标
}
```

### 1.2 双链表

```js
const N = 100010;
let e = new Array(N).fill(0); // e[i]节点i的值
let l = new Array(N).fill(0); // l[i]节点i的左指针
let r = new Array(N).fill(0); // r[i]节点i的右指针
let idx;; // 当前用到了哪个点

// 初始化
function init(){
    // 0表示左端点，1表示右端点
    r[0] = 1;
    l[1] = 0;
    idx = 2; // 从2开始分配,0和1已经用了
}

// 在下标k的右边插入一个数x
function add(k, x){
    e[idx] = x; // 当前节点的值是x
    r[idx] = r[k]; // 当前节点的右指针指向k的右指针
    l[idx] = k; // 当前节点的左指针指向k
    l[r[k]] = idx; // k的右指针的左指针指向当前节点。注意：这一步要在r[idx] = r[k]之前，否则会出错
    r[k] = idx; // k的右指针指向当前节点
}

// 在下标k的左边插入一个数x，可以看作是在l[k]的右边插入一个数x，直接调用上面的add函数即可，即add(l[k], x)

// 删除下标k的节点
function remove(k){
    r[l[k]] = r[k]; // k的左指针的右指针指向k的右指针
    l[r[k]]  = l[k]; // k的右指针的左指针指向k的左指针
}
```

## 2. 栈约队列

## 3. KMP


