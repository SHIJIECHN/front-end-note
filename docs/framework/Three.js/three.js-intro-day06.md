---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 纹理
---

## 纹理（Texture）

纹理：设置物体表面贴合的彩色图片。指物体光滑表面上的彩色图案。
- 使用纹理加载器TextureLoader加载外部图片
- 通过设置物体的.map属性，降价在得到的外部图片贴合在物体表面

```javascript
const loader = new TextureLoader();
const material = new MeshBasicMaterial({
    map: loader.load('xxx/xxx.jpg')
})
```

多个纹理贴图

```javascript
const loader = new TextureLoader();
const imgSrcArr = [imgSrc1, imgSrc2,imgSrc3,imgSrc4,imgSrc5,imgSrc6];
// 创建一组材质,每个次啊之对应立方体每个面所用到的材质
const materialArr : MeshBasicMaterial[] = [];
imgSrcArr.forEach((src)=>{
  materialArr.push(new MeshBasicMaterial({
    map: loader.load(src)
  }))
})
```

## 纹理加载器的不同事件回调函数

```javascript
const loader = new TextureLoader();
const material = new MeshBasicMaterial({
  // loader.load('xxx.jpg')返回值为Text类型实例
  map: loader.load(imgSrc,
    (texture)=>{
      console.log('纹理图片加载完成');
      console.log(texture);
      console.log(texture.image.currentSrc) // 图片实际加载的地址
    },
    (event)=>{
      console.log('纹理图片加载中');
      console.log(event)
    },
    (error)=>{
      console.log('纹理图片加载失败');
      console.log(error);
    }
    ),
});
```

## 纹理加载管理器

使用纹理加载管理器可以监控多个图片资源的加载。

1. 新建一个LoadingManager实例
2. 把该实例传递给TextureLoader的构造函数
   
