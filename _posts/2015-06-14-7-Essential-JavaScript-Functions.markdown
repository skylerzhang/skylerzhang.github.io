---
layout: post
title:  "七个必备的JavaScript函数"
date:   2015-06-14
categories: js
---

本文翻译自[7 Essential JavaScript Functions](http://davidwalsh.name/essential-javascript-functions)

我记得早期的JavaScript不管你做什么，都需要一个简单的函数来适配所有的浏览器, 翻因为不同的浏览器厂商对js方法的支持都不一样。
不仅仅是一些新的特性，像对 `addEventListener` 和 `attachEvent` 这种基础的特征的支持也不一样。虽然时间过了这么久，但是为了方便和实现某些功能还是有
一些函数是每个开发人员都需要放在自己的工具库里的。

#### debounce

