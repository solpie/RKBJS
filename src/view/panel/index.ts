import {RKBOPView} from "./stageRKB/RKBOPView";
//////////////
///////////////////

var routes = [
    {
        path: '/', name: 'panel',
        components: {default: RKBOPView}
    },
    {
        path: '/stage1v1/auto/:game_id',
        components: {default:RKBOPView}
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
}).$mount('#panel');