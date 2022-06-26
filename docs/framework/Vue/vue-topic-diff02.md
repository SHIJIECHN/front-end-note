---
autoGroup-3: 源码专题
sidebarDepth: 3
title:  1. Diff算法（二）
---

## 什么是diff
diff算法是一种通过同层的树节点进行比较的高效算法。   
两个特点：
1. 比较只会在同层级进行比较，不会跨层比较
2. 在diff比较的过程中，循环从两边向中间比较

在vue中，diff算法作为虚拟dom的新旧VNode节点比较。

## 比较方式
diff整体策略为：深度优先，同层比较。

1. 比较只会在同层级进行，不会跨层级比较
<img :src="$withBase('/framework/Vue/diff01.png')" alt="diff" />

2. 比较的过程中，循环从两边向中间收拢
<img :src="$withBase('/framework/Vue/diff02.png')" alt="diff" />

## diff流程
### 1. 第一步
vue的虚拟dom渲染真实dom的过程首先会对新老VNode的开始和结束位置进行标记：oldStartIndex、oldEndIndex、newStartIndex、newEndIndex。
```javascript
let oldStartIdx = 0 // 旧节点开始下标
let newStartIdx = 0 // 新节点开始下标
let oldEndIdx = oldCh.length - 1 // 旧节点结束下标
let oldStartVnode = oldCh[0]  // 旧节点开始vnode
let oldEndVnode = oldCh[oldEndIdx] // 旧节点结束vnode
let newEndIdx = newCh.length - 1 // 新节点结束下标
let newStartVnode = newCh[0] // 新节点开始vnode
let newEndVnode = newCh[newEndIdx] // 新节点结束vnode
```
经过第一步之后，初始的新旧VNode节点为：
<img :src="$withBase('/framework/Vue/diff03.png')" alt="diff" />


### 2. 第二步
标记好节点位置后，就开始进入到while循环处理中，这里是diff算法的核心流程，分情况进行了新老节点的比较并移动对应的VNode节点。while循环的退出条件是直到老节点或新节点的开始位置大于结束位置。
```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    ....//处理逻辑
}
```
while 循环中的处理逻辑， 循环过程中首先对新老 VNode 节点的头尾进行比较，寻找相同节点，如果有相同节点满足 sameVnode（可以复用的相同节点） 则直接进行 patchVnode (该方法进行节点复用处理)，并且根据具体情形，移动新老节点的 VNode 索引，以便进入下一次循环处理，一共有 2 * 2 = 4 种情形。下面根据代码展开分析:

#### 情形一
当新老 VNode 节点的 start 满足 sameVnode 时，直接 patchVnode 即可，同时新老 VNode 节点的开始索引都加 1。
```javascript
 if (sameVnode(oldStartVnode, newStartVnode)) {
    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
    oldStartVnode = oldCh[++oldStartIdx]
    newStartVnode = newCh[++newStartIdx]
}
```

#### 情形二
当新老 VNode 节点的 end 满足 sameVnode 时，同样直接 patchVnode 即可，同时新老 VNode 节点的结束索引都减 1。
```javascript
else if (sameVnode(oldEndVnode, newEndVnode)) {
    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
    oldEndVnode = oldCh[--oldEndIdx]
    newEndVnode = newCh[--newEndIdx]
}
```

#### 情形三
当老 VNode 节点的 start 和新 VNode 节点的 end 满足 sameVnode 时，这说明这次数据更新后 oldStartVnode 已经跑到了 oldEndVnode 后面去了。这时候在 patchVnode 后，还需要将当前真实 dom 节点移动到 oldEndVnode 的后面，同时老 VNode 节点开始索引加 1，新 VNode 节点的结束索引减 1。
```javascript
else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
    oldStartVnode = oldCh[++oldStartIdx]
    newEndVnode = newCh[--newEndIdx]
}
```
#### 情形四
当老 VNode 节点的 end 和新 VNode 节点的 start 满足 sameVnode 时，这说明这次数据更新后 oldEndVnode 跑到了 oldStartVnode 的前面去了。这时候在 patchVnode 后，还需要将当前真实 dom 节点移动到 oldStartVnode 的前面，同时老 VNode 节点结束索引减 1，新 VNode 节点的开始索引加 1。
```javascript
else if (sameVnode(oldEndVnode, newStartVnode)){
    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
    oldEndVnode = oldCh[--oldEndIdx]
    newStartVnode = newCh[++newStartIdx]
}
```
#### 如果都不满足以上四种情形
说明没有相同的节点可以复用，则通过单点遍历查找。
1. 以旧VNode为key值，对应的index序列为value值的哈希表。
2. 拿到新VNode的newStartVnode，判断它的key是否存在上面的哈希表中。
3. 不存在，则新建DOM，并插入oldStartVnode前面
4. 存在，继续判断是否为sameVnode，如果相同，直接移动到oldStartVnode前面。如果不同，直接创建插入oldStartVnode前面。
```javascript
else {
    // 没有找到相同的可以复用的节点，则新建节点处理
    /* 
        生成一个key与旧VNode的key对应的哈希表（只有第一次进来undefined的时候会生成，
        也为后面检测重复的key值做铺垫） 
        比如childre是这样的 [{xx: xx, key: 'key0'}, {xx: xx, key: 'key1'}, {xx: xx, key: 'key2'}]
        beginIdx = 0 endIdx = 2 结果生成{key0: 0, key1: 1, key2: 2} 
    */
    if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
    /*
        如果newStartVnode新的VNode节点存在key并且这个key在oldVnode
        中能找到则返回这个节点的idxInOld（即第几个节点，下标）
    */
    idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
    if (isUndef(idxInOld)) { // New element
        /*newStartVnode没有key或者是该key没有在老节点中找到则创建一个新的节点*/
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
    } else {
        /*获取同key的老节点*/
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
        /*如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode*/
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        //因为已经patchVnode进去了，所以将这个老节点赋值undefined
        oldCh[idxInOld] = undefined
        /*当有标识位canMove时可以直接插入oldStartVnode对应的真实Dom节点前面*/
        canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
        // same key but different element. treat as new element
        /*
            当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag
            不一样或者是有不一样type的input标签），创建一个新的节点
        */
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
    }
    newStartVnode = newCh[++newStartIdx]
}

```

再来看我们的实例，第一次循环后，找到了旧节点的末尾和新节点的开头(都是 D)相同，于是直接复用 D 节点作为 diff 后创建的第一个真实节点。同时旧节点的 endIndex 移动到了 C，新节点的 startIndex 移动到了 C。
<img :src="$withBase('/framework/Vue/diff04.png')" alt="diff" />

### 3. 第三步

