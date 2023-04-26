---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 进阶
---

## 按需渲染

目前为止，问哦们的例中都是连续渲染的：

```javascript
const render = () => {
  ...
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

但是有些场景连续渲染是没有必要的。因此我们想只有在需要的时候在进行渲染。

- 两种情况：
  - 初始化的时候渲染
  - 窗口大小改变，自动渲染
  - 鼠标拖拽的时候渲染

初始化的时候渲染

```javascript
const render = ()=>{
  renderer.render(scene, camera);
}
window.requestAnimationFrame(render); // 场景只在初始化时渲染一次
```

窗口大小改变，自动渲染

```javascript
const handleResize = ()=>{
  if(canvasRef.current === null) return;
  const width = canvasRef.current.clientWidth;
  const height = canvasRef.current.clientHeight;
  camera.aspect = width /height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  window.requestAnimationFrame(render);// 触发重新渲染
  // 这里并不建议直接调用render()，而是选择window.requestAnimationFrame(render)
}
```

鼠标拖拽的时候渲染。OrbitControls提供了change事件来监听变化

```javascript
controls.addEventListener('change', render); // 当OrbitControls发生改变时，添加对应的事件处理函数，调用render重新渲染场景
```

OrbitControls有个选项增加某种惯性，让画面显得不那么僵硬。开启enableDamping来实现同时需要在渲染函数中调用control.update，这就意味着不呢个直接在change事件中调用render，这样会导致死循环。

控制器响应一个change事件然后调用render，然后render调用controls.update。这个方法会再调用change事件。所以通过是使用requestAnimationFrame调用render。

```javascript
controls.enableDamping = true;
```

## 画布

1. 创建画布截屏，并保存图片到本地
2. 设置不清楚画布内容
3. 获取键盘事件
4. 设置画布透明度
5. 设置画布为背景

