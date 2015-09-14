---
layout: post
title:  "七个必备的JavaScript函数"
date:   2015-06-14
categories: js
tag: js
---

本文翻译自[7 Essential JavaScript Functions](http://davidwalsh.name/essential-javascript-functions)

我记得早期的JavaScript不管你做什么，都需要一个简单的函数来适配所有的浏览器, 翻因为不同的浏览器厂商对js方法的支持都不一样。
不仅仅是一些新的特性，像对 `addEventListener` 和 `attachEvent` 这种基础的特征的支持也不一样。虽然时间过了这么久，但是为了方便和实现某些功能还是有
一些函数是每个开发人员都需要放在自己的工具库里的。

#### debounce

当谈到事件驱动的性能的时候，去抖函数可以成为改变游戏局势的人。如果没有把去抖函数使用在`scroll`,`resize`,`key*`等事件中，你的程序可能会出现错误。下面这个`debounce`函数
可以使你的代码更加高效：

{% highlight javascript linenos%}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
    };
};

// Usage
var myEfficientFn = debounce(function() {
	// All the taxing stuff you do
}, 250);
window.addEventListener('resize', myEfficientFn);
{% endhighlight %}
