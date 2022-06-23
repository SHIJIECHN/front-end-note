---
autoGroup-2: Vue
sidebarDepth: 3
title: Diff算法
---

## Diff
没有diff算法前，DOM更新：
1. 遍历老虚拟DOM
2. 遍历新虚拟DOM
3. 重新排序

diff算法优化规则：
1. 只比较同一层级，不跨级比较。
2. 标签名不同，直接删除并重新创建，不继续深度比较。
3. 标签名相同，key相同，就认为是相同节点，不继续深度比较。


## init
主要是通过patch函数实现，init函数执行就会生成patch函数。当patch传入两个vnode的时候，就会做比较，比较就会用到diff算法。
```javascript
function init(){
    return function patch(){
        // ...
    }
}
init(); 
// init()的返回值就是function patch
```
### 1. patch

#### isVnode
```javascript
function isVnode(vnode: any): vnode is VNode {
  // vnode.sel有值就返回true，没有值就返回false
  // sel 就是标签，如div#contaier
  // sel 是vnode结构存在的属性，真实的DOM是不存在的
  return vnode.sel !== undefined;
}

// container 时会进入
if (!isVnode(oldVnode)) {
    // 将真实DOM转成了虚拟DOM，oldVnode变成了虚拟DOM
    oldVnode = emptyNodeAt(oldVnode);
}
```
总结：isVnode：如果oldVnode是真实的DOM就会进入执行emptyNodeAt，也就是首次渲染的时候会执行。因为只有首次渲染的时候传入的是container真实DOM，视图更新传入的是vnode虚拟节点。

#### emptyNodeAt
```javascript
function emptyNodeAt(elm: Element) {
    const id = elm.id ? "#" + elm.id : "";
    const c = elm.className ? "." + elm.className.split(" ").join(".") : "";

    // 返回vnode函数执行的结果
    return vnode(
        api.tagName(elm).toLowerCase() + id + c,
        {},
        [],
        undefined,
        elm
    );
}

export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}

// vnode 简化
function vnode(sel, data, children, text, elm){
    return {sel, data, children, text, elm, key}
}
```
总结：emptyNodeAt：将container真实DOM元素转成vnode，同时vnode：{elm：container}，elm属性保存了container真实DOM元素。

#### sameVnode
```javascript
if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
} else {
    // 获取elm ->container，oldVnode：patch的第一个参数container
    elm = oldVnode.elm!;
    // 获取 container 的 parent，也就是 body
    parent = api.parentNode(elm) as Node;

    // vnode: patch的第二个参数。
    // 创建新的DOM元素
    createElm(vnode, insertedVnodeQueue);

    if (parent !== null) {
    // 将vnode.elm 插入到 parent 中。
    // 就是将新的元素插入到parent中，此时新的DOM元素和老的DOM元素同时存在
    api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
    // 移除老的DOM元素
    removeVnodes(parent, [oldVnode], 0, 0);
    }
}

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  // 比较标签和key值，都相同就返回true，就是 sel标签 和 key
  const isSameKey = vnode1.key === vnode2.key;
  const isSameIs = vnode1.data?.is === vnode2.data?.is;
  const isSameSel = vnode1.sel === vnode2.sel;

  return isSameSel && isSameKey && isSameIs;
}
```
总结：
1. 当新的vnode和oldvnode不是同一个元素，就是将vnode节点变成真实的DOM并插入到old元素的父级元素下，并移除old元素节点。
2. insertBefore：可以前面插入元素，也可以后面插入元素
3. 如果是相同元素就进入patchVnode函数中

#### createElm
```javascript
function creatElm(vnode, insertedVnodeQueue){
    // ...

    // 创建出一个真实的DOM
    return vnode.elm 
}
```

#### patchVnode
```javascript
function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNodeQueue
){
    // 作用是记录需要更新的节点
    const elm = vnode.elm = oldVnode.elm!;
    // 拿到两个子元素
    const oldCh = oldVnode.children as VNode[];
    const ch = vnode.children as VNode[];

    // ...

    // vnode: {tag, {}, 'xxx'} 或者 vnode:{tag, {}, []}
    // vnode {sel, data, children, text, elm, key}，
    // children和text只能有一个有值，或者都没有值
    // vnode是否有text，如果没有text，返回true
    if (isUndef(vnode.text)) {
        // 新的vnode有children，老的vnode也有children
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        // 新vnode 有children，老的vnode，无children
        // 有text -> 无text  text删除
        // 无children -> 有children 加上children
        if (isDef(oldVnode.text)) api.setTextContent(elm, "");
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        // 新vnode 无children 无text
        // 老vnode 有children 无text
        // 有children  -> 无children
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        // 新vnode 无text 无children
        // 老vnode 有text 无children
        // 有text -> 无text
        api.setTextContent(elm, "");
      }
    // 有text，无children  
    } else if (oldVnode.text !== vnode.text) {
      // oldVnode 有children，无text
      // 更新视图，新的更新老的
      //         text     无text
      //       无children  children
      // 新的无children，老的有children，当新的更新老的的时候，就直接移除老的children
      if (isDef(oldCh)) {
        // 移除 
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      // 插入text
      api.setTextContent(elm, vnode.text!);
    }
}
```
总结：
1. vnode有text，无children；有children，无text。
2. 当新vnode有text的时候，如果老的vnode有children，则直接移除老vnode 的children，并将新的text插入。
3. 新vnode无text。

####  updateChildren
```javascript
// init -> patch -> patchVode -> updateChildren

// 新的vnode有children，老的vnode也有children
  function updateChildren(
    parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue
  ) {
    // 四个指针指向两个列表的头尾: oldStartIndex oldEndIndex newStartIndex newEndIndex
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx: KeyToIndexMap | undefined;
    let idxInOld: number;
    let elmToMove: VNode;
    let before: any;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 四种极端情况
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];

      // 比较开头和结尾节点，如果相同就向下移动。
      // 头跟头比较，相同
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
    
      // 老的尾根新的头比较，相同
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];

      // 老的头跟新的尾比较，相同
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(
          parentElm,
          oldStartVnode.elm!,
          api.nextSibling(oldEndVnode.elm!)
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];

      // 老的尾跟新的头比较，相同
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];


      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key as string];
        if (isUndef(idxInOld)) {
          // New element
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!
          );
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(
              parentElm,
              createElm(newStartVnode, insertedVnodeQueue),
              oldStartVnode.elm!
            );
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(
          parentElm,
          before,
          newCh,
          newStartIdx,
          newEndIdx,
          insertedVnodeQueue
        );
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }
```