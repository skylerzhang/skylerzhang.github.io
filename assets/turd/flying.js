/**
 * Created by zhangning on 15/1/28. mail: skylerzhang@gmail.com
 */

function Flying(img, w, h, maxFrame){
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

Flying.prototype.draw = function(gd){
    gd.save();

    gd.translate(this.x, this.y);
    gd.rotate(d2a(this.rotate));
    if(!Math.abs(this.rotate)>90){
        gd.scale(-1,1);
    }

    gd.drawImage(this.img, 0, this.nowFrame*this.h, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
    gd.restore();
};

Flying.prototype.move = function(){
    var speedX = Math.cos(d2a(this.rotate+90)) * this.speed;
    var speedY = Math.sin(d2a(this.rotate+90)) * this.speed;
    this.y -= speedY;
    this.x -= speedX;
};

Flying.prototype.nextFrame = function(){
    this.nowFrame++ ;
    if(this.nowFrame >= this.maxFrame){
        this.nowFrame = 0;
    }
};

//大苍蝇继承标准苍蝇

//function BigFlying(img, w, h, maxFrame){
//    Flying.apply(this, arguments);
//}
//
//BigFlying.prototype = new Flying();
