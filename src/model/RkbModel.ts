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
    }

    getFlyPlayerDoc(id) {
    }

    cs_clearActPlayerGameRec(param) {
    }

    cs_saveToTotalScore(param) {
    }

    cs_setCursorPlayer(param) {
    }

    cs_changeColor(param) {
    }

    cs_resetGame(param, cmdMap) {
    }

    cs_saveGameRec(param, res) {
    }

    cs_updateWinScore(param) {
        console.log('cs_updateWinScore', param);
        this.gameInfo.winScore = param.winScore;
        this.emit(`${CommandId.updateWinScore}`, ScParam(param));
    }

    cs_setActPlayer(param) {
    }

    cs_fadeInFTShow(param: any) {
    }


    private cs_fadeOutFTShow(param: any) {
        this.emit(`${CommandId.fadeOutFTShow}`, param);
    }

    private cs_fadeInFtRank(param: any) {
    }

    private cs_fadeInMixRank(param: any) {

    }

    private cs_fadeInPlayerRank(param: any) {
    }

    startGame(gameId) {
    }

    refreshBracket(actDoc: any) {

    }

    getActDoc(): any {
        // return db.activity.getDocArr([3])[0];
    }

    private quePlayer(playerId: any, isout: boolean) {
    }
}