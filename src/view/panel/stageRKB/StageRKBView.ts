import {JParam} from "../../Command";
import {BasePanelView} from "../BasePanelView";
import {PanelId} from "../../const";
/**
 * Created by toramisu on 2016/10/24.
 */
declare var io;
export class StageRKBView extends BasePanelView {
    opView;

    constructor(opView) {
        super(PanelId.rkbPanel);
        this.opView = opView;
        opView.test = "test";
        // RKBOPView.props.test = "dsfsd";
        console.log("StageRKBView");
        var ws = io.connect(`http://${window.location.hostname}/${PanelId.rkbPanel}`);
        ws.on('connect', function (msg) {
            console.log('connect', window.location.hostname);
            ws.emit("opUrl", JParam({opUrl: window.location.hostname}));
        });
    }
}
