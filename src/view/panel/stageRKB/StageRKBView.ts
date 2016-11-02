import {JParam} from "../../Command";
import {BasePanelView} from "../BasePanelView";
import {PanelId, TimerState} from "../../const";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {ScorePanel} from "./ScorePanel";
import {PlayerPanel} from "./PlayerPanel";
import {EventPanel} from "./EventPanel";
import {CountDownPanel} from "./CountDownPanel";
/**
 * Created by toramisu on 2016/10/24.
 */
declare var io;
declare var hupuWsUrl;
export class StageRKBView extends BasePanelView {
    $opView;
    scorePanel;
    playerPanel;
    eventPanel;
    countDownRender;
    isScorePanelVisible;
    constructor($opView) {
        super(PanelId.rkbPanel);
        this.$opView = $opView;

        this.isScorePanelVisible = true;


        $opView.test = "test";
        // RKBOPView.props.test = "dsfsd";
        console.log("StageRKBView");
        var localWs = io.connect(`http://${window.location.hostname}/${PanelId.rkbPanel}`);
        localWs.on('connect', function (msg) {
            console.log('connect', window.location.hostname);
            localWs.emit("opUrl", JParam({opUrl: window.location.hostname}));
        });
        this.initAuto();
    }

    initAuto() {
        var remoteIO = io.connect(hupuWsUrl);
        this.scorePanel = new ScorePanel(this, true);
        // this.scorePanel.init(gameDoc);
        this.playerPanel = new PlayerPanel(this, true);
        // this.playerPanel.init(gameDoc);
        // this.gameId = gameDoc.id;
        this.eventPanel = new EventPanel(this);
        // this.$parent['eventPanel'] = this.eventPanel;
        // this.$parent['gameId'] = Number(this.$route.params.game_id);

        this.countDownRender = new CountDownPanel(this.stage);
        var setPlayer = (leftPlayer, rightPlayer)=> {
            var leftPlayerInfo = new PlayerInfo();
            var playerData = leftPlayer;
            leftPlayerInfo.name(playerData.name);
            leftPlayerInfo.avatar(playerData.avatar);
            leftPlayerInfo.winGameCount(playerData.winAmount);
            leftPlayerInfo.loseGameCount(playerData.loseAmount);
            leftPlayerInfo.playerData['ftDoc'] = {name: leftPlayer.group};
            leftPlayerInfo.playerData.playerNum = leftPlayer.playerNum;
            leftPlayerInfo.playerData.curFtScore = leftPlayer.roundScore;
            this.playerPanel.setPlayer(0, leftPlayerInfo.playerData);
            var rightPlayerInfo = new PlayerInfo();
            playerData = rightPlayer;
            rightPlayerInfo.name(playerData.name);
            rightPlayerInfo.avatar(playerData.avatar);
            rightPlayerInfo.winGameCount(playerData.winAmount);
            rightPlayerInfo.loseGameCount(playerData.loseAmount);
            rightPlayerInfo.playerData['ftDoc'] = {name: rightPlayer.group};
            rightPlayerInfo.playerData.playerNum = rightPlayer.playerNum;
            rightPlayerInfo.playerData.curFtScore = rightPlayer.roundScore;
            this.playerPanel.setPlayer(1, rightPlayerInfo.playerData);

            this.scorePanel.setPlayerName([leftPlayer.name, rightPlayer.name])
        };
        remoteIO.on('connect', ()=> {
            console.log('hupuAuto socket connected');
            remoteIO.emit('passerbyking', {
                game_id: this.$opView.$route.params.game_id,
                page: 'score'
            })
        });
        remoteIO.on('wall', (data: any)=> {
            var event = data.et;
            var eventMap = {};
            console.log('event:', event, data);

            eventMap['init'] = ()=> {
                console.log('init', data);
                this.scorePanel.ctn.visible = this.isScorePanelVisible;
                this.scorePanel.set35ScoreLight(data.winScore);
                this.scorePanel.setGameIdx(data.gameIdx);
                setPlayer(data.player.left, data.player.right);
                this.scorePanel.setLeftScore(data.player.left.leftScore);
                this.scorePanel.setRightScore(data.player.right.rightScore);
                this.scorePanel.setLeftFoul(data.player.left.leftFoul);
                this.scorePanel.setRightFoul(data.player.right.rightFoul);
                if (data.status == 0) {//status字段吧 0 进行中 1已结束
                    this.scorePanel.resetTimer();
                    this.scorePanel.toggleTimer1(TimerState.RUNNING);
                }
                //test
                // this.eventPanel.playerInfoCard.fadeInWinPlayer(true, data.player);

                // this.scorePanel.resetTimer();
                // this.scorePanel.toggleTimer1(TimerState.RUNNING);
                // Tween.get(this).wait(3000).call(()=> {
                //     this.scorePanel.toggleTimer1(TimerState.PAUSE);
                // });
            };
            eventMap['updateScore'] = ()=> {
                console.log('updateScore', data);
                if (data.leftScore != null) {
                    this.scorePanel.setLeftScore(data.leftScore);
                }
                if (data.rightScore != null) {
                    this.scorePanel.setRightScore(data.rightScore);
                }
                if (data.rightFoul != null) {
                    this.scorePanel.setRightFoul(data.rightFoul);
                }
                if (data.leftFoul != null) {
                    this.scorePanel.setLeftFoul(data.leftFoul);
                }
            };
            eventMap['startGame'] = ()=> {
                console.log('startGame', data);
                this.scorePanel.set35ScoreLight(data.winScore);
                this.scorePanel.setGameIdx(data.gameIdx);
                setPlayer(data.player.left, data.player.right);
                // window.location.reload();
                this.scorePanel.resetScore();
                this.scorePanel.resetTimer();
                this.scorePanel.toggleTimer1(TimerState.RUNNING);
            };
            eventMap['commitGame'] = ()=> {
                if (this.isScorePanelVisible) {
                    var isBlue = data.idx == 0;
                    data.player.winGameCount = data.player.winAmount;
                    data.player.loseGameCount = data.player.loseAmount;
                    data.player.curFtScore = data.player.roundScore;
                    this.eventPanel.playerInfoCard.fadeInWinPlayer(isBlue, data.player);
                    this.scorePanel.toggleTimer1(TimerState.PAUSE);
                }
            };
            eventMap['fadeInCountDown'] = ()=> {
                var text = data.text;
                var cdSec = data.cdSec;
                var type = data.type;
                this.countDownRender.fadeInCountDown(cdSec, text);
                console.log('fadeInCountDown', data);
            };
            eventMap['fadeOutCountDown'] = ()=> {
                this.countDownRender.fadeOut();
                console.log('fadeOutCountDown', data);
            };
            if (eventMap[event])
                eventMap[event]();
        });
    }
}
