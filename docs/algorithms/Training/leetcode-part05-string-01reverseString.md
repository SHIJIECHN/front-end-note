---
autoGroup-5: 字符串
sidebarDepth: 3
title: 反转字符串
---

## 反转字符串
[力扣题目链接](https://leetcode.cn/problems/reverse-string/)
```md
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。
不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

示例 1：
输入：["h","e","l","l","o"]
输出：["o","l","l","e","h"]

示例 2：
输入：s = ["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]
```

双指针法：
1. 将left指向字符数组首元素，right指向字符数组尾元素
2. 当left < right:
   - 交换s[left]和s[rihgt]
   - left指针右移一位，即left = left + 1
   - right指针左移一位，即right = right - 1
3. 当right >= left， 反转结束，返回字符数组即可


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
给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符。
- 如果剩余字符少于 k 个，则将剩余字符全部反转。
- 如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。
```md
示例 1：
输入：s = "abcdefg", k = 2
输出："bacdfeg"

示例 2：
输入：s = "abcd", k = 2
输出："bacd"
```

思路：
1. 首先统计字符串长度，然后设i为截取起始位置，i每次循环跳步2*k
2. 定义变量left，right。left是i的其实位置，right是i+k-1的位置。但是如果i+k-1 < len，则right = len -1。 
3. 若 i <= slen 则 翻转前k个字符再拼接后k个字符，定位i及重新统计剩余个数

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