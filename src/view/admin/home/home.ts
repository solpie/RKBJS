import {VueBase} from "../../utils/VueBase";
/**
 * Created by toramisu on 2016/10/24.
 */
declare var $;
declare var QRCode;

class HomeView extends VueBase {
    template = require('./home.html');
    links = VueBase.PROP;
    opUrlArr = VueBase.PROP;
    selected = VueBase.PROP;
    options = VueBase.PROP;
    gameDataArr = VueBase.PROP;
    iosParam = VueBase.Dict;
    rmtpUrl = VueBase.String;

    constructor() {
        super();
        VueBase.initProps(this);
    }

    created() {
        console.log('post /admin/');
        var apiGame = 'http://api.liangle.com/api/passerbyking/game/list';
        $.get(`http://${window.location.host}/get?url=${apiGame}`, (res1)=> {
            var data = JSON.parse(res1.entity);
            console.log(data);
            var gameDataArr = data.data;
            this.gameDataArr = [];
            for (var i = 0; i < gameDataArr.length; i++) {
                // var gameData = gameDataArr[i];
                var gameData = gameDataArr[gameDataArr.length - 1 - i];
                gameData.text = "[" + gameData.id + "]:" + gameData.title;
                gameData.value = gameData.id;
                this.gameDataArr.push(gameData);
            }
            this.options = gameDataArr;
        });
        // try {
        //     $.ajax({
        //         type: "GET",
        //         url: "http://www.liangle.com/passerbyking/game/info/84",
        //         dataType: 'jsonp',
        //         success: function (res) {
        //             console.log(res);
        //         }
        //     });
        // }
        // catch (e) {
        //     console.log(e);
        // }
        // $.ajax({
        //     type: "get",
        //     async: false,
        //     url: "http://www.liangle.com/passerbyking/game/info/84?callbackparam=success_jsonpCallback",
        //     dataType: "jsonp",
        //     jsonp: "callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        //     jsonpCallback: "success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        //     success: function (json) {
        //         alert(json);
        //         alert(json[0].name);
        //     },
        //     error: function (e) {
        //         console.log(e, this)
        //     }
        // });
        // dynamicLoading.js("http://www.liangle.com/passerbyking/game/info/84");
        // $.ajax({
        //     type: 'GET',
        //     url: "http://www.liangle.com/passerbyking/game/info/84",
        //     contentType: "application/json",
        //     dataType: 'jsonp',
        //     success: function (json) {
        //         alert(json);
        //     },
        //     error: function (e) {
        //         console.log(e.message);
        //     }
        // });
    }

    mounted() {
        this.updateLinks(78);
        // this.selected = 78
    }

    updateLinks(gameId) {
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
    }

    watch = {
        selected: "onSelGameID"
    };

    genQRCode() {
        this.iosParam = {"rtmp": this.rmtpUrl, gameId: this.selected + ""};
        new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify(this.iosParam),
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    methods = {
        onSelGameID(gameId){
            this.updateLinks(gameId);
            $.get(`http://${window.location.host}/admin/sync/${this.selected}`, (res)=> {
                console.log(res)
            });
        },
        onClkQRCode(){
            // var $s = $($('script')[0])
            // console.log($s);


            this.genQRCode()
        }
    };
}

export var homeView = new HomeView();