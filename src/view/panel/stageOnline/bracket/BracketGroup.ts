// 18452736
function _mkGroup(parameters) {
    let x = parameters.x;
    let y = parameters.y;
    let hints = parameters.hints ? parameters.hints : ['', ''];
    let s = {font: '25px', fill: '#C1C1C1', align: 'right'};
    let s1 = new PIXI.Text('', s);
    s1.y = 8;
    let s2 = new PIXI.Text('', s);
    s2.y =  8 + 50;
    s1.x = s2.x = 175;
    return {
        x: x, y: y, labels: [], hints: hints,
        scores: [s1, s2]
    }
}
export let groupPosMap = {
    "1": _mkGroup({x: 255, y: 95, hints: ['1号种子 ', "8号种子 "]}),
    "2": _mkGroup({x: 255, y: 95 + 145, hints: ['4号种子 ', "5号种子 "]}),
    "3": _mkGroup({x: 255, y: 95 + 145 * 2, hints: ['2号种子 ', "7号种子 "]}),
    "4": _mkGroup({x: 255, y: 95 + 145 * 3, hints: ['3号种子 ', "6号种子 "]}),
    "5": _mkGroup({x: 255, y: 805, hints: ['第1场败者 ', "第2场败者 "]}),
    "6": _mkGroup({x: 255, y: 805 + 145, hints: ['第3场败者 ', "第4场败者 "]}),
    "7": _mkGroup({x: 655, y: 168}),
    "8": _mkGroup({x: 655, y: 457}),
    "9": _mkGroup({x: 655, y: 900, hints: ['第7场败者 ', ""]}),
    "10": _mkGroup({x: 655, y: 755, hints: ['第8场败者 ', ""]}),
    "11": _mkGroup({x: 1055, y: 312}),
    "12": _mkGroup({x: 1055, y: 825}),
    "13": _mkGroup({x: 1460, y: 755, hints: ['第11场败者 ', ""]}),
    "14": _mkGroup({x: 1460, y: 390, hints: ['', "第13场胜者 "]}),
};
export class BracketGroup {
    x: number;
    y: number;
    round: number;
    idx: number;//场次
    playerArr: Array<PlayerSvg>;

    constructor(idx) {
        this.idx = idx;
        // if (groupPosMap[idx]) {
        //     this.x = groupPosMap[idx].x;
        //     this.y = groupPosMap[idx].y;
        // }
        this.playerArr = [new PlayerSvg, new PlayerSvg];
    }
}
export class PlayerSvg {
    seed: number;//八强排位
    name: string;//
    avatar: string;//
    isHint: boolean = false;
    isWin: boolean = false;
    score: number = 0;//
}