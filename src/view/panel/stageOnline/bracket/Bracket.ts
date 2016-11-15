import {BasePanelView} from "../../BasePanelView";
import {PanelId, ViewConst} from "../../../const";
import {groupPosMap, PlayerSvg} from "./BracketGroup";
import {newBitmap} from "../../../utils/PixiEx";
import {drawLine1, drawLine2, drawLine4} from "./GroupLine";
import {blink2} from "../../../utils/Fx";
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
declare let $;
declare let io;
declare let hupuWsUrl;

export class Bracket extends BasePanelView {
    comingTitle: PIXI.Sprite;

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
        let ctn: PIXI.Container = this.ctn;
        let bg = newBitmap({
            url: "/img/panel/bracket/tile2.png",
            isTiling: true,
            width: ViewConst.STAGE_WIDTH,
            height: ViewConst.STAGE_HEIGHT
        });
        bg.alpha = 0.8;
        ctn.addChild(bg);
        ctn.addChild(newBitmap({url: "/img/panel/bracket/title.png"}));
        let s = {font: '25px', fill: '#C1C1C1', align: 'right'};
        let hintStyle = {font: '25px italic', fill: '#AFAFAF', align: 'right'};
        for (let idx in groupPosMap) {
            let group2 = groupPosMap[idx];
            //todo 优化newBitmap options use tex
            ctn.addChild(newBitmap({
                url: "/img/panel/bracket/group.png",
                x: group2.x, y: group2.y
            }));
            //game idx
            let gameIdx = Number(idx);
            let gameIdxText = new PIXI.Text(idx, s);
            if (gameIdx > 9)
                gameIdxText.x = group2.x - 50;
            else
                gameIdxText.x = group2.x - 30;
            gameIdxText.y = group2.y + 5;
            ctn.addChild(gameIdxText);

            //hint
            for (let i = 0; i < group2.hints.length; i++) {
                let hint = group2.hints[i];
                let label = new PIXI.Text(hint, hintStyle);
                label.x = group2.x + 15;
                label.y = group2.y + 8 + i * 48;
                group2.labels.push(label);
                ctn.addChild(label);
                ctn.addChild(group2.scores[i]);

                group2.playerArr = [new PlayerSvg, new PlayerSvg]
            }
            if (gameIdx > 4) {

            }
        }
        ///group line
        let ofsX = 213;
        let ofsY = 48;
        let g1 = groupPosMap[1];
        ctn.addChild(drawLine1(g1.x + ofsX, g1.y + ofsY));
        g1 = groupPosMap[3];
        ctn.addChild(drawLine1(g1.x + ofsX, g1.y + ofsY));
        g1 = groupPosMap[10];
        ctn.addChild(drawLine1(g1.x + ofsX, g1.y + ofsY - 1));

        g1 = groupPosMap[7];
        ctn.addChild(drawLine1(g1.x + ofsX, g1.y + ofsY, 144));

        g1 = groupPosMap[5];
        ctn.addChild(drawLine2(g1.x + ofsX, g1.y - 5));
        g1 = groupPosMap[6];
        ctn.addChild(drawLine2(g1.x + ofsX, g1.y - 5));
        g1 = groupPosMap[12];
        ctn.addChild(drawLine2(g1.x + ofsX, g1.y - 24, 19));

        g1 = groupPosMap[11];
        ctn.addChild(drawLine4(g1.x + ofsX, g1.y + ofsY - 1));

        this.comingTitle = newBitmap({url: '/img/panel/bracket/comingTitle.png'});
        this.comingTitle.visible = false;
        ctn.addChild(this.comingTitle);

        //test
        TweenLite.delayedCall(2, () => {
            this.setComingIdx(1);
        })
    }

    setComingIdx(idx) {
        let g = groupPosMap[idx];
        this.comingTitle.visible = true;
        this.comingTitle.x = g.x - 4;
        this.comingTitle.y = g.y - 36;
        blink2(this.comingTitle, .6);
    }

    hide() {
        this.ctn.visible = false;
    }

    show() {
        this.ctn.visible = true;
    }

    initAuto(gameId) {
        let remoteIO = io.connect(hupuWsUrl);
        remoteIO.on('connect', () => {
            console.log('hupuAuto socket connected GameId', gameId);
            remoteIO.emit('passerbyking', {
                game_id: gameId,
                page: 'top8Map'
            })
        });

        remoteIO.on('wall', (data: any) => {
            let event = data.et;
            let eventMap = {};
            console.log('event:', event, data);

            eventMap['top8Match'] = () => {
                console.log('top8Match', data);
                data.data = data.list;
                this.onBracketData(data);
            };

            if (eventMap[event])
                eventMap[event]();
        });
    }

    onBracketData(res) {
        for (let gameIdx in res.data) {
            let dataObj = res.data[gameIdx];
            let group1 = groupPosMap[gameIdx];
            group1.idx = Number(gameIdx);
            if (dataObj.left.score || dataObj.right.score) {
                if (dataObj.left.score > dataObj.right.score)
                    group1.playerArr[0].isWin = true;
                else
                    group1.playerArr[1].isWin = true;
            }
            let hints = group1.hints;
            group1.labels[0].text = dataObj.left.name || (hints ? hints[0] : '');
            group1.scores[0].text = dataObj.left.score || "0";

            group1.labels[1].text = dataObj.right.name || (hints ? hints[1] : '');
            group1.scores[1].text = dataObj.right.score || "0";
        }
    }
}