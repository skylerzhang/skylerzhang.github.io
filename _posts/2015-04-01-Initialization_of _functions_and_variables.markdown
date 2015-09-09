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

#### 


