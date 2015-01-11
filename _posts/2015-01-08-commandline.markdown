---
layout: post
title:  "基于node构建命令行工具【译】"
date:   2015-1-08 23:00:00
categories: node
---

本文翻译自[Command-line utilities with Node.js](http://cruft.io/posts/node-command-line-utilities/)
本人水平有限，如有错误还请指正。

node.js 中一个经常被忽视的功能就是它可以用来创建命令行工具。这篇文章我就来示范一下用node.js创建命令行工具是一件多么简单的事情。文章里我将创建一个
基于关键词、拥有者和语言来快速搜索Github仓库的命令行工具。如果你想直接看源码，它可以在[这儿获得](https://gist.github.com/GlynnPhillips/7f3dcb2b990796f1856f)。

### 理解命令行

不管你用的是什么脚本语言，在写任何Unix命令行工具之前，最重要的就是理解它通用的输入模式。最基本的模式由三个主要部分组成：命令，选项，参数

#### 命令

命令可以分成以下三类：

1、内部命令 - 这种命令的验证和执行不依赖任何外部的可执行文件。

2、包含命令 - 这种命令的执行需要一个通常包含在系统重要部分之中的可执行文件。

3、外部命令 - 这种命令的执行需要一个外部的可执行文件，但它并不是系统自带的，而是由第三方添加的。

#### 选项

命令行的选项可以用来改变命令的运行。类Unix系统上的选项通常都带有连字符并且是用空格分隔开的。

#### 参数

当命令行运行的时候，一个参数就传递一条信息。参数经常被用来指定信息来源，或者改变命令的执行。

### 创建一个命令行工具

在我开始编写之前，我有必要指出这篇教程的编写和测试都是在类Unix系统下（OSX）。如果你想运行在其他的类Unix系统下,可能需要再做一些额外的工作。

开始编写前唯一的依赖就是node.js。你可以在命令行里运行 `which node`来查看它是否已经安装。如果你已经安装了你可能会得到一个类似下面这样的返回。如果返回是空
那么你可能没有安装node，你可以从[node.org](www.nodejs.org)下载安装包。

{% highlight html %}
 $ which node
 /usr/local/bin/node
{% endhighlight %}

首先，创建一个名叫`gitsearch.js`的文件并且在第一行加一个[shebang](http://en.wikipedia.org/wiki/Shebang_(Unix));这样就能告诉系统用什么解释器
来使用和运行我们的文件。在我们的项目中我们希望用node的解释器来运行文件。(在[stackoverlow](http://unix.stackexchange.com/questions/29608/why-is-it-better-to-use-usr-bin-env-name-instead-of-path-to-name-as-my)上
有一个讨论是关于为什么要用`/usr/bin/env node`来代替`/usr/local/bin/node`的)。

{% highlight html %}
 #!/usr/bin/env node
{% endhighlight %}

你的脚本要可是执行的（所它可以通过载入程序来运行）。为了让脚本可执行，运行 `chmod +x gitsearch.js`，可以改变脚本的访问权限，这样加载程序就可以运行它了。

### 创建命令

创建命令最简单的方式就是通过调用路径和文件名来运行你的脚本。

{% highlight html %}
 ./gitsearch.js
{% endhighlight %}

创建命令行工具最关键就是确保在你的系统里没有其他命令和你用了同样的名字。你可以用`which commandName`来查询命令是否已经存在。在这个例子我们用的命令叫
`gitsearch`, 如果运行`which gitsearch`返回的是空，那么说明这个命令没有被使用。因为这是一个NodeJs脚本，所以我们将用[npm](https://www.npmjs.org/)来安装这个脚本
这样做意味着你只需要输入你脚本的名字无需担心路径问题。

为了让NodeJs脚本能通过npm来安装，我们需要在和`gitsearch.js`相同目录下创建一个相应的`package.json`文件。

{% highlight json %}
{
    "name": "gitsearch",
    "version": "0.0.1",

    "description": "A simple command-line tool for searching git repositories",
    "author": "Glynn Phillips",
    "engines": {
      "node": ">=0.10"
    },
    "dependencies": {
    },
    "bin": {
      "gitsearch": "gitsearch.js"
    }
}
{% endhighlight %}

最重要的部分是这里`"bin": {"gitsearch": "gitsearch.js"}`,他将`gitsearch`命令关联到了`gitsearch.js`文件。在命令行里进入到相应的文件夹
通过npm来全局安装你的脚本。

{% highlight html %}
 cd ./path/to/directory/
 sudo npm install -g
{% endhighlight %}

这样做有个缺点就是每次你更改`gitsearch.js`文件后你都需要重新运行下`npm install -g`命令来查看全局映射的改变。

现在执行`gitsearch`命令将会运行你的脚本。为了验证它，在你的脚本里加上`console.log("Hello World")`,然后重新运行`npm install -g`再执行你们的命令。

### 选项和参数