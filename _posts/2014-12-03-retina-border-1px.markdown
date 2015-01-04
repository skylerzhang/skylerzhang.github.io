---
layout: post
title:  "在retina屏幕实现1px的border"
date:   2014-12-03
categories: css
---

之前在web端，绝大多数屏幕的物理像素(点pt)和渲染像素(px)1:1。
起初的智能机物理像素和渲染像素也都是1:1,但这一切在iPhone4 发布之后就变了。从iPhone4 开始苹果收集都使用了retina屏幕，原来的1个点需要
用2*2=4 个像素来渲染。
在指定
    {% highlight html %}
        <meta name="viewport" content="width=device-width, initial-scale=1">
    {% endhighlight %}
的情况下,我们在布局的时候必须把所有的2X设计稿的尺寸除以2才是我们想要的效果。
但是，这样的话问题就来了，如果设计的某些尺寸就是1px 怎么办（border居多）？
总不能让前端写 `border-width: 0.5px` 吧。

下面介绍几种我在网上搜集到的方法：

##方法一，利用border-image：

    {% highlight css %}
        border-width: 1px;
        border-image: url(border.gif) 2 repeat;
    {% endhighlight %}

`border.gif` 是一个6*6的小图片，如下图每一个小格子就是1像素。


![6*6小图片]({{ site.url }}/images/border.gif)

这样做的原理很简单，填充border的时候其实还是2px宽，但是因为一半是红色（边框颜色）一半是白色（底色），所以视觉上看就是1px;
如果对`border-image`的参数不明白的可以看[张鑫旭][border-image]这篇文章。


##方法二，直接上0.5px;

    {% highlight css %}
        border: 0.5px solid red;
    {% endhighlight %}

虽然看上去很帅但是目前只有 ios 上的 Safari8+ 才支持。


##方法三，利用缩放：

{% highlight css %}
    border:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        border: 1px #999 solid;
        content: "";
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
    }
{% endhighlight %}

如果我要给一个块加边框，以前是直接在类里加`border` ,现在是不加了，而是长度加倍加给它的为元素然后再缩放到原来的一半。
这样写的话就会造成border属性 和 其他属性被分开，维护起来费劲。


##方法四，利用渐变：

{% highlight css %}
    background:
    	linear-gradient(180deg, black, black 50%, transparent 50%) top    left  / 100% 1px no-repeat,
    	linear-gradient(90deg,  black, black 50%, transparent 50%) top    right / 1px 100% no-repeat,
    	linear-gradient(0,      black, black 50%, transparent 50%) bottom right / 100% 1px no-repeat,
    	linear-gradient(-90deg, black, black 50%, transparent 50%) bottom left  / 1px 100% no-repeat;
{% endhighlight %}

原理就是1：1渐变，上面的一半是border颜色，下面的一半是背景颜色。


另外还有用 `svg`, `box-shadow` 等等好多方法，但是我个人还是最喜欢第二种...虽然该颜色什么的比较麻烦，但是后期维护会省事很多。

[border-image]:http://www.zhangxinxu.com/wordpress/2010/01/css3-border-image%E8%AF%A6%E8%A7%A3%E3%80%81%E5%BA%94%E7%94%A8%E5%8F%8Ajquery%E6%8F%92%E4%BB%B6/
