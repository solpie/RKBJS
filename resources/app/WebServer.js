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
	    RkbModel.prototype.initOp = function () {
	        var _this = this;
	        PanelRouter_1.panelRouter.post("/stage1v1/:cmdId", function (req, res) {
	            if (!req.body)
	                return res.sendStatus(400);
	            var cmdId = req.params.cmdId;
	            var param = req.body;
	            console.log("/stage1v1/" + cmdId);
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
	            var isSend = cmdMap[cmdId](param);
	            if (!isSend)
	                res.sendStatus(200);
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