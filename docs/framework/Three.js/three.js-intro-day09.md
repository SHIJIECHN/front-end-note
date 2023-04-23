---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 阴影
---

## LightShadow

所有的阴影的基类都是LightShadow，它是一个抽象类，不能直接实例化，只能通过其他的阴影类来创建阴影。

阴影类型

| 阴影类型（都继承于LightShadow） | 阴影名称 | 解释说明|
| -------- | -------- | ------- |
|PointLightShadow|点光源阴影|对应PointLight光源|
|DirectionalLightShadow|平行光阴影|对应DirectionalLIght光源|
|SpotLightShadow|聚光灯阴影|对应SpotLight光源|

注意：DirectionlLightShadow只能使用OrthographicCamera镜头来计算阴影，无法在PerspectiveCamera镜头下使用。

这是因为PerspectiveCamera镜头下，光线是会发散的，而OrthographicCamera镜头下，光线是平行的。

你无需创建阴影实例，阴影实例是由灯光内部创建的。

## 阴影贴图

默认情况下Three.js使用阴影贴图来绘制阴影。

阴影贴图：所谓“贴图”，可以想象成“一层层窗户纸”。

阴影的渲染需要大量的计算和性能。

降低阴影所需性能的解决办法：

方案1：可以有多个灯光，但只有一个平行光可产生阴影

方案2：使用光照贴图或环境光照遮挡贴图来预先计算离线照明的效果

方案3：使用假阴影，添加一个平面放到物体下方的地面上，同时赋予一个看着像阴影的纹理图片材质。

