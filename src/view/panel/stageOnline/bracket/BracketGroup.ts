let groupPosMap = {
    "1": {x: 255, y: 95},
    "2": {x: 255, y: 95 + 145},
    "3": {x: 255, y: 95 + 145 * 2},
    "4": {x: 255, y: 95 + 145 * 3},
    "5": {x: 255, y: 805},
    "6": {x: 255, y: 805 + 145},
    "7": {x: 655, y: 0},
    "8": {x: 655, y: 0},
    "9": {x: 655, y: 0},
    "10": {x: 655, y: 0},
    "11": {x: 1055, y: 0},
    "12": {x: 1055, y: 0},
    "13": {x: 1460, y: 0},
    "14": {x: 1460, y: 0},
};

export class BracketGroup {
    x: number;
    y: number;
    round: number;
    idx: number;//场次
    playerArr: Array<PlayerSvg>;

    constructor(idx) {
        this.idx = idx;
        if (groupPosMap[idx]) {
            this.x = groupPosMap[idx].x;
            this.y = groupPosMap[idx].y;
        }
        this.playerArr = [new PlayerSvg, new PlayerSvg];
    }
}
class PlayerSvg {
    seed: number;//八强排位
    name: string;//
    avatar: string;//
    isHint: boolean = false;
    isWin: boolean = false;
    score: number = 0;//
}