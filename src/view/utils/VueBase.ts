export class VueBase {
    static PROP: any = {v: null, _: null};
    static Number: any = {v: 0, _: null};
    static String: any = {v: "", _: null};
    props = {};
    template;
    $route;

    // constructor() {
    //     super();
    //     VueBase.initProps(this);
    // }
    // put above in subClass

    static initProps(subClassObj) {
        for (var p in subClassObj) {
            var o = subClassObj[p];
            if (o.hasOwnProperty("v")
                && o.hasOwnProperty("_")) {
                //create props
                console.log("init value", p);
                subClassObj["props"][p] = o.v;
            }
        }
    }

    created() {
        VueBase.initProps(this);
    }

    mounted() {

    }
}