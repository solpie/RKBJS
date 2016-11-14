import {BasePanelView} from "../../BasePanelView";
import {PanelId, ViewConst} from "../../../const";
import {BracketGroup} from "./BracketGroup";
import {imgToTexture} from "../../../utils/PixiEx";
import {loadImgArr} from "../../../utils/JsFunc";
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
declare var $;
declare var io;
declare var hupuWsUrl;
export class Bracket extends BasePanelView {
    constructor(stage, gameId) {
        super(PanelId.onlinePanel);
        this.name = PanelId.bracketPanel;
        console.log("new bracket");
        this.ctn = new PIXI.Container();
        stage.addChild(this.ctn);
        this.stage = stage;
        this.initAuto(gameId);

        this.initBg()
    }

    initBg() {

        loadImgArr(["/img/panel/bracket/bracketBg.png",
            "/img/panel/bracket/group.png",
            "/img/panel/bracket/title.png"], (imgArr)=> {
            var imgBg = imgArr[0];
            var imgGroup = imgArr[1];
            var imgTitle = imgArr[2];

            var ctn: PIXI.Container = this.ctn;
            var tilingBg = new PIXI.extras.TilingSprite(imgToTexture(imgBg), ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT);
            tilingBg.alpha = 0.8;
            ctn.addChild(tilingBg);

            var title = new PIXI.Sprite(imgToTexture(imgTitle));
            ctn.addChild(title);
        });
    }

    hide() {
        this.ctn.visible = false;
    }

    show() {
        this.ctn.visible = true;
    }

    initAuto(gameId) {
        var remoteIO = io.connect(hupuWsUrl);
        remoteIO.on('connect', ()=> {
            console.log('hupuAuto socket connected GameId', gameId);
            remoteIO.emit('passerbyking', {
                game_id: gameId,
                page: 'top8Map'
            })
        });

        remoteIO.on('wall', (data: any)=> {
            var event = data.et;
            var eventMap = {};
            console.log('event:', event, data);

            eventMap['top8Match'] = ()=> {
                console.log('top8Match', data);
                data.data = data.list;
                this.onBracketData(data);
            };

            if (eventMap[event])
                eventMap[event]();
        });
    }

    onBracketData(res) {
        var matchArr = [];
        var playerHintMap = {
            '5': ['  第1场败者', '  第2场败者'],
            '6': ['  第3场败者', '  第4场败者'],
            '9': ['  第7场败者', ''],
            '13': ['  第11场败者', ''],
            '10': ['  第8场败者', ''],
            '14': ['', '  第13场胜者']
        };

        for (var gameIdx in res.data) {
            var dataObj = res.data[gameIdx];
            var match: BracketGroup = new BracketGroup(gameIdx);
            match.idx = Number(gameIdx);
            if (dataObj.left.score || dataObj.right.score) {
                if (dataObj.left.score > dataObj.right.score)
                    match.playerArr[0].isWin = true;
                else
                    match.playerArr[1].isWin = true;
            }

            if (!dataObj.left.name) {
                match.playerArr[0].isHint = true
            }
            if (!dataObj.right.name) {
                match.playerArr[1].isHint = true
            }
            var hintName = playerHintMap[gameIdx];
            match.playerArr[0].name = dataObj.left.name ? dataObj.left.name : (hintName ? hintName[0] : '');
            match.playerArr[0].score = dataObj.left.score;

            match.playerArr[1].name = dataObj.right.name ? dataObj.right.name : (hintName ? hintName[1] : '');
            match.playerArr[1].score = dataObj.right.score;
            matchArr.push(match);
        }
        this.render(matchArr);
    }

    render(groupArr) {
        //todo: bg group cache
        // loadTexture($, proxy('/img/panel/bracketBg.png'), (tex)=> {
        //     var tilingSprite = new PIXI.extras.TilingSprite(tex, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT);
        //     this.ctn.addChild(tilingSprite);
        // });


        // loadImgArr(["/img/panel/bracket/bracketBg.png",
        //     "/img/panel/bracket/group.png",
        //     "/img/panel/bracket/title.png"], (imgArr)=> {
        //     var imgBg = imgArr[0];
        //     var imgGroup = imgArr[1];
        //     var imgTitle = imgArr[2];
        //
        //     var bg = new createjs.Shape();
        //     bg.alpha = .8;
        //     bg.graphics.beginBitmapFill(imgBg, "repeat")
        //         .drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT);
        //
        //     bg.graphics.endFill();
        //     this.ctn.addChild(bg);
        //
        //
        //     var groupShape = new createjs.Shape();
        //     var m = new createjs.Matrix2D();
        //     groupArr.length = 2;
        //     for (var i = 0; i < groupArr.length; i++) {
        //         var group = groupArr[i];
        //         console.log(group);
        //         // m.tx = group.x;
        //         // m.ty = group.y;
        //         m.translate(group.x, group.y);
        //         groupShape.graphics.beginBitmapFill(imgGroup, "repeat", m)
        //             .drawRect(group.x, group.y, imgGroup.width, imgGroup.height);
        //         groupShape.graphics.endFill();
        //     }
        //
        //     groupShape.graphics.beginBitmapFill(imgTitle)
        //         .drawRect(0, 0, imgTitle.width, imgTitle.height);
        //     groupShape.graphics.endFill();
        //     this.ctn.addChild(groupShape);
        // })

    }
}