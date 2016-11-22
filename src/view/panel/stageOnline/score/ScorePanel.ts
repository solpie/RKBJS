import { BitmapText, imgToTex, loadRes, newBitmap } from '../../../utils/PixiEx';

import { ViewConst } from '../../../const';
export class ScorePanel {
    timeText: PIXI.Text

    constructor(parent: PIXI.Container) {
        let ctn = new PIXI.Container()
        ctn.y = ViewConst.STAGE_HEIGHT - 132
        parent.addChild(ctn)

        ctn.addChild(newBitmap({ url: '/img/panel/score/bg.png' }))

        let timeText = this.timeText = new PIXI.Text("99:99", { fill: "#ffffffff" })
        timeText.x = ViewConst.STAGE_WIDTH * .5 - 28
        timeText.y = 100
        ctn.addChild(timeText)


        var px = 865

        let leftScoreNum = new BitmapText({
            text: '10',
            animations: {
                "0": 1, "1": 2, "2": 3, "3": 4, "4": 5,
                "5": 6, "6": 7, "7": 8, "8": 9, "9": 0
            },
            img: "/img/panel/stage1v1/scoreNum.png",
            frames: [[0, 0, 40, 54],
            [41, 0, 40, 54],
            [0, 55, 40, 54],
            [41, 55, 40, 54],
            [82, 0, 40, 54],
            [82, 55, 40, 54],
            [123, 0, 40, 54],
            [123, 55, 40, 54],
            [0, 110, 40, 54],
            [41, 110, 40, 54]]
        })
        leftScoreNum.x = px
        leftScoreNum.y = 60
        leftScoreNum.align = 'right'
        ctn.addChild(leftScoreNum)
    }

    toggleTimer1(state) {

    }
    resetTimer() {

    }

}