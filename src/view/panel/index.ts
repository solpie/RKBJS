import {RKBOPView} from "./stageRKB/RKBOPView";
import {StageOnlineView} from "./stageOnline/StageOnlineView";
//////////////
///////////////////

var routes = [
    {
        path: '/', name: 'panel',
        components: {default: RKBOPView}
    },
    {
        path: '/rkb/:op/:game_id',
        components: {default: RKBOPView}
    },
    {
        path: '/ol/:op/:game_id',
        components: {default: StageOnlineView}
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