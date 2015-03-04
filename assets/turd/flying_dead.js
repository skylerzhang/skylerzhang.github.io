/**
 * Created by zhangning on 15/1/28. mail: skylerzhang@gmail.com
 */

function DeadFlying(img, w, h, maxFrame){
    this.x = 0;
    this.y = 0;

    this.w = w;
    this.h = h;

    this.img = img;

    this.rotate = 0;

    this.maxFrame = maxFrame;
    this.nowFrame = 0;

    this.speed = Math.random()*2+1;

}

DeadFlying.prototype.draw = function(gd){
    gd.save();

    gd.translate(this.x, this.y);
    gd.rotate(d2a(this.rotate));
    if(!Math.abs(this.rotate)>90){
        gd.scale(-1,1);
    }

    gd.drawImage(this.img, 0, 4*this.h+this.nowFrame*this.h, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
    gd.restore();
};

DeadFlying.prototype.nextFrame = function(){
    this.nowFrame++ ;
    if(this.nowFrame >= this.maxFrame){
        this.nowFrame = 0;
    }
};

//烧死的苍蝇继承被拍死的苍蝇

function FiredFlying(){
    DeadFlying.apply(this, arguments);
}

FiredFlying.prototype = new DeadFlying();

FiredFlying.prototype.nextFrame = function () {
    this.nowFrame ++ ;
    if(this.nowFrame == this.maxFrame){
        return true;
    }
};