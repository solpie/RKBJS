import {RankView} from "./rank/RankView";
import {BasePanelView} from "../BasePanelView";
import {Bracket} from "./bracket/Bracket";
import {dynamicLoading} from "../../utils/WebJsFunc";


let rankView: RankView;
let bracketView: Bracket;
let canvasStage;
class StageOnlineView {
    template = require('./stage-online.html')

}
export let stageOnlineView = {
    template: require('./stage-online.html'),
    bracket: null,
    basePanelArr: null,
    components: {},
    props: {
        gameId: null,
        isOp: null,
        stage: ""
    },
    created() {
        this.basePanelArr = [];
        this.isOp = this.$route.params.op == "op";
        if (this.isOp) {
            dynamicLoading.css('/css/bulma.min.css')
        }
        console.log('stageOnlineView created!');
    },
    mounted() {
        canvasStage = BasePanelView.initPixi();
        // this.bracket = new BracketView();
        // this.bracket.gameId = this.$route.params.game_id;
        this.gameId = this.$route.params.game_id;
        if (!rankView) {
            rankView = new RankView(this, canvasStage);
            rankView.reqRank(this.gameId);
            this.basePanelArr.push(rankView);
        }
        console.log('stageOnlineView mounted!');
    },
    methods: {
        showOnly(bpName: string){
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
        },
        onClkHide(){
            console.log('onClkHide');
            this.stage = "";
            this.showOnly("");
        },
        onClkRank(){
            console.log('onClkRank');
            this.stage = "rank";
            rankView.reqRank(this.gameId);
            this.showOnly(rankView.name);
        },
        onClkBracket (){
            console.log('onClkBracket ');
            this.stage = "bracket";

            if (!bracketView) {
                bracketView = new Bracket(canvasStage, this.gameId);
                this.basePanelArr.push(bracketView);
            }
            this.showOnly(bracketView.name);
        }
    }
};