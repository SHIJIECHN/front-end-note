---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 阴影
---

## LightShadow

所有的阴影的基类都是LightShadow，它是一个抽象类，不能直接实例化，只能通过其他的阴影类来创建阴影。

阴影类型

| 阴影类型（都继承于LightShadow） | 阴影名称   | 解释说明                 |
| ------------------------------- | ---------- | ------------------------ |
| PointLightShadow                | 点光源阴影 | 对应PointLight光源       |
| DirectionalLightShadow          | 平行光阴影 | 对应DirectionalLIght光源 |
| SpotLightShadow                 | 聚光灯阴影 | 对应SpotLight光源        |

注意：DirectionlLightShadow只能使用OrthographicCamera镜头来计算阴影，无法在PerspectiveCamera镜头下使用。

这是因为PerspectiveCamera镜头下，光线是会发散的，而OrthographicCamera镜头下，光线是平行的。

你无需创建阴影实例，阴影实例是由灯光内部创建的。

1. 平行光中的影子（DirectionalLightShadow）的镜头使用的是OrthographicCamera，不是PerspectiveCamera
2. 其他2中阴影PointLightShadow、SpotLightShadow镜头默认使用的是PerspectiveCamera

## 阴影贴图

默认情况下Three.js使用阴影贴图来绘制阴影。

阴影贴图：所谓“贴图”，可以想象成“一层层窗户纸”。

阴影的渲染需要大量的计算和性能。

降低阴影所需性能的解决办法：

方案1：可以有多个灯光，但只有一个平行光可产生阴影

方案2：使用光照贴图或环境光照遮挡贴图来预先计算离线照明的效果

方案3：使用假阴影，添加一个平面放到物体下方的地面上，同时赋予一个看着像阴影的纹理图片材质。


## 阴影渲染
1. 需要开启渲染器阴影渲染。

```javascript
renderer.shadowMap.enabled = true; // 开启渲染阴影
```

2. 灯光开启投影

```javascript
light.castShadow = true; // 开启投射阴影
```

3. 平面需要开启接收阴影渲染

```javascript
planeMesh.receiveShadow = true;
```

4. 物体需要开启接收和投射阴影

```javascript
boxMesh.castShadow = true; // 开启投影映射
boxMesh.receiveShadow = true; // 开启接收投影

sphereMesh.castShadow = true;
sphereMesh.receiveShadow = true;
```

1. 如果没有加入环境光，此时的阴影颜色为黑，加入环境光后，阴影会变浅，但是需要渲染器的useLegacyLights修改为false，按照物理矫正正确光照的模式来渲染场景，否则物体大片光亮。

```javascript
renderer.useLegacyLights = false;
// 添加半球环境光。
const hemisphereLight = new HemisphereLight(0xFFFFFF, 0x000000,2);
scene.add(hemisphereLight);
```

## 辅助函数

1. 坐标轴辅助对象
2. 光照辅助对像
3. 相机辅助对象
4. 阴影辅助对象

坐标轴辅助对象：

```javascript
const axes = new AxesHelper();
(axes.material as Material).depthTest = false;
axes.renderOrder = 1;
light.add(axes);
scene.add(light);
scene.add(light.target);
```

光照辅助对象：

```javascript
const lightHelper = new DirectionalLightHelper(light);
scene.add(lightHelper);
```

相机辅助对象：

```javascript
const helperCamera = new PerspectiveCamera(45, 2, 5, 100);
helperCamera.position.set(20, 10, 20);
helperCamera.lookAt(0, 5, 0);
scene.add(helperCamera);

const cameraHelper = new CameraHelper(helperCamera);
scene.add(cameraHelper);
```

阴影辅助对象：

灯光中阴影的镜头对应的辅助对象，为了方便通过灯光的辅助对象来观察灯光所能投射的阴影可见区域

```javascript
// light为平行光
const shadowCamera = light.shadow.camera;
// 修正阴影镜头视锥的可见范围
shadowCamera.left = -10;
shadowCamera.right = 10;
shadowCamera.top = 10;
shadowCamera.bottom = -10;
shadowCamera.updateProjectionMatrix();
// 阴影辅助对象
const shadowHelper = new CameraHelper(shadowCamera);
scene.add(shadowHelper);
```




