/**
 * Created by zhangning on 15/1/28. mail: skylerzhang@gmail.com
 */

function TurdDefault(img, w, h, maxFrame){
    this.x = 0;
    this.y = 0;

    this.w = w;
    this.h = h;

    this.img = img;

    this.rotate = 0;

    this.maxFrame = maxFrame;
    this.nowFrame = 0;
}

TurdDefault.prototype.draw = function(gd){
    gd.save();

    gd.translate(this.x, this.y);
    gd.drawImage(this.img, 0, this.nowFrame*this.h, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);

    gd.restore();
};

TurdDefault.prototype.nextFrame = function(){
    this.nowFrame++;
    if (this.nowFrame >= this.maxFrame){
        this.nowFrame = 0;
    }
};

//左顾右盼的屎蛋继承标准屎蛋的属性和方法

function TurdLookAround(img, w, h, maxFrame){
    TurdDefault.apply(this, arguments);
}

TurdLookAround.prototype = new TurdDefault();

//火焰技能的屎蛋继承标准屎蛋的属性和方法

function TurdFire(img, w, h, maxFrame){
    TurdDefault.apply(this, arguments);
}

TurdFire.prototype = new TurdDefault();

//TurdFire.prototype.nextFrame = function (){
//    this.nowFrame ++ ;
//    if(this.nowFrame == this.maxFrame){
//        return true;
//    }
//};