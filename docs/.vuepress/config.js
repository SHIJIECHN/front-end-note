const pluginConf = require('./config/pluginConf.js');
const navConf = require('./config/navConf.js');
// const nav = require("./config/nav.js")

module.exports = {
  base: '/front-end-note/',
  logo: '/assets/img/hexo.png',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'front-end-note',
      description: 'Web 开发笔记与解决方案'
    }
  },
  dest: './dist',   // 设置输出目录
  port: 2233, //端口
  themeConfig: {
    repo: 'https://github.com/SHIJIECHN/front-end-note',
    editLinks: true,
    docsDir: 'docs',
    smoothScroll: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: navConf,
        displayAllHeaders: true,
      }
    }
  },
  plugins: pluginConf,
  extraWatchFiles: ['.vuepress/nav.js']
  }