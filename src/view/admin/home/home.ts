import {JParam} from "../../Command";
/**
 * Created by toramisu on 2016/10/24.
 */
export var HomeView = {
    template: require('./home.html'),
    props: {
        links: null,
        opUrlArr: null,
    },
    created: function () {
        this.links = [
            {title: "screen1v1 ob", url: "/panel/#!/screen1v1/ob"},
            {title: "bracket1v1 ob", url: "/panel/#!/bracket/ob"},
            {title: "stage1v1 op/:game_id", url: "/panel/#!/stage1v1/op"},
            {title: "stage1v1 auto", url: "/panel/#!/stage1v1/auto"},
            {title: "八强对阵", url: "/panel/#!/bracket/auto/22"},
            {title: "战团排行", url: "/panel/#!/stage1v1/auto/35?score=0"},
        ];
        console.log('post /admin/');
        this.$http.post('/admin/', JParam({cmd: "opUrl"})).then((res)=> {
            this.opUrlArr = res.opUrlArr;
            console.log("/admin res:", res);
        });
    },
    mounted: function () {
    },
};