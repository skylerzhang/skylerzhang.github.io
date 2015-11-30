---
layout: post
title:  "遍历协议"
date:   2015-11-30
categories: es6
tag: es6
---

ES6添加的`iteration`（遍历），它不是一项新的语法也不是一个新的内置对象，它是一项协议。
通过这个协议可以给任何对象实现一个便利的遍历工具。

这项协议包括两部分：`iterable protocols`(可遍历协议)和`iterator protocols`(遍历器协议)。

###可遍历协议

通过可遍历协议，JavaScript对象可以定义和改造他们的遍历行为，比如你可以自定义通过`for...of`结构循环出来的值。
一些内置类型内置了遍历行为，像`array`，`map`等，但是有一些是没有的像`object`。

一个对象如果想要是可遍历的，那就必须实现一个`@@iterator`方法，这也就意味着对象或者通过原型连继承的对象必须得有一个名叫`Symbol.iterator`的属性。

<table class="standard-table">
 <thead>
  <tr>
   <th scope="col">属性</th>
   <th scope="col">值</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>[Symbol.iterator]</td>
   <td>一个不需要任何参数函数，返回一个遵从`iterator protocol`（遍历器协议）的对象</td>
  </tr>
 </tbody>
</table>

当一个对象需要被遍历的时候，它的@@iterator 方法都会在遍历开始之前被调用，这次调用不需要任何参数并返回一个遍历器对象，用于获取遍历时候的值。

###遍历器协议

遍历器协议定义个一种标准的途径来产生一系列值（无论是有限还是无限的）。

当一个对象实现了具有下列语意的`next()`方法后，它就变成了一个遍历器。

<table class="standard-table">
 <thead>
  <tr>
   <th scope="col">属性</th>
   <th scope="col">值</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>next</td>
   <td>
   一个不需要任何参数函数，返回一个具有两个属性的对象
   <ul>
      <li>done(boolean)
        <ul>
          <li>当遍历器经过一系列遍历之后到达最后一个值，done的值就会变为true</li>
          <li>当遍历器可以继续产生下一个值的时候，done的值为false</li>
        </ul>
      </li>
      <li>value-任何通过遍历器返回的js值，当`done`为真时可以忽略</li>
   </ul>
   </td>
  </tr>
 </tbody>
</table>

一些遍历器反过来也是可遍历的：

{% highlight javascript linenos%}
var someArray = [1, 5, 7];
var someArrayEntries = someArray.entries(); //返回一个数组遍历器

someArrayEntries.toString();           // "[object Array Iterator]"
someArrayEntries === someArrayEntries[Symbol.iterator]();    // true
{% endhighlight %}

###使用遍历协议的例子

字符串就是内置的可遍历对象：

{% highlight javascript linenos%}
var someString = "hi";
typeof someString[Symbol.iterator];          // "function"
{% endhighlight %}

字符串对象默认的遍历器是一个一个返回字符

{% highlight javascript linenos%}
var iterator = someString[Symbol.iterator]();
iterator + "";                               // "[object String Iterator]"

iterator.next();                             // { value: "h", done: false }
iterator.next();                             // { value: "i", done: false }
iterator.next();                             // { value: undefined, done: true }
{% endhighlight %}

一些内置的方法同样也用到了遍历协议，比如扩展运算符

{% highlight javascript linenos%}
[...someString]                              // ["h", "i"]
{% endhighlight %}

我们也可以通过实现我们自己的@@iterator方法来重定义遍历行为：

{% highlight javascript linenos%}
var someString = new String("hi");          // need to construct a String object explicitly to avoid auto-boxing

someString[Symbol.iterator] = function() {
  return { // this is the iterator object, returning a single element, the string "bye"
    next: function() {
      if (this.first) {
        this.first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    first: true
  };
};
{% endhighlight %}

###可遍历的例子

####内置可遍历的对象

String，Array，TypeArray，Map 和 Set 都是js内置的可遍历对象，因为他们的原型上实现了@@iterator方法。

####用户自定义的可遍历对象

{% highlight javascript linenos%}
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable]; // [1, 2, 3]
{% endhighlight %}

####可以接受可遍历对象的内置接口

有许多接口可以接受可遍历对象，比如Map(iterable),WeakMap([iterable]),Set([iterable])和WeakSet([iterable]):

{% highlight javascript linenos%}
var myObj = {};
new Map([[1,"a"],[2,"b"],[3,"c"]]).get(2);               // "b"
new WeakMap([[{},"a"],[myObj,"b"],[{},"c"]]).get(myObj); // "b"
new Set([1, 2, 3]).has(3);                               // true
new Set("123").has("2");                                 // true
new WeakSet(function*() {
    yield {};
    yield myObj;
    yield {};
}()).has(myObj);                                         //true
{% endhighlight %}

还有 Promise.all(iterable), Promise.race(iterable), and Array.from()。

####必须使用可遍历对象的语法

一些声明和表达式必须使用可遍历对象，如果`for...of`循环，扩展运算符，`yield*`和解构操作

{% highlight javascript linenos%}
for(let value of ["a", "b", "c"]){
    console.log(value);
}
// "a"
// "b"
// "c"

[..."abc"]; // ["a", "b", "c"]

function* gen(){
  yield* ["a", "b", "c"];
}

gen().next(); // { value:"a", done:false }

[a, b, c] = new Set(["a", "b", "c"]);
a // "a"
{% endhighlight %}

####不符合规范的可遍历对象

如果一个可遍历对象的@@iterator方法没有返回一个遍历器对象，那当这个对象被用到上述接口中的时候会报错

{% highlight javascript linenos%}
var nonWellFormedIterable = {}
nonWellFormedIterable[Symbol.iterator] = () => 1
[...nonWellFormedIterable] // TypeError: [] is not a function
{% endhighlight %}

###遍历器实例

####简单的遍历器

{% highlight javascript linenos%}
function makeIterator(array){
    var nextIndex = 0;

    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    };
}

var it = makeIterator(['yo', 'ya']);

console.log(it.next().value); // 'yo'
console.log(it.next().value); // 'ya'
console.log(it.next().done);  // true
{% endhighlight %}

####无限的遍历器

{% highlight javascript linenos%}
function idMaker(){
    var index = 0;

    return {
       next: function(){
           return {value: index++, done: false};
       }
    };
}

var it = idMaker();

console.log(it.next().value); // '0'
console.log(it.next().value); // '1'
console.log(it.next().value); // '2'
// ...
{% endhighlight %}

####结合generator

{% highlight javascript linenos%}
function* makeSimpleGenerator(array){
    var nextIndex = 0;

    while(nextIndex < array.length){
        yield array[nextIndex++];
    }
}

var gen = makeSimpleGenerator(['yo', 'ya']);

console.log(gen.next().value); // 'yo'
console.log(gen.next().value); // 'ya'
console.log(gen.next().done);  // true



function* idMaker(){
    var index = 0;
    while(true)
        yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // '0'
console.log(gen.next().value); // '1'
console.log(gen.next().value); // '2'
// ...
{% endhighlight %}

###generator对象是一个遍历器还是一个可遍历的对象？

答案是『都是』：

{% highlight javascript linenos%}
var aGeneratorObject = function*(){
    yield 1;
    yield 2;
    yield 3;
}();
typeof aGeneratorObject.next;
// "function", because it has a next method, so it's an iterator
typeof aGeneratorObject[Symbol.iterator];
// "function", because it has an @@iterator method, so it's an iterable
aGeneratorObject[Symbol.iterator]() === aGeneratorObject;
// true, because its @@iterator method return its self (an iterator), so it's an well-formed iterable
[...aGeneratorObject];
// [1, 2, 3]
{% endhighlight %}
