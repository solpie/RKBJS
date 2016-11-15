import {loadImg} from "./JsFunc";
import {proxy} from "./WebJsFunc";
export function imgToTex(img): PIXI.Texture {
    return new PIXI.Texture(new PIXI.BaseTexture(img))
}
function makeSprite(parameters): PIXI.Sprite {
    let url = parameters.url;
    let isCrossOrigin = parameters.isCrossOrigin;
    let callback = parameters.callback;

    let s = new PIXI.Sprite();

    loadRes(url, (img) => {
        s.texture = imgToTex(img);
        if (callback)
            callback(s)
    }, isCrossOrigin);
    return s;
}

function loadRes(url: string, callback, isCrossOrigin?: boolean) {
    if (isCrossOrigin) {
        let req = new XMLHttpRequest();
        req.open('GET', proxy(url), true);
        req.onload = function (res) {
            loadImg(req.responseText, callback);
        };
        req.send();
    }
    else {
        loadImg(url, callback);
    }
}

let _nullTex = imgToTex(null);
function makeTilingSprite(options): PIXI.extras.TilingSprite {
    let width = options.width;
    let height = options.height;
    let url = options.url;
    let callback = options.callback;
    let isCrossOrigin = options.isCrossOrigin;
    loadRes(url, (img) => {
        t.texture = imgToTex(img);
        if (callback)
            callback(t)
    }, isCrossOrigin);
    let t = new PIXI.extras.TilingSprite(_nullTex, width, height);
    return t
}
export function newBitmap(options: { url: string
    isCrossOrigin?: boolean
    callback?,
    isTiling?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number}): PIXI.Sprite {
    let isTiling = options.isTiling;
    let s;
    if (isTiling) {
        s = makeTilingSprite(options);
    }
    else {
        s = makeSprite(options);
    }
    s.x = options.x ? options.x : 0;
    s.y = options.y ? options.y : 0;
    return s
}