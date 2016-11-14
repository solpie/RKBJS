import {loadImg} from "./JsFunc";
export function loadTexture($, url, callback) {
    $.get(url, (res)=> {
        console.log(res);
        loadImg(res, (img)=> {
            callback(new PIXI.Texture(new PIXI.BaseTexture(img)))
        })
    });
}