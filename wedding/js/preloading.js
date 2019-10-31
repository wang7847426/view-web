//预加载
//Progress:function handler(progress){//使用当前进度},
//Complete:function handler(){//加载完成后执行},
//imglist:[uri1,uri2,uri3,....],
//delay:nubmer
function Load(Progress, Complete, imglist, delay) {
    var complete = 0;
    var count = imglist.length;
    var currentProgress = 0;

    function _animate() {
        var completeProgres = complete / count;
        currentProgress = (currentProgress + 0.01) < completeProgres ? (currentProgress + 0.01) : completeProgres;
        if (Math.floor(currentProgress * 100) < 100) {
            Progress(currentProgress);
            setTimeout(_animate, delay);
        } else {
            setTimeout(function () {
                Progress(1);
                setTimeout(function () {
                    Complete();
                }, 200);
            }, delay);
        }
    }
    this.Start = function () {
        for (var i = 0; i < count; i++) {
            var img = new Image();
            img.onload = function () {
                complete++;
                if (!Progress && complete == count) {
                    Complete();
                }
            };
            img.src = imglist[i];
        }
        if (Progress) {
            _animate();
        }
    }
};

// function fnLoading(p){
//      document.getElementById('progressbar').innerHTML = parseInt(p * 100) + "%";
// };
