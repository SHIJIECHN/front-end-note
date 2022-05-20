---
autoGroup-1: Vue
sidebarDepth: 3
title: 生命周期函数
---

## 生命周期函数

生命周期钩子函数：Vue实例再某一个时间点会自动执行的函数。
```html
<body>
    <div id="root"></div>

    <script type="text/javascript">
        const vm = new Vue({
                el: '#root',
                data() {
                    return {
                        content: 123
                    }
                },
                template: `<h1>{{content}}</h1>`,
                beforeCreate: function() {
                    console.log('beforeCreate');
                },
                created: function() {
                    console.log('create');
                },
                beforeMount: function() {
                    console.log('beforeMount');
                },
                mounted: function() {
                    console.log('mounted');
                },
                // 执行vm.$destroy()，后面两个钩子函数beforeDestroy和destroyed会执行
                beforeDestroy: function() {
                    console.log('beforeDestroy');
                },
                destroyed: function() {
                    console.log('destroyed');
                },
                // 执行vm.$data.content = 456，会执行钩子函数beforeUpdate和updated
                beforeUpdate: function() {
                    console.log('beforeUpdate');
                },
                updated: function() {
                    console.log('updated');
                }
            })
            /**
             * beforeCreate
             * create
             * beforeMount
             * mounted
             */
    </script>
</body>
```

