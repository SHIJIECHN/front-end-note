---
autoGroup-1: Three.js新手上路
sidebarDepth: 3
title: 第一个3D场景
---

## 三个顶层总对象
1. 场景：THREE.Scene()
2. 相机：THREE.OrthographicCamera()
3. 渲染器：THREE.WebGLRenderer()

## 场景
THREE.Scene()
```javascript
var scene = new THREE.Scene();
```

### 1. 网格模型
```javascript
// var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
var geometry = new THREE.BoxGeometry(200, 200, 200); //创建一个立方体几何对象Geometry
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中
```

### 2. 光照
```javascript
//点光源
var point = new THREE.PointLight(0xffffff);
point.position.set(400, 200, 300); //点光源位置
scene.add(point); //点光源添加到场景中
//环境光
var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);
```

总结：
1. 使用add()方法把三维场景的子对象添加到场景中

## 相机
```javascript
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(250, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```


## 渲染器
```javascript
/**
 * 创建渲染器对象
 */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera); // 相当于告诉浏览器根据相机的放置方式拍摄已经创建好的三维场景对象
```
总结：
1. 每执行一次renderer.render()，浏览器就会渲染出一帧图像。

## 旋转动画
### 1. setInterval 周期性渲染
```javascript
// 渲染函数
function render() {
    renderer.render(scene,camera);//执行渲染操作
    mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
}
//间隔20ms周期性调用函数fun,20ms也就是刷新频率是50FPS(1s/20ms)，每秒渲染50次
setInterval("render()",20);
```

### 2. requestAnimationFrame()
requestAnimationFrame()调用一个函数不是立即调用而是向浏览器发起一个执行某函数的请求， 什么时候会执行由浏览器决定。一般默认保持60FPS的频率，大约每16.7ms调用一次requestAnimationFrame()方法指定的函数。
```javascript
function render() {
    renderer.render(scene,camera);//执行渲染操作
    mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
    requestAnimationFrame(render);//请求再次执行渲染函数render
}
render();
```

### 3. 均匀旋转
```javascript
let T0 = new Date();//上次时间
function render() {
    let T1 = new Date();//本次时间
    let t = T1-T0;//时间差
    T0 = T1;//把本次时间赋值给上次时间
    requestAnimationFrame(render);
    renderer.render(scene,camera);//执行渲染操作
    mesh.rotateY(0.001*t);//旋转角速度0.001弧度每毫秒
}
render();
```

## 鼠标操作
OrbitControls：http://www.yanhuangxueyuan.com/threejs/examples/js/controls/OrbitControls.js
```javascript
function render() {
  renderer.render(scene,camera);//执行渲染操作
}
render();
var controls = new THREE.OrbitControls(camera,renderer.domElement);//创建控件对象
controls.addEventListener('change', render);//监听鼠标、键盘事件
```
使用requestAnimationFrame()
```javascript
function render() {
  renderer.render(scene,camera);//执行渲染操作
  // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
  requestAnimationFrame(render);//请求再次执行渲染函数render
}
render();
var controls = new THREE.OrbitControls(camera,renderer.domElement);//创建控件对象
// 已经通过requestAnimationFrame(render);周期性执行render函数，没必要再通过监听鼠标事件执行render函数
// controls.addEventListener('change', render)
```

## 场景插入新的几何体
几何体类别
```javascript
/长方体 参数：长，宽，高
var geometry = new THREE.BoxGeometry(100, 100, 100);
// 球体 参数：半径60  经纬度细分数40,40
var geometry = new THREE.SphereGeometry(60, 40, 40);
// 圆柱  参数：圆柱面顶部、底部直径50,50   高度100  圆周分段数
var geometry = new THREE.CylinderGeometry( 50, 50, 100, 25 );
// 正八面体
var geometry = new THREE.OctahedronGeometry(50);
// 正十二面体
var geometry = new THREE.DodecahedronGeometry(50);
// 正二十面体
var geometry = new THREE.IcosahedronGeometry(50);
```
立方体、球体和圆柱体的网格模型
```javascript
// 立方体网格模型
var geometry = new THREE.BoxGeometry(200, 200, 200); //创建一个立方体几何对象Geometry
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
var mesh1 = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh1); //网格模型添加到场景中

// 球体网格模型
var geometry2 = new THREE.SphereGeometry(60, 40, 40);
var material2 = new THREE.MeshLambertMaterial({
  color: 0xff00ff
})
var mesh2 = new THREE.Mesh(geometry2, material2); // //网格模型对象Mesh
mesh2.translateY(120)//球体网格模型沿Y轴正方向平移120
scene.add(mesh2);

// 圆柱网格模型
var geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25);
var material3 = new THREE.MeshLambertMaterial({
  color: 0xffff00
})
var mesh3 = new THREE.Mesh(geometry3, material3); // //网格模型对象Mesh
// mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
mesh3.position.set(120, 0, 0); //设置mesh3模型对象的xyz坐标为120,0,0
scene.add(mesh3);

// 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
var axisHelper = new THREE.AxisHelper(250);
scene.add(axisHelper);
```

## 材质效果
### 1. 半透明效果
```javascript
var sphereMaterial=new THREE.MeshLambertMaterial({
    color:0xff0000,
    opacity:0.7,
    transparent:true
});//材质对象
```
材质常见属性：
1. color：材质颜色
2. wireframe：将几何图形渲染为线框。默认false
3. opacity：透明度。0标识完全透明，1表示完全不透明
4. transparent：是否开启透明，默认false

### 2. 高光效果
- 镜面反射：MeshPhongMaterial()
- 漫反射：MeshLambertMaterial()

```javascript
var material2 = new THREE.MeshPhongMaterial({
  color: 0xff00ff,
  specular: 0x4488ee, // 网格球面高光颜色
  shininess: 12 // 光照强度系数
})
```

### 3. 材质类型
1. MeshBasicMaterial：基础网格材质，不受光照影响的材质
2. MeshLambertMaterial：Lambert网格材质，与光照有反应，漫反射
3. MeshPhongMaterial：高光Phong材质,与光照有反应
4. MeshStandardMaterial：BR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃等效果

## 光照效果
常见光源类型
1. AmbientLight：环境光
2. PointLight：点光源
3. DirectionalLight：平行光，比如太阳光
4. SpotLight：聚光源

```javascript
//点光源
var point = new THREE.PointLight(0xffffff);
point.position.set(400, 200, 300); //点光源位置
// 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
scene.add(point); //点光源添加到场景中

// 多个光源
var point2 = new THREE.PointLight(0xffffff);
point2.position.set(-400, -200, -300);
scene.add(point2);

//环境光  
// 环境光颜色与网格模型的颜色进行RGB进行乘法运算
// 环境光只是设置整个空间的明暗效果
var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);
```