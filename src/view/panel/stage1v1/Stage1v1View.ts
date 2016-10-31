import {JParam} from "../../Command";
import {BasePanelView} from "../BasePanelView";
/**
 * Created by toramisu on 2016/10/24.
 */
// var io = require("socket.io");
declare var io;
export class Stage1v1View extends BasePanelView{
    template = require('./stage.html');
    props = {
        links: null,
    };

    created() {
        var ws = new io();
        ws.on('connect', function (msg) {
            console.log('connect', window.location.hostname);
            ws.emit("opUrl", JParam({opUrl: window.location.hostname}));
        });
        console.log('created!')
    }

    mounted() {
        console.log('mounted!');
    }
}
export var stage1v1View = new Stage1v1View();
