let ivt = 5;
let lineCol = 0x18191a;
export function drawLine1(x, y, height = 72): PIXI.Graphics {
    let g = new PIXI.Graphics();
    g.x = x;
    g.y = y;
    g.lineColor = lineCol;
    return g.lineStyle(2, 0x18191a)
        .moveTo(0, 1)
        // -
        .lineTo(77, 1)
        // -|
        .lineTo(77, height)
        // -|_
        .lineTo(77 + 98, height)
        // ─┐
        .moveTo(77 + 98, height + ivt)
        .lineTo(77, height + ivt)
        .lineTo(77, height + ivt + height)
        .lineTo(1, height + ivt + height)
        .moveTo(1, height + height)
        .lineTo(77 - ivt, height + height)
        .lineTo(77 - ivt, 1 + ivt)
        .lineTo(0, 1 + ivt)
}
export function drawLine2(x, y, height = 0): PIXI.Graphics {
    let g = new PIXI.Graphics();
    g.x = x;
    g.y = y;
    g.lineWidth = 2;
    return g.lineStyle(2, lineCol)
        .moveTo(77 + 98, 1)
        .lineTo(77, 1)
        .lineTo(77, 1 + 52 + height)
        .lineTo(0, 1 + 52 + height)
        .moveTo(0, 1 + 52 + ivt + height)
        .lineTo(77 + ivt, 1 + 52 + ivt + height)
        .lineTo(77 + ivt, 1 + ivt)
        .lineTo(77 + 98, 1 + ivt)
}
export function drawLine4(x, y): PIXI.Graphics {
    let height = 78;
    let g = new PIXI.Graphics();
    g.x = x;
    g.y = y;
    g.lineColor = lineCol;
    return g.lineStyle(2, 0x18191a)
        .moveTo(0, 1)
        // -
        .lineTo(77, 1)
        // -|
        .lineTo(77, height)
        // -|_
        .lineTo(77 + 98, height)
        // ─┐
        .moveTo(77 + 98, height + ivt)
        .lineTo(77-ivt, height + ivt)
        .lineTo(77-ivt, 1 + ivt)
        .lineTo(0, 1 + ivt)
}