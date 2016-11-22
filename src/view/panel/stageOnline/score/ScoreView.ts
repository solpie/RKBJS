import { ScorePanel } from './ScorePanel';
import { CommandId } from '../../../Command';
import { initIO } from '../../../../router/PanelRouter';
import { PanelId, TimerState } from '../../../const';
import { BasePanelView } from '../../BasePanelView';
declare let io;
export class ScoreView extends BasePanelView {
    scorePanel: ScorePanel
    delayTimeMS = 0
    constructor(stage: PIXI.Container) {
        super(PanelId.onlinePanel)
        this.name = PanelId.scorePanel
        this.ctn = new PIXI.Container()
        stage.addChild(this.ctn)

        this.scorePanel = new ScorePanel(this.ctn)

        console.log('new ScoreView')
    }
    initIO() {
        let localWs = io.connect(`/${PanelId.rkbPanel}`)
        localWs.on('connect', function (msg) {
            console.log('connect', window.location.host);
            localWs.emit("opUrl", { opUrl: window.location.host });
        })
            .on(`${CommandId.sc_setDelayTime}`, (data) => {
                console.log("CommandId.setDelayTime", data);
                this.delayTimeMS = data.delayTimeMS;
            })
            .on(CommandId.sc_startTimer, (data) => {
                this.scorePanel.toggleTimer1(TimerState.RUNNING)
            })
            .on(CommandId.sc_pauseTimer, (data) => {
                this.scorePanel.toggleTimer1(TimerState.PAUSE)
            })
            .on(CommandId.sc_resetTimer, (data) => {
                console.log("CommandId.sc_resetTimer", data);
                this.scorePanel.resetTimer()
            })
    }
}