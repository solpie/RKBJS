import {Stage1v1View, stage1v1View} from "./stage1v1/Stage1v1View";
//////////////
///////////////////

var routes = [
    {
        path: '/', name: 'home',
        components: {default: stage1v1View}
    }
];

// require('./../../../static/js/vue/vue.min.js');
// require('./../../../static/js/vue/vue-router.min.js');
declare var VueRouter;
declare var Vue;
var router = new VueRouter({
    routes // short for routes: routes
});

router.afterEach((to, from) => {
});

var app = new Vue({
    router
}).$mount('#app');
