---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 有效的字母异位词
---


## 哈希表的三种结构
三种数据结构：
1. 数组
2. set
3. map

当遇到需要判断一个元素是否出现过的场景时，应该第一个想到用哈希表。

## 有效的字母异位词
[力扣题目链接](https://leetcode.cn/problems/valid-anagram/)

```js
function isAnagram(s: string, t: string): boolean {
  const len1 = s.length;
  const len2 = t.length;
  if (len1 !== len2) return false;

  let map = new Map();
  for (let i = 0; i < len1; i++){
    if (map.has(s[i])){
      map.set(s[i], map.get(s[i])+1)
    } else {
      map.set(s[i], 1)
    }
  }

  for (let j = 0; j < len2; j++){
    if (map.has(t[j])){
      map.set(t[j], map.get(t[j])-1)
    } else {
      map.set(t[j], 1)
    }

    if (map.get(t[j]) == 0) {
      map.delete(t[j])
    }
  }

  if (map.size == 0) {
    return true;
  }
  
  return false;
};

```

## 赎金信
[力扣题目链接](https://leetcode.cn/problems/ransom-note/)

```js
function canConstruct(ransomNote: string, magazine: string): boolean {
  const len1 = ransomNote.length;
  const len2 = magazine.length;
  // 如果 magazine 的长度小于 ransomNote，说明 ransomNote 的字母多
  if (len2 < len1) return false
  
  let map = new Map();
  for (let i = 0; i < len1; i++){
    if (map.has(ransomNote[i])) {
      map.set(ransomNote[i], map.get(ransomNote[i]) + 1);
    } else {
      map.set(ransomNote[i], 1);
    }
  }
  
  for (let j = 0; j < len2; j++){
    if (map.has(magazine[j])) {
      map.set(magazine[j], map.get(magazine[j]) - 1);
      if (map.get(magazine[j]) == 0) {
        map.delete(magazine[j]);
      }
    }
  }
  
  if (map.size == 0) {
    return true;
  }

  return false;
};
```

## 字母异位词分组
[力扣题目链接](https://leetcode.cn/problems/group-anagrams/)

```js
function groupAnagrams(strs: string[]): string[][] {
  let map = new Map();
  // 对字母进行排序：'eat'->'aet' ,'tea' -> 'aet'
  const getSort = (s: string) => {
    return s.split('').sort().join('');
  }

  // 遍历数组
  for (let i of strs) {
    const sortResult = getSort(i);
    // 键排序后的结果作为键，排序之前的放入数组中，作为值
    if (map.has(sortResult)) {
      map.get(sortResult).push(i)
    } else {
      map.set(sortResult, [i])
    }
  }
  
  // 扩展运算符和for...of循环获取values的结果是一样的
  return [...map.values()];
};
```

## 找到字符串中所有字母异位词
[力扣题目链接](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)
```typescript
var findAnagrams = function (s:string, p:string) :number[]{
  const pLen = p.length
  const res: number[] = [] // 返回值
  const map = new Map() // 存储 p 的字符
  for (let item of p) {
    map.set(item, map.get(item) ? map.get(item) + 1 : 1)
  }
  // 存储窗口里的字符情况
  const window = new Map()
  let valid = 0 // 有效字符个数

  for (let i = 0; i < s.length; i++) {
    const right = s[i]
    // 向右扩展
    window.set(right, window.get(right) ? window.get(right) + 1 : 1)
    // 扩展的节点值是否满足有效字符
    if (window.get(right) === map.get(right)) {
      valid++
    }
    if (i >= pLen) {
      // 移动窗口 -- 超出之后，收缩回来， 这是 pLen 长度的固定窗口
      const left = s[i - pLen]
      // 原本是匹配的，现在移出去了，肯定就不匹配了
      if (window.get(left) === map.get(left)) {
        valid--
      }
      window.set(left, window.get(left) - 1)
    }
    // 如果有效字符数量和存储 p 的map 的数量一致，则当前窗口的首字符保存起来
    if (valid === map.size) {
      res.push(i - pLen + 1)
    }
  }
  return res
}
```