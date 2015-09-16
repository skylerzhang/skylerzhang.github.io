---
layout: post
title:  "理解JavaScript预解析"
date:   2015-04-01
categories: js
tag: js
---

本文翻译自[Initialization of functions and variables](http://javascript.info/tutorial/initialization)

Javascript里函数和变量的实现技术和其他语言是完全不同的。一旦你知道它是怎么工作的，它将会变得很容易掌握。

在Javascript里所有本地变量和函数都是一个叫做`LexicalEnvironment`的特殊内置对象的属性。

在浏览器里最外层的`LexicalEnvironment`是`window`,它也被叫做全局对象。

### 最外层变量的初始化

当脚本将要被执行的时候, 有一个提前运行的阶段叫做变量的初始化（预解析）。

首先，解释器扫描代码中`FunctionDeclarations`，在主代码中通过 `function name {...}`的方式定义。

这样做会提取所有声明并创建函数放到`window`对象中。

举个例子，思考下面的代码

{% highlight javascript linenos%}
var a = 5
function f(arg) { alert('f:'+arg) }
var g = function(arg) { alert('g:'+arg) }
{% endhighlight %}

在这里浏览器找到`function f`，创建了函数并把它存为`window.f`。

{% highlight javascript linenos%}
// 1. Function Declarations are initialized before the code is executed.
// so, prior to first line we have: window = { f: function }
var a = 5
function f(arg) { alert('f:'+arg) } // <-- FunctionDeclaration
var g = function(arg) { alert('g:'+arg) }
{% endhighlight %}

由于这种机制的影响，`f`函数可以在它被声明之前来调用。

{% highlight javascript linenos%}
f()
function f() { alert('ok') }
{% endhighlight %}

其次，解释器会扫描`var`声明的变量并且创建一个`window`属性，但赋值不会在这个阶段被执行。所有变量的初始值都是`undefined`。

{% highlight javascript linenos%}
// 1. Function declarations are initialized before the code is executed.
// window = { f: function }
// 2. Variables are added as window properties.
// window = { f: function, a: undefined, g: undefined }
var a = 5   // <-- var
function f(arg) { alert('f:'+arg) }
var g = function(arg) { alert('g:'+arg) } // <-- var
{% endhighlight %}

`g`的值是一个函数表达式，但是解释器并不在乎这些。它创建一个变量，但并会再分配他们。

总结

    1、`FunctionDeclarations`使函数变得随时可用。它允许你在函数声明之前调用它。
    2、变量的初始值都是`undefined`。
    3、当执行到他们的时候，真正的的赋值才会发生。
    
综上，不可能有一个函数和一个变量同名。

第三，代码开始运行，当一个变量或者函数被调用，解释器会从`window`对象里获取他们。

{% highlight javascript linenos%}
alert("a" in window) // true, because window.a exists
alert(a) // undefined, because assignment happens below
alert(f) // function, because it is Function Declaration
alert(g) // undefined, because assignment happens below
var a = 5 
function f() { /*...*/ }
var g = function() { /*...*/ }
{% endhighlight %}  

第四，赋值之后，`a`变成了`5`，`g`变成了一个函数。在下面的代码中，`alerts`被放到了下面。注意他们的不同：

{% highlight javascript linenos%}
var a = 5 
var g = function() { /*...*/ }
alert(a) // 5
alert(g) // function
{% endhighlight %}

如果一个变量没有用`var`声明，它就不会被初始化。解释器找不到它。

{% highlight javascript linenos%}
alert("b" in window) // false, there is no window.b
alert(b) // error, b is not defined
b = 5
{% endhighlight %}

