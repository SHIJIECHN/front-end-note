---
autoGroup-5: 字符串
sidebarDepth: 3
title: 反转字符串
---

## 反转字符串
[力扣题目链接](https://leetcode.cn/problems/reverse-string/)

```ts
function reverseString(s: string[]): void {
  const length = s.length;

  let left = 0,
    right = length - 1;
  while (left < right) {
    // 交换值：
    // 方法一
    [s[left], s[right]] = [s[right], s[left]];

    // 方法二
    // let temp = s[left];
    // s[left] = s[right];
    // s[right] = temp;

    left++;
    right--;
  }
};
```

## 反转字符串 II
[力扣题目链接](https://leetcode.cn/problems/reverse-string-ii/)
```ts
function reverseStr(s: string, k: number): string {
  let arr: string[] = s.split('');
  const length = arr.length;
  if (k == 0) return s;
  

  const step = 2 * k;
  let left = 0,
    right = length - 1;
  for (let i = 0; i < length; i += step){
    left = i;
    right = (i + k - 1) >= length ? length - 1 : i + k - 1;
    while (left < right) {
      let temp = arr[left];
      arr[left] = arr[right];
      arr[right] = temp;
      left++;
      right--;
    }
  }

  return arr.join('')
};

```