---
layout: post
title:  "5种方法使你的网站又小又快【译】"
date:   2015-02-10
categories: web
tag: web
---

本文翻译自[5 Ways to Make Your Site Smaller and Faster](http://davidwalsh.name/site-speed)

忏悔：每个星期我都会祈祷一次，如果我是一个工作是割草和做园林绿化的小男孩那该有多好。为什么呢？因为在每天工作结束后,他们都可以说一句
『草已经剪完了，我的工作完成了。』作为一个网页开发者，我们能那样说吗？一个网站总是可以变的效率更高，它经常需要进行字节级别的优化。只要我们认识到这一点
我们将发自肺腑的永远的说『网站还不够好。』要成为一个伟大的开发者，我们经常觉着自己的工作还不够好,这是以一种多么否定的方式来度过我们的医生啊。

有一个好消息就是有一些简单的方法可以在表现和加载时间方面收到一些意想不到的效果。这里有五个简单的方法可以让你在几分钟内使你的网站变得更快。

#### 1.压缩图片--ImageOptim

在改善网站加载时间方面，压缩图片是最简单直接的方法。Photoshop和其他图片编辑软件在图片压缩方面效率很低，每次请求都要下载额外的数据，有个好消息就是
有许多工具可以消除这些额外的数据。MAC上我最喜欢的工具就是[ImageOptim](https://imageoptim.com/)。
![ImageOptim](http://davidwalsh.name/demo/image-optim-sample.jpg)

#### 2.CloudFlare

CloudFlare 是一种免费提供下载增强的服务:

##### 1.CDN 服务

##### 2.JavaScript, CSS,  HTML 压缩

##### 3.停机备份服务

##### 4.DDOS防御

##### 5.基于位置的资源分发

#### 3.使用Fontello制作更小的符号图标库

符号字体已经流行好几年了，这儿我就不再赘述它为什么流行了，我们都知道它非常棒。问题是当我们要用某一些符号字体的时候我们懒得去引用整个符号字体文件。虽然我们很少去注意字体文件，但是他们通常都很大。
幸运的是像[Fontello](http://fontello.com/)这种网站的存在。

Fontello 可以让你从许多符号字体中只选择你需要的并且可以把他们生成一个只有几KB的字体图标样式表。

#### 4.生成静态文件

我们喜欢我们的动态脚本,但是如果静态页面可以满足我们的需要的时候，我们为什么还要用动态页面呢？这种问题我们在WordPress上经常看到——提交的内容通常不改变,但是广告和评论可能会变。

答案？当一个页面可能改变的时候找到关键点，当这些关键点出现的时候产生静态文件。一个很棒的叫[Really Static](https://wordpress.org/plugins/really-static/)的WordPress工具
可以帮我们在博客平台上完成这个工作。当然你的非WordPress CMS 系统需要自定义页面生成，但是比起速度的提升，这很值得你去做。

如果你有内容需要在那些静态页面里轮换，比如广告或者链到更多的当前内容。请考虑用JavaScript 和 AJAX 来请求得到那些内容，那这个页面将是静态的，JavaScript将会从CDN上请求新内容，唯一需要烤炉的速度问题将会变成AJAX的请求。

#### 5.延迟加载

一个众所周知的网站缓慢的原因是页面上的请求过多引起的。在过去我们已经 CSS/image sprites , 拼接JavaScript、CSS 资源和[data URIs](https://developer.mozilla.org/zh-CN/docs/data_URIs)来解决这个问题。
现在你还可以用延迟加载和或者简单的在页面中嵌入他们。

{% highlight javascript %}
    document.querySelectorAll('article pre').length && (function() {
        var mediaPath = '/assets/';

        var stylesheet = document.createElement('style');
        stylesheet.setAttribute('type', 'text/css');
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('href', mediaPath + 'css/syntax.css');
        document.head.appendChild(stylesheet);

        var syntaxScript = document.createElement('script');
        syntaxScript.async = 'true';
        syntaxScript.src = mediaPath + 'js/syntax.js';
        document.body.appendChild(syntaxScript);
    })();
{% endhighlight %}

上面这个例子就是只有页面上的元素需要高亮的时候才会下载高亮语法的资源。如果用于高亮语法的css只有很少的几行怎么办？可以避免额外的请求直接讲他们嵌入到页面中。

{% highlight html %}
    <style type="text/css">
    	<?php include('media/assets/highlight.css'); ?>
    	</style>
    </head>
{% endhighlight %}

或者你可以串联你用于高亮语法的css和整个网站的css——也是个不错的选择。

你看，这些方法都难以置信的简单和迅速，如果你话几分钟来做他们那网站就回变流畅。当你思考网站获得的访问人数，页面浏览量的时候，你就会明白为什么这些细节的优化会如此重要。