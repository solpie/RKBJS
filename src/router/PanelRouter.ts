import {ServerConf} from "../Env";
import {PanelId} from "../view/const";
export let panelRouter = express.Router();
declare let rest;

panelRouter.get('/', function (req, res) {
    console.log('get panel:');
    res.render('panel', {host: ServerConf.host, wsPort: ServerConf.wsPort, hupuWsUrl: ServerConf.hupuWsUrl});
});

panelRouter.get('/screen', function (req, res) {
    console.log('get screen:');
    res.render('screen/index', {host: ServerConf.host, wsPort: ServerConf.wsPort, hupuWsUrl: ServerConf.hupuWsUrl});
});

panelRouter.get('/auto/bracket/:game_id', function (req, res) {
    console.log('get /auto/bracket', req.params.game_id);
    let game_id = req.params.game_id;
    let api1 = 'http://api.liangle.com/api/passerbyking/game/top8Match/' + game_id;

    rest(api1).then(function (response) {
        res.send(JSON.parse(response.entity));
    });
});


panelRouter.get('/auto/player/:game_id', function (req, res) {
    let game_id = req.params.game_id;
    let api1 = 'http://api.liangle.com/api/passerbyking/game/players/' + game_id;

    rest(api1).then(function (response) {
        res.send(JSON.parse(response.entity));
    });
});

///// online io
let onlineIO;
export let initIO = (io) => {
    onlineIO = io.of(`/${PanelId.rkbPanel}`);
    onlineIO
        .on("connect", (socket) => {
            console.log('onlineIO connect');
        })
        .on('disconnect', function (socket) {
            console.log('onlineIO disconnect');
        });
};
panelRouter.post(`/${PanelId.onlinePanel}/:cmdId`, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    let cmdId = req.params.cmdId;
    let param = req.body;
    console.log(`/${PanelId.onlinePanel}/${cmdId}`, param);
    let cmdMap: any = {};
    if (param.hasOwnProperty("_")) {
        //auto emit
        let autoCmdId = cmdId.replace("cs_", "sc_");
        onlineIO.emit(autoCmdId, param);
        res.sendStatus(200);
    }
    else {
        let isSend = cmdMap[cmdId](param);
        if (!isSend)
            res.sendStatus(200);
    }
});

