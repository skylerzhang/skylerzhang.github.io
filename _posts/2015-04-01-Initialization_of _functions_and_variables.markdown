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

###函数变量

在每个函数被调用和运行的时候，都会有一个新的`词法环境对象`被创建,里面包含参数、变量和嵌套函数。

这个对象用于对内部变量的读写。不像`window`对象，一个函数的`词法环境对象`没有直接的入口可以获得它。

让我们看一下下面函数的具体执行过程：

{% highlight javascript linenos%}
function sayHi(name) {
  var phrase = "Hi, " + name
  alert(phrase)
}
sayHi('John')
{% endhighlight %}

1、当解释器准备运行函数的时候，是从函数第一行的前面开始运行，一个空的`词法环境对象`被创建，里面包含了参数、变量和内嵌函数。

{% highlight javascript linenos%}
function sayHi(name) {
// LexicalEnvironment = { name: 'John', phrase: undefined }
  var phrase = "Hi, " + name
  alert(phrase)
}
sayHi('John')
{% endhighlight %}

参数有初始值，但是本地变量没有。

2、然后函数开始运行，最终赋值被执行。一个变量最终被赋值意味着`词法环境对象`上相应的属性也被赋值。

{% highlight javascript linenos%}
function sayHi(name) {
// LexicalEnvironment = { name: 'John', phrase: undefined }
  var phrase = "Hi, " + name
// LexicalEnvironment = { name: 'John', phrase: 'Hi, John'}
  alert(phrase)
}
sayHi('John')
{% endhighlight %}

最后一行`alert(phrase)`从`词法环境对象`里查找`phrase`属性并输出它的值。

3、在执行结束后，在通常情况下`词法环境对象`连同它内部的内容会一并被js的垃圾回收机制回收，因为这些变量都已经不再需要了。但是如你所见事实上也有例外的时候。

    如果我们看了ECMA-262 的说明，实际上是有两个不同的对象。
    
    第一个是`VariableEnvironment`对象，包含着变量和函数，由`FunctionDeclaration`声明，声明之后就不可再变了。
    
    第一个是`LexicalEnvironment`对象，几乎和`VariableEnvironment`一样，但是这个对象才是在函数执行过程中用到过的对象。
    
    你可以在[ECMA-262](http://www.ecma-international.org/publications/standards/Ecma-262.htm)的标准中找到更详细的描述。
    
###没有块级作用域

下面两段代码是没有区别的：

{% highlight javascript linenos%}
var i = 1
{
  i = 5
}
{% endhighlight %}

{% highlight javascript linenos%}
i = 1
{
  var i = 5
}
{% endhighlight %}

在这两个案例中，所有的`var`声明都是发生在这块代码执行之前。

不像JAVA、C 等其他语言，在JavaScript的循环中变量会被留存的。

{% highlight javascript linenos%}
for(var i=0; i<5; i++) { }
alert(i) // 5, variable survives and keeps value
}
{% endhighlight %}