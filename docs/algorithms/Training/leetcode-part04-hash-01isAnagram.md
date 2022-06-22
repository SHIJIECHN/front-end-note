---
autoGroup-4: 哈希表
sidebarDepth: 3
title: 链表相交
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