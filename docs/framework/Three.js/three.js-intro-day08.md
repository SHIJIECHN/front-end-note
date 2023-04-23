---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 镜头
---

## 镜头类型

| 镜头类型（都继承于Camera） | 镜头名称   | 解释说明                                     |
| -------------------------- | ---------- | -------------------------------------------- |
| ArrayCamera                | 镜头这列   | 一组已预定义的镜头                           |
| CubeCamera                 | 立方体镜头 | 6个面的镜头（前、后、左、右、顶、底          |
| OrthographicCamera         | 正交镜头   | 无论物体距离镜头远近，最终渲染出的大小不变   |
| PerspectiveCamera          | 透视镜头   | 像人眼睛一样的镜头，远小近大，最常用的镜头   |
| stereoCamera               | 立方镜头   | 双透视镜头，常用于创建3D立方体影像或视差屏障 |

所有镜头的辅助对象都是：CameraHelper.

- 平截面
  - 远截面（far）：物体最远处的界面
  - 近界面（near）：物体最近出的界面
- 视锥
  - 镜头的观察角度（fov）：默认值50
  - 镜头画面的宽高比（aspect）：默认值2
  - 镜头的最近可见距离（far）：默认值2000
  - 镜头的最远可见距离（near）：默认值0.1
  - 一个隐含因素：镜头本身的位置（camera.postion）

## CameraHelper

镜头辅助对象来观察镜头。

```javascript
const helper = new CameraHelper(leftCamera);
scene.add(helper);
```

- 统一个场景渲染2个不同的画面
  - 2个画面：添加两个镜头，每个镜头设置不同
  - 2个交互：添加左右2个div、2个OrbitControls覆盖于canvas之上
  - 渲染2个画面：使用渲染器的裁减功能
    - setScissor(x, y, width, height)：将剪裁区域设置为(x,y)到(x + width, y + height)
    - setScieeorTarget(boolean)：启用或禁用剪裁检测。若启用，则只有在所定义的剪裁区域内的像素才会受之后的渲染器影响
    - setViewPort(x, y, width, height)：将视口大小设置为(x, y)到(x + width, y + height)

