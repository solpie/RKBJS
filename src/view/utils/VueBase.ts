export class VueBase {
    static PROP: any = {$: null};
    static Number: any = {v: 0};
    props = {};
    template;
    $route;
    constructor() {
        console.log("VueBase");
        for (var p in this) {
            if (this[p] == VueBase.PROP) {
                //create props
                this["props"][p] = null
            }
            if (this[p] == VueBase.Number) {
                //create props
                this["props"][p] = VueBase.Number.v
            }
        }
    }

    created() {

    }

    mounted() {

    }
}