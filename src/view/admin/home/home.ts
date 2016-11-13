import {dynamicLoading} from "../../utils/WebJsFunc";
/**
 * Created by toramisu on 2016/10/24.
 */
declare var $;
require("script!./../../../../clientLibs/qrcode.min.js");
declare var QRCode;
export var HomeView = {
    template: require('./home.html'),
    props: {
        links: null,
        opUrlArr: null,
        selected: 0,
        options: null
    },
    watch: {
        selected: "onSelGameID"
    },
    created: function () {
        console.log('post /admin/');
        // dynamicLoading.js('/js/qrcode.min.js');
        var apiGame = 'http://api.liangle.com/api/passerbyking/game/list';
        $.get(`http://${window.location.host}/get?url=${apiGame}`, (res1)=> {
            var data = JSON.parse(res1.entity);
            console.log(data);
            var gameDataArr = data.data;
            this.gameDataArr = gameDataArr;
            for (var i = 0; i < gameDataArr.length; i++) {
                var gameData = gameDataArr[i];
                gameData.text = "[" + gameData.id + "]:" + gameData.title;
                gameData.value = gameData.id;
            }
            this.options = gameDataArr;
        });
    },
    mounted: function () {
        this.updateLinks(1);
    },
    methods: {
        updateLinks(gameId){
            this.links = [
                {title: "战团排行", url: `/panel/#/ol/auto/${gameId}?score=0`},
                {title: "八强对阵", url: `/panel/#!/bracket/auto/${gameId}`},
                {title: "比分面板", url: `/panel/#/rkb/ob/${gameId}`},
                {title: "比分面板 操作", url: `/panel/#/rkb/op/${gameId}`},
                {title: "战团排行 操作", url: `/panel/#/ol/op/${gameId}`},
                // {title: "bracket1v1 ob", url: "/panel/#/bracket/ob"},
                // {title: "stage1v1 auto", url: "/panel/#/stage1v1/auto"},
                {title: "screen1v1 ob", url: "/panel/#/screen1v1/ob"},
            ];
        },
        onSelGameID(gameId){
            this.updateLinks(gameId);
            $.get(`http://${window.location.host}/admin/sync/${this.selected}`, (res)=> {
                console.log(res)
            });
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: "http://jindo.dev.naver.com/collie",
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }
};