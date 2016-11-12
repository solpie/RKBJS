declare var $;
export var PanelView = {
    template: require('./panel.html'),
    props: {
        selected: null,
        options: null
    },
    watch: {
        selected: "onSelGameID"
    },
    gameDataArr: null,
    created(){
        // http://api.liangle.com/api/passerbyking/game/list
        var apiGame = 'http://api.liangle.com/api/passerbyking/game/list';
        $.get(`http://${window.location.host}/get?url=${apiGame}`, (res1)=> {
            var data = JSON.parse(res1.entity);
            console.log(data);
            var gameDataArr = data.data;
            this.gameDataArr = gameDataArr;
            for (var i = 0; i < gameDataArr.length; i++) {
                var gameData = gameDataArr[i];
                gameData.text = "[" + gameData.id + "]:" + gameData.title;
                gameData.value = gameData.id;
            }
            this.options = gameDataArr;
        });
    },
    mounted(){
    },
    methods: {
        onClkSync(){
            console.log('onClkSync');
        },
        onSelGameID(){
            $.get(`http://${window.location.host}/admin/sync/${this.selected}`, (res)=> {
                console.log(res)
            })
        }
    }
};