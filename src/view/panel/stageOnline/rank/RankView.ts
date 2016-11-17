import Bitmap = createjs.Bitmap;
import Container = createjs.Container;
import {PlayerDoc} from "../../../../model/PlayerInfo";
import {BasePanelView} from "../../BasePanelView";
import {PanelId, FontName} from "../../../const";
import {FTInfo} from "../../../../model/FTInfo";
import {newBitmap} from "../../../utils/PixiEx";
import {loadImgArr} from "../../../utils/JsFunc";
import Shape = createjs.Shape;
import Text = createjs.Text;
declare let $;
declare let PIXI;

export class RankView extends BasePanelView {
    $opView;

    constructor($opView, stage) {
        super(PanelId.onlinePanel);
        this.name = PanelId.rankPanel;
        this.$opView = $opView;
        this.ctn = new PIXI.Container();
        stage.addChild(this.ctn);
        this.stage = stage;

        console.log('new rankView');
    }

    reqRank(gameId) {
        let game_id = gameId;
        console.log('get /api/passerbyking/game/players/', game_id);
        let api1 = 'http://api.liangle.com/api/passerbyking/game/rank/' + game_id;
        // api1 = 'http://api.liangle.com/api/passerbyking/game/list'
        $.get('http://' + window.location.host + '/get?url=' + api1, (respone) => {
            let data = JSON.parse(respone.entity);
            let mixRankData = data.data;

            let rankPlayerDocArr = [];
            for (let i = 0; i < mixRankData.player_rank.length; i++) {
                let player_rank = mixRankData.player_rank[i];
                let rankPlayerDoc = new PlayerDoc();
                rankPlayerDoc.name = player_rank.name;
                rankPlayerDoc.avatar = player_rank.avatar;
                rankPlayerDoc['ftName'] = player_rank.group;
                rankPlayerDoc.curFtScore = player_rank.score;
                rankPlayerDoc.ftScore = player_rank.total_score;
                rankPlayerDocArr.push(rankPlayerDoc);
            }

            let rankFtDocArr = [];
            for (let j = 0; j < mixRankData.group_rank.length; j++) {
                let group_rank = mixRankData.group_rank[j];
                let ftDoc = new FTInfo();
                ftDoc.name = group_rank.name;
                ftDoc.fullName = group_rank.full_name;
                ftDoc.logo = group_rank.logo;
                ftDoc.curScore = group_rank.score;
                ftDoc.score = group_rank.total_score;
                rankFtDocArr.push(ftDoc);
            }
            this.fadeInMixRank({
                totalFtDocArr: rankFtDocArr,
                totalPlayerDocArr: rankPlayerDocArr,
                gameId: game_id,
                auto: true
            });
        });
    }

    static getPlayerItem(playerDoc: PlayerDoc, ftMap, rank12?) {
        let ctn = new PIXI.Container();
        // loadTexture($, proxy(playerDoc.avatar), (tex) => {
        let avatar = newBitmap({
            url: playerDoc.avatar, isCrossOrigin: true, callback: () => {
                let bfWidth = avatar.width;
                avatar.y = 18;
                avatar.scale.x = avatar.scale.y = 119 / avatar.height;
                avatar.x = 18 + (130 - bfWidth * avatar.scale.x) / 2;
            }
        });

        let m = new PIXI.Graphics();
        m.beginFill(0xff0000);
        m.drawRect(0, 0, 130, 130);
        m.x = m.y = 18;
        ctn.addChild(m);
        avatar.mask = m;
        ctn.addChild(avatar);

        if (rank12) {
            let icon = newBitmap({url: '/img/panel/stage1v1/ft/rank' + rank12 + '.png'});
            icon.x = -20;
            icon.y = -30;
            ctn.addChild(icon);
        }

        let style = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: false,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 500
        };

        let nameText = new PIXI.Text(playerDoc.name, style);
        nameText.x = 160;
        nameText.y = 30;
        ctn.addChild(nameText);


        let ftName;
        if (playerDoc['ftName']) {
            ftName = playerDoc['ftName'];
        }
        else {
            let ftInfo = ftMap[playerDoc.ftId];
            ftName = ftInfo ? ftInfo.name : '无';
        }
        style.fontSize = '22px';
        style.dropShadow = true;
        style.fontStyle = 'italic';

        // var ftText = new PIXI.Text(ftName, {
        //     font: 'bold italic 22px Arvo',
        //     fill: '#3e1707',
        //     stroke: '#a4410e',
        //     strokeThickness: 1
        // });
        let ftText = new PIXI.Text(ftName+' ', style);
        ftText.x = 268;
        ftText.y = 90;
        ctn.addChild(ftText);


        let curScoreText = new PIXI.Text(String(playerDoc.curFtScore ? playerDoc.curFtScore : 0), {
            align: 'right',
            fill: '#ffffff'
        });
        // curScoreText.width = 80;
        curScoreText.style.font.fontsize(22);
        curScoreText.style.align = "right";
        curScoreText.x = 620;
        curScoreText.y = 90;
        ctn.addChild(curScoreText);
        curScoreText.updateText();

        let totalScoreText = new PIXI.Text(String(playerDoc.ftScore ? playerDoc.ftScore : 0), {
            align: 'right',
            fill: '#ffffff'
        });
        // totalScoreText.width = 80;
        totalScoreText.style.font.fontsize(22);
        totalScoreText.style.align = "right";
        totalScoreText.x = 770;
        totalScoreText.y = 90;
        ctn.addChild(totalScoreText);

        // });
        return ctn;
    };

    hide() {
        this.ctn.visible = false;
    }

    show() {
        this.ctn.visible = true;
    }

    static getFtItem(ftDoc, rank12?) {
        let ctn = new PIXI.Container();
        let itemBg = newBitmap({url: '/img/panel/stage1v1/ft/ftRankTeam.jpg'});
        ctn.addChild(itemBg);

        let logo = newBitmap({url: ftDoc.logo, isCrossOrigin: true});
        logo.x = 18;
        logo.y = 18;
        ctn.addChild(logo);

        if (rank12) {
            let icon = newBitmap({url: '/img/panel/stage1v1/ft/rank' + rank12 + '.png'});
            icon.x = -20;
            icon.y = -30;
            ctn.addChild(icon);
        }
        let s = {
            font: 'bold 40px Arial',
            align: 'right',
            fill: '#ffffff'
        };
        let nameText = new PIXI.Text(ftDoc.name, s);
        nameText.x = 160;
        nameText.y = 40;
        ctn.addChild(nameText);

        s.font = 'bold 22px Arial';
        let ftIntroText = new PIXI.Text(ftDoc.fullName + '', s);
        ftIntroText.x = 160;
        ftIntroText.y = 90;
        ctn.addChild(ftIntroText);

        let curScoreText = new PIXI.Text((ftDoc.curScore ? ftDoc.curScore : 0) + '', s);
        curScoreText.textAlign = 'right';
        curScoreText.x = 620;
        curScoreText.y = 95;
        ctn.addChild(curScoreText);

        let totalScoreText = new PIXI.Text((ftDoc.score ? ftDoc.score : 0) + '', s);
        totalScoreText.textAlign = 'right';
        totalScoreText.x = 780;
        totalScoreText.y = 95;
        ctn.addChild(totalScoreText);

        return ctn;
    }

    fadeInMixRank(param) {
        this.ctn.addChild(newBitmap({url: '/img/panel/stage1v1/ft/ftRankBg2.jpg'}));
        for (let i = 0; i < 5; i++) {
            let curItem = RankView.getPlayerItem(param.totalPlayerDocArr[i], param.ftMap, (i == 0 || i == 1 ? i + 1 : null));
            curItem.x = 45;
            curItem.y = 140 + i * 185;
            let itemBg = newBitmap({url: '/img/panel/stage1v1/ft/ftRankPlayer.jpg'});
            curItem.addChildAt(itemBg, 0);
            this.ctn.addChild(curItem);
            if (param.totalFtDocArr[i]) {
                let totalItem = RankView.getFtItem(param.totalFtDocArr[i], (i == 0 || i == 1 ? i + 1 : null));
                totalItem.x = 1005;
                totalItem.y = curItem.y;
                this.ctn.addChild(totalItem);
            }
        }
        let imgArr = [];
        imgArr.push({name: 'itemBg', url: '/img/panel/stage1v1/ft/ftRankPlayer.jpg'});

        loadImgArr(imgArr, (imgCol) => {
            console.log('load img', imgCol);
        });
    }

}