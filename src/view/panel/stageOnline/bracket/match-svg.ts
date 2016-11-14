// import {Component} from "../../VueEx";
// @Component({
//     template: require('./match.html'),
//     props: {
//         playerArr: {},
//         idx: {},
//         x: {},
//         y: {},
//         match: {}
//     },
//     watch: {
//         match: 'onMatchChanged'
//     }
// })
export var matchsvg ={
    template: require('./match.html'),
    props: {
        playerArr: {},
        idx: {},
        x: {},
        y: {},
        match: {}
    },
    watch: {
        match: 'onMatchChanged'
    },
    // playerArr: Array<any>;
    // idx: number;
    // match: BracketGroup;
    // x: number;
    // y: number;
    methods:{
        onMatchChanged() {
            console.log('onMatchChanged');
        }
    },
    ready() {
        this.idx = 2;
        this.playerArr = [
            {name: "player1", score: 1},
            {name: "player2", score: 3, isWin: true}
        ];
        this.x = this.match.x;
        this.y = this.match.y;
        this.idx = this.match.idx;
        this.playerArr = this.match.playerArr;
        if (this.playerArr[0].score && this.playerArr[1].score) {
            if (this.playerArr[0].score > this.playerArr[1].score)
                this.playerArr[0].isWin = true;
            else
                this.playerArr[1].isWin = true;
        }

        console.log('match ready', this.match);
    },

};