---
autoGroup-1: 算法
sidebarDepth: 3
title: 3. 括号匹配
---

## 题目

一个字符串内部可能包含 `{ }` `( )` `[ ]` 三种括号，判断该字符串是否是括号匹配的。<br>
如 `(a{b}c)` 就是匹配的， `{a(b` 和 `{a(b}c)` 就是不匹配的。

## 栈 Stack

该题目的考察目的很明确 —— 栈

栈，先进后出，基本的 API
- push
- pop
- length

和栈相关的数据结构（后面讲）
- 队列，先进先出
- 堆，如常说的“堆栈模型”

## 逻辑结构和物理结构

栈和数组有什么区别？—— 没有可比性，两者不是一个级别。就像：房子和石头有什么区别？

栈是一种逻辑结构，一种理论模型，它可以脱离编程语言单独讲。<br>
数组是一种物理结构，代码的实现，不同的语言，数组语法是不一样的。

栈可以用数组来表达，也可以用链表来表达，也可以自定义 `class MyStack {...}` 自己实现…<br>
在 JS 中，栈一般情况下用数组实现。

## 思路

- 遇到左括号 `{ ( [` 则压栈
- 遇到右括号 `} ) ]` 则判断栈顶，相同的则出栈
- 最后判断栈 length 是否为 0

## 答案

参考 match-brackets.ts 和 match-brackets.test.ts

## 性能分析
时间复杂度O(n)。空间复杂度O(n)，因为有栈

## 划重点

- 栈
- 逻辑结构和物理结构


## 源码
### match-brackets.ts
```typescript
/**
 * @description 括号匹配
 */

/**
 * 判断括号是否匹配
 * @param left 左括号
 * @param right 右括号
 * @returns 
 */
function isMatch(left: string, right: string): boolean{
    if(left === '(' &&  right === ')') return true;
    if(left === '{' &&  right === '}') return true;
    if(left === '[' &&  right === ']') return true;
    return false;    
}


/**
 * 判断是否括号匹配
 * @param str str
 */
export function matchBracket(str: string): boolean{
    const length = str.length;
    // 空字符串
    if(length === 0) return true;

    const stack = [];
    const leftSymbols = '{[('; // 左括号
    const rightSymbols = '}])'; // 有括号

    // 循环字符串
    for(let i = 0; i < length; i++){
        const s = str[i];

        // 判断是否是左括号
        if(leftSymbols.includes(s)){  // includes的时间复杂度是O(n)，但是leftSymbols是一个常量和输入没有关系。而且非常短。
            stack.push(s); // 左括号，压栈  空间复杂度O(n)
        }else if(rightSymbols.includes(s)){ // 判断是否是右括号
            const top = stack[stack.length -1]; // 左括号 ************注意此处取值
            // 左括号与右括号匹配
            if(isMatch(top, s)){
                stack.pop(); // 右括号，出栈
            }else{
                // 只要有一个不匹配，就说明括号不匹配
                return false;
            }
        }
    }
    return true;
}

// 功能测试
const str = '{a(b[c]d)e}f';
console.info(matchBracket(str));
```

### match-brackets.test.ts
```typescript
/**
 * @description 括号匹配
 */

import { matchBracket } from "./match-bracket";

describe('括号匹配', ()=>{
    it('正常情况', ()=>{
        const str = '{a(b[c]d)e}f';
        const res = matchBracket(str);
        // 不是数组或字符串时，用toBe
        expect(res).toBe(true);
    })

    it('括号不匹配', ()=>{
        const str = '{a(b[(c]d)e}f';
        const res = matchBracket(str);
        expect(res).toBe(false);
    })

    it('括号顺序不一致', ()=>{
        const str = '{a(b[c)d]e}f';
        const res = matchBracket(str);
        expect(res).toBe(false);
    })

    it('空字符串', ()=>{
        const res = matchBracket('');
        expect(res).toBe(true);
    })
})
```
运行命令：`npx jest src/01-algorithm/match-bracket.test.ts `   
结果：
 <img :src="$withBase('/algorithms/Theory/match-bracket.png')" alt="match-bracket" />
