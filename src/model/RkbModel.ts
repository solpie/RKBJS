import {PanelId, ScParam} from "../view/const";
import {CommandId} from "../view/Command";
import {ServerConf} from "../Env";
import {GameRkbInfo} from "./GameRkbInfo";
import {panelRouter} from "../router/PanelRouter";
declare var rest;
declare var io;
export class RkbModel {
    gameInfo: GameRkbInfo;
    emit: (cmd: string, param?: Object)=>void;

    //websocket
    remoteIO: any;
    panelWsMap = {};

    constructor(io) {
        this.gameInfo = new GameRkbInfo();

        io.on('connection', function () { /* … */
        });
        io = io.of(`/${PanelId.rkbPanel}`);
        io
            .on("connect", (socket) => {
                console.log('connect');
                socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: this.gameInfo, isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket) {
                console.log('disconnect');
            });
        this.emit = (cmd, param)=> {
            io.emit(cmd, param);
        };
        this.initHupuAuto();
        this.initOp();
    }

    private initHupuAuto() {
        rest('http://test.jrstvapi.hupu.com/zhubo/getNodeServer').then(function (response) {
            // console.log(response);
            var a = JSON.parse(response.entity);
            if (a && a.length) {
                ServerConf.hupuWsUrl = a[0];
            }
        });
    }

    syncGame(gameId) {
        var remoteIO;
        if (!this.panelWsMap[gameId]) {
            remoteIO = this.panelWsMap[gameId] = io.connect(ServerConf.hupuWsUrl);
            remoteIO.on('connect', ()=> {
                console.log('hupuAuto socket connected');
                remoteIO.emit('passerbyking', {
                    game_id: gameId,
                    page: 'score'
                })
            });
            remoteIO.on('wall', (data: any)=> {
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
    }

    initOp() {
        //post /panel/rkb/:cmdId
        panelRouter.post(`/rkb/:cmdId`, (req, res) => {
            if (!req.body) return res.sendStatus(400);
            var cmdId = req.params.cmdId;
            var param = req.body;
            console.log(`/rkb/${cmdId}`, param);
            var cmdMap: any = {};


            cmdMap[`${CommandId.cs_minLeftScore}`] = () => {
                this.gameInfo.minLeftScore();
                this.emit(`${CommandId.updateLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
                // screenPanelHanle.io.emit(`${CommandId.updateLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
            };

            cmdMap[`${CommandId.cs_minRightScore}`] = () => {
                this.gameInfo.minRightScore();
                this.emit(`${CommandId.updateRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));
                // screenPanelHanle.io.emit(`${CommandId.updateRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));
            };

            cmdMap[`${CommandId.cs_addLeftScore}`] = () => {
                var straight = this.gameInfo.addLeftScore();
                this.emit(`${CommandId.updateLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
                // screenPanelHanle.io.emit(`${CommandId.updateLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
            };

            cmdMap[`${CommandId.cs_addRightScore}`] = () => {
                var straight = this.gameInfo.addRightScore();
                this.emit(`${CommandId.updateRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));
                // screenPanelHanle.io.emit(`${CommandId.updateRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));
            };
            cmdMap[`${CommandId.cs_unLimitScore}`] = (param) => {
                this.gameInfo.unLimitScore = param.unLimitScore;
                this.emit(`${CommandId.unLimitScore}`, ScParam({unLimitScore: this.gameInfo.unLimitScore}));
            };


            //// foul
            cmdMap[`${CommandId.cs_addRightFoul}`] = () => {
                var rightFoul: number = this.gameInfo.addRightFoul();
                this.emit(`${CommandId.updateRightFoul}`, ScParam({rightFoul: rightFoul}));
            };
            cmdMap[`${CommandId.cs_minRightFoul}`] = () => {
                var rightFoul: number = this.gameInfo.minRightFoul();
                this.emit(`${CommandId.updateRightFoul}`, ScParam({rightFoul: rightFoul}));
            };
            cmdMap[`${CommandId.cs_addLeftFoul}`] = () => {
                var leftFoul: number = this.gameInfo.addLeftFoul();
                this.emit(`${CommandId.updateLeftFoul}`, ScParam({leftFoul: leftFoul}));
            };
            cmdMap[`${CommandId.cs_minLeftFoul}`] = () => {
                var leftFoul: number = this.gameInfo.minLeftFoul();
                this.emit(`${CommandId.updateLeftFoul}`, ScParam({leftFoul: leftFoul}));
            };


            cmdMap[`${CommandId.cs_resetGame}`] = (param) => {
                return this.cs_resetGame(param, cmdMap);
            };


            cmdMap[`${CommandId.cs_toggleTimer}`] = (param) => {
                if (param) {
                    this.gameInfo.toggleTimer(param.state);
                    this.emit(`${CommandId.toggleTimer}`, ScParam(param));
                }
                else {
                    this.gameInfo.toggleTimer();
                    this.emit(`${CommandId.toggleTimer}`);
                }
            };
            //
            cmdMap[`${CommandId.cs_resetTimer}`] = () => {
                this.gameInfo.resetTimer();
                this.emit(`${CommandId.resetTimer}`);
            };

            // var actPlayerIdArr = ()=> {
            //     for (var k in db.activity.dataMap) {
            //         if (db.activity.dataMap[k].activityId == 3) {
            //             return db.activity.dataMap[k].gameDataArr[0].playerIdArr;
            //         }
            //     }
            // };
            cmdMap[`${CommandId.cs_updatePlayer}`] = (param) => {
                return this.cs_updatePlayer(param);
            };

            cmdMap[`${CommandId.cs_updatePlayerAll}`] = (param) => {
                // this.gameInfo.playerDocArr = db.player.getDocArr(param.playerIdArr);
                // this.emit(`${CommandId.updatePlayerAll}`, ScParam({playerDocArr: this.gameInfo.playerDocArr}));
            };

            cmdMap[`${CommandId.cs_updateKingPlayer}`] = (param) => {
                this.gameInfo.kingPlayer = param.kingPlayer;
                this.emit(`${CommandId.updateKingPlayer}`, ScParam({kingPlayer: this.gameInfo.kingPlayer}));
            };

            cmdMap[`${CommandId.cs_updatePlayerState}`] = (param) => {
                // db.player.updatePlayerDoc([param.playerDoc], ()=> {
                //     var playerDoc = param.playerDoc;
                //     // if (playerDoc.state == PlayerState1v1.FIGHTING) {
                //     //     // this.emit(`${CommandId.updatePlayer}`, ScParam(param))
                //     // }
                //     if (playerDoc.state == PlayerState1v1.Dead) {
                //         console.log('player state dead', playerDoc.name, this.playerQue, this.playerQue.length);
                //         var deadIdx = this.playerQue.indexOf(playerDoc.id);
                //         if (deadIdx > -1)
                //             this.playerQue.splice(deadIdx, 1);
                //         console.log('player state dead', playerDoc.name, this.playerQue, this.playerQue.length);
                //     }
                //     console.log('cs_updatePlayerState', 'updatePlayerState', param);
                //     this.emit(`${CommandId.updatePlayerState}`, ScParam(param))
                // });
            };


            cmdMap[`${CommandId.cs_setActPlayer}`] = (param) => {
                return this.cs_setActPlayer(param);
            };

            cmdMap[`${CommandId.cs_setGameIdx}`] = (param) => {
                this.gameInfo.gameIdx = param.gameIdx;
                this.emit(`${CommandId.setGameIdx}`, ScParam(param));
            };

            cmdMap[`${CommandId.cs_fadeInActivityPanel}`] = (param) => {
                // var playerIdArr;
                // for (var k in db.activity.dataMap) {
                //     if (db.activity.dataMap[k].activityId == 3) {
                //         playerIdArr = db.activity.dataMap[k].gameDataArr[0].playerIdArr;
                //         break;
                //     }
                // }
                // playerIdArr = playerIdArr.concat(mapToArr(this.exPlayerIdMap));
                // var playerDocArr = db.player.getDocArr(playerIdArr);
                // this.emit(`${CommandId.fadeInActivityPanel}`, ScParam({
                //     playerDocArr: playerDocArr,
                //     page: param.page
                // }));
            };

            cmdMap[`${CommandId.cs_fadeOutActivityPanel}`] = (param) => {
                this.emit(`${CommandId.fadeOutActivityPanel}`);
            };

            cmdMap[`${CommandId.cs_updatePlayerBackNum}`] = (param) => {
                this.emit(`${CommandId.updatePlayerBackNum}`, ScParam(param));
            };

            cmdMap[`${CommandId.cs_startingLine}`] = (param) => {
                this.emit(`${CommandId.startingLine}`, ScParam({playerDocArr: this.gameInfo.getPlayerDocArr()}));
            };
            cmdMap[`${CommandId.cs_hideStartingLine}`] = (param) => {
                this.emit(`${CommandId.hideStartingLine}`);
            };
            cmdMap[`${CommandId.cs_fadeInCountDown}`] = (param)=> {
                this.emit(`${CommandId.fadeInCountDown}`, param);
            };

            cmdMap[`${CommandId.cs_fadeOutCountDown}`] = (param)=> {
                this.emit(`${CommandId.fadeOutCountDown}`);
            };

            cmdMap[`${CommandId.cs_fadeInWinPanel}`] = (param) => {
                var isBlueWin = this.gameInfo.leftScore > this.gameInfo.rightScore;
                var playerDoc;
                if (isBlueWin)
                    playerDoc = this.gameInfo.getPlayerDocArr()[0];
                else
                    playerDoc = this.gameInfo.getPlayerDocArr()[1];

                if (playerDoc.id == ServerConf.king) {
                    playerDoc.isKing = true;
                }
                this.emit(`${CommandId.fadeInWinPanel}`, ScParam({
                    isBlue: isBlueWin,
                    playerDoc: playerDoc
                }));
            };

            cmdMap[`${CommandId.cs_fadeOutWinPanel}`] = (param) => {
                this.emit(`${CommandId.fadeOutWinPanel}`);
            };


            cmdMap[`${CommandId.cs_getBracketPlayerByIdx}`] = (param) => {
                var actDoc = this.getActDoc();
                var bracketIdx = param.bracketIdx;
                var bracketDoc = actDoc.bracket[bracketIdx];
                console.log('bracketDoc', bracketDoc);
                if (bracketDoc) {
                    cmdMap[`${CommandId.cs_updatePlayer}`]({
                        idx: 0,
                        playerId: bracketDoc.gameInfoArr[0].id
                    });
                    cmdMap[`${CommandId.cs_updatePlayer}`]({
                        idx: 1,
                        playerId: bracketDoc.gameInfoArr[1].id
                    });
                }
            };

            cmdMap[`${CommandId.cs_setBracketPlayer}`] = (param) => {
                // var playerIdArr = param.playerIdArr;
                // var actDoc = db.activity.getDocArr([3])[0];
                // var playerDocArr = db.player.getDocArr(playerIdArr);
                // console.log('bracket playerDocArr', playerDocArr);
                // if (playerDocArr.length == 8) {
                //     for (var i = 0; i < 4; i++) {
                //         playerDocArr[i * 2].score = 0;
                //         playerDocArr[i * 2 + 1].score = 0;
                //         actDoc.bracket[i + 1] = {
                //             gameInfoArr: [
                //                 playerDocArr[i * 2], playerDocArr[i * 2 + 1]
                //             ]
                //         }
                //     }
                //     for (var i = 4; i < 14; i++) {
                //         if (actDoc.bracket[i + 1]) {
                //             delete actDoc.bracket[i + 1];
                //         }
                //     }
                //
                //     db.activity.ds().update({id: actDoc.id}, actDoc, ()=> {
                //     });
                //
                //     var matchArr = this.refreshBracket(actDoc);
                //     this.emit(`${CommandId.refreshClient}`, ScParam({matchArr: matchArr}));
                // }
            };

            cmdMap[`${CommandId.cs_refreshClient}`] = (param) => {
                // var actDoc = db.activity.getDocArr([3])[0];
                // var matchArr = this.refreshBracket(actDoc);
                // this.emit(`${CommandId.refreshClient}`, ScParam({matchArr: matchArr}));
            };

            cmdMap[`${CommandId.cs_changeColor}`] = (param)=> {
                return this.cs_changeColor(param);
            };
            cmdMap[`${CommandId.cs_clearActPlayerGameRec}`] = (param)=> {
                return this.cs_clearActPlayerGameRec(param);
            };
            cmdMap[`${CommandId.cs_updateWinScore}`] = (param)=> {
                return this.cs_updateWinScore(param);
            };
            cmdMap[`${CommandId.cs_saveGameRec}`] = (param)=> {
                return this.cs_saveGameRec(param, res);
            };
            cmdMap[`${CommandId.cs_setCursorPlayer}`] = (param)=> {
                return this.cs_setCursorPlayer(param);
            };
            cmdMap[`${CommandId.cs_saveToTotalScore}`] = (param)=> {
                return this.cs_saveToTotalScore(param);
            };
            ///  FT
            cmdMap[`${CommandId.cs_fadeInPlayerRank}`] = (param)=> {
                return this.cs_fadeInPlayerRank(param);
            };

            cmdMap[`${CommandId.cs_fadeInFtRank}`] = (param)=> {
                return this.cs_fadeInFtRank(param);
            };

            cmdMap[`${CommandId.cs_fadeInFTShow}`] = (param)=> {
                return this.cs_fadeInFTShow(param);
            };

            cmdMap[`${CommandId.cs_fadeOutFTShow}`] = (param)=> {
                return this.cs_fadeOutFTShow(param);
            };

            cmdMap[`${CommandId.cs_fadeInMixRank}`] = (param)=> {
                return this.cs_fadeInMixRank(param);
            };

            cmdMap[`${CommandId.cs_setScorePanelVisible}`] = (param)=> {
                return this.cs_setScorePanelVisible(param);
            };
            cmdMap[`${CommandId.cs_autoSaveGameRec}`] = (param)=> {
                return this.cs_autoSaveGameRec(param);
            };
            if (param.hasOwnProperty("_")) {
                //auto emit
                var autoCmdId = cmdId.replace("cs_", "");
                this.emit(autoCmdId, param);
                res.sendStatus(200);
            }
            else {
                var isSend = cmdMap[cmdId](param);
                if (!isSend)
                    res.sendStatus(200);
            }
        });
    }

    cs_autoSaveGameRec(param) {
        this.emit(`${CommandId.setScorePanelVisible}`, ScParam(param));
    }

    cs_setScorePanelVisible(param) {
        this.emit(`${CommandId.setScorePanelVisible}`, ScParam(param));
    }

    cs_updatePlayer(param) {
        // var auto = param.auto;

        var playerId = param.playerId;
        var playerIdx = param.idx;
        // if (this.gameInfo.gameState == GameInfo.GAME_STATE_ING) {
        //     db.player.syncDataMap(()=> {
        //         param.playerDoc = this.getFlyPlayerDoc(playerId);//db.player.dataMap[playerId];
        //         this.gameInfo.setPlayerInfoByIdx(playerIdx, db.player.getPlayerInfoById(playerId));
        //         db.game.updatePlayerByPos(this.gameInfo.id, playerIdx, playerId);
        //         // param.avgEloScore = this.gameInfo.getAvgEloScore();
        //         this.emit(`${CommandId.updatePlayer}`, ScParam(param));
        //     });
        // }
    }

    getFlyPlayerDoc(id) {
        // var playerDoc = db.player.dataMap[id];
        // if (playerDoc) {
        //     if (playerDoc.ftId) {
        //         playerDoc.ftDoc = db.ft.dataMap[playerDoc.ftId];
        //     }
        // }
        // return playerDoc;
    }

    cs_clearActPlayerGameRec(param) {
        // var playerDocArr = [];
        // for (var id in db.player.dataMap) {
        //     var playerDoc = db.player.dataMap[id];
        //     if (playerDoc) {
        //         playerDocArr.push(playerDoc);
        //         playerDoc.loseGameCount = 0;
        //         playerDoc.winGameCount = 0;
        //         playerDoc.curFtScore = 0;
        //         playerDoc.state = null;
        //     }
        // }
        // db.player.updatePlayerDoc(playerDocArr);
        //
        //
        // var f = [];
        // for (var ftId in db.ft.dataMap) {
        //     var ftDoc = FTInfo.clone(db.ft.dataMap[ftId]);
        //     ftDoc.curScore = 0;
        //     f.push(ftDoc);
        // }
        // db.ft.updateDocArr(f);
    }

    cs_saveToTotalScore(param) {
        // var a = [];
        // for (var playerId in db.player.dataMap) {
        //     var playerDoc: PlayerDoc = db.player.dataMap[playerId];
        //     playerDoc.ftScore = 0;
        //     a.push(playerDoc);
        // }
        // db.player.updateDocArr(a);
        //
        // var f = [];
        // for (var ftId in db.ft.dataMap) {
        //     var ftDoc = FTInfo.clone(db.ft.dataMap[ftId]);
        //     ftDoc.score = 0;
        //     f.push(ftDoc);
        // }
        // db.ft.updateDocArr(f);
    }

    cs_setCursorPlayer(param) {
        // var playerId = param.playerId;
        // this.queInfo.setCursorByPlayerId(playerId);
    }

    cs_changeColor(param) {
        // var p1 = {idx: 0, playerId: this.gameInfo.getPlayerDocArr()[1].id};
        // var p2 = {idx: 1, playerId: this.gameInfo.getPlayerDocArr()[0].id};
        //
        // this.cs_updatePlayer(p1);
        // this.cs_updatePlayer(p2);
        //
        // var tmp;
        // tmp = this.playerQue[0];
        // this.playerQue[0] = this.playerQue[1];
        // this.playerQue[1] = tmp;
        //
        // tmp = this.gameInfo.leftFoul;
        // this.gameInfo.leftFoul = this.gameInfo.rightFoul;
        // this.gameInfo.rightFoul = tmp;
        // this.emit(`${CommandId.updateRightFoul}`, ScParam({rightFoul: this.gameInfo.rightFoul}));
        // this.emit(`${CommandId.updateLeftFoul}`, ScParam({leftFoul: this.gameInfo.leftFoul}));
        //
        // tmp = this.gameInfo.leftScore;
        // this.gameInfo.leftScore = this.gameInfo.rightScore;
        // this.gameInfo.rightScore = tmp;
        //
        // this.emit(`${CommandId.updateLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
        // this.emit(`${CommandId.updateRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));

    }

    cs_resetGame(param, cmdMap) {
        // this.gameInfo = new Game1v1Info();
        // this.gameInfo.gameIdx = this.lastGameIdx + 1;
        // this.emit(`${CommandId.resetGame}`);
        //
        // var deadNum = 0;
        // var playerIdArr = this.getActDoc().gameDataArr[0].playerIdArr;
        // this.gameInfo.deadPlayerArr = [];
        // for (var i = 0; i < playerIdArr.length; i++) {
        //     var playerDoc = db.player.dataMap[playerIdArr[i]];
        //     if (playerDoc.state == PlayerState1v1.Dead) {
        //         deadNum++;
        //         this.gameInfo.deadPlayerArr.push(playerDoc.name);
        //         console.log('dead player', playerDoc.name);
        //     }
        // }
        // this.gameInfo.infoText = '淘汰: ' + deadNum + '  总: ' + playerIdArr.length + "  剩：" + (playerIdArr.length - deadNum);
        // this.init1v1();
        // cmdMap[`${CommandId.cs_updatePlayer}`]({playerId: this.nextPlayerIdArr2[0], idx: 0});
        // cmdMap[`${CommandId.cs_updatePlayer}`]({playerId: this.nextPlayerIdArr2[1], idx: 1});
        // console.log('player', this.nextPlayerIdArr2);
    }

    cs_saveGameRec(param, res) {
        ////////////////    bracket
        // var bracketIdx = param.bracketIdx;
        // if (bracketIdx) {
        //     var actDoc = db.activity.getDocArr([3])[0];
        //     var getLoserInfo = (isLoser: boolean = true)=> {
        //         var winner;
        //         var loser;
        //         var bluePlayer = {
        //             id: this.gameInfo.playerInfoArr[0].id(),
        //             name: this.gameInfo.playerInfoArr[0].name(),
        //             avatar: this.gameInfo.playerInfoArr[0].avatar(),
        //             score: this.gameInfo.leftScore
        //         };
        //         var redPlayer = {
        //             id: this.gameInfo.playerInfoArr[1].id(),
        //             name: this.gameInfo.playerInfoArr[1].name(),
        //             avatar: this.gameInfo.playerInfoArr[1].avatar(),
        //             score: this.gameInfo.rightScore
        //         };
        //         if (this.gameInfo.leftScore < this.gameInfo.rightScore) {
        //             winner = redPlayer;
        //             loser = bluePlayer;
        //         }
        //         else {
        //             winner = bluePlayer;
        //             loser = redPlayer;
        //         }
        //         return isLoser ? loser : winner;
        //     };
        //
        //     var getWinnerInfo = ()=> {
        //         return getLoserInfo(false);
        //     };
        //
        //     actDoc.bracket[bracketIdx] = {
        //         gameInfoArr: [
        //             {
        //                 id: this.gameInfo.playerInfoArr[0].id(),
        //                 name: this.gameInfo.playerInfoArr[0].name(),
        //                 avatar: this.gameInfo.playerInfoArr[0].avatar(),
        //                 score: this.gameInfo.leftScore
        //             },
        //             {
        //                 id: this.gameInfo.playerInfoArr[1].id(),
        //                 name: this.gameInfo.playerInfoArr[1].name(),
        //                 avatar: this.gameInfo.playerInfoArr[1].avatar(),
        //                 score: this.gameInfo.rightScore
        //             }
        //         ]
        //     };
        //
        //     db.activity.ds().update({id: actDoc.id}, actDoc, ()=> {
        //     });
        //
        //     var setBracketPlayer = (idx)=> {
        //         var map = bracketMap[idx];
        //         if (map) {
        //             var bracketIdx = map.loser[0];
        //             var playerPos = map.loser[1];
        //             if (bracketIdx > 0) {
        //                 if (!actDoc.bracket[bracketIdx])
        //                     actDoc.bracket[bracketIdx] = {gameInfoArr: [{}, {}]};
        //                 actDoc.bracket[bracketIdx].gameInfoArr[playerPos] = getLoserInfo();
        //                 actDoc.bracket[bracketIdx].gameInfoArr[playerPos].score = 0;
        //             }
        //             bracketIdx = map.winner[0];
        //             playerPos = map.winner[1];
        //
        //             if (bracketIdx > 0) {
        //                 if (!actDoc.bracket[bracketIdx])
        //                     actDoc.bracket[bracketIdx] = {gameInfoArr: [{}, {}]};
        //                 actDoc.bracket[bracketIdx].gameInfoArr[playerPos] = getWinnerInfo();
        //                 actDoc.bracket[bracketIdx].gameInfoArr[playerPos].score = 0;
        //             }
        //         }
        //     };
        //
        //     setBracketPlayer(bracketIdx);
        //
        //     var matchArr = this.refreshBracket(actDoc);
        //     this.emit(`${CommandId.refreshClient}`, ScParam({matchArr: matchArr}));
        // }
        //
        //
        // ////////////////////////////////
        //
        // if (this.gameInfo.isFinish) {
        //     res.send(false);
        // }
        // else {
        //     this.lastGameIdx = Number(this.gameInfo.gameIdx);
        //     this.gameInfo.saveGameResult();
        //     this.quePlayer(this.gameInfo.winner_Idx[0], false);
        //     if (this.lastLoserPlayerInfo && this.lastLoserPlayerInfo.id() == this.gameInfo.loserPlayerInfo.id()) {
        //         console.log('player out: ', this.gameInfo.loserPlayerInfo.id(), this.gameInfo.loserPlayerInfo.name())
        //         // var playerDoc = db.player.dataMap[this.gameInfo.loserPlayerInfo.id()];
        //         // playerDoc.state = PlayerState1v1.Dead;
        //         this.gameInfo.loserPlayerInfo.playerData.state = PlayerState1v1.Dead;
        //         this.quePlayer(this.gameInfo.loser_Idx[0], true);
        //         // cmdMap[`${CommandId.cs_updatePlayerState}`]({playerDoc: playerDoc})
        //         // this.nextPlayerIdArr[0] = this.playerQue[0];
        //         // this.nextPlayerIdArr[1] = this.playerQue[1];
        //
        //         this.queInfo.setPlayerDead(this.gameInfo.loser_Idx[0]);
        //         this.nextPlayerIdArr2 = this.queInfo.getPlayerIdArr(true);
        //     }
        //     else {
        //         // if (this.playerQue[0] != this.gameInfo.loser_Idx[0]) {
        //         //     this.nextPlayerIdArr[this.gameInfo.winner_Idx[1]] = this.playerQue[0];
        //         // }
        //         // else
        //         //     this.nextPlayerIdArr[this.gameInfo.winner_Idx[1]] = this.playerQue[1];
        //         // this.nextPlayerIdArr[this.gameInfo.loser_Idx[1]] = this.gameInfo.loser_Idx[0];
        //
        //         this.nextPlayerIdArr2[this.gameInfo.loser_Idx[1]] = this.gameInfo.loser_Idx[0];
        //         this.nextPlayerIdArr2[this.gameInfo.winner_Idx[1]] = this.queInfo.getPlayerIdArr(false)[0];//loser_Idx[0];
        //     }
        //     // console.log('nextPlayerIdArr', this.nextPlayerIdArr);
        //     console.log('nextPlayerIdArr2', this.nextPlayerIdArr2);
        //
        //     this.lastLoserPlayerInfo = this.gameInfo.loserPlayerInfo;
        //     db.player.updatePlayerDoc(this.gameInfo.getPlayerDocArr(), null);
        //
        //     ///********************************save ft score
        //     var bluePlayerDoc: PlayerDoc = this.gameInfo.getPlayerDocArr()[0];
        //     var ftInfoArr = [];
        //     var ftDoc = db.ft.dataMap[bluePlayerDoc.ftId];
        //     if (ftDoc) {
        //         FTInfo.saveScore(ftDoc, this.gameInfo.leftScore);
        //         ftInfoArr.push(ftDoc);
        //     }
        //     var redPlayerDoc: PlayerDoc = this.gameInfo.getPlayerDocArr()[1];
        //     ftDoc = db.ft.dataMap[redPlayerDoc.ftId];
        //     if (ftDoc) {
        //         FTInfo.saveScore(ftDoc, this.gameInfo.rightScore);
        //         ftInfoArr.push(ftDoc);
        //     }
        //     db.ft.updateDocArr(ftInfoArr, ()=> {
        //         db.ft.syncDataMap();
        //     });
        //     //*********************************************
        //     // db.game.updateDocArr([this.gameInfo.getGameDoc()]);
        //     db.game.create(this.gameInfo.getGameDoc());
        //     res.send(true);
        // }
        // return ServerConst.SEND_ASYNC;
    }

    cs_updateWinScore(param) {
        console.log('cs_updateWinScore', param);
        this.gameInfo.winScore = param.winScore;
        this.emit(`${CommandId.updateWinScore}`, ScParam(param));
    }

    cs_setActPlayer(param) {
        // var playerIdArr = param.playerIdArr;
        // if (playerIdArr && playerIdArr.length) {
        //     var countPlayerId = [];
        //     var updatePlayerDocArr = [];
        //     for (var i = 0; i < playerIdArr.length; i++) {
        //         var playerDoc = db.player.dataMap[i + 1];
        //         var playerDoc2 = db.player.dataMap[playerIdArr[i]];
        //         if (playerDoc && (playerDoc2.name != playerDoc.name)) {
        //             var empty = 100;
        //             while (db.player.dataMap[empty]) {
        //                 empty++;
        //             }
        //             playerDoc.id = empty;
        //             db.player.dataMap[playerDoc.id] = playerDoc;
        //             updatePlayerDocArr.push(playerDoc);
        //         }
        //     }
        //     for (var i = 0; i < playerIdArr.length; i++) {
        //         var playerDoc2 = db.player.dataMap[playerIdArr[i]];
        //         playerDoc2.id = i + 1;
        //         playerDoc2.active = true;
        //         updatePlayerDocArr.push(playerDoc2);
        //         countPlayerId.push(playerDoc2.id);
        //     }
        //     db.player.updateDocArr(updatePlayerDocArr, ()=> {
        //         db.player.syncDataMap();
        //     });
        //
        //     var actDoc = this.getActDoc();
        //     actDoc.gameDataArr[0].playerIdArr = countPlayerId;
        //     db.activity.updateDocArr([actDoc]);
        // }
    }

    cs_fadeInFTShow(param: any) {
        // var playerIdArr = this.getActDoc().gameDataArr[0].playerIdArr;
        //
        // var ftInfoArr = mapToArr(db.ft.dataMap);
        // var playerDoc;
        // var flyFtInfoArr = [];
        // for (var i = 0; i < ftInfoArr.length; i++) {
        //     var flyFtInfo: FTInfo = FTInfo.clone(ftInfoArr[i]);
        //     flyFtInfoArr.push(flyFtInfo);
        //     flyFtInfo.memberArr = [];
        //     for (var playerId in db.player.dataMap) {
        //         playerDoc = db.player.dataMap[playerId];
        //         if (playerDoc.ftId && playerDoc.ftId == flyFtInfo.id) {
        //             playerDoc.active = playerIdArr.indexOf(Number(playerId)) > -1;
        //             flyFtInfo.memberArr.push(playerDoc)
        //         }
        //     }
        // }
        //
        // this.emit(`${CommandId.fadeInFTShow}`, ScParam({ftInfoArr: flyFtInfoArr, idx: param.idx, ftId: param.ftId}));
    }


    private cs_fadeOutFTShow(param: any) {
        this.emit(`${CommandId.fadeOutFTShow}`, param);
    }

    private cs_fadeInFtRank(param: any) {
        // var ftDocArr = mapToArr(db.ft.dataMap);
        // for (var i = 0; i < ftDocArr.length; i++) {
        //     var ftDoc = ftDocArr[i];
        //     if (!ftDoc.score) {
        //         ftDoc.score = 0;
        //     }
        //     if (!ftDoc.curScore) {
        //         ftDoc.curScore = 0;
        //     }
        // }
        // //
        // // db.ft.updateDocArr(ftDocArr);
        // ftDocArr = ftDocArr.sort(descendingProp('curScore'));
        // var curFtDocArr = ftDocArr.slice(0, 5);
        //
        // ftDocArr = ftDocArr.sort(descendingProp('score'));
        // var totalFtDocArr = ftDocArr.slice(0, 5);
        //
        // this.emit(`${CommandId.fadeInFtRank}`, ScParam({
        //     curFtDocArr: curFtDocArr,
        //     totalFtDocArr: totalFtDocArr
        // }));
    }

    private cs_fadeInMixRank(param: any) {
        // var isAuto = param.auto;
        // var totalPlayerDocArr;
        // var playerDocArr = mapToArr(db.player.dataMap, true);
        // var ftDocArr = mapToArr(db.ft.dataMap, true);
        //
        // var pFilter = [];
        // for (var i = 0; i < playerDocArr.length; i++) {
        //     var p = playerDocArr[i];
        //     if (!p.ftScore)
        //         p.ftScore = 0;
        //     if (p.ftId) {
        //         pFilter.push(p);
        //     }
        // }
        // var sortAndSendRes = ()=> {
        //     playerDocArr = pFilter.sort(descendingProp('curFtScore'));
        //     totalPlayerDocArr = playerDocArr.slice(0, 5);
        //     var ftMap = db.ft.dataMap;
        //
        //     ftDocArr = ftDocArr.sort(descendingProp('curScore'));
        //     var totalFtDocArr = ftDocArr.slice(0, 5);
        //
        //     this.emit(`${CommandId.fadeInMixRank}`, ScParam({
        //         ftMap: ftMap,
        //         totalFtDocArr: totalFtDocArr,
        //         totalPlayerDocArr: totalPlayerDocArr,
        //         auto: false
        //     }));
        // };
        //
        // if (isAuto) {
        //     var game_id = param.game_id;
        //     console.log('get /api/passerbyking/game/players/', game_id);
        //     var api1 = 'http://api.liangle.com/api/passerbyking/game/rank/' + game_id;
        //     unirest.get(api1)
        //         .end((response)=> {
        //             console.log(response.body);
        //             var mixRankData = response.body.data;
        //
        //             var rankPlayerDocArr = [];
        //             for (var i = 0; i < mixRankData.player_rank.length; i++) {
        //                 var player_rank = mixRankData.player_rank[i];
        //                 var rankPlayerDoc = new PlayerDoc();
        //                 rankPlayerDoc.name = player_rank.name;
        //                 rankPlayerDoc.avatar = player_rank.avatar;
        //                 rankPlayerDoc['ftName'] = player_rank.group;
        //                 rankPlayerDoc.curFtScore = player_rank.score;
        //                 rankPlayerDoc.ftScore = player_rank.total_score;
        //                 rankPlayerDocArr.push(rankPlayerDoc);
        //             }
        //
        //             var rankFtDocArr = [];
        //             for (var j = 0; j < mixRankData.group_rank.length; j++) {
        //                 var group_rank = mixRankData.group_rank[j];
        //                 var ftDoc = new FTInfo();
        //                 ftDoc.name = group_rank.name;
        //                 ftDoc.fullName = group_rank.full_name;
        //                 ftDoc.logo = group_rank.logo;
        //                 ftDoc.curScore = group_rank.score;
        //                 ftDoc.score = group_rank.total_score;
        //                 rankFtDocArr.push(ftDoc);
        //             }
        //             this.emit(`${CommandId.fadeInMixRank}`, ScParam({
        //                 totalFtDocArr: rankFtDocArr,
        //                 totalPlayerDocArr: rankPlayerDocArr,
        //                 gameId: game_id,
        //                 auto: true
        //             }));
        //         });
        // }
        // else
        //     sortAndSendRes();


    }

    private cs_fadeInPlayerRank(param: any) {
        // var curPlayerDocArr;
        // var totalPlayerDocArr;
        // var playerDocArr = mapToArr(db.player.dataMap);
        //
        // // for (var i = 0; i < playerDocArr.length; i++) {
        // //     var playerDoc = playerDocArr[i];
        // //     if (!playerDoc.ftScore) {
        // //         playerDoc.ftScore = 0;
        // //     }
        // //     if (!playerDoc.curFtScore) {
        // //         playerDoc.curFtScore = 0;
        // //     }
        // // }
        // // db.player.updateDocArr(playerDocArr);
        // console.log('Rank', playerDocArr);
        // playerDocArr = playerDocArr.sort(descendingProp('ftScore'));
        // totalPlayerDocArr = playerDocArr.slice(0, 5);
        // console.log('Rank', playerDocArr);
        //
        // playerDocArr = playerDocArr.sort(descendingProp('curFtScore'));
        // curPlayerDocArr = playerDocArr.slice(0, 5);
        // console.log('Rank', playerDocArr);
        // var ftMap = db.ft.dataMap;
        // this.emit(`${CommandId.fadeInPlayerRank}`, ScParam({
        //     ftMap: ftMap,
        //     curPlayerDocArr: curPlayerDocArr,
        //     totalPlayerDocArr: totalPlayerDocArr
        // }));
    }

    startGame(gameId) {
        // var gameDoc = db.game.getDataById(gameId);
        // if (!gameDoc) {
        //     gameDoc = db.activity.getGameDocByGameId(gameId)
        // }
        // this.gameInfo = new Game1v1Info(gameDoc);
        // if (gameDoc.playerIdArr) {
        //     this.gameInfo.playerInfoArr = [];
        //     for (var playerId of gameDoc.playerIdArr) {
        //         console.log('playerId', playerId);
        //         this.gameInfo.playerInfoArr.push(new PlayerInfo(db.player.dataMap[playerId]));
        //     }
        // }
        //
        // db.game.startGame(gameDoc);
        // console.log('startGame:', gameId, gameDoc);
    }

    refreshBracket(actDoc: any) {
        //refresh bracket
        // var matchArr = [];
        // var playerHintMap = {
        //     '5': ['  第1场败者', '  第2场败者'],
        //     '6': ['  第3场败者', '  第4场败者'],
        //     '9': ['  第7场败者', ''],
        //     '13': ['  第11场败者', ''],
        //     '10': ['  第8场败者', ''],
        //     '14': ['', '  第13场胜者']
        // };
        // for (var i = 0; i < 15; i++) {
        //     var ms: BracketGroup = new BracketGroup(0, 0, i + 1);
        //     var bracketDoc = actDoc.bracket[ms.idx];
        //
        //     if (bracketDoc) {
        //         if (bracketDoc.gameInfoArr[0]) {
        //             ms.playerArr[0].name = bracketDoc.gameInfoArr[0].name;
        //             ms.playerArr[0].avatar = bracketDoc.gameInfoArr[0].avatar;
        //             ms.playerArr[0].score = bracketDoc.gameInfoArr[0].score;
        //         }
        //         if (bracketDoc.gameInfoArr[1]) {
        //             ms.playerArr[1].name = bracketDoc.gameInfoArr[1].name;
        //             ms.playerArr[1].avatar = bracketDoc.gameInfoArr[1].avatar;
        //             ms.playerArr[1].score = bracketDoc.gameInfoArr[1].score;
        //         }
        //
        //         if (ms.playerArr[0].score || ms.playerArr[1].score) {
        //             if (ms.playerArr[0].score > ms.playerArr[1].score) {
        //                 ms.playerArr[0].isWin = true;
        //             }
        //             else {
        //                 ms.playerArr[1].isWin = true;
        //             }
        //         }
        //     }
        //
        //     if (!ms.playerArr[0].name && playerHintMap[ms.idx]) {
        //         ms.playerArr[0].name = playerHintMap[ms.idx][0];
        //         ms.playerArr[0].isHint = true;
        //     }
        //     if (!ms.playerArr[1].name && playerHintMap[ms.idx]) {
        //         ms.playerArr[1].name = playerHintMap[ms.idx][1];
        //         ms.playerArr[1].isHint = true;
        //     }
        //     matchArr.push(ms);
        // }
        //
        // matchArr.sort(ascendingProp('idx'));
        // return matchArr;

    }

    getActDoc(): any {
        // return db.activity.getDocArr([3])[0];
    }

    private quePlayer(playerId: any, isout: boolean) {
        // console.log('quePlayer playerId:', playerId, isout);
        // if (this.playerQue[0] == playerId) {
        //     var p0 = this.playerQue.shift();
        //     if (!isout)
        //         this.playerQue.push(p0);
        //     else
        //         console.log('quePlayer out:', p0, this.playerQue);
        // }
        // else if (this.playerQue[1] == playerId) {
        //     var p0 = this.playerQue.shift();
        //     // this.playerQue.push(p0);
        //     var p1 = this.playerQue.shift();
        //     if (!isout)
        //         this.playerQue.push(p1);
        //     else {
        //         console.log('quePlayer out:', p1, this.playerQue);
        //     }
        //     this.playerQue = [p0].concat(this.playerQue);
        // } else {
        //     console.log('quePlayer gg', playerId, this.playerQue);
        // }
        // console.log('quePlayer', this.playerQue);
    }
}