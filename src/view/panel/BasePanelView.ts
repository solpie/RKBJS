import {ViewConst} from "../const";
import Stage = createjs.Stage;
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
declare var $;
export class BasePanelView {
    stageWidth;
    stageHeight;
    ctn;
    stage;
    opReq: (cmdId: string, param: any, callback?: any)=>void;

    constructor(pid) {
        this.opReq = (cmdId: string, param: any, callback?: any)=> {
            $.post(`/panel/${pid}/${cmdId}`,
                param,
                callback);
        };
    }

    static initStage() {
        var canvas = document.getElementById("stage");
        if (canvas) {
            canvas.setAttribute("width", ViewConst.STAGE_WIDTH + "");
            canvas.setAttribute("height", ViewConst.STAGE_HEIGHT + "");
            var stage = new createjs.Stage(canvas);
            stage.autoClear = true;
            createjs.Ticker.framerate = 60;
            createjs.Ticker.addEventListener("tick", function () {
                stage.update();
            });
            console.log("initStage");
            return stage;
        }
        else
            throw "no elem id; 'stage'"
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
            console.log('initCanvas');
        }
    }

    hide() {
        var ctn = this.ctn;
        createjs.Tween.get(ctn).to({alpha: 0}, 100).call(function () {
            ctn.alpha = 1;
            ctn.removeAllChildren();
        });
    }
}