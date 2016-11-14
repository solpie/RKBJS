import {BasePanelView} from "../../BasePanelView";
import {BracketGroup} from "./BracketGroup";
import {PanelId} from "../../../const";
declare var io;
var $ = require('jquery');
export class BracketView extends BasePanelView {
    matchArr: Array<any>;
    gameId: number;

    constructor() {
        super(PanelId.bracketPanel);
        this.init();
    }

    init() {
        this.matchArr = [];
        for (var i = 0; i < 14; i++) {
            var ms: BracketGroup = new BracketGroup(i + 1);// new BracketGroup();
            // ms.idx = i + 1;
            this.matchArr.push(ms);
        }
        var matchArr = this.matchArr;
        var setMatchPos = function (idx, x, y) {
            matchArr[idx].x = x;
            matchArr[idx].y = y;
        };

        var i: number;
        var ms: BracketGroup;
        for (i = 0; i < 4; i++) {
            ms = matchArr[i];
            ms.x = 0;
            ms.y = 35 + 160 * i;
        }
        // 5 6
        for (i = 0; i < 2; i++) {
            ms = matchArr[i + 4];
            ms.x = 0;
            ms.y = 760 + 160 * i
        }
        // 7 8
        var col2x = 400;
        for (i = 0; i < 2; i++) {
            ms = matchArr[i + 6];
            ms.x = col2x;
            ms.y = 115 + 320 * i
        }
        // 9 10
        setMatchPos(8, col2x, 700 + 160);
        setMatchPos(9, col2x, 700);
        var col3x = col2x * 2;
        //  11
        setMatchPos(10, col3x, 280);
        // 12
        setMatchPos(11, col3x, 780);
        var col4x = col2x * 3;
        //  13
        setMatchPos(12, col4x, 730);
        // 14
        setMatchPos(13, col4x, 345);
        // var io = super.ready(PanelId.stage1v1Panel, false);
        //
        // io
        //     .on(`${CommandId.initPanel}`, (param) => {
        //         console.log(`${CommandId.initPanel}`, param);
        //         this.updateBracket(param.matchArr);
        //     })
        //     .on(`${CommandId.refreshClient}`, (param)=> {
        //         console.log('refresh bracket', param);
        //         this.updateBracket(param.matchArr);
        //     });

        // console.log('game_id:', this.$route.params.game_id);
        if (this.gameId) {
            this.initAuto()
        }
    }

    initAuto() {
        var remoteIO = io.connect();
        var game_id = this.gameId;
        remoteIO.on('connect', ()=> {
            console.log('hupuAuto socket connected');
            remoteIO.emit('passerbyking', {
                game_id: this.gameId,
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

        // this.$http.get('/panel/auto/bracket/' + game_id, (res)=> {
        //     console.log(res);
        //     this.onBracketData(res);
        // })
    }

    onBracketData(res) {
        // var matchArr = [];
        // var playerHintMap = {
        //     '5': ['  第1场败者', '  第2场败者'],
        //     '6': ['  第3场败者', '  第4场败者'],
        //     '9': ['  第7场败者', ''],
        //     '13': ['  第11场败者', ''],
        //     '10': ['  第8场败者', ''],
        //     '14': ['', '  第13场胜者']
        // };
        // for (var gameIdx in res.data) {
        //     var dataObj = res.data[gameIdx];
        //     var match: BracketGroup = new BracketGroup();
        //
        //     match.idx = Number(gameIdx);
        //     if (dataObj.left.score || dataObj.right.score) {
        //         if (dataObj.left.score > dataObj.right.score)
        //             match.playerArr[0].isWin = true;
        //         else
        //             match.playerArr[1].isWin = true;
        //     }
        //
        //     if (!dataObj.left.name) {
        //         match.playerArr[0].isHint = true
        //     }
        //     if (!dataObj.right.name) {
        //         match.playerArr[1].isHint = true
        //     }
        //     var hintName = playerHintMap[gameIdx];
        //     match.playerArr[0].name = dataObj.left.name ? dataObj.left.name : (hintName ? hintName[0] : '');
        //     match.playerArr[0].score = dataObj.left.score;
        //
        //     match.playerArr[1].name = dataObj.right.name ? dataObj.right.name : (hintName ? hintName[1] : '');
        //     match.playerArr[1].score = dataObj.right.score;
        //     matchArr.push(match);
        // }
        // this.updateBracket(matchArr)
    }

    updateBracket(matchArr) {

        for (var j = 0; j < 14; j++) {
            var match: BracketGroup = matchArr[j];
            var isOverMatch =
                match.idx == 5
                || match.idx == 6
                || match.idx == 9
                || match.idx == 10
                || match.idx == 11
                || match.idx == 13
                || match.idx == 14
            for (var k = 0; k < 2; k++) {
                var playerSvg = match.playerArr[k];
                var $playerSvg = $('#playerName' + (j * 2 + k));
                $playerSvg.text(playerSvg.name);
                if (playerSvg.isHint) {
                    console.log('player name isHint');
                    $playerSvg.attr('class', 'match--player-name -placeholder')
                } else {
                    $playerSvg.attr('class', 'match--player-name2');
                    if (playerSvg.name && playerSvg.name.length > 6) {
                        $playerSvg.attr('class', 'match--player-name3')
                    }
                    if (playerSvg.isWin) {
                        $('#winner' + (j * 2 + k)).show();
                        // match--winner-background
                    }
                    else {
                        $('#winner' + (j * 2 + k)).hide();
                        if (isOverMatch && (playerSvg.score || playerSvg.score)) {
                            $playerSvg.css({opacity: 0.2});
                        }
                    }
                }

                $('#score' + (j * 2 + k)).text(playerSvg.score);
            }
        }
    }

    onMatchArrChanged(v) {
        console.log('onMatchArrChanged', v)
    }
}