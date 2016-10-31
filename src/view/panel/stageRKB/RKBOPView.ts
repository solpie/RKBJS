import {StageRKBView} from "./StageRKBView";
/**
 * Created by toramisu on 2016/10/31.
 */
export var RKBOPView = {
    template: require('./RKBOP.html'),
    props: {
        links: null,
        test: "hello",
    },
    created() {
        var stageRKBView = new StageRKBView(this);
        console.log('op created!')
    },

    mounted() {
        // this.test = "hello";
        console.log('op mounted!');
    }
};