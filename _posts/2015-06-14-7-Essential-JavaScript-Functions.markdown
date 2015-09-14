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

### debounce

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

### poll

正如我提到的去抖函数，有时候你无法通过插入事件来监听一个期望得到的状态 —— 如果这个事件不存在，你就需要时时来检查这个状态：

{% highlight javascript linenos%}
function poll(fn, callback, errback, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() {
        // If the condition is met, we're done!
        if(fn()) {
            callback();
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(p, interval);
        }
        // Didn't match and too much time, reject!
        else {
            errback(new Error('timed out for ' + fn + ': ' + arguments));
        }
    })();
}

// Usage:  ensure element is visible
poll(
    function() {
        return document.getElementById('lightbox').offsetWidth > 0;
    },
    function() {
        // Done, success callback
    },
    function() {
        // Error, failure callback
    }
);
{% endhighlight %}

Polling 函数在web中非常有用并且将来也会如此。

###once

很多时候你想让一个函数只能调用一次，就像你使用`onload`事件。下面的代码提供了上述函数：

{%highlight javascript linenos%}
function once(fn, context) {
	var result;

	return function() {
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

// Usage
var canOnlyFireOnce = once(function() {
	console.log('Fired!');
});

canOnlyFireOnce(); // "Fired!"
canOnlyFireOnce(); // nada

{%endhighlight%}

`once`函数确保了一个函数只能调用一次，因此阻止了重复初始化！

###getBasoluteUrl

从一个动态字符串中获取绝对地址并不像你想象的那么简单。构造函数`URL`或许可以，但是如果你不提供它需要的参数（有时候你无法提供）
它可能会出bug。这里有一个巧妙的方法来通过输入字符串来获取绝对地址：

{%highlight javascript linenos%}
var getAbsoluteUrl = (function() {
	var a;

	return function(url) {
		if(!a) a = document.createElement('a');
		a.href = url;

		return a.href;
	};
})();

// Usage
getAbsoluteUrl('/something'); // http://davidwalsh.name/something

{%endhighlight%}

`a`标签的`href`属性来帮你处理和`URL`的废话，并返回一个准确可靠的绝对地址。

###isNative

如果你要重写一个函数，希望知道给定的函数是否是原生的。下面这段好用的代码可以给你答案：

{%highlight javascript linenos%}
;(function() {

  // Used to resolve the internal `[[Class]]` of values
  var toString = Object.prototype.toString;

  // Used to resolve the decompiled source of functions
  var fnToString = Function.prototype.toString;

  // Used to detect host constructors (Safari > 4; really typed array specific)
  var reHostCtor = /^\[object .+?Constructor\]$/;

  // Compile a regexp using a common native method as a template.
  // We chose `Object#toString` because there's a good chance it is not being mucked with.
  var reNative = RegExp('^' +
    // Coerce `Object#toString` to a string
    String(toString)
    // Escape any special regexp characters
    .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
    // Replace mentions of `toString` with `.*?` to keep the template generic.
    // Replace thing like `for ...` to support environments like Rhino which add extra info
    // such as method arity.
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  function isNative(value) {
    var type = typeof value;
    return type == 'function'
      // Use `Function#toString` to bypass the value's own `toString` method
      // and avoid being faked out.
      ? reNative.test(fnToString.call(value))
      // Fallback to a host object check because some environments will represent
      // things like typed arrays as DOM methods which may not conform to the
      // normal native pattern.
      : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
  }

  // export however you want
  module.exports = isNative;
}());

// Usage
isNative(alert); // true
isNative(myCustomFunction); // false

{%endhighlight%}

这个函数并不完美，但它可以满足你的需求。

###insertRule

我们都知道我们可以通过选择器（via`document.querySelectorAll`）抓去一组节点并且给他们添加样式，但是怎样添加样式才能更有效率呢？（像在css里添加一样）:

{%highlight javascript linenos%}
var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement('style');

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute('media', 'screen')
	// style.setAttribute('media', 'only screen and (max-width : 1024px)')

	// WebKit hack :(
	style.appendChild(document.createTextNode(''));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

// Usage
sheet.insertRule("header { float: left; opacity: 0.8; }", 1);
{%endhighlight%}

再动态的重ajax网站，这样做格外有用。如果你要给选中的节点添加样式，你不必再遍历选择器所匹配的元素来添加样式。

###matchesSelector

在进入下一步之前，我们通常会验证`input`的输入值；确保值的有效性，确保表单数据合法，等等。但是再进行下一步之前，我们又有多少次会验证元素是否匹配呢？
你可以使用`matchesSelector`函数来验证这个元素能否被给定的选择器所匹配。

{%highlight javascript linenos%}
function matchesSelector(el, selector) {
	var p = Element.prototype;
	var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
		return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
	};
	return f.call(el, selector);
}

// Usage
matchesSelector(document.getElementById('myDiv'), 'div.someSelector[some-attribute=true]')
{%endhighlight%}