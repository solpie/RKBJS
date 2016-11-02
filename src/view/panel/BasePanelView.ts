import {ViewConst} from "../const";
import Stage = createjs.Stage;
import Container = createjs.Container;
declare var $;
export class BasePanelView {
    stageWidth;
    stageHeight;
    ctn;
    stage;
    opReq: (cmdId: string, param: any, callback?: any)=>void;

    constructor(pid) {
        this.initCanvas();
        this.opReq = (cmdId: string, param: any, callback?: any)=> {
            $.post(`/panel/${pid}/${cmdId}`,
                param,
                callback);
        };
    }

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