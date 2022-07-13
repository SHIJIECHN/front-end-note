---
autoGroup-5: 字符串
sidebarDepth: 3
title: 替换空格
---

## 替换空格
[力扣题目链接](https://leetcode.cn/problems/ti-huan-kong-ge-lcof/)
请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
```md
示例 1：
输入：s = "We are happy."
输出："We%20are%20happy."
```
不使用额外发空间，思路：
1. 计算字符串空格的个数，扩充数组到每个空格替换成 %20 之后的大小
2. 然后从后往前替换空格，也就是双指针法。

```ts
// 直接处理
function replaceSpace(s: string): string {
  const len = s.length;
  if (len == 0) return s;
  let str = [];
  let arr = s.split('');
  
  for (let i = 0; i < arr.length; i++){
    if (arr[i] == ' ') {
      str[i] = "%20"
    } else {
      str[i] = arr[i]
    }
  }
  console.log(str.join(''));
  
  return str.join('')
};

// 双指针法
function replaceSpace(s: string): string {
  // 字符串转数组
  let arr: string[] = s.split('');
  let spaceCount: number = 0;
  const len = arr.length;

  // 计算空格数
  for (let i = 0; i < len; i++){
    if (arr[i] === ' ') {
      spaceCount++;
    }
  }

  let left = len - 1,
    right = len + 2 * spaceCount - 1;
  
  // arr.length = len + 2 * spaceCount;
  while (left >= 0) {
    if (arr[left] === ' ') {
      arr[right--] = '0';
      arr[right--] = '2';
      arr[right--] = '%';
      left--;
    } else {
      arr[right--] = arr[left--]
    }
  }
  
  // 数组转字符串
  return arr.join('')
};
```