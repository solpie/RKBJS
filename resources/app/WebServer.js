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
	var RkbModel_1 = __webpack_require__(5);
	var WebServer = (function () {
	    function WebServer(callback) {
	        this.initEnv(callback);
	        this.test();
	    }
	    WebServer.prototype.test = function () {
	    };
	    WebServer.prototype.initEnv = function (callback) {
	        var _this = this;
	        var process = __webpack_require__(11);
	        Env_1.ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
	        console.log(process.execPath, Env_1.ServerConf.isDev);
	        var fs = __webpack_require__(12);
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
	        app.engine('ejs', ejs.renderFile);
	        app.set('view engine', 'ejs');
	        app.use(express.static("./resources/app/static"));
	        app.use(bodyParser.urlencoded({ extended: false, limit: '55mb' }));
	        app.use(bodyParser.json({ limit: '50mb' }));
	        app.all("*", function (req, res, next) {
	            var start = new Date().getTime();
	            res.header('Access-Control-Allow-Origin', '*');
	            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	            if (req.method == 'OPTIONS') {
	                res.send(200);
	            }
	            else {
	                next();
	                var ms = new Date().getTime() - start;
	                if (req.url.search('.png') > -1) {
	                }
	                else
	                    console.log('%c%s %s - %s ms', "color: Green;font-weight:bold; background-color: LimeGreen;", req.method, req.url, ms);
	            }
	        });
	        app.get('/', function (req, res) {
	            res.redirect('/admin');
	        });
	        app.get('/get', function (req, res) {
	            var url = req.query.url;
	            rest(url).then(function (response) {
	                res.send(response);
	            });
	        });
	        app.use('/admin', AdminRouter_1.adminRouter);
	        app.use('/panel', PanelRouter_1.panelRouter);
	        var server = __webpack_require__(13).createServer(app);
	        server.listen(Env_1.ServerConf.port, function () {
	            _this.initSocketIO(server);
	            console.log("server on:", Env_1.ServerConf.port);
	        });
	    };
	    WebServer.prototype.initSocketIO = function (server) {
	        var io = new SocketIO(server);
	        var rkbModel = new RkbModel_1.RkbModel(io);
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
	    res.render('admin', { version: 0.5, opUrlArr: ['http://123', '21'].toString() });
	});
	exports.adminRouter.get('/sync/:gameId', function (req, res) {
	    var gameId = req.params.gameId;
	    res.send("同步面板时间 Game Id：" + gameId);
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
	    res.render('panel', { host: Env_1.ServerConf.host, wsPort: Env_1.ServerConf.wsPort, hupuWsUrl: Env_1.ServerConf.hupuWsUrl });
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var const_1 = __webpack_require__(6);
	var Command_1 = __webpack_require__(7);
	var Env_1 = __webpack_require__(2);
	var GameRkbInfo_1 = __webpack_require__(8);
	var PanelRouter_1 = __webpack_require__(4);
	var RkbModel = (function () {
	    function RkbModel(io) {
	        var _this = this;
	        this.panelWsMap = {};
	        this.gameInfo = new GameRkbInfo_1.GameRkbInfo();
	        io.on('connection', function () {
	        });
	        io = io.of("/" + const_1.PanelId.rkbPanel);
	        io
	            .on("connect", function (socket) {
	            console.log('connect');
	            socket.emit("" + Command_1.CommandId.initPanel, const_1.ScParam({ gameInfo: _this.gameInfo, isDev: Env_1.ServerConf.isDev }));
	        })
	            .on('disconnect', function (socket) {
	            console.log('disconnect');
	        });
	        this.emit = function (cmd, param) {
	            io.emit(cmd, param);
	        };
	        this.initHupuAuto();
	        this.initOp();
	    }
	    RkbModel.prototype.initHupuAuto = function () {
	        rest('http://test.jrstvapi.hupu.com/zhubo/getNodeServer').then(function (response) {
	            var a = JSON.parse(response.entity);
	            if (a && a.length) {
	                Env_1.ServerConf.hupuWsUrl = a[0];
	            }
	        });
	    };
	    RkbModel.prototype.syncGame = function (gameId) {
	        var remoteIO;
	        if (!this.panelWsMap[gameId]) {
	            remoteIO = this.panelWsMap[gameId] = io.connect(Env_1.ServerConf.hupuWsUrl);
	            remoteIO.on('connect', function () {
	                console.log('hupuAuto socket connected');
	                remoteIO.emit('passerbyking', {
	                    game_id: gameId,
	                    page: 'score'
	                });
	            });
	            remoteIO.on('wall', function (data) {
	                var event = data.et;
	                var eventMap = {};
	                console.log('event:', event, data);
	            });
	        }
	        remoteIO = this.panelWsMap[gameId];
	        remoteIO.emit('passerbyking', {
	            game_id: gameId,
	            page: "tsync"
	        });
	    };
	    RkbModel.prototype.initOp = function () {
	        var _this = this;
	        PanelRouter_1.panelRouter.post("/rkb/:cmdId", function (req, res) {
	            if (!req.body)
	                return res.sendStatus(400);
	            var cmdId = req.params.cmdId;
	            var param = req.body;
	            console.log("/rkb/" + cmdId, param);
	            var cmdMap = {};
	            cmdMap[("" + Command_1.CommandId.cs_minLeftScore)] = function () {
	                _this.gameInfo.minLeftScore();
	                _this.emit("" + Command_1.CommandId.updateLeftScore, const_1.ScParam({ leftScore: _this.gameInfo.leftScore }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_minRightScore)] = function () {
	                _this.gameInfo.minRightScore();
	                _this.emit("" + Command_1.CommandId.updateRightScore, const_1.ScParam({ rightScore: _this.gameInfo.rightScore }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_addLeftScore)] = function () {
	                var straight = _this.gameInfo.addLeftScore();
	                _this.emit("" + Command_1.CommandId.updateLeftScore, const_1.ScParam({ leftScore: _this.gameInfo.leftScore }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_addRightScore)] = function () {
	                var straight = _this.gameInfo.addRightScore();
	                _this.emit("" + Command_1.CommandId.updateRightScore, const_1.ScParam({ rightScore: _this.gameInfo.rightScore }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_unLimitScore)] = function (param) {
	                _this.gameInfo.unLimitScore = param.unLimitScore;
	                _this.emit("" + Command_1.CommandId.unLimitScore, const_1.ScParam({ unLimitScore: _this.gameInfo.unLimitScore }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_addRightFoul)] = function () {
	                var rightFoul = _this.gameInfo.addRightFoul();
	                _this.emit("" + Command_1.CommandId.updateRightFoul, const_1.ScParam({ rightFoul: rightFoul }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_minRightFoul)] = function () {
	                var rightFoul = _this.gameInfo.minRightFoul();
	                _this.emit("" + Command_1.CommandId.updateRightFoul, const_1.ScParam({ rightFoul: rightFoul }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_addLeftFoul)] = function () {
	                var leftFoul = _this.gameInfo.addLeftFoul();
	                _this.emit("" + Command_1.CommandId.updateLeftFoul, const_1.ScParam({ leftFoul: leftFoul }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_minLeftFoul)] = function () {
	                var leftFoul = _this.gameInfo.minLeftFoul();
	                _this.emit("" + Command_1.CommandId.updateLeftFoul, const_1.ScParam({ leftFoul: leftFoul }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_resetGame)] = function (param) {
	                return _this.cs_resetGame(param, cmdMap);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_toggleTimer)] = function (param) {
	                if (param) {
	                    _this.gameInfo.toggleTimer(param.state);
	                    _this.emit("" + Command_1.CommandId.toggleTimer, const_1.ScParam(param));
	                }
	                else {
	                    _this.gameInfo.toggleTimer();
	                    _this.emit("" + Command_1.CommandId.toggleTimer);
	                }
	            };
	            cmdMap[("" + Command_1.CommandId.cs_resetTimer)] = function () {
	                _this.gameInfo.resetTimer();
	                _this.emit("" + Command_1.CommandId.resetTimer);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updatePlayer)] = function (param) {
	                return _this.cs_updatePlayer(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updatePlayerAll)] = function (param) {
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updateKingPlayer)] = function (param) {
	                _this.gameInfo.kingPlayer = param.kingPlayer;
	                _this.emit("" + Command_1.CommandId.updateKingPlayer, const_1.ScParam({ kingPlayer: _this.gameInfo.kingPlayer }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updatePlayerState)] = function (param) {
	            };
	            cmdMap[("" + Command_1.CommandId.cs_setActPlayer)] = function (param) {
	                return _this.cs_setActPlayer(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_setGameIdx)] = function (param) {
	                _this.gameInfo.gameIdx = param.gameIdx;
	                _this.emit("" + Command_1.CommandId.setGameIdx, const_1.ScParam(param));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInActivityPanel)] = function (param) {
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeOutActivityPanel)] = function (param) {
	                _this.emit("" + Command_1.CommandId.fadeOutActivityPanel);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updatePlayerBackNum)] = function (param) {
	                _this.emit("" + Command_1.CommandId.updatePlayerBackNum, const_1.ScParam(param));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_startingLine)] = function (param) {
	                _this.emit("" + Command_1.CommandId.startingLine, const_1.ScParam({ playerDocArr: _this.gameInfo.getPlayerDocArr() }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_hideStartingLine)] = function (param) {
	                _this.emit("" + Command_1.CommandId.hideStartingLine);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInCountDown)] = function (param) {
	                _this.emit("" + Command_1.CommandId.fadeInCountDown, param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeOutCountDown)] = function (param) {
	                _this.emit("" + Command_1.CommandId.fadeOutCountDown);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInWinPanel)] = function (param) {
	                var isBlueWin = _this.gameInfo.leftScore > _this.gameInfo.rightScore;
	                var playerDoc;
	                if (isBlueWin)
	                    playerDoc = _this.gameInfo.getPlayerDocArr()[0];
	                else
	                    playerDoc = _this.gameInfo.getPlayerDocArr()[1];
	                if (playerDoc.id == Env_1.ServerConf.king) {
	                    playerDoc.isKing = true;
	                }
	                _this.emit("" + Command_1.CommandId.fadeInWinPanel, const_1.ScParam({
	                    isBlue: isBlueWin,
	                    playerDoc: playerDoc
	                }));
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeOutWinPanel)] = function (param) {
	                _this.emit("" + Command_1.CommandId.fadeOutWinPanel);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_getBracketPlayerByIdx)] = function (param) {
	                var actDoc = _this.getActDoc();
	                var bracketIdx = param.bracketIdx;
	                var bracketDoc = actDoc.bracket[bracketIdx];
	                console.log('bracketDoc', bracketDoc);
	                if (bracketDoc) {
	                    cmdMap[("" + Command_1.CommandId.cs_updatePlayer)]({
	                        idx: 0,
	                        playerId: bracketDoc.gameInfoArr[0].id
	                    });
	                    cmdMap[("" + Command_1.CommandId.cs_updatePlayer)]({
	                        idx: 1,
	                        playerId: bracketDoc.gameInfoArr[1].id
	                    });
	                }
	            };
	            cmdMap[("" + Command_1.CommandId.cs_setBracketPlayer)] = function (param) {
	            };
	            cmdMap[("" + Command_1.CommandId.cs_refreshClient)] = function (param) {
	            };
	            cmdMap[("" + Command_1.CommandId.cs_changeColor)] = function (param) {
	                return _this.cs_changeColor(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_clearActPlayerGameRec)] = function (param) {
	                return _this.cs_clearActPlayerGameRec(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_updateWinScore)] = function (param) {
	                return _this.cs_updateWinScore(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_saveGameRec)] = function (param) {
	                return _this.cs_saveGameRec(param, res);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_setCursorPlayer)] = function (param) {
	                return _this.cs_setCursorPlayer(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_saveToTotalScore)] = function (param) {
	                return _this.cs_saveToTotalScore(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInPlayerRank)] = function (param) {
	                return _this.cs_fadeInPlayerRank(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInFtRank)] = function (param) {
	                return _this.cs_fadeInFtRank(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInFTShow)] = function (param) {
	                return _this.cs_fadeInFTShow(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeOutFTShow)] = function (param) {
	                return _this.cs_fadeOutFTShow(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_fadeInMixRank)] = function (param) {
	                return _this.cs_fadeInMixRank(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_setScorePanelVisible)] = function (param) {
	                return _this.cs_setScorePanelVisible(param);
	            };
	            cmdMap[("" + Command_1.CommandId.cs_autoSaveGameRec)] = function (param) {
	                return _this.cs_autoSaveGameRec(param);
	            };
	            if (param.hasOwnProperty("_")) {
	                var autoCmdId = cmdId.replace("cs_", "");
	                _this.emit(autoCmdId, param);
	                res.sendStatus(200);
	            }
	            else {
	                var isSend = cmdMap[cmdId](param);
	                if (!isSend)
	                    res.sendStatus(200);
	            }
	        });
	    };
	    RkbModel.prototype.cs_autoSaveGameRec = function (param) {
	        this.emit("" + Command_1.CommandId.setScorePanelVisible, const_1.ScParam(param));
	    };
	    RkbModel.prototype.cs_setScorePanelVisible = function (param) {
	        this.emit("" + Command_1.CommandId.setScorePanelVisible, const_1.ScParam(param));
	    };
	    RkbModel.prototype.cs_updatePlayer = function (param) {
	        var playerId = param.playerId;
	        var playerIdx = param.idx;
	    };
	    RkbModel.prototype.getFlyPlayerDoc = function (id) {
	    };
	    RkbModel.prototype.cs_clearActPlayerGameRec = function (param) {
	    };
	    RkbModel.prototype.cs_saveToTotalScore = function (param) {
	    };
	    RkbModel.prototype.cs_setCursorPlayer = function (param) {
	    };
	    RkbModel.prototype.cs_changeColor = function (param) {
	    };
	    RkbModel.prototype.cs_resetGame = function (param, cmdMap) {
	    };
	    RkbModel.prototype.cs_saveGameRec = function (param, res) {
	    };
	    RkbModel.prototype.cs_updateWinScore = function (param) {
	        console.log('cs_updateWinScore', param);
	        this.gameInfo.winScore = param.winScore;
	        this.emit("" + Command_1.CommandId.updateWinScore, const_1.ScParam(param));
	    };
	    RkbModel.prototype.cs_setActPlayer = function (param) {
	    };
	    RkbModel.prototype.cs_fadeInFTShow = function (param) {
	    };
	    RkbModel.prototype.cs_fadeOutFTShow = function (param) {
	        this.emit("" + Command_1.CommandId.fadeOutFTShow, param);
	    };
	    RkbModel.prototype.cs_fadeInFtRank = function (param) {
	    };
	    RkbModel.prototype.cs_fadeInMixRank = function (param) {
	    };
	    RkbModel.prototype.cs_fadeInPlayerRank = function (param) {
	    };
	    RkbModel.prototype.startGame = function (gameId) {
	    };
	    RkbModel.prototype.refreshBracket = function (actDoc) {
	    };
	    RkbModel.prototype.getActDoc = function () {
	    };
	    RkbModel.prototype.quePlayer = function (playerId, isout) {
	    };
	    return RkbModel;
	}());
	exports.RkbModel = RkbModel;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	exports.PanelId = {
	    stagePanel: 'stage',
	    stage1v1Panel: 'stage1v1',
	    rkbPanel: 'rkb',
	    bracketPanel: 'bracket',
	    rankPanel: 'rankPanel',
	    onlinePanel: 'online',
	    winPanel: 'win',
	    actPanel: 'act',
	    screenPanel: 'screen',
	    playerPanel: 'player'
	};
	exports.ServerConst = {
	    SEND_ASYNC: true,
	    DEF_AVATAR: '/img/panel/stage1v1/blue.png'
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
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var cmdEnum;
	(function (cmdEnum) {
	    cmdEnum[cmdEnum["dmkPush"] = 0] = "dmkPush";
	    cmdEnum[cmdEnum["toggleTracker"] = 1] = "toggleTracker";
	    cmdEnum[cmdEnum["toggleBallRolling"] = 2] = "toggleBallRolling";
	    cmdEnum[cmdEnum["toggleTimer"] = 3] = "toggleTimer";
	    cmdEnum[cmdEnum["cs_toggleTimer"] = 4] = "cs_toggleTimer";
	    cmdEnum[cmdEnum["resetTimer"] = 5] = "resetTimer";
	    cmdEnum[cmdEnum["cs_resetTimer"] = 6] = "cs_resetTimer";
	    cmdEnum[cmdEnum["disableTracker"] = 7] = "disableTracker";
	    cmdEnum[cmdEnum["updateLeftScore"] = 8] = "updateLeftScore";
	    cmdEnum[cmdEnum["cs_addLeftScore"] = 9] = "cs_addLeftScore";
	    cmdEnum[cmdEnum["updateRightScore"] = 10] = "updateRightScore";
	    cmdEnum[cmdEnum["cs_addRightScore"] = 11] = "cs_addRightScore";
	    cmdEnum[cmdEnum["updateLeftBall"] = 12] = "updateLeftBall";
	    cmdEnum[cmdEnum["updateRightBall"] = 13] = "updateRightBall";
	    cmdEnum[cmdEnum["cs_addLeftBall"] = 14] = "cs_addLeftBall";
	    cmdEnum[cmdEnum["cs_addRightBall"] = 15] = "cs_addRightBall";
	    cmdEnum[cmdEnum["cs_minLeftBall"] = 16] = "cs_minLeftBall";
	    cmdEnum[cmdEnum["cs_minRightBall"] = 17] = "cs_minRightBall";
	    cmdEnum[cmdEnum["cs_updateInitBallCount"] = 18] = "cs_updateInitBallCount";
	    cmdEnum[cmdEnum["minLeftScore"] = 19] = "minLeftScore";
	    cmdEnum[cmdEnum["cs_minLeftScore"] = 20] = "cs_minLeftScore";
	    cmdEnum[cmdEnum["minRightScore"] = 21] = "minRightScore";
	    cmdEnum[cmdEnum["cs_minRightScore"] = 22] = "cs_minRightScore";
	    cmdEnum[cmdEnum["updateLeftFoul"] = 23] = "updateLeftFoul";
	    cmdEnum[cmdEnum["cs_addLeftFoul"] = 24] = "cs_addLeftFoul";
	    cmdEnum[cmdEnum["cs_minLeftFoul"] = 25] = "cs_minLeftFoul";
	    cmdEnum[cmdEnum["updateRightFoul"] = 26] = "updateRightFoul";
	    cmdEnum[cmdEnum["cs_addRightFoul"] = 27] = "cs_addRightFoul";
	    cmdEnum[cmdEnum["cs_minRightFoul"] = 28] = "cs_minRightFoul";
	    cmdEnum[cmdEnum["cs_updateLeftSkill"] = 29] = "cs_updateLeftSkill";
	    cmdEnum[cmdEnum["updateLeftSkill"] = 30] = "updateLeftSkill";
	    cmdEnum[cmdEnum["cs_updateRightSkill"] = 31] = "cs_updateRightSkill";
	    cmdEnum[cmdEnum["updateRightSkill"] = 32] = "updateRightSkill";
	    cmdEnum[cmdEnum["stageFadeOut"] = 33] = "stageFadeOut";
	    cmdEnum[cmdEnum["cs_fadeOut"] = 34] = "cs_fadeOut";
	    cmdEnum[cmdEnum["playerScore"] = 35] = "playerScore";
	    cmdEnum[cmdEnum["cs_playerScore"] = 36] = "cs_playerScore";
	    cmdEnum[cmdEnum["stageFadeIn"] = 37] = "stageFadeIn";
	    cmdEnum[cmdEnum["cs_stageFadeIn"] = 38] = "cs_stageFadeIn";
	    cmdEnum[cmdEnum["moveStagePanel"] = 39] = "moveStagePanel";
	    cmdEnum[cmdEnum["cs_moveStagePanel"] = 40] = "cs_moveStagePanel";
	    cmdEnum[cmdEnum["updatePlayer"] = 41] = "updatePlayer";
	    cmdEnum[cmdEnum["cs_updatePlayer"] = 42] = "cs_updatePlayer";
	    cmdEnum[cmdEnum["updatePlayerAll"] = 43] = "updatePlayerAll";
	    cmdEnum[cmdEnum["cs_changeColor"] = 44] = "cs_changeColor";
	    cmdEnum[cmdEnum["cs_updatePlayerAll"] = 45] = "cs_updatePlayerAll";
	    cmdEnum[cmdEnum["cs_updatePlayerBackNum"] = 46] = "cs_updatePlayerBackNum";
	    cmdEnum[cmdEnum["updatePlayerBackNum"] = 47] = "updatePlayerBackNum";
	    cmdEnum[cmdEnum["fadeInNotice"] = 48] = "fadeInNotice";
	    cmdEnum[cmdEnum["cs_fadeInNotice"] = 49] = "cs_fadeInNotice";
	    cmdEnum[cmdEnum["cs_resetGame"] = 50] = "cs_resetGame";
	    cmdEnum[cmdEnum["cs_toggleDmk"] = 51] = "cs_toggleDmk";
	    cmdEnum[cmdEnum["toggleDmk"] = 52] = "toggleDmk";
	    cmdEnum[cmdEnum["resetGame"] = 53] = "resetGame";
	    cmdEnum[cmdEnum["cs_unLimitScore"] = 54] = "cs_unLimitScore";
	    cmdEnum[cmdEnum["unLimitScore"] = 55] = "unLimitScore";
	    cmdEnum[cmdEnum["cs_updatePlayerState"] = 56] = "cs_updatePlayerState";
	    cmdEnum[cmdEnum["updatePlayerState"] = 57] = "updatePlayerState";
	    cmdEnum[cmdEnum["cs_setGameIdx"] = 58] = "cs_setGameIdx";
	    cmdEnum[cmdEnum["setGameIdx"] = 59] = "setGameIdx";
	    cmdEnum[cmdEnum["fadeInWinPanel"] = 60] = "fadeInWinPanel";
	    cmdEnum[cmdEnum["cs_fadeInWinPanel"] = 61] = "cs_fadeInWinPanel";
	    cmdEnum[cmdEnum["fadeOutWinPanel"] = 62] = "fadeOutWinPanel";
	    cmdEnum[cmdEnum["cs_fadeOutWinPanel"] = 63] = "cs_fadeOutWinPanel";
	    cmdEnum[cmdEnum["saveGameRec"] = 64] = "saveGameRec";
	    cmdEnum[cmdEnum["cs_saveGameRec"] = 65] = "cs_saveGameRec";
	    cmdEnum[cmdEnum["cs_fadeInFinalPlayer"] = 66] = "cs_fadeInFinalPlayer";
	    cmdEnum[cmdEnum["fadeInFinalPlayer"] = 67] = "fadeInFinalPlayer";
	    cmdEnum[cmdEnum["cs_fadeOutFinalPlayer"] = 68] = "cs_fadeOutFinalPlayer";
	    cmdEnum[cmdEnum["fadeOutFinalPlayer"] = 69] = "fadeOutFinalPlayer";
	    cmdEnum[cmdEnum["cs_setActPlayer"] = 70] = "cs_setActPlayer";
	    cmdEnum[cmdEnum["cs_setBracketPlayer"] = 71] = "cs_setBracketPlayer";
	    cmdEnum[cmdEnum["cs_clearActPlayerGameRec"] = 72] = "cs_clearActPlayerGameRec";
	    cmdEnum[cmdEnum["cs_getBracketPlayerByIdx"] = 73] = "cs_getBracketPlayerByIdx";
	    cmdEnum[cmdEnum["cs_refreshClient"] = 74] = "cs_refreshClient";
	    cmdEnum[cmdEnum["refreshClient"] = 75] = "refreshClient";
	    cmdEnum[cmdEnum["cs_updateWinScore"] = 76] = "cs_updateWinScore";
	    cmdEnum[cmdEnum["updateWinScore"] = 77] = "updateWinScore";
	    cmdEnum[cmdEnum["cs_updateKingPlayer"] = 78] = "cs_updateKingPlayer";
	    cmdEnum[cmdEnum["updateKingPlayer"] = 79] = "updateKingPlayer";
	    cmdEnum[cmdEnum["cs_setCursorPlayer"] = 80] = "cs_setCursorPlayer";
	    cmdEnum[cmdEnum["setCursorPlayer"] = 81] = "setCursorPlayer";
	    cmdEnum[cmdEnum["cs_saveToTotalScore"] = 82] = "cs_saveToTotalScore";
	    cmdEnum[cmdEnum["cs_setScorePanelVisible"] = 83] = "cs_setScorePanelVisible";
	    cmdEnum[cmdEnum["setScorePanelVisible"] = 84] = "setScorePanelVisible";
	    cmdEnum[cmdEnum["cs_autoSaveGameRec"] = 85] = "cs_autoSaveGameRec";
	    cmdEnum[cmdEnum["cs_setDelayTime"] = 86] = "cs_setDelayTime";
	    cmdEnum[cmdEnum["setDelayTime"] = 87] = "setDelayTime";
	    cmdEnum[cmdEnum["cs_startingLine"] = 88] = "cs_startingLine";
	    cmdEnum[cmdEnum["startingLine"] = 89] = "startingLine";
	    cmdEnum[cmdEnum["cs_hideStartingLine"] = 90] = "cs_hideStartingLine";
	    cmdEnum[cmdEnum["hideStartingLine"] = 91] = "hideStartingLine";
	    cmdEnum[cmdEnum["cs_queryPlayerByPos"] = 92] = "cs_queryPlayerByPos";
	    cmdEnum[cmdEnum["fadeInPlayerPanel"] = 93] = "fadeInPlayerPanel";
	    cmdEnum[cmdEnum["cs_fadeInPlayerPanel"] = 94] = "cs_fadeInPlayerPanel";
	    cmdEnum[cmdEnum["fadeOutPlayerPanel"] = 95] = "fadeOutPlayerPanel";
	    cmdEnum[cmdEnum["cs_fadeOutPlayerPanel"] = 96] = "cs_fadeOutPlayerPanel";
	    cmdEnum[cmdEnum["movePlayerPanel"] = 97] = "movePlayerPanel";
	    cmdEnum[cmdEnum["cs_movePlayerPanel"] = 98] = "cs_movePlayerPanel";
	    cmdEnum[cmdEnum["straightScore3"] = 99] = "straightScore3";
	    cmdEnum[cmdEnum["straightScore5"] = 100] = "straightScore5";
	    cmdEnum[cmdEnum["initPanel"] = 101] = "initPanel";
	    cmdEnum[cmdEnum["cs_fadeInActivityPanel"] = 102] = "cs_fadeInActivityPanel";
	    cmdEnum[cmdEnum["fadeInActivityPanel"] = 103] = "fadeInActivityPanel";
	    cmdEnum[cmdEnum["cs_fadeInNextActivity"] = 104] = "cs_fadeInNextActivity";
	    cmdEnum[cmdEnum["fadeInNextActivity"] = 105] = "fadeInNextActivity";
	    cmdEnum[cmdEnum["cs_fadeInActivityExGame"] = 106] = "cs_fadeInActivityExGame";
	    cmdEnum[cmdEnum["fadeInActivityExGame"] = 107] = "fadeInActivityExGame";
	    cmdEnum[cmdEnum["cs_fadeOutActivityPanel"] = 108] = "cs_fadeOutActivityPanel";
	    cmdEnum[cmdEnum["fadeOutActivityPanel"] = 109] = "fadeOutActivityPanel";
	    cmdEnum[cmdEnum["cs_startGame"] = 110] = "cs_startGame";
	    cmdEnum[cmdEnum["cs_restartGame"] = 111] = "cs_restartGame";
	    cmdEnum[cmdEnum["cs_fadeInRankPanel"] = 112] = "cs_fadeInRankPanel";
	    cmdEnum[cmdEnum["fadeInRankPanel"] = 113] = "fadeInRankPanel";
	    cmdEnum[cmdEnum["cs_fadeInNextRank"] = 114] = "cs_fadeInNextRank";
	    cmdEnum[cmdEnum["fadeInNextRank"] = 115] = "fadeInNextRank";
	    cmdEnum[cmdEnum["cs_setGameComing"] = 116] = "cs_setGameComing";
	    cmdEnum[cmdEnum["setGameComing"] = 117] = "setGameComing";
	    cmdEnum[cmdEnum["cs_fadeOutRankPanel"] = 118] = "cs_fadeOutRankPanel";
	    cmdEnum[cmdEnum["fadeOutRankPanel"] = 119] = "fadeOutRankPanel";
	    cmdEnum[cmdEnum["cs_fadeInCountDown"] = 120] = "cs_fadeInCountDown";
	    cmdEnum[cmdEnum["fadeInCountDown"] = 121] = "fadeInCountDown";
	    cmdEnum[cmdEnum["cs_fadeOutCountDown"] = 122] = "cs_fadeOutCountDown";
	    cmdEnum[cmdEnum["fadeOutCountDown"] = 123] = "fadeOutCountDown";
	    cmdEnum[cmdEnum["cs_inScreenScore"] = 124] = "cs_inScreenScore";
	    cmdEnum[cmdEnum["inScreenScore"] = 125] = "inScreenScore";
	    cmdEnum[cmdEnum["cs_fadeInFTShow"] = 126] = "cs_fadeInFTShow";
	    cmdEnum[cmdEnum["fadeInFTShow"] = 127] = "fadeInFTShow";
	    cmdEnum[cmdEnum["cs_fadeOutFTShow"] = 128] = "cs_fadeOutFTShow";
	    cmdEnum[cmdEnum["fadeOutFTShow"] = 129] = "fadeOutFTShow";
	    cmdEnum[cmdEnum["cs_fadeInPlayerRank"] = 130] = "cs_fadeInPlayerRank";
	    cmdEnum[cmdEnum["fadeInPlayerRank"] = 131] = "fadeInPlayerRank";
	    cmdEnum[cmdEnum["cs_fadeInFtRank"] = 132] = "cs_fadeInFtRank";
	    cmdEnum[cmdEnum["fadeInFtRank"] = 133] = "fadeInFtRank";
	    cmdEnum[cmdEnum["cs_fadeInMixRank"] = 134] = "cs_fadeInMixRank";
	    cmdEnum[cmdEnum["fadeInMixRank"] = 135] = "fadeInMixRank";
	    cmdEnum[cmdEnum["cs_findPlayerData"] = 136] = "cs_findPlayerData";
	    cmdEnum[cmdEnum["cs_attack"] = 137] = "cs_attack";
	    cmdEnum[cmdEnum["attack"] = 138] = "attack";
	    cmdEnum[cmdEnum["cs_addHealth"] = 139] = "cs_addHealth";
	    cmdEnum[cmdEnum["addHealth"] = 140] = "addHealth";
	    cmdEnum[cmdEnum["fadeInOK"] = 141] = "fadeInOK";
	    cmdEnum[cmdEnum["cs_combo"] = 142] = "cs_combo";
	    cmdEnum[cmdEnum["combo"] = 143] = "combo";
	})(cmdEnum || (cmdEnum = {}));
	exports.CommandId = {};
	for (var k in cmdEnum) {
	    exports.CommandId[k] = k;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var PlayerInfo_1 = __webpack_require__(9);
	var BaseInfo_1 = __webpack_require__(10);
	var const_1 = __webpack_require__(6);
	exports.bracketMap = {
	    "1": { 'loser': [5, 0], 'winner': [7, 0] },
	    "2": { 'loser': [5, 1], 'winner': [7, 1] },
	    "3": { 'loser': [6, 0], 'winner': [8, 0] },
	    "4": { 'loser': [6, 1], 'winner': [8, 1] },
	    "5": { 'loser': [-1, 0], 'winner': [10, 1] },
	    "6": { 'loser': [-1, 0], 'winner': [9, 1] },
	    "7": { 'loser': [9, 0], 'winner': [11, 0] },
	    "8": { 'loser': [10, 0], 'winner': [11, 1] },
	    "9": { 'loser': [-1, 0], 'winner': [12, 1] },
	    "10": { 'loser': [-1, 0], 'winner': [12, 0] },
	    "11": { 'loser': [13, 0], 'winner': [14, 0] },
	    "12": { 'loser': [-1, 0], 'winner': [13, 1] },
	    "13": { 'loser': [-1, 0], 'winner': [14, 1] }
	};
	var GameRkbInfo = (function () {
	    function GameRkbInfo(gameDoc) {
	        this.leftFoul = 0;
	        this.rightFoul = 0;
	        this.playerInfoArr = new Array(2);
	        this.gameIdx = 0;
	        this.winScore = 2;
	        this.gameState = 0;
	        this.kingPlayer = 0;
	        this._timer = null;
	        this.timerState = 0;
	        this.time = 0;
	        this.rightScore = 0;
	        this.leftScore = 0;
	        this._startDate = new Date().getTime();
	        if (gameDoc) {
	            BaseInfo_1.setPropTo(gameDoc, this);
	            var playerDocArr = this.playerInfoArr;
	            this.playerInfoArr = [];
	            for (var i = 0; i < playerDocArr.length; i++) {
	                this.playerInfoArr.push(new PlayerInfo_1.PlayerInfo(playerDocArr[i]));
	            }
	        }
	    }
	    GameRkbInfo.prototype.addLeftScore = function () {
	        if (this.unLimitScore === 1)
	            this.leftScore += 1;
	        else
	            this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
	    };
	    GameRkbInfo.prototype.addRightScore = function () {
	        if (this.unLimitScore === 1)
	            this.rightScore += 1;
	        else
	            this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
	    };
	    GameRkbInfo.prototype.minRightScore = function () {
	        this.rightScore = (this.rightScore - 1) % (this.winScore + 1);
	    };
	    GameRkbInfo.prototype.minLeftScore = function () {
	        this.leftScore = (this.leftScore - 1) % (this.winScore + 1);
	    };
	    GameRkbInfo.prototype.setPlayerInfoByIdx = function (pos, playerInfo) {
	        this.playerInfoArr[pos] = playerInfo;
	        return playerInfo;
	    };
	    GameRkbInfo.prototype.saveGameResult = function () {
	        if (this.gameState === 0) {
	            var isBlueWin = this.leftScore > this.rightScore;
	            var bluePlayerDoc = this.playerInfoArr[0].playerData;
	            var redPlayerDoc = this.playerInfoArr[1].playerData;
	            bluePlayerDoc.ftScore ? bluePlayerDoc.ftScore += this.leftScore : bluePlayerDoc.ftScore = this.leftScore;
	            bluePlayerDoc.curFtScore ? bluePlayerDoc.curFtScore += this.leftScore : bluePlayerDoc.curFtScore = this.leftScore;
	            bluePlayerDoc.dtScore = this.leftScore;
	            redPlayerDoc.ftScore ? redPlayerDoc.ftScore += this.rightScore : redPlayerDoc.ftScore = this.rightScore;
	            redPlayerDoc.curFtScore ? redPlayerDoc.curFtScore += this.rightScore : redPlayerDoc.curFtScore = this.rightScore;
	            redPlayerDoc.dtScore = this.rightScore;
	            if (isBlueWin) {
	                this.loserPlayerInfo = this.playerInfoArr[1];
	                this.loserPlayerInfo.isBlue = false;
	                this.winner_Idx = [this.playerInfoArr[0].playerData.id, 0];
	                this.loser_Idx = [this.playerInfoArr[1].playerData.id, 1];
	                PlayerInfo_1.PlayerInfo.addWinGameAmount(this.playerInfoArr[0].playerData);
	                PlayerInfo_1.PlayerInfo.addLoseGameAmount(this.playerInfoArr[1].playerData);
	            }
	            else {
	                this.winner_Idx = [this.playerInfoArr[1].playerData.id, 1];
	                this.loser_Idx = [this.playerInfoArr[0].playerData.id, 0];
	                this.loserPlayerInfo = this.playerInfoArr[0];
	                this.loserPlayerInfo.isBlue = true;
	                PlayerInfo_1.PlayerInfo.addLoseGameAmount(this.playerInfoArr[0].playerData);
	                PlayerInfo_1.PlayerInfo.addWinGameAmount(this.playerInfoArr[1].playerData);
	            }
	            this.gameState = 1;
	        }
	    };
	    Object.defineProperty(GameRkbInfo.prototype, "isFinish", {
	        get: function () {
	            return this.gameState != 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    GameRkbInfo.prototype.getGameDoc = function () {
	        var g = {};
	        var date = new Date();
	        g.time = this.time;
	        var winner = this.playerInfoArr[this.winner_Idx[1]].playerData;
	        var loser = this.playerInfoArr[this.loser_Idx[1]].playerData;
	        g.idx = this.gameIdx;
	        g.start = this._startDate;
	        g.end = date.getTime();
	        var gameDoc = function (playerDoc) {
	            return { name: playerDoc.name, _id: playerDoc._id, score: playerDoc.dtScore };
	        };
	        g.blueFoul = this.leftFoul;
	        g.redFoul = this.rightFoul;
	        g.winner = gameDoc(winner);
	        g.loser = gameDoc(loser);
	        console.log('getGameDoc', g);
	        return g;
	    };
	    GameRkbInfo.prototype.getPlayerDocArr = function () {
	        var a = [];
	        for (var i = 0; i < this.playerInfoArr.length; i++) {
	            a.push(this.playerInfoArr[i].playerData);
	        }
	        return a;
	    };
	    GameRkbInfo.prototype.toggleTimer = function (state) {
	        var _this = this;
	        if (state) {
	            if (state === const_1.TimerState.PAUSE) {
	                this.resetTimer();
	            }
	        }
	        else {
	            if (this._timer) {
	                this.resetTimer();
	            }
	            else {
	                this._timer = setInterval(function () {
	                    _this.time++;
	                }, 1000);
	                this.timerState = 1;
	            }
	        }
	    };
	    GameRkbInfo.prototype.resetTimer = function () {
	        clearInterval(this._timer);
	        this._timer = 0;
	        this.timerState = 0;
	    };
	    GameRkbInfo.prototype.addRightFoul = function () {
	        this.rightFoul++;
	        return this.rightFoul;
	    };
	    GameRkbInfo.prototype.minRightFoul = function () {
	        this.rightFoul--;
	        return this.rightFoul;
	    };
	    GameRkbInfo.prototype.addLeftFoul = function () {
	        this.leftFoul++;
	        return this.leftFoul;
	    };
	    GameRkbInfo.prototype.minLeftFoul = function () {
	        this.leftFoul--;
	        return this.leftFoul;
	    };
	    return GameRkbInfo;
	}());
	exports.GameRkbInfo = GameRkbInfo;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseInfo_1 = __webpack_require__(10);
	var PlayerDoc = (function () {
	    function PlayerDoc() {
	        this.id = 0;
	        this.name = '';
	        this.phone = 0;
	        this.eloScore = 0;
	        this.style = 0;
	        this.avatar = "";
	        this.height = 0;
	        this.weight = 0;
	        this.dtScore = 0;
	        this.activityId = 0;
	        this.gameRec = [];
	        this.loseGameCount = 0;
	        this.winGameCount = 0;
	        this.ftId = 0;
	        this.ftScore = 0;
	        this.playerNum = 0;
	        this.curFtScore = 0;
	        this.location = '上海';
	    }
	    return PlayerDoc;
	}());
	exports.PlayerDoc = PlayerDoc;
	exports.PlayerState1v1 = {
	    FIGHTING: ' ',
	    PIGEON: '鸽子',
	    WAITING: '  ',
	    Dead: '淘汰'
	};
	var PlayerInfo = (function (_super) {
	    __extends(PlayerInfo, _super);
	    function PlayerInfo(playerData) {
	        _super.call(this);
	        this.playerData = new PlayerDoc();
	        this.isRed = true;
	        this.isMvp = false;
	        this.backNumber = 0;
	        if (playerData) {
	            if (playerData['playerData'] != null) {
	                this.playerData = BaseInfo_1.obj2Class(playerData.playerData, PlayerDoc);
	                this.setPlayerInfoFromData(playerData);
	            }
	            else {
	                this.playerData = BaseInfo_1.obj2Class(playerData, PlayerDoc);
	                this.setPlayerInfoFromData(playerData);
	            }
	        }
	    }
	    PlayerInfo.prototype.setPlayerInfoFromData = function (data) {
	        if (data['isRed'] != null)
	            this.isRed = data.isRed;
	        if (data['isMvp'] != null)
	            this.isMvp = data.isMvp;
	        if (data['backNumber'] != null)
	            this.backNumber = data.backNumber;
	    };
	    PlayerInfo.prototype.getPlayerData = function () {
	        this.playerData['isRed'] = this.isRed;
	        this.playerData['isMvp'] = this.isMvp;
	        this.playerData['backNumber'] = this.backNumber;
	        return this.playerData;
	    };
	    PlayerInfo.prototype.id = function (val) {
	        return BaseInfo_1.prop(this.playerData, "id", val);
	    };
	    PlayerInfo.prototype.phone = function (val) {
	        return BaseInfo_1.prop(this.playerData, "phone", val);
	    };
	    PlayerInfo.prototype.name = function (val) {
	        return BaseInfo_1.prop(this.playerData, "name", val);
	    };
	    PlayerInfo.prototype.activityId = function (val) {
	        return BaseInfo_1.prop(this.playerData, "activityId", val);
	    };
	    PlayerInfo.prototype.eloScore = function (val) {
	        return BaseInfo_1.prop(this.playerData, "eloScore", val);
	    };
	    PlayerInfo.prototype.dtScore = function (val) {
	        return BaseInfo_1.prop(this.playerData, "dtScore", val);
	    };
	    PlayerInfo.prototype.style = function (val) {
	        return BaseInfo_1.prop(this.playerData, "style", val);
	    };
	    PlayerInfo.prototype.avatar = function (val) {
	        return BaseInfo_1.prop(this.playerData, "avatar", val);
	    };
	    PlayerInfo.prototype.gameRec = function (val) {
	        return BaseInfo_1.prop(this.playerData, "gameRec", val);
	    };
	    PlayerInfo.winPercent = function (playerDoc) {
	        var p = playerDoc.winGameCount / PlayerInfo.gameCount(playerDoc);
	        if (!p)
	            p = 0;
	        return p;
	    };
	    PlayerInfo.winPercentStr = function (playerDoc) {
	        return (PlayerInfo.winPercent(playerDoc) * 100).toFixed(1) + "%";
	    };
	    PlayerInfo.weight = function (playerDoc) {
	        return playerDoc.weight || playerDoc.playerData.weight;
	    };
	    PlayerInfo.height = function (playerDoc) {
	        return playerDoc.height || playerDoc.playerData.height;
	    };
	    PlayerInfo.intro = function (playerDoc) {
	        return playerDoc.intro || playerDoc.playerData.intro;
	    };
	    PlayerInfo.prototype.winpercent = function (val) {
	        return this.winGameCount() / this.gameCount();
	    };
	    PlayerInfo.gameCount = function (playerDoc) {
	        return (playerDoc.loseGameCount + playerDoc.winGameCount) || 0;
	    };
	    PlayerInfo.addWinGameAmount = function (playerDoc) {
	        playerDoc.winGameCount++;
	        return playerDoc.winGameCount;
	    };
	    PlayerInfo.addLoseGameAmount = function (playerDoc) {
	        playerDoc.loseGameCount++;
	        return playerDoc.loseGameCount;
	    };
	    PlayerInfo.prototype.gameCount = function () {
	        return this.loseGameCount() + this.winGameCount();
	    };
	    PlayerInfo.prototype.winGameCount = function (val) {
	        return BaseInfo_1.prop(this.playerData, "winGameCount", val);
	    };
	    PlayerInfo.prototype.loseGameCount = function (val) {
	        return BaseInfo_1.prop(this.playerData, "loseGameCount", val);
	    };
	    PlayerInfo.prototype.getWinPercent = function () {
	        return (this.winpercent() * 100).toFixed(1) + "%";
	    };
	    PlayerInfo.getStyleIcon = function (style) {
	        var path = '/img/panel/stage/';
	        if (style === 1) {
	            path += 'feng.png';
	        }
	        else if (style === 2) {
	            path += 'lin.png';
	        }
	        else if (style === 3) {
	            path += 'huo.png';
	        }
	        else if (style === 4) {
	            path += 'shan.png';
	        }
	        return path;
	    };
	    PlayerInfo.prototype.getWinStyleIcon = function () {
	        var path = '/img/panel/stage/win/';
	        if (this.style() == 1) {
	            path += 'fengWin.png';
	        }
	        else if (this.style() == 2) {
	            path += 'linWin.png';
	        }
	        else if (this.style() == 3) {
	            path += 'huoWin.png';
	        }
	        else if (this.style() == 4) {
	            path += 'shanWin.png';
	        }
	        return path;
	    };
	    PlayerInfo.prototype.getRec = function () {
	        return { id: this.id(), eloScore: this.eloScore(), dtScore: this.dtScore() };
	    };
	    PlayerInfo.prototype.saveScore = function (dtScore, isWin) {
	        this.dtScore(dtScore);
	        this.eloScore(this.eloScore() + dtScore);
	        if (isWin) {
	            this.winGameCount(this.winGameCount() + 1);
	        }
	        else
	            this.loseGameCount(this.loseGameCount() + 1);
	    };
	    PlayerInfo.prototype.getCurWinningPercent = function () {
	        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
	    };
	    return PlayerInfo;
	}(BaseInfo_1.BaseInfo));
	exports.PlayerInfo = PlayerInfo;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.isdef = function (val) {
	    return val != undefined;
	};
	exports.prop = function (obj, paramName, v, callback) {
	    if (exports.isdef(v)) {
	        obj[paramName] = v;
	        if (callback)
	            callback();
	    }
	    else
	        return obj[paramName];
	};
	exports.obj2Class = function (obj, cls) {
	    var c = new cls;
	    for (var paramName in obj) {
	        c[paramName] = obj[paramName];
	    }
	    return c;
	};
	function setPropTo(data, obj) {
	    for (var key in data) {
	        if (obj.hasOwnProperty(key))
	            obj[key] = data[key];
	    }
	}
	exports.setPropTo = setPropTo;
	var BaseDoc = (function () {
	    function BaseDoc() {
	    }
	    return BaseDoc;
	}());
	exports.BaseDoc = BaseDoc;
	var BaseInfo = (function () {
	    function BaseInfo() {
	    }
	    return BaseInfo;
	}());
	exports.BaseInfo = BaseInfo;


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("process");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ }
/******/ ]);
//# sourceMappingURL=WebServer.js.map