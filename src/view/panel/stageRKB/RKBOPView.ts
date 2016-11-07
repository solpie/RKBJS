import {StageRKBView} from "./StageRKBView";
/**
 * Created by toramisu on 2016/10/31.
 */
var stageRKBView: StageRKBView;
export var RKBOPView = {
    template: require('./RKBOP.html'),
    props: {
        links: null,
        test: "hello",
    },
    created() {
        console.log('op created!')
    },

    mounted() {
        // this.test = "hello";
        if (!stageRKBView)
            stageRKBView = new StageRKBView(this);
        console.log('op mounted!');
    }
};