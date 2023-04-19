---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 材质
---

## 材质

即线段属性后物体表面的颜色、贴图、光亮程度、反射特性、粗糙度等属性。

按照用途，材质答题分为：

1. 点材质：应用在点、粒子上
2. 线性材质：线段、虚线
3. 基础材质：应用在面上的各种材质
4. 特殊用途的材质：阴影
5. 自定义材质

- 材质基础：
  - Material：所有材质的父类
- 点材质：
  - PointsMaterial：点材质（粒子材质）。用于创建粒子属性
- 线性材质：
  - LineBasicMaterial：线段材质（颜色、宽度、断电、连接点等属性）
  - LineDashedMaterial：虚线材质。继承于LineBasicMaterial，用来绘制虚线
- 基础材质（针对面）
  - MeshBasicMaterial：最基础的材质，不反射光，仅显示材质本身的颜色
  - MeshLambertMaterial：仅顶点处反射光
  - MeshMatcapMaterial：自带光效（明暗）的材质
  - MeshPhongMaterial：任何点都反射光，拥有光泽度
  - MeshToonMaterial：卡通着色
  - MeshStandardMaterial：除光泽度外，还有粗糙度和金属度
  - MeshPhysicalMaterial：除光泽度、粗糙度、金属度外，还有清漆度和清漆粗糙度
- 特殊用途材质
  - shadowMaterial：阴影材质
  - MeshDistanceMaterial：另一种阴影投影材质
  - MeshDeptMaterial：远近距离深度着色材质
  - MeshNormalMaterial：网格法向量材质
  - SpriteMaterial：精灵材质/雪碧材质
- 自定义材质
  - ShaderMaterial：着色器材质
  - RawShaderMaterial：原始着色器材质

## MeshPhongMaterial

MeshPhongMaterial可以作为其他材质的参考对象：

1. 比MeshPhoneMaterial简单的有MeshBasicMaterial、MeshaLamberMaterial
2. 和MeshPhongMaterial相似的有MeshToonMaterial
3. 比MeshPhongMaterial复杂的有MeshStandardMaterial、MeshPhysicalMaterial


### 1. Phong

Phong光照模型：是最简单、最基础的光照模型，该模型只考虑物体对直线光的反射作用，不考虑物体之间的漫反射光（环境光）

Phong的假设前提：
1. 物体通常被设置为不透明
2. 物体表面发射率相同

创建：

```javascript
const material = new MeshPhongMaterial({
    color: 0xff0000,
    flatShading: true
})
```
或者

```javascript
const material = new MeshPhongMaterial();
material.color.setHSL(0, 1, .5);
material.flatShading = true;
```

设置颜色的多种方式

```javascript
material.color.set(0x00FFFF);
material.color.set('red');
material.color.set(rgb(255, 127, 64));
material.color.set(hsl(180, 50%, 25%));
material.color.setHSL(h, s, l);
material.color.setRGB(r, g, b)
```

### 2. Phong的属性

- flatShading：平面着色。
  - 它不是由MeshPhongMaterial定义的，而是由父类Material定义的。
  - 值是布尔值，指是否启用平面着色模式。默认false，即不启用平面着色模式
- emissive（发光颜色）
  - color指材质的颜色，而emissive指材质的发光色
  - 如果color设置为黑色，emissive设置为某色，那么此时材质就是呈现emissive颜色
- shininess（光泽度）：数字
  - 默认值为30
  - 最小值为0，即无光泽度，此时效果于Lambert相同
  - 该值越大，光泽度越高，呈现的效果越接近高清玻璃或钢琴烤漆的那种光泽感

### 3. 着色

含义：根据光照条件重建物体各表面明暗效果的过程，就叫着色。

常见的3中着色算法（模式）：
- Flat Shading: 平面着色。
  - 根据每个三角形的发现计算着色效果，每个面只计算一次
- Gouraud Shading：逐顶着色。
  - 针对每个顶点计算，而后对每个顶点的计算结果颜色进行线性插值得到片源的颜色
- Phong Shading：补色渲染。
  - 对每个三角形的每个片元进行着色计算，所以又称为逐片元着色

### 4. 冯氏光照模型

冯氏光照模型主要又三个分量：

- 环境光照（Ambient Lighting）：物体几乎永远不会是完全黑暗的，环境光照是一个常量
- 漫反射光照（Diffuse Lighting）：模拟光源对物体的方向性影响，越是正对着光源的地方越亮
  - 通过计算物体平面某个点的法向量于该点于光源的单位向量进行乘积，得到该点的亮度
  - 当这两个向量相互重叠时该点最亮（亮度值为1），当这两个向量成90度则最暗（亮度值为0）
- 镜面光照（Specular Lighting）：模拟有光泽物体上面出现的亮点

冯氏着色法（Phong Shading）：每个片元或者每个点计算一次光照，点的法向量是通过顶点的法向量插值得到的。

Phong光照反射模型也被称为冯氏反射模型。

::: theorem 补充
1. MeshPhongMaterial中的Phong是指Phong光照反射模型
2. Phong Shading中的Phong只指补色渲染（逐片元渲染）
:::


### 5. 比较

- MeshBasicMaterial：不反射任何光，仅显示材质本身颜色
- MeshLambertMaterial：仅顶点处反射光
- MeshPhongMaterial：任何地方都可反射光

## MeshToonMaterial

与MeshPhongMateri类似但是又不同。

MeshToonMaterial不是光滑着色，而是使用一个渐变贴图来决定如何着色。

如果没有设置纹理图片，则采用默认策略：默认使用的渐变贴图是前70%的部分使用70%的亮度，后30%的部分使用100%的亮度。

最终呈现出的效果，看起来特别像卡通动画的风格。所以MeshToonMaterial又被称为卡通网格材质。


## MeshStandardMaterial和MeshPhysicalMaterial

- Phong属性：shininess光泽度
- MeshStardardMaterial对应2个属性属性：
  - roughness：粗糙度，取值0-1，即0为粗糙度最低，此时表现的光泽度最高
  - metalness：金属度，取值0-1，即0为非金属、金属度最高为1
- MeshPhysicalMaterial继承与MeshStandardMaterial，新增2个属性：
  - clearcoat：添加（应用）透明涂层的程度，取值0-1
  - clearCoatRoughness：透明涂层的粗糙度，取值0-1

清漆：额外增加透明涂层。


## 材质通用两个属性

- flatShading
- side：显示三角形的哪侧边（面）
  - 默认值FontSide，即只显示（渲染）前面一侧的面
  - BackSize，只显示（渲染）里面一侧的面
  - DoubleSide：两侧（外面和里面）都将被显示（渲染）