---
autoGroup-3: Node基础
sidebarDepth: 3
title:  3. commonJS、后端的分层
---

## 分层
刚开始分层：    
controller：处理用户请求和相关逻辑。
Model：数据库。    
后来，从controller中分出一层view。
view：视图。
controller：控制器。   
Model：数据库。  

1. web层（controller）：直接喝用户交互：用户权限校验、数据封装、数据正确或者错误的用户提示。
2. 业务逻辑层（server层， 具体的就是：LoginService）：处理后端的业务。
3. DAO（data access object，数据进入对象）：数据进入数据库前的数据操作，对象转为数据，数据转为对象。
   1. 读取：数据转换成对象，发给前端
   2. 写入：对象转换成数据，写入数据库
4. 持久层：数据库。管理数据间的对应关系。关系型：mySql、Oracle、DB2。非关系型：MongoDB，Redis，HBase

### 1. 案例：用户登录
LoginServer
   1. web层（LoginController）：获取到用户名和密码，传入逻辑层中进行比对。
   2. 逻辑层LoginService：比对web层和DAO层传入的用户名和密码
   3. DAO：取出用户名和密码，放到逻辑层中进行比对。


## CommonJS
1. 一个文件就是一个模块，拥有单独的作用域；（kiss原则）
2. 普通方式定义的变量、函数、对象，都属于模块内部
3. require()
4. exports，module.exports导出相应模块

