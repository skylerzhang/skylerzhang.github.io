---
layout: post
title:  "基于node构建命令行工具【译】"
date:   2015-1-08 23:00:00
categories: node
tag: node
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

     $ which node
     /usr/local/bin/node

首先，创建一个名叫`gitsearch.js`的文件并且在第一行加一个[shebang](http://en.wikipedia.org/wiki/Shebang_(Unix));这样就能告诉系统用什么解释器
来使用和运行我们的文件。在我们的项目中我们希望用node的解释器来运行文件。(在[stackoverlow](http://unix.stackexchange.com/questions/29608/why-is-it-better-to-use-usr-bin-env-name-instead-of-path-to-name-as-my)上
有一个讨论是关于为什么要用`/usr/bin/env node`来代替`/usr/local/bin/node`的)。

     #!/usr/bin/env node

你的脚本要可是执行的（所它可以通过载入程序来运行）。为了让脚本可执行，运行 `chmod +x gitsearch.js`，可以改变脚本的访问权限，这样加载程序就可以运行它了。

### 创建命令

创建命令最简单的方式就是通过调用路径和文件名来运行你的脚本。

     ./gitsearch.js

创建命令行工具最关键就是确保在你的系统里没有其他命令和你用了同样的名字。你可以用`which commandName`来查询命令是否已经存在。在这个例子我们用的命令叫
`gitsearch`, 如果运行`which gitsearch`返回的是空，那么说明这个命令没有被使用。因为这是一个NodeJs脚本，所以我们将用[npm](https://www.npmjs.org/)来安装这个脚本
这样做意味着你只需要输入你脚本的名字无需担心路径问题。

为了让NodeJs脚本能通过npm来安装，我们需要在和`gitsearch.js`相同目录下创建一个相应的`package.json`文件。

{% highlight json linenos%}
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

     cd ./path/to/directory/
     sudo npm install -g

这样做有个缺点就是每次你更改`gitsearch.js`文件后你都需要重新运行下`npm install -g`命令来查看全局映射的改变。

现在执行`gitsearch`命令将会运行你的脚本。为了验证它，在你的脚本里加上`console.log("Hello World")`,然后重新运行`npm install -g`再执行你们的命令。

### 选项和参数

但进行输入和输出工作时，命令行工具是十分有用的。参数和选项可以通过`process.argv`文件传进命令行。添加`console.log(process.argv);`到你的脚本并且带着参数运行你的命令
你将会的得到如下的输出：

     gitsearch -g
     [ 'node', '/path/to/script/gitsearch.js', '-g' ]

Node最有价值的方面就是它的开发者社区和他们所贡献的包。这些包往往都是轻量级的,被用来做一些特定的工作。一个伟大的例子
就是[Commander](https://github.com/visionmedia/commander.js/)，一个被设计用来构建命令行接口并且提供处理参数和选项的方法。

在命令行里通过通过运行`npm install commander --save`来安装commander(添加`--save`选项`npm`将会自动升级你package.json里的依赖)。

现在更新你的脚本如下：

{% highlight javascript linenos%}
 #!/usr/bin/env node

 var program = require('commander');

 program
     .version('0.0.1')
     .usage('<keywords>')
     .parse(process.argv);

 if(!program.args.length) {
     program.help();
 } else {
     console.log('Keywords: ' + program.args);
 }
{% endhighlight %}

这里我们用到了node的require函数来加载commander模块到脚本中,并且开始了一个命令的基本结构。

Commander 对象的 `.args`属性只包含了从命令行传入的参数，类似于`process.argv`。所以这里我们用它来检测参数是否存在,因为我们这个命令行工具需要至少一个参数作为搜索关键词。

现在带一个参数运行`gitsearch`就像`gitsearch jquery`这样，命令行将会输出`Keywords: jquery`(如果你没有传递参数进去，将会返回命令行`help`)。用commander的另一个好处
就是他会根据你提供的选项信息自动产生`help`，你也可以通过`gitsearch -h`手动运行产生。

使用带有参数的命令行，我们可以构建我们搜索github api端点

{% highlight javascript linenos%}
 program
     .version('0.0.1')
     .usage('<keywords>')
     .parse(process.argv);

 if(!program.args.length) {
     program.help();
 } else {
     var keywords = program.args;
     var url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q='+keywords;
 }
{% endhighlight %}

因为github api 用的是 HTTP 端点所以我们需要发起一个HTTP请求。为了简单我们可以使用[request](https://www.npmjs.org/package/request)包

    npm install request --save

{% highlight javascript linenos%}
#!/usr/bin/env node

var program = require('commander');
var request = require('request');
{% endhighlight %}

现在我们可以用request 对我们指定的url发起一个`GET`了。

{% highlight javascript linenos%}
request({
    method: 'GET',
    headers: {
        'User-Agent': 'yourGithubUsername'
    },
    url: url
}, function(error, response, body) {

    if (!error && response.statusCode == 200) {
        var body = JSON.parse(body);
        console.log(body);
    } else if (error) {
        console.log('Error: ' + error);
    }
});
{% endhighlight %}

注意gitgub的api要求所有的请求都必须提供一个合法的`User-Agent`头，可以是你的用户名或者是你应用的名称。

现在当你传`jquery`到你的`gitsearch`命令，将会得到一个json返回，里面所提到jquery的代码仓库中排名前一百的。
这个输出包含许多数据，所以我们可以用[chalk](https://www.npmjs.com/package/chalk)给数据加点样式让它变得更易读一些。

    npm install chalk --save

{% highlight javascript linenos%}
#!/usr/bin/env node

var program = require('commander');
var request = require('request');
var chalk = require('chalk');

{% endhighlight %}

对于这个例子，我们决定循环输出他的仓库名、所有者、描述和克隆地址,用chalk给他们加上样式。

{% highlight javascript linenos%}
if (!error && response.statusCode == 200) {
    var body = JSON.parse(body);

    for(var i = 0; i < body.items.length; i++) {
        console.log(chalk.cyan.bold.underline('Name: ' + body.items[i].name));
        console.log(chalk.magenta.bold('Owner: ' + body.items[i].owner.login));
        console.log(chalk.grey('Desc: ' + body.items[i].description + '\n'));
        console.log(chalk.grey('Clone url: ' + body.items[i].clone_url + '\n'));
    }
} else if (error) {
    console.log(chalk.red('Error: ' + error));
}

{% endhighlight %}

为了更好的提炼结果，我们还可以加上更多的选项和参数。通过github api 我们可以获得许多选项，现在我选择通过所有者和语言来筛选。

{% highlight javascript linenos%}
program
    .version('0.0.1')
    .usage('[options] <keywords>')
    .option('-o, --owner [name]', 'Filter by the repositories owner')
    .option('-l, --language [language]', 'Filter by the repositories language')
    .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    var keywords = program.args;

    var url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q='+keywords;

    if(program.owner) {
        url = url + '+user:' + program.owner;
    }

    if(program.language) {
        url = url + '+language:' + program.language;
    }

    […]
}
{% endhighlight %}

现在运行 `gitsearch jquery -o jquery -l JavaScript`命令，返回的所有提到过jquery的仓库中将只包含jquery拥有的和用javascript编写的。

### 退出代码

一个很重要的问题就是确保你的脚本能够正确的退出来，这里我们再一次使用了object对象。万一出错`process.exit`一定要大于0，然而一个正确的退出这个值应该等于0。
这里我已经为HTTP请求后和出错添加了推出代码。当我们使用commander的`.help()`方法时，我们不需要推出代码，因为它会帮我们自动退出。

{% highlight javascript linenos%}
if (!error && response.statusCode == 200) {
    var body = JSON.parse(body);
    for(var i = 0; i < body.items.length; i++) {
        console.log(chalk.cyan.bold('Name: ' + body.items[i].name));
        console.log(chalk.magenta.bold('Owner: ' + body.items[i].owner.login));
        console.log(chalk.grey('Desc: ' + body.items[i].description + '\n'));
        console.log(chalk.grey('Clone url: ' + body.items[i].clone_url + '\n'));
    }
    process.exit(0);
} else if (error) {
    console.log(chalk.red('Error: ' + error));
    process.exit(1);
}
{% endhighlight %}

### 合并

最后我还加上了`--full`选项用来输出没有任何操作和样式的结果。

    program
        .version('0.0.1')
        .usage('[options] <keywords>')
        .option('-o, --owner [name]', 'Filter by the repositories owner')
        .option('-l, --language [language]', 'Filter by the repositories language')
        .option('-f, --full', 'Full output without any styling')
        .parse(process.argv);

{% highlight javascript linenos%}
if (!error && response.statusCode == 200) {
    var body = JSON.parse(body);
    if(program.full) {
        console.log(body);
    } else {
        for(var i = 0; i < body.items.length; i++) {
            console.log(chalk.cyan.bold('Name: ' + body.items[i].name));
            console.log(chalk.magenta.bold('Owner: ' + body.items[i].owner.login));
            console.log(chalk.grey('Desc: ' + body.items[i].description + '\n'));
            console.log(chalk.grey('Clone url: ' + body.items[i].clone_url + '\n'));
        }
        process.exit(0);
    }
} else if (error) {
    console.log(chalk.red('Error: ' + error));
    process.exit(1);
}
{% endhighlight %}

这样可以有效的利用其他可获得的命令行工具比如 less 、grep 、pbcopy。合并功能简单的方式就是用`pipeline`实现链式操作将上一个命令的输出作为下一个命令的输入。

#### pbcopy

`pbcopy`是一个简单的复制命令行输出的命令。用这个命令将允许你复制输出到其他的程序。

    gitsearch jquery -f | pbcopy

#### less

`less`是一个分页命令，它能够将输出分割成若干易操作的片段，每次只展示一屏。

    gitsearch jquery -f | less

#### grep

`grep`是一个用正则表达式来搜索文本数据的工具。

    gitsearch jquery -f | grep watcher

### 总结

命令行工具对于简化任务和自动化执行重复操作非常有用，对于开发者而言NodeJs将是一个伟大的跳板，通过它开发者可以构建自己的命令而无需额外学习shell脚本。

这是一个最基础的关于如何通过NodeJs构建命令行工具的例子。通过npm和gitub你可以找到许多非常有用的工具的实例。