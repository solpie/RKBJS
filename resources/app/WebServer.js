/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var AdminRouter_1 = __webpack_require__(1);
	var Env_1 = __webpack_require__(2);
	var PanelRouter_1 = __webpack_require__(4);
	var const_1 = __webpack_require__(5);
	var Command_1 = __webpack_require__(6);
	var WebServer = (function () {
	    function WebServer(callback) {
	        this.initEnv(callback);
	        this.test();
	    }
	    WebServer.prototype.test = function () {
	    };
	    WebServer.prototype.initEnv = function (callback) {
	        var _this = this;
	        var process = __webpack_require__(7);
	        Env_1.ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
	        console.log(process.execPath, Env_1.ServerConf.isDev);
	        var fs = __webpack_require__(8);
	        fs.readFile('resources/app/package.json', function (err, data) {
	            if (err)
	                throw err;
	            var dataObj = JSON.parse(data);
	            Env_1.ServerConf.port = dataObj.server.port;
	            _this.initServer();
	            _this.serverConf = Env_1.ServerConf;
	            console.log("server config:", Env_1.ServerConf);
	            if (callback)
	                callback(dataObj);
	        });
	    };
	    WebServer.prototype.initServer = function () {
	        var _this = this;
	        var app = express();
	        app.set('views', "./resources/app/view");
	        app.engine('mustache', mustacheExpress());
	        app.set('view engine', 'mustache');
	        app.use(express.static("./resources/app/static"));
	        app.use(bodyParser.urlencoded({ extended: false, limit: '55mb' }));
	        app.use(bodyParser.json({ limit: '50mb' }));
	        app.all("*", function (req, res, next) {
	            var start = new Date;
	            res.header('Access-Control-Allow-Origin', '*');
	            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	            if (req.method == 'OPTIONS') {
	                res.send(200);
	            }
	            else {
	                next();
	                var ms = new Date - start;
	                console.log('%c%s %s - %s ms', "color: Green;font-weight:bold; background-color: LimeGreen;", req.method, req.url, ms);
	            }
	        });
	        app.get('/', function (req, res) {
	            res.redirect('/admin');
	        });
	        app.use('/admin', AdminRouter_1.adminRouter);
	        app.use('/panel', PanelRouter_1.panelRouter);
	        var server = __webpack_require__(9).createServer(app);
	        server.listen(Env_1.ServerConf.port, function () {
	            _this.initSocketIO(server);
	            console.log("server on:", Env_1.ServerConf.port);
	        });
	    };
	    WebServer.prototype.initSocketIO = function (server) {
	        var io = new SocketIO(server);
	        io.on('connection', function () {
	        });
	        io = io.of("/" + const_1.PanelId.rkbPanel);
	        io
	            .on("connect", function (socket) {
	            console.log('connect');
	            socket.emit("" + Command_1.CommandId.initPanel, const_1.ScParam({ gameInfo: "", isDev: Env_1.ServerConf.isDev }));
	        })
	            .on('disconnect', function (socket) {
	            console.log('disconnect');
	        });
	    };
	    return WebServer;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WebServer;
	exports.webServer = new WebServer();


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.adminRouter = express.Router();
	exports.adminRouter.get('/', function (req, res) {
	    res.render('admin/index.mustache', { version: 0.5, opUrlArr: "['http://123', '21']" });
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Node_path = __webpack_require__(3);
	exports._path = function (path) {
	    if (!exports.ServerConf.isDev)
	        return Node_path.join('resources', path);
	    return path;
	};
	exports.ServerConf = { isDev: false, hupuWsUrl: '' };


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Env_1 = __webpack_require__(2);
	exports.panelRouter = express.Router();
	exports.panelRouter.get('/', function (req, res) {
	    console.log('get panel:');
	    res.render('panel.mustache', { host: Env_1.ServerConf.host, wsPort: Env_1.ServerConf.wsPort, hupuWsUrl: Env_1.ServerConf.hupuWsUrl });
	});
	exports.panelRouter.get('/screen', function (req, res) {
	    console.log('get screen:');
	    res.render('screen/index', { host: Env_1.ServerConf.host, wsPort: Env_1.ServerConf.wsPort, hupuWsUrl: Env_1.ServerConf.hupuWsUrl });
	});
	exports.panelRouter.get('/auto/bracket/:game_id', function (req, res) {
	    console.log('get /auto/bracket', req.params.game_id);
	    var game_id = req.params.game_id;
	    var api1 = 'http://api.liangle.com/api/passerbyking/game/top8Match/' + game_id;
	    rest(api1).then(function (response) {
	        res.send(JSON.parse(response.entity));
	    });
	});
	exports.panelRouter.get('/auto/player/:game_id', function (req, res) {
	    var game_id = req.params.game_id;
	    var api1 = 'http://api.liangle.com/api/passerbyking/game/players/' + game_id;
	    rest(api1).then(function (response) {
	        res.send(JSON.parse(response.entity));
	    });
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	exports.PanelId = {
	    stagePanel: 'stage',
	    stage1v1Panel: 'stage1v1',
	    rkbPanel: 'rkb',
	    bracketPanel: 'bracket',
	    winPanel: 'win',
	    actPanel: 'act',
	    screenPanel: 'screen',
	    playerPanel: 'player'
	};
	exports.ServerConst = {
	    SEND_ASYNC: true,
	    DEF_AVATAR: '/img/panel/stage/blue.png'
	};
	exports.ViewConst = {
	    STAGE_WIDTH: 1920,
	    STAGE_HEIGHT: 1080
	};
	exports.TimerState = {
	    START_STR: 'start',
	    PAUSE_STR: 'pause',
	    PAUSE: 0,
	    RUNNING: 1
	};
	exports.ViewEvent = {
	    PLAYER_EDIT: 'edit player',
	    PLAYER_ADD: 'add player',
	    STRAIGHT3_LEFT: 'STRAIGHT3_LEFT',
	    STRAIGHT3_RIGHT: 'STRAIGHT3_RIGHT'
	};
	function ScParam(param) {
	    return param;
	}
	exports.ScParam = ScParam;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	exports.JParam = function (o) {
	    return { jstr: JSON.stringify(o) };
	};
	(function (CommandId) {
	    CommandId[CommandId["dmkPush"] = 0] = "dmkPush";
	    CommandId[CommandId["ShowConsoleWin"] = 100000] = "ShowConsoleWin";
	    CommandId[CommandId["toggleTracker"] = 100001] = "toggleTracker";
	    CommandId[CommandId["toggleBallRolling"] = 100002] = "toggleBallRolling";
	    CommandId[CommandId["toggleTimer"] = 100003] = "toggleTimer";
	    CommandId[CommandId["cs_toggleTimer"] = 100004] = "cs_toggleTimer";
	    CommandId[CommandId["resetTimer"] = 100005] = "resetTimer";
	    CommandId[CommandId["cs_resetTimer"] = 100006] = "cs_resetTimer";
	    CommandId[CommandId["disableTracker"] = 100007] = "disableTracker";
	    CommandId[CommandId["updateLeftScore"] = 100008] = "updateLeftScore";
	    CommandId[CommandId["cs_addLeftScore"] = 100009] = "cs_addLeftScore";
	    CommandId[CommandId["updateRightScore"] = 100010] = "updateRightScore";
	    CommandId[CommandId["cs_addRightScore"] = 100011] = "cs_addRightScore";
	    CommandId[CommandId["updateLeftBall"] = 100012] = "updateLeftBall";
	    CommandId[CommandId["updateRightBall"] = 100013] = "updateRightBall";
	    CommandId[CommandId["cs_addLeftBall"] = 100014] = "cs_addLeftBall";
	    CommandId[CommandId["cs_addRightBall"] = 100015] = "cs_addRightBall";
	    CommandId[CommandId["cs_minLeftBall"] = 100016] = "cs_minLeftBall";
	    CommandId[CommandId["cs_minRightBall"] = 100017] = "cs_minRightBall";
	    CommandId[CommandId["cs_updateInitBallCount"] = 100018] = "cs_updateInitBallCount";
	    CommandId[CommandId["minLeftScore"] = 100019] = "minLeftScore";
	    CommandId[CommandId["cs_minLeftScore"] = 100020] = "cs_minLeftScore";
	    CommandId[CommandId["minRightScore"] = 100021] = "minRightScore";
	    CommandId[CommandId["cs_minRightScore"] = 100022] = "cs_minRightScore";
	    CommandId[CommandId["updateLeftFoul"] = 100023] = "updateLeftFoul";
	    CommandId[CommandId["cs_addLeftFoul"] = 100024] = "cs_addLeftFoul";
	    CommandId[CommandId["cs_minLeftFoul"] = 100025] = "cs_minLeftFoul";
	    CommandId[CommandId["updateRightFoul"] = 100026] = "updateRightFoul";
	    CommandId[CommandId["cs_addRightFoul"] = 100027] = "cs_addRightFoul";
	    CommandId[CommandId["cs_minRightFoul"] = 100028] = "cs_minRightFoul";
	    CommandId[CommandId["cs_updateLeftSkill"] = 100029] = "cs_updateLeftSkill";
	    CommandId[CommandId["updateLeftSkill"] = 100030] = "updateLeftSkill";
	    CommandId[CommandId["cs_updateRightSkill"] = 100031] = "cs_updateRightSkill";
	    CommandId[CommandId["updateRightSkill"] = 100032] = "updateRightSkill";
	    CommandId[CommandId["stageFadeOut"] = 100033] = "stageFadeOut";
	    CommandId[CommandId["cs_fadeOut"] = 100034] = "cs_fadeOut";
	    CommandId[CommandId["playerScore"] = 100035] = "playerScore";
	    CommandId[CommandId["cs_playerScore"] = 100036] = "cs_playerScore";
	    CommandId[CommandId["stageFadeIn"] = 100037] = "stageFadeIn";
	    CommandId[CommandId["cs_stageFadeIn"] = 100038] = "cs_stageFadeIn";
	    CommandId[CommandId["moveStagePanel"] = 100039] = "moveStagePanel";
	    CommandId[CommandId["cs_moveStagePanel"] = 100040] = "cs_moveStagePanel";
	    CommandId[CommandId["updatePlayer"] = 100041] = "updatePlayer";
	    CommandId[CommandId["cs_updatePlayer"] = 100042] = "cs_updatePlayer";
	    CommandId[CommandId["updatePlayerAll"] = 100043] = "updatePlayerAll";
	    CommandId[CommandId["cs_changeColor"] = 100044] = "cs_changeColor";
	    CommandId[CommandId["cs_updatePlayerAll"] = 100045] = "cs_updatePlayerAll";
	    CommandId[CommandId["cs_updatePlayerBackNum"] = 100046] = "cs_updatePlayerBackNum";
	    CommandId[CommandId["updatePlayerBackNum"] = 100047] = "updatePlayerBackNum";
	    CommandId[CommandId["fadeInNotice"] = 100048] = "fadeInNotice";
	    CommandId[CommandId["cs_fadeInNotice"] = 100049] = "cs_fadeInNotice";
	    CommandId[CommandId["cs_resetGame"] = 100050] = "cs_resetGame";
	    CommandId[CommandId["cs_toggleDmk"] = 100051] = "cs_toggleDmk";
	    CommandId[CommandId["toggleDmk"] = 100052] = "toggleDmk";
	    CommandId[CommandId["resetGame"] = 100053] = "resetGame";
	    CommandId[CommandId["cs_unLimitScore"] = 100054] = "cs_unLimitScore";
	    CommandId[CommandId["unLimitScore"] = 100055] = "unLimitScore";
	    CommandId[CommandId["cs_updatePlayerState"] = 100056] = "cs_updatePlayerState";
	    CommandId[CommandId["updatePlayerState"] = 100057] = "updatePlayerState";
	    CommandId[CommandId["cs_setGameIdx"] = 100058] = "cs_setGameIdx";
	    CommandId[CommandId["setGameIdx"] = 100059] = "setGameIdx";
	    CommandId[CommandId["fadeInWinPanel"] = 100060] = "fadeInWinPanel";
	    CommandId[CommandId["cs_fadeInWinPanel"] = 100061] = "cs_fadeInWinPanel";
	    CommandId[CommandId["fadeOutWinPanel"] = 100062] = "fadeOutWinPanel";
	    CommandId[CommandId["cs_fadeOutWinPanel"] = 100063] = "cs_fadeOutWinPanel";
	    CommandId[CommandId["saveGameRec"] = 100064] = "saveGameRec";
	    CommandId[CommandId["cs_saveGameRec"] = 100065] = "cs_saveGameRec";
	    CommandId[CommandId["cs_fadeInFinalPlayer"] = 100066] = "cs_fadeInFinalPlayer";
	    CommandId[CommandId["fadeInFinalPlayer"] = 100067] = "fadeInFinalPlayer";
	    CommandId[CommandId["cs_fadeOutFinalPlayer"] = 100068] = "cs_fadeOutFinalPlayer";
	    CommandId[CommandId["fadeOutFinalPlayer"] = 100069] = "fadeOutFinalPlayer";
	    CommandId[CommandId["cs_setActPlayer"] = 100070] = "cs_setActPlayer";
	    CommandId[CommandId["cs_setBracketPlayer"] = 100071] = "cs_setBracketPlayer";
	    CommandId[CommandId["cs_clearActPlayerGameRec"] = 100072] = "cs_clearActPlayerGameRec";
	    CommandId[CommandId["cs_getBracketPlayerByIdx"] = 100073] = "cs_getBracketPlayerByIdx";
	    CommandId[CommandId["cs_refreshClient"] = 100074] = "cs_refreshClient";
	    CommandId[CommandId["refreshClient"] = 100075] = "refreshClient";
	    CommandId[CommandId["cs_updateWinScore"] = 100076] = "cs_updateWinScore";
	    CommandId[CommandId["updateWinScore"] = 100077] = "updateWinScore";
	    CommandId[CommandId["cs_updateKingPlayer"] = 100078] = "cs_updateKingPlayer";
	    CommandId[CommandId["updateKingPlayer"] = 100079] = "updateKingPlayer";
	    CommandId[CommandId["cs_setCursorPlayer"] = 100080] = "cs_setCursorPlayer";
	    CommandId[CommandId["setCursorPlayer"] = 100081] = "setCursorPlayer";
	    CommandId[CommandId["cs_saveToTotalScore"] = 100082] = "cs_saveToTotalScore";
	    CommandId[CommandId["cs_setScorePanelVisible"] = 100083] = "cs_setScorePanelVisible";
	    CommandId[CommandId["setScorePanelVisible"] = 100084] = "setScorePanelVisible";
	    CommandId[CommandId["cs_autoSaveGameRec"] = 100085] = "cs_autoSaveGameRec";
	    CommandId[CommandId["cs_startingLine"] = 100086] = "cs_startingLine";
	    CommandId[CommandId["startingLine"] = 100087] = "startingLine";
	    CommandId[CommandId["cs_hideStartingLine"] = 100088] = "cs_hideStartingLine";
	    CommandId[CommandId["hideStartingLine"] = 100089] = "hideStartingLine";
	    CommandId[CommandId["cs_queryPlayerByPos"] = 100090] = "cs_queryPlayerByPos";
	    CommandId[CommandId["fadeInPlayerPanel"] = 100091] = "fadeInPlayerPanel";
	    CommandId[CommandId["cs_fadeInPlayerPanel"] = 100092] = "cs_fadeInPlayerPanel";
	    CommandId[CommandId["fadeOutPlayerPanel"] = 100093] = "fadeOutPlayerPanel";
	    CommandId[CommandId["cs_fadeOutPlayerPanel"] = 100094] = "cs_fadeOutPlayerPanel";
	    CommandId[CommandId["movePlayerPanel"] = 100095] = "movePlayerPanel";
	    CommandId[CommandId["cs_movePlayerPanel"] = 100096] = "cs_movePlayerPanel";
	    CommandId[CommandId["straightScore3"] = 100097] = "straightScore3";
	    CommandId[CommandId["straightScore5"] = 100098] = "straightScore5";
	    CommandId[CommandId["initPanel"] = 100099] = "initPanel";
	    CommandId[CommandId["cs_fadeInActivityPanel"] = 100100] = "cs_fadeInActivityPanel";
	    CommandId[CommandId["fadeInActivityPanel"] = 100101] = "fadeInActivityPanel";
	    CommandId[CommandId["cs_fadeInNextActivity"] = 100102] = "cs_fadeInNextActivity";
	    CommandId[CommandId["fadeInNextActivity"] = 100103] = "fadeInNextActivity";
	    CommandId[CommandId["cs_fadeInActivityExGame"] = 100104] = "cs_fadeInActivityExGame";
	    CommandId[CommandId["fadeInActivityExGame"] = 100105] = "fadeInActivityExGame";
	    CommandId[CommandId["cs_fadeOutActivityPanel"] = 100106] = "cs_fadeOutActivityPanel";
	    CommandId[CommandId["fadeOutActivityPanel"] = 100107] = "fadeOutActivityPanel";
	    CommandId[CommandId["cs_startGame"] = 100108] = "cs_startGame";
	    CommandId[CommandId["cs_restartGame"] = 100109] = "cs_restartGame";
	    CommandId[CommandId["cs_fadeInRankPanel"] = 100110] = "cs_fadeInRankPanel";
	    CommandId[CommandId["fadeInRankPanel"] = 100111] = "fadeInRankPanel";
	    CommandId[CommandId["cs_fadeInNextRank"] = 100112] = "cs_fadeInNextRank";
	    CommandId[CommandId["fadeInNextRank"] = 100113] = "fadeInNextRank";
	    CommandId[CommandId["cs_setGameComing"] = 100114] = "cs_setGameComing";
	    CommandId[CommandId["setGameComing"] = 100115] = "setGameComing";
	    CommandId[CommandId["cs_fadeOutRankPanel"] = 100116] = "cs_fadeOutRankPanel";
	    CommandId[CommandId["fadeOutRankPanel"] = 100117] = "fadeOutRankPanel";
	    CommandId[CommandId["cs_fadeInCountDown"] = 100118] = "cs_fadeInCountDown";
	    CommandId[CommandId["fadeInCountDown"] = 100119] = "fadeInCountDown";
	    CommandId[CommandId["cs_fadeOutCountDown"] = 100120] = "cs_fadeOutCountDown";
	    CommandId[CommandId["fadeOutCountDown"] = 100121] = "fadeOutCountDown";
	    CommandId[CommandId["cs_inScreenScore"] = 100122] = "cs_inScreenScore";
	    CommandId[CommandId["inScreenScore"] = 100123] = "inScreenScore";
	    CommandId[CommandId["cs_fadeInFTShow"] = 100124] = "cs_fadeInFTShow";
	    CommandId[CommandId["fadeInFTShow"] = 100125] = "fadeInFTShow";
	    CommandId[CommandId["cs_fadeOutFTShow"] = 100126] = "cs_fadeOutFTShow";
	    CommandId[CommandId["fadeOutFTShow"] = 100127] = "fadeOutFTShow";
	    CommandId[CommandId["cs_fadeInPlayerRank"] = 100128] = "cs_fadeInPlayerRank";
	    CommandId[CommandId["fadeInPlayerRank"] = 100129] = "fadeInPlayerRank";
	    CommandId[CommandId["cs_fadeInFtRank"] = 100130] = "cs_fadeInFtRank";
	    CommandId[CommandId["fadeInFtRank"] = 100131] = "fadeInFtRank";
	    CommandId[CommandId["cs_fadeInMixRank"] = 100132] = "cs_fadeInMixRank";
	    CommandId[CommandId["fadeInMixRank"] = 100133] = "fadeInMixRank";
	    CommandId[CommandId["cs_findPlayerData"] = 100134] = "cs_findPlayerData";
	    CommandId[CommandId["cs_attack"] = 100135] = "cs_attack";
	    CommandId[CommandId["attack"] = 100136] = "attack";
	    CommandId[CommandId["cs_addHealth"] = 100137] = "cs_addHealth";
	    CommandId[CommandId["addHealth"] = 100138] = "addHealth";
	    CommandId[CommandId["fadeInOK"] = 100139] = "fadeInOK";
	    CommandId[CommandId["cs_combo"] = 100140] = "cs_combo";
	    CommandId[CommandId["combo"] = 100141] = "combo";
	})(exports.CommandId || (exports.CommandId = {}));
	var CommandId = exports.CommandId;
	var CommandItem = (function () {
	    function CommandItem(id) {
	        this.id = id;
	    }
	    return CommandItem;
	}());
	var Command = (function () {
	    function Command() {
	        this.cmdArr = [];
	        console.log("CommandId", CommandId);
	    }
	    return Command;
	}());
	exports.Command = Command;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("process");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ }
/******/ ]);
//# sourceMappingURL=WebServer.js.map