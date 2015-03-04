/**
 * Created by zhangning on 15/1/28. mail: skylerzhang@gmail.com
 */

function BigFlying(img, w, h, maxFrame){
    this.x = 0;
    this.y = 0;

    this.w = w;
    this.h = h;

    this.img = img;

    this.maxFrame = maxFrame;
    this.nowFrame = 0;

    this.speed = 0;

}

BigFlying.prototype.draw = function(gd){
    gd.drawImage(this.img, 0, this.nowFrame*this.h, this.w, this.h, this.x-this.w/2, this.y-this.h/2, this.w, this.h);
};

BigFlying.prototype.move = function(){
    this.y -= this.speed;
};

BigFlying.prototype.nextFrame = function(){
    this.nowFrame++ ;
    if(this.nowFrame >= this.maxFrame){
        this.nowFrame = 0;
    }
};