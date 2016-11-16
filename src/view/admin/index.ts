/**
 * Created by toramisu on 2016/10/22.
 */

require('../../../resources/app/static/css/bulma.min.css');
require(`script!./../../../clientLibs/jquery.min.js`);
require(`script!./../../../clientLibs/qrcode.min.js`);
require(`script!./../../../clientLibs/vue/vue.min.js`);
require(`script!./../../../clientLibs/vue/vue-router.min.js`);

import {Navbar} from "./navbar/Navbar";
import {homeView} from "./home/home";
import {PlayerView} from "./player/player";
import {RankView} from "./rank/rank";
import {PanelView} from "./panel/panel";
//////////////
var routes = [
    {
        path: '/', name: 'home',
        components: {content: homeView, Navbar: Navbar}
    },
    {
        path: '/player', name: 'player',
        components: {content: PlayerView, Navbar: Navbar},
    },
    {
        path: '/panel', name: 'panel',
        components: {content: PanelView, Navbar: Navbar},
    },
    {
        path: '/rank', name: 'rank',
        components: {content: RankView, Navbar: Navbar},
    }
];

declare let VueRouter;
declare let Vue;
let router = new VueRouter({
    routes // short for routes: routes
});

router.afterEach((to, from) => {
    let toPath = to.path;
    router.app.active = toPath.split("/")[1];
});

let app = new Vue({
    router
}).$mount('#app');
