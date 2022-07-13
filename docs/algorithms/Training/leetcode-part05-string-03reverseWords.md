---
autoGroup-5: 字符串
sidebarDepth: 3
title: 反转字符串
---

## 反转字符串
[力扣题目链接](https://leetcode.cn/problems/reverse-string/)
给你一个字符串 s ，颠倒字符串中 单词 的顺序。

单词 是由非空格字符组成的字符串。s 中使用至少一个空格将字符串中的 单词 分隔开。

返回 单词 顺序颠倒且 单词 之间用单个空格连接的结果字符串。

注意：输入字符串 s中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。

```md
示例 1：
输入：s = "the sky is blue"
输出："blue is sky the"

示例 2：
输入：s = " hello world "
输出："world hello"
解释：颠倒后的字符串中不能存在前导空格和尾随空格。

示例 3：
输入：s = "a good  example"
输出："example good a"
解释：如果两个单词间有多余的空格，颠倒后的字符串需要将单词间的空格减少到仅有一个。
```
解题思路：
- 移除多余空格
- 将整个字符串反转
- 将每个单词反转

```ts
function reverseWords(s: string): string {
  const strArr = s.split('');

  removeExtraSpace(s);
  const length = strArr.length;
  // 翻转整个字符串
  reverse(strArr, 0, length - 1);

  let start = 0, end = 0;
  while (start < length) {
    end = start;
    while (strArr[end] !== ' ' && end < length) {
      end++;
    }
    // 翻转单个单词
    reverse(strArr, start, end - 1);
    start = end + 1;
  }
  return strArr.join('');
  

  // 删除多余空格, 如'   hello     world   ' => 'hello world'
  function removeExtraSpace(s: string){
    let slowIndex = 0, fastIndex = 0; // 定义快慢指针
    const length = s.length;
  
    while (fastIndex < length) {
      // 移除开始位置和重复的空格
      if (strArr[fastIndex] == ' ' && (fastIndex == 0 || strArr[fastIndex - 1] == ' ')) {
        fastIndex++
      } else {
        strArr[slowIndex++] = strArr[fastIndex++]; 
      }
    }
  
    // 去掉字符串后面的空格。此时slowIndex为字符的最后有效长度
    if (strArr[slowIndex - 1] === ' ') {
      strArr.length = slowIndex - 1;
    } else {
      strArr.length = slowIndex;
    }
  }

  // 翻转字符串，如：'hello' => 'olleh'
  function reverse(strArr: string[], start: number, end: number) {
    while (start < end) {
      [strArr[end], strArr[start]] = [strArr[start], strArr[end]]
      start++;
      end--;
    }
  }
}
```