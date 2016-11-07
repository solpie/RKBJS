import {matchsvg} from "./bracket/match-svg";
import {BracketView} from "./bracket/BracketView";
import {RankView} from "./rank/RankView";
import {BasePanelView} from "../BasePanelView";
import {PlayerDoc} from "../../../model/PlayerInfo";
import {FTInfo} from "../../../model/FTInfo";
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
var canvasStage;
export var StageOnlineView = {
    template: require('./stage-online.html'),
    // props: {
    //     gameId: 1,
    // },
    bracket: null,
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
        if (!rankView)
        {
            rankView = new RankView(this, canvasStage);
            rankView.reqRank(this.gameId);
        }

        console.log('StageOnlineView mounted!');
    },
    methods: {

        onClkHide(){
            console.log('onClkHide');
            this.stage = "";
            rankView.hide();
        },
        onClkRank(){
            console.log('onClkRank');
            this.stage = "rank";
            rankView.reqRank(this.gameId);
            // rankView.fadeInMixRank({});
        },
        onClkBracket (){
            console.log('onClkBracket ');
            this.stage = "bracket";
        }
    }
};