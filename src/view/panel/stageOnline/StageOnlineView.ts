import {RankView} from "./rank/RankView";
import {BasePanelView} from "../BasePanelView";
import {Bracket} from "./bracket/Bracket";
import {dynamicLoading} from "../../utils/WebJsFunc";
import {VueBase} from "../../utils/VueBase";
import {PanelId} from "../../const";
import {CommandId} from "../../Command";

declare let $;
declare let io;
let rankView: RankView;
let bracketView: Bracket;
let canvasStage;
class StageOnlineView extends VueBase {
    template = require('./stage-online.html');
    basePanelArr: BasePanelView[];
    gameId = VueBase.String;
    isOp = VueBase.PROP;
    opReq = (cmdId: string, param: any, callback: any) => {
        $.post(`/panel/${PanelId.onlinePanel}/${cmdId}`,
            param,
            callback);
    };

    constructor() {
        super();
        VueBase.initProps(this);
    }

    protected created() {
        this.basePanelArr = [];
        this.isOp = this.$route.params.op == "op";
        if (this.isOp) {
            dynamicLoading.css('/css/bulma.min.css')
        }
        console.log('stageOnlineView created!');
    }

    protected mounted() {
        canvasStage = BasePanelView.initPixi();
        // this.bracket = new BracketView();
        // this.bracket.gameId = this.$route.params.game_id;
        this.gameId = this.$route.params.game_id;
        if (this.$route.query['panel'] && this.$route.query['panel'] == "bracket") {
            //test
            this.showBracket();
        }
        else {
            this.showRank();
        }
        console.log('StageOnlineView mounted!');
        this.initIO();
    }

    initIO() {
        let localWs = io.connect(`http://${window.location.host}/${PanelId.rkbPanel}`);
        localWs.on('connect', function (msg) {
            console.log('connect', window.location.host);
            localWs.emit("opUrl", {opUrl: window.location.host});
        })
            .on(`${CommandId.sc_showRank}`, (data)=> {
                console.log("CommandId.sc_showRank", data);
                this.showRank();
            })
            .on(`${CommandId.sc_showBracket}`, (data)=> {
                console.log("CommandId.sc_showBracket", data);
                this.showBracket();
            })
            .on(`${CommandId.sc_hideOnlinePanel}`, (data)=> {
                this.showOnly("");
            })
    }

    showRank() {
        if (!rankView) {
            rankView = new RankView(this, canvasStage);
            rankView.reqRank(this.gameId);
            this.basePanelArr.push(rankView);
        }
        rankView.reqRank(this.gameId);
        this.showOnly(rankView.name);
    }

    showBracket() {
        console.log('onClkBracket');
        if (!bracketView) {
            bracketView = new Bracket(canvasStage, this.gameId);
            this.basePanelArr.push(bracketView);
        }
        this.showOnly(bracketView.name);
    }

    showOnly(bpName: string) {
        let showBp;
        for (let i = 0; i < this.basePanelArr.length; i++) {
            let bp: BasePanelView = this.basePanelArr[i];
            if (bpName != bp.name)
                bp.hide();
            else
                showBp = bp;
        }
        if (showBp)
            showBp.show();
    }

    methods = {
        onClkHide(){
            console.log('onClkHide');
            this.opReq(`${CommandId.cs_hideOnlinePanel}`, {_: null})
        },
        onClkRank(){
            console.log('onClkRank');
            this.opReq(`${CommandId.cs_showRank}`, {_: null})
        },
        onClkBracket (){
            this.opReq(`${CommandId.cs_showBracket}`, {_: null});
        }
    }
}
export let stageOnlineView = new StageOnlineView();