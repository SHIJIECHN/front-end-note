---
autoGroup-1: Vue
sidebarDepth: 3
title: 指令基础/设计模式
---

## 多页面应用 vs 单页面应用
- 多页面应用：每次都请求对应的`HTML`文件。优点：1. 首屏时间快；2. `SEO`优化好。缺点：页面切换可能比较慢。   
- 单页面应用：首屏慢，`SEO`差；页面切换快。 


index.html移动端配置：  
- `width=device-width`：处理`iPhone`与`iPad`上视口问题，设置可以达到最佳的视口；`initial-scale=1.0`处理`IE`的视口问题；
- 禁止用户缩放：`minimum-scale=1.0,maximum-scale=1.0,user-scalable=no`


初始化文件配置：reset.css, border.css, fastclick包

轮播图：  
vue-awesome-swiper@2.6.7
样式穿透：.sw-wrapper >>> .swiper-pagination-bullet-active     
异步处理：
```vue
// 父组件：swiperList是异步请求返回的数据
<home-swiper :swiper-list = swiperList></home-swiper>

// 子组件： v-if只有等到有数据了才进行操作。采用计算属性。
<swiper :options="swiperOption" v-if="isSwiperShow"></swiper>
props: {
    swiperList: Array
},
computed:{
    isSwiperShow(){
        return this.swiperList.length;
    }
}
```

```css
/*给盒子设置ellipsis不起作用，需要加上min-width*/
.list-item .item-info{
    flex: 1;
    padding: .4rem .1rem;
    min-width: 0; /*注意*/
}
```

滚动插件：better-scroll   


## Git
1. 远程新建分支以后使用git pull, git checkout index-swiper.
2. 合并分支：切换到main分支，git merge origin/index-swiper，git push。
