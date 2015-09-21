---
layout: post
title:  "哪些属性会使浏览器重排"
date:   2015-09-21
categories: js
tag: event js
---

下面的所有的属性和方法，在被请求和调用的时候都会触发浏览器同步的计算样式和布局。这个就是所谓的重排，是一个很常见的性能瓶颈。

###元素 

####盒模型尺寸

* `elem.offsetLeft`, `elem.offsetTop`, `elem.offsetWidth`, `elem.offsetHeight`, `elem.offsetParent`
* `elem.clientLeft`, `elem.clientTop`, `elem.clientWidth`, `elem.clientHeight`
* `elem.getClientRects()`, `elem.getBoundingClientRect()`

####滚动的全部

* `elem.scrollBy()`, `elem.scrollTo()`
* `elem.scrollIntoView()`, `elem.scrollIntoViewIfNeeded()`
* `elem.scrollWidth`, `elem.scrollHeight`
* `elem.scrollLeft`, `elem.scrollTop` 设置他们也一样

####聚焦

* `elem.focus()` 会触发两次重排[(来源)](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/dom/Element.cpp&q=updateLayoutIgnorePendingStylesheets%20-f:out%20-f:test&sq=package:chromium&l=2369&ct=rc&cd=4&dr=C)

####其他

* `elem.computedRole`, `elem.computedName`
* `elem.innerText` [(来源)](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/dom/Element.cpp&q=updateLayoutIgnorePendingStylesheets%20-f:out%20-f:test&sq=package:chromium&l=2626&ct=rc&cd=4&dr=C)

###获取非行间样式

`window.getComputedStyle()` 会使样式重新计算。

`window.getComputedStyle()` 如果满足以下条件的任意一条就会是页面重排。

1、元素在一个`shadow tree` 里。

2、有媒体查询。尤其是有以下属性：

* `min-width`, `min-height`, `max-width`, `max-height`, `width`, `height`
* `aspect-ratio`, `min-aspect-ratio`, `max-aspect-ratio`
* `device-pixel-ratio`, `resolution`, `orientation`
    
3、请求下面属性的一中：

* `height`, `width`
* `top`, `right`, `bottom`, `left`
* `margin` [`-top`, `-right`, `-bottom`, `-left`, or shorthand] 只有当`margin`值固定的时候.
* `padding` [`-top`, `-right`, `-bottom`, `-left`, or shorthand] 只有当`padding`值固定的时候.
* `transform`, `transform-origin`, `perspective-origin`
* `translate` , `rotate`, `scale`
* `webkit-filter`, `backdrop-filter`
* `motion-path`, `motion-offset`, `motion-rotation`
* `x`, `y`, `rx`, `ry`

###window

* `window.scrollX`, `window.scrollY`
* `window.innerHeight`, `window.innerWidth`
* `window.getMatchedCSSRules()` 只会重新计算样式

###表单

* `inputElem.focus()`
* `inputElem.select()`, `textareaElem.select()`

###鼠标事件爱你

* `mouseEvt.layerX`, `mouseEvt.layerY`, `mouseEvt.offsetX`, `mouseEvt.offsetY`

###document

* `doc.scrollingElement` 只会重新计算样式

###Range

* `range.getClientRects()`, `range.getBoundingClientRect()`

###SVG

太多了，参见[Tony Gentilcore's 2011 Layout Triggering List](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

###contenteditable

全部, …包括复制一张图片到剪切板。