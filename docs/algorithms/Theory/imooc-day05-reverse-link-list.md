---
autoGroup-1: 算法
sidebarDepth: 3
title: 5. 反转单向链表
---

## 题目

定义一个函数，输入一个单向链表的头节点，反转该链表，并输出反转之后的头节点

## 链表

链表是一种物理结构（非逻辑结构），是数组的补充。<br>
数组需要一段连续的内存空间，而链表不需要。

数据结构
- 单向链表 `{ value, next }`
- 双向链表 `{ value, prev, next }`

两者对比
相同点：都是有序结构。
- 链表：查询慢O(n)，新增和删除较快O(1)
- 数组：查询快O(1)，新增和删除较慢O(n)

## 应用场景

React Fiber 就把 vdom 树转换为一个链表，这样才有可能随时中断、再继续进行。<br>
如果 vdom 是树，那只能递归一次性执行完成，中间无法断开。

<img :src="$withBase('/algorithms/Theory/react-fiber-链表.png')" alt="react-fiber-链表" />

## 分析

反转链表，画图很好理解。没有捷径，遍历一边，重新设置 next 指向即可。<br>
但实际写代码，却并不简单，很容易造成 nextNode 丢失。

因此，遍历过程中，至少要存储 3 个指针 `prevNode` `curNode` `nextNode`

时间复杂度 `O(n)`

## 答案

参考 reverse-link-list.ts 和 reverse-link-list.test.ts

## 划重点

- 链表
- 链表和数组的不同
    - 内存占用
    - 查询、新增、删除的效率
- 如何保证 nextNode 不丢失

## 扩展

思考：用数组和链表实现队列，哪个性能更好？<br>

### 分析
数组是连续存储，push很快，shift很慢；链表是非连续存储，add和delete都很快（但查找很慢）。<br>

### 结论
链表实现队列会更快。队列是一种先进先出的结构，如果使用数组实现，每次进，就push一个元素，但是每次出队列的时候，shift操作，后面的元素都要移动。而链表不一样，只需要改变指向就可以了。<br>

### 思路
链表实现队列：单向链表就可以实现，但要同时需要记录head和tail。要从tail入队，从head出队，否则出队时tail不好定位，length要实时记录，不可比案例链表获取

### 答案
参考 queue-with-list.ts 和 queue-with-list.test.ts

### 性能分析
- 空间复杂度都是O(n)
- add时间复杂度：链表O(1)；数组O(1)
- delete时间复杂度：链表O(1)；数组O(n)

### 划重点
- 链表，链表 vs 数组
- 数据结构的选择，要比算法优化更重要
- 要有时间复杂度的敏感性，如length不能遍历查找


## 源码
### reverse-link-list.ts
```typescript
/**
 * @description 反转单向链表
 */


/**
 * 链表结构
 */
export interface ILinkListNode{
    value: number
    next?: ILinkListNode
}

/**
 * 反转单向链表，并返回反转之后的head node
 * @param listNode list head node
 */
export function reverseLinkList(listNode: ILinkListNode): ILinkListNode{
    // 定义三个指针
    let prevNode: ILinkListNode | undefined = undefined;
    let curNode: ILinkListNode | undefined = undefined;
    let nextNode: ILinkListNode | undefined = listNode;

    // 以nextNode为主遍历链表
    while(nextNode){
        // 第一个元素，删掉next， 防止循环引用
        if(curNode && !prevNode){ // 开始的情况: curNode有值，prevNode没有值。就是第一个元素没有next指向，直接删除
            delete curNode.next
        }

        // 反转指针
        if(curNode && prevNode){ // 中间的情况
            curNode.next = prevNode;
        }

        // 整体向后移动指针
        prevNode = curNode;
        curNode = nextNode;
        nextNode = nextNode?.next; // ? 属性获取不到就返回空，如果没有next属性，返回undefined
    }

    // 最后个的补充：当 nextNode 空时，此时 curNode 尚未设置 next
    curNode!.next = prevNode; // ! 判断curNode可能没有值，加！表示不用管我自己处理。因为在定义的时候有可能curNode为undefined

    return curNode!;
}


/**
 * 根据数组创建单向链表
 * @param arr number arr
 * @returns 返回单向链表
 * 返回的是什么呢？返回的是一个头，因为链表单向结构，所以只要找到头head就可以了。
 * 我们说的输入链表，其实就是输入head，返回链表也是返回head，就是节点
 *  arr = [100, 200, 300]
 * {value: 300}
 * {value: 200, next: {value: 300}}
 * {value: 100, next: {value: 200, next: {value: 300}}}
 */
export function createLinkList(arr: number[]): ILinkListNode {
    
    const length = arr.length;
    if(length === 0) throw new Error('arr is empty');


    // 当前节点。因为我们要按数组生成链表，我们从后往前依次生成
    let curNode: ILinkListNode = {
        value: arr[length -1] // 数组的最后一个节点
    }

    if(length === 1) return curNode; // 只有一个元素，直接返回当前节点

    // 循环遍历，从倒数第二个节点开始
    for(let i = length -2; i >=0; i--){
        curNode = {
            value: arr[i],
            next: curNode
        }
    }

    return curNode
}

// const arr = [100, 200, 300, 400, 500];
// const list = createLinkList(arr);
// console.info('list: ', list);

// const list1 = reverseLinkList(list);
// console.info(list1)
```

### reverse-link-list.test.ts
```typescript
/**
 * @description 反转单向链表 test
 */

import { createLinkList, ILinkListNode, reverseLinkList } from "./reverse-link-list"

describe('反转单向链表', ()=>{
    it('单个元素', ()=>{
        const node: ILinkListNode = {value: 100};
        const node1 = reverseLinkList(node);
        // 对象的对比用toEqual，字符串、数字对比用ToBe
        expect(node1).toEqual({value: 100});
    })

    it('多个元素', ()=>{
        const node = createLinkList([100, 200, 300]);
        const node1 = reverseLinkList(node);
        expect(node1).toEqual({
            value: 300,
            next:{
                value: 200,
                next: {
                    value: 100
                }
            }
        })
    })
})
```

### queue-with-list.ts
```typescript
/**
 * @description 用链表实现队列
 */

interface IListNode {
    value : number,
    next: IListNode | null
}

export class MyQueue {
    private head: IListNode | null = null;
    private tail: IListNode | null = null;
    private len = 0;

    /**
     * 入队，在 tail 位置
     * @param n number
     */
    add(n: number){
        const newNode: IListNode = {
            value: n,
            next: null // 在tail位置入队，所以最后一个next是没有值的
        }
        // 假设head和tail都是空的，也就是增加的是第一个节点，这时head和tail都要指向新增的节点

        // 处理head。当head为空时
        if(this.head == null){
            this.head = newNode
        }

        // 处理tail
        const tailNode = this.tail; // 获取当前的 tail 节点
        if(tailNode){ // 如果tailNode不为空的，将这个节点的next指向新增的节点
            tailNode.next = newNode;
        }
        // 将 tail 指向新的节点
        this.tail = newNode;

        // 记录长度
        this.len++;

    }

    /**
     * 出队，在 head 位置
     */
    delete(): number | null{
        const headNode = this.head;
        if(headNode == null ) return null; // 没有节点了

        if(this.len <= 0) return null;

        // 取值
        const value = headNode.value;

        // 修改head指向
        this.head = headNode.next;

        // 记录长度
        this.len--;

        return value;
    }

    get length():number{
        // len要单独存储，不能遍历链表获取，否则时间复杂度太高
        return this.len;
    }
}
// 功能测试
// const q = new MyQueue();
// q.add(100);
// q.add(200);
// q.add(300);
// console.info('length1: ', q.length);
// console.log(q.delete());
// console.info('length2: ', q.length);
// console.log(q.delete());
// console.info('length3: ', q.length);
// console.log(q.delete());
// console.info('length4: ', q.length);
// console.log(q.delete());
// console.info('length5: ', q.length);

// 性能测试
const q1 = new MyQueue();
console.time('queue with list');
for(let i = 0; i < 10*10000; i++){
    q1.add(i);
}
for(let i = 0; i < 10*10000; i++){
    q1.delete();
}
console.timeEnd('queue with list'); // 12ms

const q2 = [];
console.time('queue with array');
for(let i = 0; i < 10*10000; i++){
    q2.push(i);
}
for(let i = 0; i < 10*10000; i++){
    q2.shift();
}
console.timeEnd('queue with array'); // 495ms
```

### queue-with-list.test.ts
```typescript
/**
 * @description 链表实现队列 test
 */

import { MyQueue } from "./queue-with-list"

describe('链表实现队列', ()=>{
    it('add and length', ()=>{
        const q = new MyQueue();
        expect(q.length).toBe(0);

        q.add(100);
        q.add(200);
        q.add(300);
        expect(q.length).toBe(3);
    })


    it('delete', ()=>{
        const q = new MyQueue();
        expect(q.delete()).toBeNull();

        q.add(100);
        q.add(200);
        q.add(300);
        expect(q.delete()).toBe(100);
        expect(q.delete()).toBe(200);
        expect(q.delete()).toBe(300);
        expect(q.delete()).toBeNull();
    })

    
})
```