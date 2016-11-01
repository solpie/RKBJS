export const PanelId = {
    stagePanel: 'stage',
    stage1v1Panel: 'stage1v1',
    rkbPanel: 'rkb',
    bracketPanel: 'bracket',
    winPanel: 'win',
    actPanel: 'act',
    screenPanel: 'screen',
    playerPanel: 'player'
};
export const ServerConst = {
    SEND_ASYNC: true,
    DEF_AVATAR: '/img/panel/stage/blue.png'
};
export const ViewConst = {
    STAGE_WIDTH: 1920,
    STAGE_HEIGHT: 1080
};
export const TimerState = {
    START_STR: 'start',
    PAUSE_STR: 'pause',
    PAUSE: 0,
    RUNNING: 1
};

export const ViewEvent = {
    PLAYER_EDIT: 'edit player',
    PLAYER_ADD: 'add player',
    STRAIGHT3_LEFT: 'STRAIGHT3_LEFT',
    STRAIGHT3_RIGHT: 'STRAIGHT3_RIGHT'
};
export function ScParam(param) {
    return param
}