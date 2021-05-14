const pluginConf = require('./config/pluginConf.js');
const navConf = require('./config/navConf.js');
const headConf = require("./config/headConf.js")

module.exports = {
  base: '/front-end-note/',
  logo: '/assets/img/hexo.png',
  title: 'front-end-note',
  description: 'Web 开发笔记与解决方案',
  head: headConf,
  plugins: pluginConf,
  dest: './dist',   // 设置输出目录
  port: 2233, //端口
  themeConfig: {
    repo: 'https://github.com/SHIJIECHN/front-end-note',
    editLinks: true,
    docsDir: 'docs',
    smoothScroll: true,
    lastUpdated: '更新时间',
    editLinkText: '在 GitHub 上编辑此页',
    nav: navConf,
  }
}