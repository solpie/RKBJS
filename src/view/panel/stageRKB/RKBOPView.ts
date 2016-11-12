import {StageRKBView} from "./StageRKBView";
import {dynamicLoading} from "../../utils/WebJsFunc";
/**
 * Created by toramisu on 2016/10/31.
 */
var stageRKBView: StageRKBView;
export var RKBOPView = {
    template: require('./RKBOP.html'),
    props: {
        links: null,
        isOp: null,
        gameId: null,
        liveTime: null,//现场时间 服务器时间
        panelTime: null,//线上画面时间
        test: "hello",
    },
    created() {
        console.log('op created!');
        this.isOp = this.$route.params.op == "op";
        if (this.isOp) {
            dynamicLoading.css('/css/bulma.min.css')
        }
        this.gameId = this.$route.params.game_id;
    },

    mounted() {
        // this.test = "hello";
        if (!stageRKBView)
            stageRKBView = new StageRKBView(this);
        console.log('op mounted!');
    }
};