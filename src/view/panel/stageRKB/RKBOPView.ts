import {StageRKBView} from "./StageRKBView";
import {dynamicLoading} from "../../utils/WebJsFunc";
import {VueBase} from "../../utils/VueBase";
import {DateFormat} from "../../utils/JsFunc";
/**
 * Created by toramisu on 2016/10/31.
 */
var stageRKBView: StageRKBView;
export class RKBView extends VueBase {
    template = require('./RKBOP.html');

    links = VueBase.PROP;
    isOp = VueBase.PROP;
    gameId = VueBase.PROP;
    panelTime = VueBase.String;//线上画面时间(毫秒)
    liveTime = VueBase.String;//现场时间
    delayTime = VueBase.Number;// 秒
    test = VueBase.PROP;


    srvTime = 0;//服务器时间(毫秒)
    isTimerRunning = false;
    delayTimeMS = 0;

    constructor() {
        super();
        VueBase.initProps(this);
    }

    created() {
        console.log('RKBView created!');
        this.panelTime = "tesst";
        this.isOp = this.$route.params.op == "op";
        if (this.isOp) {
            dynamicLoading.css('/css/bulma.min.css')
        }
        this.gameId = this.$route.params.game_id;
    }

    mounted() {
        if (!stageRKBView)
            stageRKBView = new StageRKBView(this);
        console.log('op mounted!');
    }

    //methods:
    methods = {
        onClkSetDelay(){
            console.log("onClkSetDelay", this, this.delayTime);
            // this.panelTime = this.liveTime
            var dt = Number(this.delayTime);
            if (dt > 0)
                this.delayTimeMS = dt * 1000;
        }
    };

    onTick() {
        console.log("onTick");
        this.srvTime += 1000;
        this.liveTime = DateFormat(new Date(this.srvTime), "hh:mm:ss");
        this.panelTime = DateFormat(new Date(this.srvTime + this.delayTimeMS), "hh:mm:ss");
    }

    setSrvTime(t) {
        console.log("isRunning:", this.isTimerRunning, this.onTick, t);
        this.srvTime = t;
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            setInterval(()=> {
                this.onTick();
            }, 1000);
        }
    }
}
export var rkbView = new RKBView();