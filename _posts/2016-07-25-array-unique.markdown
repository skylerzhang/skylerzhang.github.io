---
layout: post
title:  "javascript数组去重"
date:   2016-07-26
categories: js
tag: js es6 unique
------------------

在实际的业务开发中经常需要对一些数据进行去重，但是如果方法不得当会使得运算效率实在低下。

{% highlight javascript linenos%}
//随机生成一个长度为30000的数组
let dealArr = [];
for (let i = 0; i < 30000; i++) {
    dealArr.push(parseInt(Math.random().toString().substring(10)));
} 
 
//方法一 ： 双层循环
function uniq(arr) {
    var result = [];
    for (let i = 0; i< arr.length; i++){
        let isRepeat = false;
        for(let j = 0; j < result.length; j++){
            if(result[j] == arr[i]){
                isRepeat = true;
                break
            }
        }
        if(!isRepeat){
            result.push(arr[i])
        }
    }
    return result;
}
 
//平均耗时: 1100毫秒左右 (node v6.2.2)
let resArray = uniq(dealArr);
{% endhighlight %}
上面这种方式的最差的情况要运算n(n+1)/2, 时间复杂度O(n^2)。3W条数据就要一秒多，当需要去重的数据有10W条的时候计算时间就已经超多一分钟。

{% highlight javascript linenos%}
//方法二 ： 利用 Array 的 indexOf() 方法 （ES5的语法）
function uniq(arr) {
    var result = [];
    for (let i = 0; i< arr.length; i++){
        if(result.indexOf(arr[i]) == -1){
            result.push(arr[i])
        }
    }
    return result;
}
 
//平均耗时: 300毫秒左右 (node v6.2.2)
let resArray = uniq(dealArr);
{% endhighlight %}
这种方式看似只有一层循环，但是ecma的规范里Array的indexOf 方法的实现里也是用到循环的。所有这种方式的效率比前面一种有了一定的提升，但是仍然不理想，


{% highlight javascript linenos%}
//方法三 ： 利用哈希表
function uniq(arr) {
    var result = [];
    var hashTable = {};
    for (let i =0; i < arr.length; i++){
        if(!hashTable[arr[i]]) {
            hashTable[arr[i]] = true;
            result.push(arr[i])
        }
    }
    return result;
}
 
//平均耗时: 15毫秒左右 (node v6.2.2)
let resArray = uniq(dealArr);
{% endhighlight %}
在js语言里构造一个哈希表是一件十分简单的事情其实就是个对象，而哈希查找的时间复杂度是一个常量，所有利用哈希表去重的时间负责度只有O(n)。
但是有一个问题需要注意，js 对象的键值只能是字符串，如果数组[123,'123']是这样的，经过去重复之后就只剩下[123]了。我们可以稍做改造用类型+名字作为哈希的键 typeof(arr[i]) + arr[i],但是如果遇到这样一个数组[ new String(123), new Number(123) ] 这种方式真的就没办法了...

{% highlight javascript linenos%}
//方法四 ： 空间复杂度最小，当前数组操作，不需要额外的内存空间
var uniq = function(array) {
    for (var i = array.length; i--;) {
        var n = array[i]
        // 先排除 即 如果它是清白的 后面就没有等值元素
        array.splice(i, 1, null)
        if (~array.indexOf(n)) {
            array.splice(i, 1); //有重复
        } else {
            array.splice(i, 1, n); //无重复
        }
    }
    return array
};
 
//平均耗时: 2200毫秒左右 (node v6.2.2)
let resArray = uniq(dealArr);
{% endhighlight %}

利用es6语法
{% highlight javascript linenos%}
// 利用了es6语法，Map数据结构类似于对象也是键值对的集合（哈希结构），但是它的键值可以不必是字符串，用它方法三的问题可以迎刃而解。
function uniq (arr) {
  const hashTable = new Map()
  return arr.filter((a) => !hashTable.has(a) && hashTable.set(a, 1))
}
 
// Set数据结构它类似于数组，但是成员的值都是唯一的，所以天然能去重
function uniq (arr) {
  return Array.from(new Set(arr))
}

{% endhighlight %}