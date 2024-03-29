---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 光照
---

## 光照

- 非反射光材质：MeshBasicMaterial。即使场景中没有任何光源，渲染后依然可以看见物体
- 反射光材质：MeshPhongMaterial。假设场景中没有任何光源，渲染出的结果将是一片漆黑，什么物体都看不见

种类：

有6中基础类型的灯管，都继承于Three.Light

| 灯光类型(都继承于Light) | 灯光名称           | 是否支持阴影 | 是否作用于全局(无处不在) | 是否有照射目标 |
| ----------------------- | ------------------ | ------------ | ------------------------ | -------------- |
| AmbientLight            | 环境光、氛围光     | 否           | 是                       | 无             |
| DirectionalLight        | 平行光             | 是           | 否                       | 有             |
| HemisphereLight         | 半球光源、户外光源 | 否           | 是                       | 无             |
| PointLight              | 点光源             | 是           | 否                       | 有             |
| RectAreaLight           | 矩形面光源         | 否           | 否                       | 无             |
| SpotLight               | 聚光灯光源         | 是           | 否                       | 有             |


3种光探针类型的环境光

| 灯光类型                                  | 灯光名称   |
| ----------------------------------------- | ---------- |
| LightProbe                                | 光探针     |
| AmbientLightProbe（继承于LightProbe）     | 环境光探针 |
| HeimisphereLightProbe（继承于LightProbe） | 半球光探针 |

光探针类型的的环境光更加适合运动类型的物体。

## 光的辅助对象

场景中的光本身是不可见的，为了方便观测光源，Three.js提供了光的辅助对象：DirectionalLightHelper、HemisphereLightHelper、PointLightHelper、RectAreaHelper、SpotLightHelper


光的辅助对象就是在渲染后出现的一些白色细线，这些白色细线指示出光源的位置、大小、以及光发射的方向。

光的辅助对象用法：
1. 先创建光的实例
2. 将创建好的光的 实例作为辅助对象构造函数的参数
3. 场景中添加辅助对象即可

```javascript
// 创建并设置平行光
const directionalLight = new DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 10, 0); // 灯光所在位置
directionalLight.target.position.set(-5, 0, 0); // 目标所在位置

// 将平行光添加到场景中
newScene.add(directionalLight);
newScene.add(directionalLight.target);

// 根据平行光实例，创建对应的辅助对象，并将辅助对象添加到场景中
const directionalLightHelper = new DirectionalLightHelper(directionalLight);
newScene.add(directionalLightHelper);
```


## OrbitControls

鼠标镜头轨道控件，可以通过鼠标来配置镜头的运动轨道，例如 缩放、平移、旋转。通过鼠标来改变镜头，以便查看不同角度下的场景。

基本用法：

```javascript
const controls = new OrbitControls(camera, canvasRef.current); // 实例化OrbitControls
controls.target.set(0, 5,0);// controls.target为镜头的坐标系统。意思时设置原点Y轴的坐标（以高出5米的轨道运行）
controls.update(); // 使空间使用新目标
```

onchang事件：监听鼠标或键盘的操作来修改镜头轨道

