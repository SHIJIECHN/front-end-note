const moment = require('moment');
const commentConf = require('./secretKeyConf.js')

moment.locale("zh-cn");

module.exports = {
    '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
        }
    },
    '@vuepress/back-to-top': true,

    // '@vuepress/google-analytics':
    // {
    //   ga: 'UA-196705735-1'
    // },

    '@vuepress/medium-zoom': {
        selector: '.content__default img',
    },
    '@vuepress/last-updated': {
        transformer: (timestamp) => moment(timestamp).format('LLLL')
    },
    "vuepress-plugin-auto-sidebar": {
        nav: true,
        title: {
            mode: "uppercase",
            map: {
                "/basicFrontEnd/JavaScript/": "JS 基础",
            }
        },
        collapse: {
            collapseList: ["/basicFrontEnd/JavaScript/"]
        }
    },
    '@vssue/vuepress-plugin-vssue': {
        // 设置 `platform` 而不是 `api`
        platform: 'github-v4',

        // 其他的 Vssue 配置
        owner: 'SHIJIECHN',
        repo: 'front-end-note',
        clientId: commentConf.clientId,
        clientSecret: commentConf.clientSecret,
        autoCreateIssue: true
    },
}