import {ViewConst} from "../const";
import Stage = createjs.Stage;
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
declare var $;
declare var PIXI;
export class BasePanelView {
    name: string;
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

    static initPixi() {
        let renderer = new PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
            {antialias: false, transparent: true, resolution: 1});
        document.body.insertBefore(renderer.view, document.getElementById("panel"));
        renderer.stage = new PIXI.Container();
        renderer.backgroundColor = 0x00000000;
        //Loop this function 60 times per second
        renderer.renderStage = ()=> {
            requestAnimationFrame(renderer.renderStage);
            renderer.render(renderer.stage);
        };
        renderer.renderStage();
        return renderer.stage;
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

    show() {
        // var ctn = this.ctn;
        // createjs.Tween.get(ctn).to({alpha: 1}, 100);
    }

    hide() {
        // var ctn = this.ctn;
        // createjs.Tween.get(ctn).to({alpha: 0}, 100).call(function () {
        //     ctn.alpha = 1;
        //     ctn.removeAllChildren();
        // });
    }
}