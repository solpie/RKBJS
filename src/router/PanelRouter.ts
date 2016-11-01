import {ServerConf} from "../Env";
import {PanelId, ScParam} from "../view/libs";
import {CommandId} from "../view/Command";
export var panelRouter = require('express').Router();

panelRouter.get('/', function (req, res) {
    console.log('get panel:');
    res.render('panel.mustache', {host: ServerConf.host, wsPort: ServerConf.wsPort, hupuWsUrl: ServerConf.hupuWsUrl});
});

panelRouter.get('/screen', function (req, res) {
    console.log('get screen:');
    res.render('screen/index', {host: ServerConf.host, wsPort: ServerConf.wsPort, hupuWsUrl: ServerConf.hupuWsUrl});
});
var unirest = require('unirest');

panelRouter.get('/auto/bracket/:game_id', function (req, res) {
    console.log('get /auto/bracket', req.params.game_id);
    var game_id = req.params.game_id;
    var api1 = 'http://api.liangle.com/api/passerbyking/game/top8Match/' + game_id;
    unirest.get(api1)
        .end(function (response) {
            console.log(response.body);
            res.send(response.body);
        });
});

panelRouter.get('/auto/player/:game_id', function (req, res) {
    console.log('get /auto/player');
    var game_id = req.params.game_id;
    var api1 = 'http://api.liangle.com/api/passerbyking/game/players/' + game_id;
    unirest.get(api1)
        .end(function (response) {
            console.log(response.body);
            res.send(response.body);
        });
});

panelRouter.initWs = (io)=> {
    console.log('initWs');
    io = io.of(`/${PanelId.rkbPanel}`);
    io
        .on("connect", (socket) => {
            console.log('connect');
            socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: this.gameInfo, isDev: ServerConf.isDev}));
        })
        .on('disconnect', function (socket) {
            console.log('disconnect');
        });
};


