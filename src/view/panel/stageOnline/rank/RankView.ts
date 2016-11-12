import Bitmap = createjs.Bitmap;
import Container = createjs.Container;
import {PlayerDoc} from "../../../../model/PlayerInfo";
import {loadImg} from "../../../utils/JsFunc";
import {BasePanelView} from "../../BasePanelView";
import {PanelId} from "../../../const";
import {FTInfo} from "../../../../model/FTInfo";
import Shape = createjs.Shape;
import Text = createjs.Text;
declare var $;

export class RankView extends BasePanelView {
    $opView;

    constructor($opView, stage) {
        super(PanelId.onlinePanel);
        this.name = PanelId.rankPanel;
        this.$opView = $opView;
        this.ctn = new createjs.Container();
        stage.addChild(this.ctn);
        this.stage = stage;

        console.log('new rankView');
    }

    reqRank(gameId) {
        var game_id = gameId;
        console.log('get /api/passerbyking/game/players/', game_id);
        var api1 = 'http://api.liangle.com/api/passerbyking/game/rank/' + game_id;
        // api1 = 'http://api.liangle.com/api/passerbyking/game/list'
        $.get('http://' + window.location.host + '/get?url=' + api1, (respone)=> {
            var data = JSON.parse(respone.entity);
            var mixRankData = data.data;

            var rankPlayerDocArr = [];
            for (var i = 0; i < mixRankData.player_rank.length; i++) {
                var player_rank = mixRankData.player_rank[i];
                var rankPlayerDoc = new PlayerDoc();
                rankPlayerDoc.name = player_rank.name;
                rankPlayerDoc.avatar = player_rank.avatar;
                rankPlayerDoc['ftName'] = player_rank.group;
                rankPlayerDoc.curFtScore = player_rank.score;
                rankPlayerDoc.ftScore = player_rank.total_score;
                rankPlayerDocArr.push(rankPlayerDoc);
            }

            var rankFtDocArr = [];
            for (var j = 0; j < mixRankData.group_rank.length; j++) {
                var group_rank = mixRankData.group_rank[j];
                var ftDoc = new FTInfo();
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
        var ctn = new Container();
        var itemBg = new Bitmap('/img/panel/stage1v1/ft/ftRankPlayer.jpg');
        ctn.addChild(itemBg);

        var avtCtn = new Container();
        ctn.addChild(avtCtn);
        loadImg(playerDoc.avatar, (img)=> {
            var avatar = new Bitmap(playerDoc.avatar);
            avatar.y = 18;
            // console.log('aw ', img.width);
            avatar.scaleX = avatar.scaleY = 119 / img.height;
            // console.log('aw ', img.width);
            avatar.x = 18 + (130 - img.width * avatar.scaleX) / 2;
            avtCtn.addChild(avatar);

            var m = new Shape();
            m.graphics.beginFill('#000').dr(0, 0, 130, 130);
            m.x = m.y = 18;
            avatar.mask = m;
        });

        if (rank12) {
            var icon = new Bitmap('/img/panel/stage1v1/ft/rank' + rank12 + '.png');
            icon.x = -20;
            icon.y = -30;
            ctn.addChild(icon);
        }

        var nameText = new Text(playerDoc.name, "bold 40px Arial", "#fff");
        nameText.x = 160;
        nameText.y = 40;
        ctn.addChild(nameText);
        var ftName;
        if (playerDoc['ftName']) {
            ftName = playerDoc['ftName'];
        }
        else {
            var ftInfo = ftMap[playerDoc.ftId];
            ftName = ftInfo ? ftInfo.name : '无';
        }

        var ftText = new Text(ftName, "22px Arial", "#fff");
        ftText.x = 268;
        ftText.y = 95;
        ctn.addChild(ftText);

        var curScoreText = new Text((playerDoc.curFtScore ? playerDoc.curFtScore : 0) + '', "22px Arial", "#fff");
        curScoreText.textAlign = 'right';
        curScoreText.x = 620;
        curScoreText.y = 95;
        ctn.addChild(curScoreText);

        var totalScoreText = new Text((playerDoc.ftScore ? playerDoc.ftScore : 0) + '', "22px Arial", "#fff");
        totalScoreText.textAlign = 'right';
        totalScoreText.x = 780;
        totalScoreText.y = 95;
        ctn.addChild(totalScoreText);

        return ctn;
    };

    static getFtItem(ftDoc, rank12?) {
        var ctn = new Container();
        var itemBg = new Bitmap('/img/panel/stage1v1/ft/ftRankTeam.jpg');
        ctn.addChild(itemBg);

        var logo = new Bitmap(ftDoc.logo);
        logo.x = 18;
        logo.y = 18;
        ctn.addChild(logo);

        if (rank12) {
            var icon = new Bitmap('/img/panel/stage1v1/ft/rank' + rank12 + '.png')
            icon.x = -20;
            icon.y = -30;
            ctn.addChild(icon);
        }

        var nameText = new Text(ftDoc.name, "bold 40px Arial", "#fff");
        nameText.x = 160;
        nameText.y = 40;
        ctn.addChild(nameText);

        var ftIntroText = new Text(ftDoc.fullName + '', "22px Arial", "#fff");
        ftIntroText.x = 160;
        ftIntroText.y = 90;
        ctn.addChild(ftIntroText);

        var curScoreText = new Text((ftDoc.curScore ? ftDoc.curScore : 0) + '', "22px Arial", "#fff");
        curScoreText.textAlign = 'right';
        curScoreText.x = 620;
        curScoreText.y = 95;
        ctn.addChild(curScoreText);

        var totalScoreText = new Text((ftDoc.score ? ftDoc.score : 0) + '', "22px Arial", "#fff");
        totalScoreText.textAlign = 'right';
        totalScoreText.x = 780;
        totalScoreText.y = 95;
        ctn.addChild(totalScoreText);

        return ctn;
    }

    fadeInMixRank(param) {
        this.ctn.removeAllChildren();

        var bg = new Bitmap('/img/panel/stage1v1/ft/ftRankBg2.jpg');
        this.ctn.addChild(bg);


        for (var i = 0; i < 5; i++) {
            var curItem = RankView.getPlayerItem(param.totalPlayerDocArr[i], param.ftMap, (i == 0 || i == 1 ? i + 1 : null));
            curItem.x = 45;
            curItem.y = 140 + i * 185;
            this.ctn.addChild(curItem);

            if (param.totalFtDocArr[i]) {
                var totalItem = RankView.getFtItem(param.totalFtDocArr[i], (i == 0 || i == 1 ? i + 1 : null));
                totalItem.x = 1005;
                totalItem.y = curItem.y;
                this.ctn.addChild(totalItem);
            }
        }
    }

}