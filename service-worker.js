/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "a5ecf32f2515affcdadc218fca3def0d"
  },
  {
    "url": "algorithms/index.html",
    "revision": "4f8b0982ce15aa665e83442514db3a66"
  },
  {
    "url": "algorithms/Theory/index.html",
    "revision": "d0614c2acec92f018fc33de6cc1e700e"
  },
  {
    "url": "algorithms/Training/index.html",
    "revision": "cbb717d1a4478db6a9415d5697e0ac8c"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "242acf62de16f0a38ae9ff21501f0f13"
  },
  {
    "url": "assets/css/0.styles.9af9985a.css",
    "revision": "257ded89778006afc86e462612c4836b"
  },
  {
    "url": "assets/img/hero.png",
    "revision": "d1fed5cb9d0a4c4269c3bcc4d74d9e64"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.82eb2da4.js",
    "revision": "5691dd19935edba69589cb1ce19b7394"
  },
  {
    "url": "assets/js/11.7b23e658.js",
    "revision": "0b066db1de905eeb832eb95807420689"
  },
  {
    "url": "assets/js/12.37f7e43c.js",
    "revision": "4378d6cd4dbfe3feca05bd93f3768022"
  },
  {
    "url": "assets/js/13.79998fe1.js",
    "revision": "75381058e365fa28a3976f29823f5fb7"
  },
  {
    "url": "assets/js/14.676cc749.js",
    "revision": "e283c03a8f720320608a2137e9b4c01f"
  },
  {
    "url": "assets/js/15.4151468f.js",
    "revision": "03b14a9f03d36a71c2dee1d99f7f4dbd"
  },
  {
    "url": "assets/js/16.32e33c24.js",
    "revision": "b01af4a01aff31ecb3881530c4d38d80"
  },
  {
    "url": "assets/js/17.c89ce9e3.js",
    "revision": "5dccb60b2281d09f6deadd6dcd704974"
  },
  {
    "url": "assets/js/18.7300a341.js",
    "revision": "f849b7e8a0fd803262bb9a75daced1a3"
  },
  {
    "url": "assets/js/19.1228ebd4.js",
    "revision": "8a57ddc9be112a9f76898943c36b8719"
  },
  {
    "url": "assets/js/2.58147687.js",
    "revision": "4fcf4385b246faf696b8cf39e509a047"
  },
  {
    "url": "assets/js/20.179843ed.js",
    "revision": "9d1e8f73d26f3c3354d3f2bdc3e0f30e"
  },
  {
    "url": "assets/js/21.f4794f83.js",
    "revision": "a6649223f3a42962498639a920eb6d4d"
  },
  {
    "url": "assets/js/22.adbb4034.js",
    "revision": "878c3fa60147058c560ba0709816369f"
  },
  {
    "url": "assets/js/23.f6c4b942.js",
    "revision": "ac6e0a6b10ccffae2f398220a36e874b"
  },
  {
    "url": "assets/js/24.4a06647c.js",
    "revision": "ce40841b44200a32c3bd1096fc90491f"
  },
  {
    "url": "assets/js/25.f1bc85cf.js",
    "revision": "a59e34dc6a44bbb7340b5bd4d821e7f7"
  },
  {
    "url": "assets/js/26.23c362d9.js",
    "revision": "2010a167691d2d1ab69bd5bb7c075d4a"
  },
  {
    "url": "assets/js/27.5f22d59d.js",
    "revision": "99cd0a1237bd067a38e4cc41de650ea8"
  },
  {
    "url": "assets/js/28.52dd03ab.js",
    "revision": "065d7c3cec14a4ead2e93c2c3cfdb413"
  },
  {
    "url": "assets/js/29.3dff7a5f.js",
    "revision": "b12ef425ebbe826c817da9a64016fb99"
  },
  {
    "url": "assets/js/3.968fa355.js",
    "revision": "b4f5239d6f3e88a833908e8971cedefb"
  },
  {
    "url": "assets/js/30.fb4f1a8d.js",
    "revision": "2553fcc60fd383713c6f7b346a6680bf"
  },
  {
    "url": "assets/js/31.90bf2b8d.js",
    "revision": "382ffec5432fb929cde0b4104b8f9e52"
  },
  {
    "url": "assets/js/32.ffe98ce7.js",
    "revision": "568a3707e04281c10119e00c2e16194b"
  },
  {
    "url": "assets/js/33.e82322b2.js",
    "revision": "b18e37947a217d4b61f4d74556c64e48"
  },
  {
    "url": "assets/js/34.6212a4e5.js",
    "revision": "9745d64e0e7581a6b69958f5d1f35cd7"
  },
  {
    "url": "assets/js/35.e5c1d9ed.js",
    "revision": "5d4191ed48765883fb2d55f45bd7569c"
  },
  {
    "url": "assets/js/36.563c44d5.js",
    "revision": "230dc82f48085608fbba7bef9e642203"
  },
  {
    "url": "assets/js/37.8bf3e7c9.js",
    "revision": "502de0f259016a000ead1b32c63f4bea"
  },
  {
    "url": "assets/js/38.45073be1.js",
    "revision": "6c6d4ba512c310f16eceb19a12951acf"
  },
  {
    "url": "assets/js/4.11993b2c.js",
    "revision": "88d1a508b6ed801ece50976037c08c59"
  },
  {
    "url": "assets/js/5.0580ca42.js",
    "revision": "3c466982aefd0044d3defe1eb83d5951"
  },
  {
    "url": "assets/js/6.88d13b7e.js",
    "revision": "df5e904b480d3a6690a4a27ffaf60be3"
  },
  {
    "url": "assets/js/7.ca82ba20.js",
    "revision": "7faa4633365a88dff15a629bf98fdb67"
  },
  {
    "url": "assets/js/8.a5a0f721.js",
    "revision": "f8b1f18c8f4d47143180791779f1a211"
  },
  {
    "url": "assets/js/9.913eafe9.js",
    "revision": "4f886e0efbe4e016761ab3ce7a1569af"
  },
  {
    "url": "assets/js/app.77d84130.js",
    "revision": "06a74cdc20e39eb0d30e92163fa0e920"
  },
  {
    "url": "basicComputer/Design/index.html",
    "revision": "6f468c184f0690525fec6f7a0c228302"
  },
  {
    "url": "basicComputer/index.html",
    "revision": "4d38e391f347c3d8ef7fdf9bf3dfb219"
  },
  {
    "url": "basicComputer/Network/index.html",
    "revision": "6474c33e1ba09192a010ab423ada0415"
  },
  {
    "url": "basicComputer/OperatingSystems/index.html",
    "revision": "ff5fa66496f5c5d63b0af91da9adf4b1"
  },
  {
    "url": "basicFrontEnd/CSS/index.html",
    "revision": "9f9f1908b70f1435af00a83962539ab1"
  },
  {
    "url": "basicFrontEnd/Engineering/index.html",
    "revision": "5c3e9b72439704da1061ce917297eaaa"
  },
  {
    "url": "basicFrontEnd/HTML/index.html",
    "revision": "495040469fbd57887b4ebb4134f1b01c"
  },
  {
    "url": "basicFrontEnd/index.html",
    "revision": "471ab4e7dda443ad103058dd34170725"
  },
  {
    "url": "basicFrontEnd/JavaScript/advanced-programming-charpter00.html",
    "revision": "ff639f923cdb20943c21a1743befee9d"
  },
  {
    "url": "basicFrontEnd/JavaScript/advanced-programming-charpter01.html",
    "revision": "d2dd0d03036f6523a6ea9bf2a184271e"
  },
  {
    "url": "basicFrontEnd/JavaScript/advanced-programming-charpter02.html",
    "revision": "42fc6ca255e9e856f0012cce7befefc5"
  },
  {
    "url": "basicFrontEnd/JavaScript/advanced-programming-charpter10.html",
    "revision": "d2d7273e2dd4986579c64c2f1bd76e79"
  },
  {
    "url": "basicFrontEnd/JavaScript/index.html",
    "revision": "49f8defd0ea015935461a04180478556"
  },
  {
    "url": "basicFrontEnd/JavaScript/javascript-dom-charpter01.html",
    "revision": "d3e6a4aade34ec8486a913742259fcb3"
  },
  {
    "url": "basicFrontEnd/JavaScript/javascript-dom-charpter02.html",
    "revision": "4d2423d30340262361eef6ca65cdf60c"
  },
  {
    "url": "basicFrontEnd/Performance/index.html",
    "revision": "90884bdf58db842dcb9ab1eaa060d4df"
  },
  {
    "url": "config.html",
    "revision": "bf55e3574cbbb273d700a6326c3f5985"
  },
  {
    "url": "framework/index.html",
    "revision": "ff5761eeb669dcc40c568518767e0139"
  },
  {
    "url": "framework/React/index.html",
    "revision": "aa1de55d8f047ca6ca86640e67047986"
  },
  {
    "url": "framework/TypeScript/index.html",
    "revision": "7b7b815255b875b6bdf9e70f2598034a"
  },
  {
    "url": "framework/Vue/index.html",
    "revision": "d293ae8a32e52d9a7660482aba76f64b"
  },
  {
    "url": "icons/icon-128x128.png",
    "revision": "135c2aba490db14f8200cd772995f35d"
  },
  {
    "url": "icons/icon-144x144.png",
    "revision": "a4271dfcd229369a16522b36b4241afa"
  },
  {
    "url": "icons/icon-152x152.png",
    "revision": "dc7ac2de31649de6f88df341b87d744f"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "6171be93b691ce4f9546def624bcadc3"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "f5ff44fc10f11d717056f8108e7f4a9d"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "cee47d4601b5a5c4dada3693ffd3ef94"
  },
  {
    "url": "icons/icon-72x72.png",
    "revision": "61eb9ebb22b0c68b6e236b859094a865"
  },
  {
    "url": "icons/icon-96x96.png",
    "revision": "c430ea29655773327896f7d65fe94c46"
  },
  {
    "url": "index.html",
    "revision": "f8b380b8bb0de7f6bd16afbb0c871d1e"
  },
  {
    "url": "operationEnv/Browser/index.html",
    "revision": "81fbe323ea8247f82abef1575b984cbe"
  },
  {
    "url": "operationEnv/index.html",
    "revision": "c887c1bacf0b084988b2774993f882b4"
  },
  {
    "url": "operationEnv/Node/index.html",
    "revision": "41982cd04a14fe0308867c551becba57"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
