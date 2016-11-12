import {StageRKBView} from "./StageRKBView";
import {dynamicLoading} from "../../utils/WebJsFunc";
import {VueBase} from "../../utils/VueBase";
/**
 * Created by toramisu on 2016/10/31.
 */
var stageRKBView: StageRKBView;
export class RKBView extends VueBase {
    template = require('./RKBOP.html');
    links = VueBase.PROP;
    isOp = VueBase.PROP;
    gameId = VueBase.PROP;
    liveTime = VueBase.String;//现场时间 服务器时间
    panelTime = VueBase.String;//线上画面时间
    test = VueBase.PROP;

    constructor() {
        super();
        VueBase.initProps(this);
    }

    created() {
        console.log('RKBView created!');

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
}
export var rkbView = new RKBView();