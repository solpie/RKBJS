import {PlayerInfo} from "../../model/PlayerInfo";
import {mapToArr, descendingProp} from "../../utils/JsFunc";
import {getEloRank} from "./elo";
// import {$} from "../../libs";
declare var $;
// var $ = require('jquery');
export var RankView = {
    template: require('./rank.html'),
    props: {
        playerDocArr: {
            type: Array
        },
        gameRecArr: {
            type: Array
        },
        playerMap: {
            type: Array
        },
        playerGameRecArr: {
            type: Array
        },
        pageIdx: {
            type: Number
        },
        playerGameRecPageArr: {
            type: Array
        }
    },

    mounted() {
        console.log("rank");

        this.playerGameRecArr = [{
            left: {name: "player3", score: 1},
            right: {name: "player1", score: 2}
        }];
        var gameIdArr = [23, 21, 22, 29, 39, 52];
        var gameDataArr = [];
        var gameId;
        var getGameData = (i)=> {
            if (i < gameIdArr.length) {
                gameId = gameIdArr[i];
                $.get('/api/passerbyking/game/match/' + gameId, (data)=> {
                    // $.get('/db/elo', {gameIdArr: [23, 21, 22, 29, 39]}, (data)=> {
                    // console.log(data);
                    data.round = gameId;
                    gameDataArr.push(data);
                    // this.playerDocArr = rank;
                    var p = Math.floor((i + 1) / gameIdArr.length * 100);
                    console.log('progress', p);
                    $('#progress1')['progress']({
                        percent: p
                    });
                    getGameData(i + 1);
                });
            }
            else {
                this.gameRecArr = [];
                var playerMap = getEloRank(gameDataArr, this.gameRecArr);
                this.playerMap = playerMap;
                // console.log('player map', playerMap);
                setInterval(()=> {
                    $('#progress1').hide();

                    this.playerDocArr = mapToArr(playerMap).sort(descendingProp('eloScore'));

                }, 500);
            }
        };
        getGameData(0)
    },
    methods: {
        onSortWinPercent() {
            console.log('onSortWinPercent');
        },
        onClkGameRecPage(pageIdx){
            this.playerGameRecArr = this.playerGameRecPageArr[pageIdx];
        },
        onShowRec(playerName) {
            this.playerGameRecArr = [];
            this.playerGameRecPageArr = [];

            var pageNum = 10;
            var page = [];
            // var page
            for (var i = 0; i < this.gameRecArr.length; i++) {
                var gameRec = this.gameRecArr[i];
                if (gameRec.left.name == playerName || gameRec.right.name == playerName) {
                    if (gameRec.left.name == playerName) {
                        gameRec.win = gameRec.left.score > gameRec.right.score;
                    }
                    if (gameRec.right.name == playerName) {
                        gameRec.win = gameRec.left.score < gameRec.right.score;
                    }
                    gameRec.name = playerName;
                    page.push(gameRec);
                    if ((page.length % pageNum) == 0) {
                        this.playerGameRecPageArr.push(page);
                        page = [];
                    }
                }
            }
            if (page.length)
                this.playerGameRecPageArr.push(page);
            this.playerGameRecArr = this.playerGameRecPageArr[0];
            console.log('onShowRec', playerName, this.playerGameRecPageArr.length);

        },
        onSortGameCount() {
            for (var p of this.playerDocArr) {
                p.gameCount = PlayerInfo.gameCount(p);
            }
            this.playerDocArr.sort(descendingProp('gameCount'));
            console.log('onSortGameCount');
        }
    }
};
