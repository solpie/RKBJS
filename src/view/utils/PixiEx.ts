import {loadImg} from "./JsFunc";
import {proxy} from "./WebJsFunc";
export function imgToTexture(img): PIXI.Texture {
    return new PIXI.Texture(new PIXI.BaseTexture(img))
}

export function newBitmap(url: string, isCross?: boolean, callback?): PIXI.Sprite {
    let s = new PIXI.Sprite();
    if (isCross) {
        let request = new XMLHttpRequest();
        request.open('GET', proxy(url), true);
        request.onload = function (res) {
            let img = new Image();
            img.onload = () => {
                let tex = imgToTexture(img);
                s.texture = tex;

                if (callback)
                    callback(tex);
            };
            img.src = request.responseText;
        };
        request.send();
        return s
    }
    else {
        loadImg(url, (img) => {
            s.texture = imgToTexture(img)
        });
        return s
    }
}