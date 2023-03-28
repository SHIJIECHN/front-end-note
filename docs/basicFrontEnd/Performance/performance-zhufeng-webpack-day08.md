---
autoGroup-2: Webpack5
sidebarDepth: 3
title: Plugin
---

## debugger插件
1. 修改package.json命令
```json
  "scripts": {
    "build": "webpack",
    "debug":"webpack"
  },
```
2. 点击vscode的debugger图标，添加launch.json文件，再点击运行按钮下拉选择，添加配置，选择Launch via NPM
```json
{
 "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "debug"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```
3. 点击调试按钮可以调试。

## 插件
生成一个文件清单。放打包后的文件名。



## 插件外链

之前的做法：
1. CDN引入
2. externals配置

