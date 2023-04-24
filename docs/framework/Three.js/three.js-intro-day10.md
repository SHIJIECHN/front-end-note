---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 雾气
---

## 雾（Fog）

特点：
1. 越靠近镜头，雾气越小
2. 越远离镜头，雾气越大
3. 雾气本身只会影响物体的渲染效果，但雾气本身并不会流动
4. 默认所有材质都可以被雾影响，若某物体不想被雾影响，可以将该物体材质的fog属性设置为false

雾的类型：

| 雾的类型 | 名称   | 解释                     |
| -------- | ------ | ------------------------ |
| Fog      | 雾     | 雾的密度随着距离线性增大 |
| FogExp2  | 指数雾 | 雾的密度随着距离指数增大 |

```javascript
const fog = new Fog(color:Interger, near: Float, fa: Float);
```
- color: 雾的颜色
- near：开始应用雾的最小距离，默认值为1
- far：应用雾的最大距离，默认值为1000

```javascript
const fog = new FogExp2(color: Interger, density: Float)
```
- color: 雾的颜色
- density：定义雾的魔都将会增加的有多快，默认值为0.00025

将雾添加到场景中：

```javascript
scene.fog = new Fog(0xFFFFFF, 10, 100);
// 或
scene.fog = new FogExp2(0xFFFFFF, 0.001);
```

所有材质都会受到雾的影响，若希望物体不受雾的影响（即使物体处于雾气当中），那么可以将物体材质fog属性设置为false即可。

```javascript
colors.forEach((color, index)=>{
  const mat = new MeshPhongMaterial({
    color,
    fog: index === 1 ? false : true // 让中间的立方体的材质不受雾的影响
  });
  const geo = new BoxGeometry(1,1,1);
  const mesh = new Mesh(geo, mat);
  mesh.position.set((index - 1) * 2, 0, 0)
  scene.add(mesh);
  boxes.push(mesh);
})
```

## Render Targets(离屏渲染)

- 普通渲染：使用渲染器WebGLRender创建渲染器实例，根据场景、灯光、场景中的物体来渲染到网页中，渲染结果直接出现在网页中。
- 离屏渲染：渲染器会渲染场景，但是不会把渲染结果直接呈现在网页中，而是把渲染结果保存到GPU内部中，此时暂存到GPU中的渲染结果（图片）可以被当做一种纹理（texture），使用到其他物体中。

离屏渲染的种类

| 离屏渲染类型                 | 名称及解释                 |
| ---------------------------- | -------------------------- |
| WebGLMultisampleRenderTarget | WebGL 2 对应的离屏渲染     |
| WebGLRenderTarget            | WebGLRender 对应的离屏渲染 |
| WebGLCubeRenderTarget        | CubeCamera对应的离屏渲染   |

离屏渲染流程：

1. 创建一个子场景
2. 创建一个总场景、一个渲染器、一面镜子
3. 使用总场景的渲染器，对子场景进行渲染，得到一个离屏渲染结果（图像纹理）。由于时候离屏渲染，只是将渲染出的视觉效果保存到GPU内存中，网页中并不会显示离屏渲染结果
4. 将离屏渲染结果作为一个纹理，作用在镜子面上
5. 使用总场景的渲染器，将镜子渲染到网页中


创建离屏渲染对象

```javascript
const rendererTarget = new WebGLRenderTarget(512, 512); // 创建离屏渲染对象
```

创建材质，并将材质纹理与离屏渲染对象的渲染结果纹理进行绑定

```javascript
const materials = new MeshPhongMaterial({
  map: rendererTarget.texture // 将离屏渲染结果作为一个纹理，作用在镜子面上
})
```

修改渲染器的渲染目标，让渲染器去渲染离屏渲染对象，当渲染完成后再清楚（恢复）渲染器的渲染目标

```javascript
// 总渲染器控制子场景中的立方体，让他们不停旋转
rtBoxes.forEach((item)=>{
  item.rotation.set(time, time, 0);
})
//修改渲染器的渲染目标，让渲染器去渲染离屏渲染对象，当渲染完成后再清楚（恢复）渲染器的渲染目标
renderer.setRenderTarget(rendererTarget);
renderer.render(rtScene, rtCamera);
renderer.setRenderTarget(null);

cubeMesh.rotation.set(time, time, 0);
renderer.render(scene, camera); // 使用渲染器把镜子和立方体进行渲染输出
```

再使用渲染器把镜子和立方体进行渲染输出

```javascript
renderer.render(scene, camera); 
```


遵循以下原则：离线渲染目标的宽高比、子场景中镜头的宽高比、总场景中物体被渲染的面的宽高比，这3者保持一致，这样就不会变形。


## 4大数据缓冲

1. 颜色缓冲
2. 像素缓冲
3. 深度缓冲：depth buffer
4. 模板缓冲：stencil buffer

离屏渲染目标除了得到并保存渲染目标对应的图片纹理外，还会额外创建颜色纹理和深度模板纹理。图片纹理中就使用了像素缓冲。

如果不需要深度缓冲，可以在离屏渲染目标初始化的时候，直接设置不需要创建深度缓冲和模板缓冲，以节省性能

```javascript
const rendererTarget = new WebGLRenderTarget(512, 512, {
  depthBuffer: false,
  stencilBuffer: false
});
```