import {JParam} from "../../Command";
/**
 * Created by toramisu on 2016/10/24.
 */
// var io = require("socket.io");
declare var io;
export var Stage1v1View = {
    template: require('./stage.html'),
    props: {
        links: null,
    },
    created: function () {
        var ws = new io();
        // var ws = new io(`http://${window.location.hostname}/socket.io/`);
        ws.on('connect', function (msg) {
            console.log('connect', window.location.hostname);
            ws.emit("opUrl", JParam({opUrl: window.location.hostname}));
        });
        console.log('created')
    },
    mounted: function () {
    },
};
console.log('created2');
