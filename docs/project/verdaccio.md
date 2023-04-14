---
autoGroup-1: 项目相关
sidebarDepth: 3
title:  verdaccio本地npm私服搭建
---

## 1. 依赖安装

1.  verdaccio全局安装

```javascript
npm i -g verdaccio
```

2. 启动verdaccio

```javascript
// 直接启动，不推荐
verdaccio
```

打开浏览器访问：http://localhost:4873可以看到页面。

3. 使用pm2进程管理启动verdaccio
```javascript
// 推荐使用 pm2 启动 verdaccio
npm i -g pm2
```

启动：由于安装包的位置与全局安装包存放位置不同（npm root -g查看包所在位置），不可以直接使用pm2 start verdaccio启动。使用下面命令：

```javascript
pm2 start D:\software\nodejs\node_modules\verdaccio\bin\verdaccio
```

启动后可以查看日志：

```javascript
pm2 log
```

在路径C:\Users\shijie03\AppData\Roaming\verdaccio下生成config.yaml。修该配置config.yaml文件后，可以通过外网http://10.246.40.134:4873访问页面:
```yaml
// ...
# log settings
logs:
  - {type: stdout, format: pretty, level: http}
  #- {type: file, path: sinopia.log, level: info}

# 外网访问 没有配置只能本机访问
listen: 0.0.0.0:4873
```

## 配置流程

### 1， 添加源地址

使用nrm管理包

```javascript
npm i -g nrm

// 查看可选源，* 代表正在使用的源
nrm ls

// 添加一个私有npm源，verdaccio 为自定义的源地址名称
nrm add verdaccio http://localhost:4873/

// 使用源地址
nrm use verdaccio
```

### 2. 添加用户

```javascript
// 添加用户前，先启动verdaccio。注意：密码不小于8位
npm adduser --registry http://localhost:4873/

// 依次输入用户名邮箱数据
Username: test
Password:
Email: (this IS public) 
Logged in as test on http://localhost:4873/.
```

添加用户出现错误：

FetchError: request to http://10.246.40.134/4873/-/v1/login failed, reason: connect ECONNREFUSED 10.246.40.134:80

原因：没有切换到源verdaccio，而在默认的源上。需要切换源。如果还不可以，尝试执行：

```javascript
npm config set proxy null
npm config set https-proxy null
npm config set registry http://registry.npmjs.org/
```

### 3. 发布

切换到要发布的包目录下：E:\TODO\login-module\my-app\login_module。

```javascript
// 登录
npm login --registry http://localhost:4873/

// 发布
npm publish --registry http://localhost:4873/
```

发布出现错误：

```javascript
npm notice
npm notice package: login_module@1.0.0
npm notice === Tarball Contents ===
npm notice 90B  index.js
npm notice 353B package.json
npm notice === Tarball Details ===
npm notice name:          login_module
npm notice version:       1.0.0
npm notice package size:  403 B
npm notice unpacked size: 443 B
npm notice shasum:        c3493e0f2931fc0219daa2cee0f3a7330f56c5e3
npm notice integrity:     sha512-hW3mXeSqRPmaW[...]ICA8K4C46Htrg==
npm notice total files:   2
npm notice
npm ERR! code E401
npm ERR! Unable to authenticate, your authentication token seems to be invalid.
npm ERR! To correct this please trying logging in again with:
npm ERR!     npm login

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\shijie03\AppData\Roaming\npm-cache\_logs\2023-04-12T07_09_55_193Z-debug.log
```

原因是没有在当前目录下进行登录，直接npm publish.

至此，本地搭建verdaccio私服托管npm包完成。




