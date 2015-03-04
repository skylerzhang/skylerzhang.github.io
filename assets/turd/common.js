/**
 * Created by zhangning on 15/1/28. mail: skylerzhang@gmail.com
 */

function loadImages(arr, fn, fnError){
    var count = 0;
    var json = {};
    for (var i=0; i<arr.length; i++){
        var oImg = new Image();
        (function(index){
            oImg.onload = function(){
                var name = arr[index].split('.')[0];
                json[name] = this;
                count++;

                if(count === arr.length){
                    fn(json);
                }
            };

            oImg.onerror = function(){
                fnError();
            }
        })(i);

        oImg.src = 'img/'+arr[i];
    }
}

function d2a(n){
    return n/180*Math.PI;
}

function a2d(n){
    return n/Math.PI*180;
}

function outOfScreen(obj, W, H, padding){
    if(obj.x<-padding || obj.x>W+padding || obj.y<-padding || obj.y>H+padding){
        return true;
    }
    else {
        return false;
    }
}