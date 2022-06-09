---
autoGroup-3: 栈与队列
sidebarDepth: 3
title: 删除字符串中的所有相邻重复项
---

## 删除字符串中的所有相邻重复项
[力扣题目链接](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

```typescript
function removeDuplicates(s: string): string {
    const length = s.length;
    let res: string[] = [];
    if(length === 0) return s;

    for(let i = 0; i < length; i++){
        let t = s[i];

        if(t !== res[res.length - 1]){
            res.push(t);
        }else{
            res.pop()
        }
    }

    return res.join('');
};

const s = 'aaaaaa';
console.log(removeDuplicates(s));
```