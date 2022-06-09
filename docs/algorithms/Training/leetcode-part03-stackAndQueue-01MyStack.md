---
autoGroup-3: 栈与队列
sidebarDepth: 3
title: 用栈实现队列
---

## 用栈实现队列
[力扣题目链接](https://leetcode.cn/problems/implement-stack-using-queues/)
思路：使用两个queue，queue1用来存放元素，queue2用于操作元素。push元素是将元素放入queue2中，然后将queue1中的所有元素拼接到queue2后面，再将queue2中的所有元素放入queue1中去。

<img :src="$withBase('/algorithms/Theory/two-queue-to-stack.png')" alt="two-queue-to-stack" />

```typescript
class MyStack {
    private queue1: number[] = [];
    private queue2: number[] = [];
    constructor() {
        this.queue1 = []; // 存放元素
        this.queue2 = []; // 操作
    }

    push(x: number): void {
        this.queue2.push(x);
        // 先将1中的所有元素拼接入2中
        while(this.queue1.length > 0){
            this.queue2.push(this.queue1.shift()!);
        }

        // 将2中的所有元素放入1里
        while(this.queue2.length > 0){
            this.queue1.push(this.queue2.shift()!);
        }
    }

    pop(): number {
        return this.queue1.shift()!;
    }

    top(): number {
        let temp = this.queue1[0];
        return temp;
    }

    empty(): boolean {
        return this.queue1.length === 0 && this.queue2.length === 0;
    }
}

var obj = new MyStack()
obj.push(1)
obj.push(3)
console.log('top: ',obj.top());
console.log('pop: ',obj.pop());
console.log('isEmpty: ',obj.empty());
```