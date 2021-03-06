import Container = createjs.Container;
import {PlayerInfo, PlayerDoc} from "../../../model/PlayerInfo";
import {CreateJsEx} from "../CreateJsEx";
import {loadImg, cnWrap, loadImgArr} from "../../utils/JsFunc";
import {ViewConst} from "../../const";
import {fadeOutCtn} from "../../utils/Fx";
import Text = createjs.Text;
import Bitmap = createjs.Bitmap;
var $ = require('jquery');
export class PlayerInfoCard {
    ctn: Container;

    constructor(parent: Container) {
        this.ctn = new createjs.Container();
        parent.addChild(this.ctn);
    }

    fadeInfoPlayerInfoCard(playerDocArr) {
        this.ctn.removeAllChildren();
        $('#ex').html("");
        this.ctn.addChild(CreateJsEx.newModal());
        for (var i = 0; i < playerDocArr.length; i++) {
            var playerDoc = playerDocArr[i];
            var pInfo;
            var isBlue = (i < 1);
            pInfo = new PlayerInfo(playerDoc);
            pInfo.isBlue = isBlue;
            pInfo.isKing = playerDoc.isKing;
            var playerCard = this.getWinPlayerCard(pInfo, (pInfo2)=> {
                var bound = pInfo2.playerCard.getBounds();
                if (bound)
                    pInfo2.playerCard.cache(bound.x, bound.y, bound.width, bound.height);
            });
            pInfo.playerCard = playerCard;
            playerCard.x = i * 830 + 400;
            playerCard.y = 250;
            // console.log("new player card", paramDataArr[i], playerCard.x, playerCard.y, mvp);
            playerCard.px = playerCard.x;
            playerCard.py = playerCard.y;
            playerCard.x = 500;
            playerCard.scaleX = playerCard.scaleY = 0.01;
            createjs.Tween.get(playerCard)
                .to({x: playerCard.px, scaleX: 1.1, scaleY: 1.1}, 200)
                .to({scaleX: 1, scaleY: 1}, 60).call(()=> {
                $('.BlueIntro').show();
                $('.RedIntro').show();
            });
            this.ctn.addChild(playerCard);
        }
    }

    getWinPlayerCard(p: PlayerInfo, callback): any {
        // var isMvp = p.isMvp;
        var ctn = new createjs.Container();
        console.log("playerCard=======:", p.avatar());
        var bgPath = '/img/panel/stage1v1/win/playerBgWin';
        if (p.isBlue)
            bgPath += "Blue";
        else
            bgPath += "Red";
        bgPath += '.png';

        console.log('bg Path:', bgPath);
        loadImgArr([p.avatar(), bgPath], (avtImgArr) => {
            var avtImg = avtImgArr[0];
            var winBgImg = avtImgArr[1];
            var isFinal = (p as any).final;
            var avatar = new createjs.Bitmap(p.avatar());
            var scale = 80 / avatar.getBounds().height;
            avatar.scaleX = avatar.scaleY = 1.2 * scale;
            avatar.x = (180 - 180 * 1.2) * .5 + 60;
            avatar.y = 50 + 30;
            if (isFinal) {
                avatar.scaleX = avatar.scaleY = 100 / avatar.getBounds().height;
                avatar.x = (180 - 180 * 1.2) * .5 + 63;
                avatar.y = 79;
            }
            // if (isAutoPanel) {
            avatar.sourceRect = new createjs.Rectangle((avtImg.width - 180) / 2, (avtImg.height - 76) / 2, 180, 76);
            avatar.scaleX = avatar.scaleY = 1.2;
            // avatar.x = (180 - 180 * 1.2) * .5 + 63;
            // avatar.y = 79;
            // var m = new createjs.Matrix2D();
            // m.tx = 100;
            // avatar.transformMatrix = m;
            // }
            ctn.addChild(avatar);


            var bg = new createjs.Bitmap(winBgImg);
            bg.x = -116;
            bg.y = -80;

            if (isFinal) {
                bg.x = -132;
                bg.y = -105;
            }
            ctn.addChild(bg);


            var col;
            if (p.isBlue) {
                col = "#1ac3fa";
            } else {
                col = "#e23f6b";
            }
            var nameCol = "#ddd";
            var nameText: Text;
            nameText = new createjs.Text(p.name(), "bold 30px Arial", col);
            nameText.textAlign = 'center';
            nameText.x = 90 + 60;
            nameText.y = 200;
            if (isFinal) {
                nameText.x += 20;
                nameText.y = 215;
            }
            ctn.addChild(nameText);

            var playerInfoText;
            playerInfoText = new createjs.Text(`身高：${PlayerInfo.height(p)} cm  体重：${PlayerInfo.weight(p)} kg`, "18px Arial", nameCol);
            playerInfoText.textAlign = 'center';
            playerInfoText.x = nameText.x;
            playerInfoText.y = 245 + 30;
            if (isFinal) {
                // playerInfoText.x += 5;
                playerInfoText.y += 15;
            }
            ctn.addChild(playerInfoText);

            if (p.isBlue)
                $('#ex').append(`<textarea class="PlayerIntro BlueIntro" >${PlayerInfo.intro(p)}</textarea>`);
            else
                $('#ex').append(`<textarea class="PlayerIntro RedIntro"  >${PlayerInfo.intro(p)}</textarea>`);


            var winLoseText: Text = new createjs.Text(`${p.winGameCount()}胜 / ${p.loseGameCount()}负 贡献值:${p.playerData.curFtScore}`, "25px Arial", '#f1c236');
            winLoseText.textAlign = 'center';
            winLoseText.x = nameText.x;
            winLoseText.y = 410;

            if (isFinal) {
                winLoseText.x += 5;
                winLoseText.y += 48;
            }
            ctn.addChild(winLoseText);
            callback(p);
        });
        return ctn;
    }

    static ftOpenPlayerCard(playerDoc: PlayerDoc): Container {
        var ctn = new Container();
        var bg = new Bitmap('/img/panel/stage1v1/ft/ftPlayerCard.png');
        ctn.addChild(bg);

        loadImg(playerDoc.avatar, ()=> {
            var avatar = new Bitmap(playerDoc.avatar);
            var scale = 104 / avatar.getBounds().height;
            avatar.scaleY = avatar.scaleX = scale;
            avatar.x = 46;
            avatar.alpha = 0.7;
            avatar.y = 62;
            ctn.addChildAt(avatar, 0);
        });

        var nameText: Text;
        var centerPx = 170;
        var col = '#f1c236';
        nameText = new Text(playerDoc.name, "bold 30px Arial", col);
        nameText.textAlign = 'center';
        nameText.x = centerPx;
        nameText.y = 191;
        ctn.addChild(nameText);

        var scoreText: Text;
        scoreText = new Text((playerDoc.ftScore ? playerDoc.ftScore : 0) + "分", "bold 30px Arial", "#fff");
        scoreText.textAlign = 'center';
        scoreText.x = centerPx;
        scoreText.y = 240;
        ctn.addChild(scoreText);

        var locationText: Text;
        locationText = new Text((playerDoc.location ? playerDoc.location : '上海'), "18px Arial", "#fff");
        locationText.textAlign = 'center';
        locationText.x = centerPx;
        locationText.y = 305;
        ctn.addChild(locationText);

        var heightText: Text = new Text(`身高：${playerDoc.height} cm`, "18px Arial", '#fff');
        heightText.x = 35;
        heightText.y = 343;
        ctn.addChild(heightText);

        var weightText: Text = new Text(`体重：${playerDoc.weight} kg`, "18px Arial", '#fff');
        weightText.x = 195;
        weightText.y = heightText.y;
        ctn.addChild(weightText);

        var introText: Text = new Text(cnWrap(playerDoc.intro, 24), "22px Arial", '#fff');
        introText.x = 30;
        introText.lineHeight = 26;
        introText.y = 382;
        ctn.addChild(introText);

        return ctn;
    }

    fadeOutPlayerInfoCard() {
        $('.BlueIntro').hide();
        $('.RedIntro').hide();
        fadeOutCtn(this.ctn);
    }


    fadeInWinPlayer(isBlue, playerDoc) {
        this.ctn.removeAllChildren();
        let ctn = this.ctn;
        $('#ex').html("");
        ctn.addChild(CreateJsEx.newModal());
        ///////////
        let titlePath = "/img/panel/stage1v1/win/winPanelTitle";
        if (isBlue)
            titlePath += 'Blue.png';
        else
            titlePath += 'Red.png';
        // if (playerDoc.isKing)
        //     titlePath = '/img/panel/stage1v1/win/winPanelTitleKing.png';

        let titleCtn = new createjs.Container();
        loadImg(titlePath, function () {
            let title = new createjs.Bitmap(titlePath);
            title.x = -419;//838 315
            title.y = -158;
            titleCtn.x = (ViewConst.STAGE_WIDTH) * .5;
            titleCtn.y = 170;
            titleCtn.scaleX = titleCtn.scaleY = 5;
            titleCtn.alpha = 0;
            createjs.Tween.get(titleCtn).to({scaleX: 1, scaleY: 1, alpha: 1}, 150);
            titleCtn.addChildAt(title, 0);
            // console.log(title.getBounds());
        });
        ctn.addChild(titleCtn);
        /////////////////

        let playerInfo = new PlayerInfo(playerDoc);
        (playerInfo as any).isBlue = isBlue;
        // if (playerDoc.isKing)
        //     (playerInfo as any).final = true;

        let playerCard = this.getWinPlayerCard(playerInfo, (pInfo2)=> {
            let bound = pInfo2.playerCard.getBounds();
            if (bound)
                pInfo2.playerCard.cache(bound.x, bound.y, bound.width, bound.height);
        });

        (playerInfo as any).playerCard = playerCard;
        playerCard.x = 800;
        playerCard.y = 250;
        playerCard.px = playerCard.x;
        playerCard.py = playerCard.y;
        playerCard.x = 500;
        playerCard.scaleX = playerCard.scaleY = 0.01;
        createjs.Tween.get(playerCard)
            .to({x: playerCard.px, scaleX: 1.1, scaleY: 1.1}, 200)
            .to({scaleX: 1, scaleY: 1}, 60).call(()=> {
            let $playerIntro = $('.PlayerIntro').css({left: '835px'});
            $playerIntro.show();
        });
        ctn.addChild(playerCard);

        createjs.Tween.get(playerCard).wait(5000).call(()=> {
            this.fadeOutWinPlayer();
        })
    }

    fadeOutWinPlayer() {
        $('.PlayerIntro').hide();
        fadeOutCtn(this.ctn);
    }

    // fadeInFinalPlayer(playerDoc) {
    //     this.ctn.removeAllChildren();
    //     var ctn = this.ctn;
    //     $('#ex').html("");
    //     ctn.addChild(CreateJsEx.newModal(1));
    //     ///////////
    //     var titlePath = "/img/panel/stage1v1/finalPlayerTitle.png";
    //     var titleCtn = new createjs.Container();
    //     loadImg(titlePath, function () {
    //         var title = new createjs.Bitmap(titlePath);
    //         title.x = -(ViewConst.STAGE_WIDTH) * .5;
    //         titleCtn.x = -title.x;
    //         titleCtn.scaleX = titleCtn.scaleY = 5;
    //         titleCtn.alpha = 0;
    //         createjs.Tween.get(titleCtn).to({scaleX: 1, scaleY: 1, alpha: 1}, 150);
    //         titleCtn.addChild(title);
    //     });
    //     ctn.addChild(titleCtn);
    //
    //     var playerInfo = new PlayerInfo(playerDoc);
    //
    //     var playerCard = this.getWinPlayerCard(playerInfo, (pInfo2)=> {
    //         var bound = pInfo2.playerCard.getBounds();
    //         if (bound)
    //             pInfo2.playerCard.cache(bound.x, bound.y, bound.width, bound.height);
    //     });
    //
    //     (playerInfo as any).playerCard = playerCard;
    //     playerCard.x = 800;
    //     playerCard.y = 250;
    //     playerCard.px = playerCard.x;
    //     playerCard.py = playerCard.y;
    //     playerCard.x = 500;
    //     playerCard.scaleX = playerCard.scaleY = 0.01;
    //     createjs.Tween.get(playerCard)
    //         .to({x: playerCard.px, scaleX: 1.1, scaleY: 1.1}, 200)
    //         .to({scaleX: 1, scaleY: 1}, 60).call(()=> {
    //         var $playerIntro = $('.PlayerIntro').css({left: '858px', top: '575px'});
    //         $playerIntro.show();
    //     });
    //     ctn.addChild(playerCard);
    // }
}

export var loadAutoAvatarShape = (imgPath, callback)=> {
    var autoAvatar = new createjs.Shape();
    var img1 = new Image();
    img1.onload = ()=> {
        console.log('img1', img1.height, img1.width);
        if (img1.width >= 180 && img1.height >= 76) {
            var m = new createjs.Matrix2D();

            m.tx = -(img1.width - 180) / 2;
            m.ty = -(img1.height - 76) / 2;
            autoAvatar.graphics.beginBitmapFill(img1, null, m);
            autoAvatar.graphics.drawRect(0, 0, 180, 76);
        }
        else {
            autoAvatar.graphics.beginBitmapFill(img1);
            autoAvatar.graphics.drawRect(0, 0, 180, 76);
        }
        callback(autoAvatar);
    };
    img1.src = imgPath;
};