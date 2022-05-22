---
autoGroup-1: 算法
sidebarDepth: 3
title: 两个栈实现一个队列
---

## 题目

请用两个栈，来实现队列的功能，实现功能 `add` `delete` `length` 。

## 队列 Queue

栈，先进后出

队列，先进先出，API 包括
- add
- delete
- length

常见的“消息队列”就是队列的一种应用场景
- A 系统向 B 系统持续发送海量的消息
- A 系统先把一条一条消息放在一个 queue
- B 系统再从 queue 中逐条消费（按顺序，先进先出）

## 逻辑结构和物理结构

队列和栈一样，是一种逻辑结构。它可以用数组、链表等实现。<br>
思考：用数组实现队列，性能会怎样 —— add 怎样？delete 怎样？

复杂场景下（如海量数据，内存不够用）需要单独设计。

## 题目分析

可画图分析：参考视频讲解

- 队列 add
    - 往 stack1 push 元素
- 队列 delete
    - 将 stack1 所有元素 pop 出来，push 到 stack2
    - 将 stack2 执行一次 pop
    - 再将 stack2 所有元素 pop 出来，push 进 stack1

## 答案

参考 two-stacks-one-queue.ts

## 性能分析
时间复杂度：add O(1); delete O(n) <br>
空间复杂度，整体是O(n)

## 划重点

- 队列
- 画图，帮助梳理解题思路

## 源码
two-stack-one-queue.ts
```typescript
/**
 * @description 两个栈 - 一个队列
 */


export class MyQueue{
    // private是当前类可以调用，但是实例不能调用
    private stack1: number[] = [];
    private stack2: number[] = [];

    /**
     * 入队
     * @param n n
     */
    add(n: number){
        this.stack1.push(n);
    }

    /**
     * 出队
     */
    delete(): number | null {
        let res;

        const stack1 = this.stack1;
        const stack2 = this.stack2;
        // 1. 将stack1所有元素移动到stack2中
        while(stack1.length){
            const n = stack1.pop();
            if(n != null){
                stack2.push(n);
            }
        }
        // 2. stack2 pop
        res = stack2.pop();

        // 3. 将stack2所有元素“还给”stack1
        while(stack2.length){
            const n = stack2.pop();
            if(n != null){
                stack1.push(n);
            }
        }

        return res || null

    }

    // 使用get的方式定义length，是想通过属性的方式访问length，即q.length
    get length(): number{
        return this.stack1.length;
    }
}

// 功能测试
// const q = new MyQueue();
// q.add(100);
// q.add(200);
// q.add(300);
// console.info(q.length);
// console.info(q.delete());
// console.info(q.length);
```
two-stack-one-queue.test.ts
```typescript
/**
 * @description 两个栈，一个队列 test
 */

import { MyQueue } from "./two-stack-one-queue"

describe('两个栈，一个队列', ()=>{
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
        expect(q.length).toBe(2);
        expect(q.delete()).toBe(200);
        expect(q.length).toBe(1);
    })
})
```
运行命令：npx jest src/01-algorithm/two-stack-one-queue.test.ts    
结果：  
 <img :src="$withBase('/algorithms/Theory/two-stack-one-queue.png')" alt="two-stack-one-queue" />
