import {Profile} from "./profile";
import {CommandId} from "../../Command";
import {ViewEvent} from "../../const";
// import {CommandId} from "../../../../event/Command";
var $ = require('jquery');
declare var jQurey;
export var PlayerView = {
    template: require('./player.html'),
    components: {Profile},
    props: [
        'total',
        'ftId',
        'playerArr',
        'playerMap',
        'ftOptionArr',
    ],
    mounted: function () {
        console.log('player Ready!!');
        // ($('.ui.sidebar') as any).sidebar('toggle');
        this.$http.post('/db/player', {all: true}).then((res)=> {
            console.log(res);
            this.playerArr = res.body.PlayerArr;
        });

        // this.$http.get('/db/ft', (res)=> {
        //     var ftArr = res.ftArr;
        //     this.ftOptionArr = [];
        //     for (var i = 0; i < ftArr.length; i++) {
        //         var ft = ftArr[i];
        //         this.ftOptionArr.push({text: ft.name, value: ft.id});
        //     }
        //     console.log('ft res:', res, this.ftOptionArr);
        // });
    },
    methods: {
        onClearActPlayerGameRec: function () {
            this.post(`/panel/stage1v1/${CommandId.cs_clearActPlayerGameRec}`)
        },

        onSaveToTotalScore: function () {
            this.post(`/panel/stage1v1/${CommandId.cs_saveToTotalScore}`)
        },
        //
        onPickPlayer: function (playerId) {
            this.pickPlayerIdArr.push(playerId);
            if (this.pickPlayerIdArr.length == 4) {
                console.log('pick team');
                this.pickPlayerIdArrArr.push(this.pickPlayerIdArr);
                this.pickPlayerIdArr = [];
            }

            this.total = this.pickPlayerIdArrArr.length * 4 + this.pickPlayerIdArr.length;
        },
        onAddPlayer: function () {
            ($('#modal-player') as any).openModal();
            this.message = "添加球员";
            this.isOpen = true;
            this.$broadcast(ViewEvent.PLAYER_ADD, {ftOptionArr: this.ftOptionArr.concat()});
        },
        //
        onAddPlayerList: function () {
            var a = [];
            for (var i = 0; i < this.pickPlayerIdArrArr.length; i++) {
                var playerIdArr = this.pickPlayerIdArrArr[i];
                a = a.concat(playerIdArr);
            }
            a = a.concat(this.pickPlayerIdArr);
            console.log('playerList', a);
            this.post(`/panel/stage1v1/${CommandId.cs_setActPlayer}`, {playerIdArr: a});
        },
        //
        onEdit: function (playerId, event) {
            event.stopPropagation();
            console.log("onEdit", playerId);
            ($('#modal-player') as any).openModal();
            this.message = "编辑球员";
            this.$broadcast(ViewEvent.PLAYER_EDIT, {playerId: playerId, ftOptionArr: this.ftOptionArr.concat()});
        },
        //
        onFtSelected: function () {
            this.playerArr = [];
            for (var playerId in this.playerMap) {
                var playerDoc = this.playerMap[playerId];
                if (playerDoc.ftId == this.ftId)
                    this.playerArr.push(playerDoc);
            }
        },
    }
};
