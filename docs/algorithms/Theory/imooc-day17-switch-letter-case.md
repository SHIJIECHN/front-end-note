---
autoGroup-1: 算法
sidebarDepth: 3
title: 17. 切换字母大小写
---

## 题目

切换字母大小写，输入 `'aBc'` 输出 `'AbC'`

## 分析

需要判断字母是大写还是小写
- 正则表达式
- `charCodeAt` 获取 ASCII 码（[ASCII 码表](https://zh.m.wikipedia.org/zh-hans/ASCII)）

性能分析
- 正则表达式性能较差
- ASCII 码性能较好

## 答案

使用 `charCodeAt` ，参考代码 switch-letter-case.ts

## 划重点

- 慎用正则表达式
- ASCII 码

## 源码

### switch-letter-case.ts
```typescript
/**
 * @description 切换字母大小写
 */

/**
 * 切换字母大小写（正则表达式）
 * @param s string
 */
export function switchLetterCase1(s: string): string{
    let res = '';

    const length = s.length;
    if(length === 0) return res;

    const reg1 = /[a-z]/; // 匹配小写
    const reg2 = /[A-Z]/; // 匹配大写

    for(let i = 0; i < length; i++){
        const c = s[i];
        // 匹配小写
        if(reg1.test(c)){
            res += c.toUpperCase();
        }else if(reg2.test(c)){ // 匹配大写
            res += c.toLowerCase();
        }else{ // 其他字符
            res += c;
        }
    }
    return res;
}

export function switchLetterCase2(s: string): string{
    let res = "";

    const length = s.length;
    if(length === 0) return res;

    for(let i = 0; i < length; i++){
        const c = s[i];
        const code =  c.charCodeAt(0);// 获取ASCII码

        // 大写字母
        if(code>= 65 && code <= 90){
            res += c.toLowerCase();
        }else if(code >= 96 && code <= 122){ // 小写字母
            res += c.toUpperCase();
        }else{
            res += c;
        }
    }
    return res;
}

// 性能测试
// const s = '100aBcD$xYz&';
// console.log(switchLetterCase2(s));

// 性能测试
const str = '1002*S*&HGsskdh9*skfdksksjd(*HGFBHGVG**^&^g';
console.time('switchLetterCase1');
for(let i = 0; i < 10 * 10000; i++){
    switchLetterCase1(str);
}
console.timeEnd('switchLetterCase1'); // 407ms

console.time('switchLetterCase2');
for(let i = 0; i < 10 * 10000; i++){
    switchLetterCase2(str);
}
console.timeEnd('switchLetterCase2'); // 159ms
```

### switch-letter-case.test.ts
```typescript
/**
 * @description 转换字母大小写
 */

import { switchLetterCase1, switchLetterCase2 } from "./switch-letter-case";

describe('转换字母大小写', ()=>{
    it('正常', ()=>{
        const s = '100aBcD$xYz&';
        const res = switchLetterCase2(s);
        expect(res).toBe('100AbCd$XyZ&');
    })

    it('空字符串', ()=>{
        const res = switchLetterCase2('');
        expect(res).toBe('');
    })

    it('非字母',()=>{
        const s = '100*&^你好';
        const res = switchLetterCase2(s);
        expect(res).toBe('100*&^你好')
    })
})
```