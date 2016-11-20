import {BasePanelView} from "../../BasePanelView";
import {PanelId, ViewConst, FontName} from "../../../const";
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
        let hintStyle = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '25px',
            fontStyle: 'italic',
            fill: '#C1C1C1',
        };
        // let hintStyle = {fontFamily: FontName.MicrosoftYahei, font: '25px italic', fill: '#AFAFAF', align: 'right'};
        for (let idx in groupPosMap) {
            let group2 = groupPosMap[idx];
            //todo 优化newBitmap options use tex
            let groupCtn  = group2.ctn = newBitmap({
                url: "/img/panel/bracket/group.png",
                x: group2.x, y: group2.y
            });

            ctn.addChild(groupCtn);

            let winHint = new PIXI.Graphics()
            winHint.beginFill(0xff0000)
                .drawRoundedRect(0,0,45,45,5)
            winHint.x = 160
            winHint.y=3
            winHint.visible = false;
            group2.winHint = winHint;

            groupCtn.addChild(winHint);

            //game idx
            let gameIdx = Number(idx);
            let gameIdxText = new PIXI.Text(idx, s);
            if (gameIdx > 9)
                gameIdxText.x =  - 50;
            else
                gameIdxText.x =  - 30;
            gameIdxText.y =  5;
            groupCtn.addChild(gameIdxText);

            //hint
            for (let i = 0; i < group2.hints.length; i++) {
                let hint = group2.hints[i];
                let label = new PIXI.Text(hint, hintStyle);
                label.x =  15;
                label.y =  8 + i * 48;
                group2.labels.push(label);
                groupCtn.addChild(label);

                let msk = new PIXI.Graphics();
                msk.y = label.y;
                msk.x = label.x;
                msk.beginFill(0x000000).drawRect(0, 0, 135, 50);
                groupCtn.addChild(msk);
                label.mask = msk;

                groupCtn.addChild(group2.scores[i]);
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
        // TweenLite.delayedCall(2, () => {
        //     this.showComingIdx(1);
        // })
    }

    showComingIdx(idx) {
        let g = groupPosMap[idx];
        if (g) {
            this.comingTitle.visible = true;
            this.comingTitle.x = g.x - 4;
            this.comingTitle.y = g.y - 36;
            blink2(this.comingTitle, .6);
        }
    }

    hideComing() {
        this.comingTitle.visible = false;
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

            eventMap['startGame'] = () => {
                this.hideComing();
            };

            eventMap['updateScore'] = () => {
                this.hideComing();
            };

            if (eventMap[event])
                eventMap[event]();
        });
    }

    onBracketData(res) {
        let closeGame = {};
        let s = {font: '25px', fill: '#e1e1e1', align: 'right'};
        for (let gameIdx in res.data) {
            let dataObj = res.data[gameIdx];
            let group1 = groupPosMap[gameIdx];
            group1.idx = Number(gameIdx);
            if (dataObj.left.score || dataObj.right.score) {
                if (dataObj.left.score > dataObj.right.score)
                    group1.playerArr[0].isWin = true;
                else
                    group1.playerArr[1].isWin = true;
                closeGame[gameIdx] = true;
            }
            if (dataObj.left.name) {
                (group1.labels[0] as PIXI.Text).style = s;
            }
            if (dataObj.right.name) {
                (group1.labels[1] as PIXI.Text).style = s;
            }
            let hints = group1.hints;
            group1.labels[0].text = dataObj.left.name || (hints ? hints[0] : '');
            group1.scores[0].text = dataObj.left.score || "0";

            group1.labels[1].text = dataObj.right.name || (hints ? hints[1] : '');
            group1.scores[1].text = dataObj.right.score || "0";
        }

        for (let i = 0; i < 14; i++) {
            let isClose = closeGame[14 - i];
            if (isClose) {
                this.showComingIdx(14 - i + 1);
                break;
            }
            else if(i==13)
            {
                this.showComingIdx(1);
            }
        }
        for (let i = 0; i < 14; i++) {
            let isClose = closeGame[i+1];
            if (!isClose) {
                groupPosMap[i+1].winHint.visible = false;
            }
            else{
                groupPosMap[i+1].ctn.alpha = 0.3;
                groupPosMap[i+1].winHint.visible = true;
                if(groupPosMap[i+1].playerArr[0].isWin)
                    groupPosMap[i+1].winHint.y = 3;
                else
                    groupPosMap[i+1].winHint.y =51;
            }
        }
    }
}