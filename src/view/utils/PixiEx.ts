import {loadImg} from "./JsFunc";
export function imgToTexture(img) {
    return new PIXI.Texture(new PIXI.BaseTexture(img))
}
export function loadTexture($, url, callback) {
    $.get(url, (res)=> {
        loadImg(res, (img)=> {
            callback(imgToTexture(img));
        })
    });
}

export var newBitmap = (url: string): PIXI.Sprite=> {
    var s = new PIXI.Sprite();
    loadImg(url, (img)=> {
        s.texture = imgToTexture(img)
    });
    return s
};