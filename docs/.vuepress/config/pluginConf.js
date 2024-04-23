const moment = require('moment');

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
    'vuepress-plugin-container': {
        type: 'theorem',
        before: info => `<div class="theorem"><p class="title">${info}</p>`,
        after: '</div>'
    },
    'vuepress-plugin-element-tabs': true,
}