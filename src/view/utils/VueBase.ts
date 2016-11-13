// export var _method: any = (func)=> {
//     return {f: func, _: null}
// };

export class VueBase {
    static PROP: any = {v: null, _: null};
    static Dict: any = {v: {}, _: null};
    static Number: any = {v: 0, _: null};
    static String: any = {v: "", _: null};
    props = {};
    methods = {};
    template;
    $route;

    // constructor() {
    //     super();
    //     VueBase.initProps(this);
    // }
    // put above in subClass

    static initProps(subClassObj: VueBase) {
        for (var key in subClassObj) {
            var o = subClassObj[key];
            if (o.hasOwnProperty("_")) {
                if (o.hasOwnProperty("v")) {
                    //create props
                    subClassObj.props[key] = o.v;
                }
                else if (o.hasOwnProperty("f")) {
                    subClassObj.methods[key] = o.f;
                }
            }
            else {
                var isClsFunc = o instanceof Function;
                if (isClsFunc) {
                    subClassObj.methods[key] = o;
                }
            }
        }
    }

    protected created() {
    }

    protected mounted() {
    }
}