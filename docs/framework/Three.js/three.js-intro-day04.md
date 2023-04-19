---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 场景图
---

## 场景图（scene graph）

- 场景（Three.scene)是场景图中的一种
- 树和图的区分：
  - 树：一种分层数据的抽象模型
  - 图：网格结构的抽象模型，有一组由边连接的节点
- 场景图的数据结构是树

## 场景图（空间）的含义

场景即空间，而空间包含以下几种情况：
- 由Scene创建的普通场景，普通场景还可以添加雾。可以添加Object3D、Mesh
- 由Object3D创建的空白空间，可以添加Mesh
- 有Mesh创建的具体的物体所在的网格空间，可以添加其他的Mesh

场景的几个概念
- 一个局部的相对空间，即为一个场景
- 一个空间（场景）又可能是由几个子空间（场景）组合而成
- 表面上添加某场景，但实际上执行的是合并场景。sceneA.add(sceneB)即合并又独立
  - 独立：sceneB中的元素（物体、灯光）的坐标位置继续保持独立
  - 合并：sceneB中的元素（物体、灯管）被复制添加到其他场景中，例如场景B中的灯光影响场景C
- 一个子空间（场景）只需要关注和他最紧密相关的空间即可
  - 通过空间嵌套来改变原有的相对状态

## 场景（空间）常见操作
1. 将空间A加入到空间B：B.add(A)
2. 设置空间A在空间B中的位置：A.position.x = xxx

## 案例太阳系

1. 主场景Scene包含太阳系
2. 太阳系：太阳系本身+太阳+地球西（含月球系）
3. 地球系：地球系本身+地球+月球系
4. 月球系：月球系本身+月球

## AxesHelper类

通过给空间网格添加AxesHelper实例来让渲染的时候，显示出XYZ网格。

```javascript
nodeArr.forEach(item=>{
	const axes = new AxesHelper();
	const material = axes.material as Material;
	material.depthTest = false;
	axes.renderOrder = 1; // renderOrder的值默认为0，这里设置为1，目的是为了提高优先级，避免被物体本身给覆盖住
	item.add(axes)
})
```