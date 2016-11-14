require(`script!D:/projects/RKBJS/clientLibs/createjs/createjs.min.js`);
require(`script!D:/projects/RKBJS/clientLibs/createjs/easeljs.min.js`);
require(`script!D:/projects/RKBJS/clientLibs/createjs/tweenjs.min.js`);

//http://www.pixijs.com/
require(`script!D:/projects/RKBJS/clientLibs/pixi.min.js`);

require(`script!D:/projects/RKBJS/clientLibs/jquery.min.js`);
require(`script!D:/projects/RKBJS/clientLibs/qrcode.min.js`);

require(`script!D:/projects/RKBJS/clientLibs/socket.io-1.4.5.min.js`);
require(`script!D:/projects/RKBJS/clientLibs/vue/vue.min.js`);
require(`script!D:/projects/RKBJS/clientLibs/vue/vue-router.min.js`);

import {rkbView} from "./stageRKB/RKBOPView";
import {stageOnlineView} from "./stageOnline/StageOnlineView";
//////////////

var routes = [
    {
        path: '/', name: 'panel',
        components: {default: rkbView}
    },
    {
        path: '/rkb/:op/:game_id',
        components: {default: rkbView}
    },
    {
        path: '/ol/:op/:game_id',
        components: {default: stageOnlineView}
    }
];

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