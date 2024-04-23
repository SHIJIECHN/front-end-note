module.exports = [
  ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ['link', { rel: 'manifest', href: '/manifest.json' }],
  ['meta', { name: 'theme-color', content: '#ffffff' }],
  // ['script', {},`
  //   // Global site tag (gtag.js) - Google Analytics

  //   (function() {
  //     var hm1 = document.createElement("script");
  //     hm1.src = "https://www.googletagmanager.com/gtag/js?id=${ga.googleAnalytics}"
  //     var s1 = document.getElementsByTagName("script")[0]; 
  //     s1.parentNode.insertBefore(hm1, s1);
  //   })()

  //   // 谷歌加载
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag(){dataLayer.push(arguments);}
  //   gtag('js', new Date());

  //   gtag('config', ${ga.googleAnalytics});
  // `]
];