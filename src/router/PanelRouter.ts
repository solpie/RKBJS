import {ServerConf} from "../Env";
export var panelRouter = express.Router();
declare var rest;

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
    var game_id = req.params.game_id;
    var api1 = 'http://api.liangle.com/api/passerbyking/game/top8Match/' + game_id;

    rest(api1).then(function (response) {
        res.send(JSON.parse(response.entity));
    });
});
panelRouter.get('/auto/player/:game_id', function (req, res) {
    var game_id = req.params.game_id;
    var api1 = 'http://api.liangle.com/api/passerbyking/game/players/' + game_id;

    rest(api1).then(function (response) {
        res.send(JSON.parse(response.entity));
    });
});

