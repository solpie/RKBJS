import {ViewConst} from "../libs";
import Stage = createjs.Stage;
import Container = createjs.Container;
export class BasePanelView{
    stageWidth;
    stageHeight;
    ctn;
    stage;
    initCanvas() {
        this.stageWidth = ViewConst.STAGE_WIDTH;
        this.stageHeight = ViewConst.STAGE_HEIGHT;
        var canvas = document.getElementById("stage");
        if (canvas) {
            canvas.setAttribute("width", this.stageWidth + "");
            canvas.setAttribute("height", this.stageHeight + "");
            var stage = new createjs.Stage(canvas);
            stage.autoClear = true;
            createjs.Ticker.framerate = 60;
            createjs.Ticker.addEventListener("tick", function () {
                stage.update();
            });

            this.ctn = new createjs.Container();
            stage.addChild(this.ctn);
            this.stage = stage;
        }
    }
}