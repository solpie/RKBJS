require(`script!./../../../clientLibs/createjs/createjs.min.js`);
require(`script!./../../../clientLibs/createjs/easeljs.min.js`);
require(`script!./../../../clientLibs/createjs/tweenjs.min.js`);

//http://www.pixijs.com/
require(`script!./../../../clientLibs/pixi.min.js`);
require(`script!./../../../clientLibs/TweenLite.min.js`);

require(`script!./../../../clientLibs/jquery.min.js`);
require(`script!./../../../clientLibs/qrcode.min.js`);

require(`script!./../../../clientLibs/socket.io-1.4.5.min.js`);
require(`script!./../../../clientLibs/vue/vue.min.js`);
require(`script!./../../../clientLibs/vue/vue-router.min.js`);

require(`script!./../../../clientLibs/webfontloader.js`);
declare let WebFont;
WebFont.load({
    google: {
        families: ['Droid Sans', 'Droid Serif']
    }
});
import {rkbView} from "./stageRKB/RKBOPView";
import {stageOnlineView} from "./stageOnline/StageOnlineView";
//////////////

let routes = [
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