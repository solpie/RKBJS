//delay in ms
export function delayCall(delay, callback) {
    createjs.Tween.get(this).wait(delay).call(callback);
    // setTimeout(callback, delay/1000);
}

// export function delayFor(start,len,func) {
//     createjs.Tween.get(this).wait(delay, callback);
// }
export function blink(target, time = 80, loop = false) {
    var blink = time;
    createjs.Tween.get(target, {loop: loop})
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink);
}
//time sec
export function blink2(target, time = 0.008, loop = false) {
    function to1(a) {
        if (target.visible)
            TweenLite.to(target, time, {alpha: a})
                .eventCallback('onComplete', () => {
                    to1(a ? 0 : 1);
                })
    }
    to1(1);
}

export function fadeOutCtn(ctn) {
    console.log(this, "show fade Out WinPanel");
    createjs.Tween.get(ctn).to({alpha: 0}, 200)
        .call(function () {
            ctn.alpha = 1;
            ctn.removeAllChildren();
        });
}