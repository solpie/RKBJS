import {BasePanelView} from "../../BasePanelView";
import {PanelId, ViewConst} from "../../../const";
import {loadImg} from "../../../utils/JsFunc";
import {MatchSvg} from "../../../../model/MatchSvg";
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
declare var io;

export class Bracket extends BasePanelView {
    constructor(stage, gameId) {
        super(PanelId.onlinePanel);
        this.name = PanelId.bracketPanel;
        console.log("new bracket");
        this.ctn = new Container();
        stage.addChild(this.ctn);
        this.stage = stage;
        this.initAuto(gameId);
    }

    show() {
        loadImg("/img/panel/stage1v1/bracketBg.png", (img)=> {
            var bg = new createjs.Shape();
            bg.alpha = .8;
            bg.graphics.beginBitmapFill(img, "repeat")
                .drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT);
            this.ctn.addChild(bg);
        });
    }

    initAuto(gameId) {
        var remoteIO = io.connect();
        remoteIO.on('connect', ()=> {
            console.log('hupuAuto socket connected');
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
            var match: MatchSvg = new MatchSvg();

            match.idx = Number(gameIdx);
            if (dataObj.left.score || dataObj.right.score) {
                if (dataObj.left.score > dataObj.right.score)
                    match.playerSvgArr[0].isWin = true;
                else
                    match.playerSvgArr[1].isWin = true;
            }

            if (!dataObj.left.name) {
                match.playerSvgArr[0].isHint = true
            }
            if (!dataObj.right.name) {
                match.playerSvgArr[1].isHint = true
            }
            var hintName = playerHintMap[gameIdx];
            match.playerSvgArr[0].name = dataObj.left.name ? dataObj.left.name : (hintName ? hintName[0] : '');
            match.playerSvgArr[0].score = dataObj.left.score;

            match.playerSvgArr[1].name = dataObj.right.name ? dataObj.right.name : (hintName ? hintName[1] : '');
            match.playerSvgArr[1].score = dataObj.right.score;
            matchArr.push(match);
        }
        // this.updateBracket(matchArr)
    }
}