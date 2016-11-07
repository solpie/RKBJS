import {RankView} from "./rank/RankView";
import {BasePanelView} from "../BasePanelView";
import {Bracket} from "./bracket/Bracket";
var dynamicLoading = {
    css: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
};

var rankView: RankView;
var bracketView: Bracket;
var canvasStage;
export var StageOnlineView = {
    template: require('./stage-online.html'),
    // props: {
    //     gameId: 1,
    // },
    bracket: null,
    basePanelArr: null,
    components: {},
    props: {
        matchArr: {},
        gameId: null,
        isOp: null,
        stage: ""
    },
    watch: {
        matchArr: 'onMatchArrChanged'
    },
    created() {
        this.basePanelArr = [];
        this.isOp = this.$route.params.op == "op";
        if (this.isOp) {
            dynamicLoading.css('/css/bulma.min.css')
        }
        console.log('StageOnlineView created!');
    },
    mounted() {
        canvasStage = BasePanelView.initStage();
        // this.bracket = new BracketView();
        // this.bracket.gameId = this.$route.params.game_id;
        this.gameId = this.$route.params.game_id;
        if (!rankView) {
            rankView = new RankView(this, canvasStage);
            rankView.reqRank(this.gameId);
            this.basePanelArr.push(rankView);
        }
        console.log('StageOnlineView mounted!');
    },
    methods: {
        showOnly(bpName: string){
            var showBp;
            for (var i = 0; i < this.basePanelArr.length; i++) {
                var bp: BasePanelView = this.basePanelArr[i];
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