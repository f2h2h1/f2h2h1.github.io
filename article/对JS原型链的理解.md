# 对 JS 原型链的理解

## JS 的类型

js 里有七种原始类型和 Object
- undefined
- boolean
- number
- string
- bigint
- symbol
- null

### 原始类型

number 是基于 IEEE 754 标准的双精度 64 位二进制格式的值（-(253 -1) 到 253 -1）。
它并没有为整数给出一种特定的类型。
除了能够表示浮点数外，还有一些带符号的值：+Infinity，-Infinity 和 NaN (非数值，Not-a-Number)。

bigint 可以用任意精度表示整数。
在将 bigint 转换为 boolean 时，它的行为类似于一个 number 。
bigint 不能与 number 互换操作。否则，将抛出 TypeError 。

bigint 和 symbol 都是 es2015 新增的，平时接触得比较少。
symbol 可以简单但不严谨地类比成 C 里面的枚举类型。

### 基本字符串和字符串对象的区别

请注意区分 JavaScript 字符串对象和基本字符串值。( 对于 Boolean 和Numbers 也同样如此。)

字符串字面量 (通过单引号或双引号定义) 和 直接调用 String 方法(没有通过 new 生成字符串对象实例)的字符串都是基本字符串。

JavaScript 会自动将基本字符串转换为字符串对象，只有将基本字符串转化为字符串对象之后才可以使用字符串对象的方法。

当基本字符串需要调用一个字符串对象才有的方法或者查询值的时候(基本字符串是没有这些方法的)，
JavaScript 会自动将基本字符串转化为字符串对象并且调用相应的方法或者执行查询。

参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String

### Object

Object 是引用类型。
大多数情况下引用类型的赋值都是浅拷贝，例如这样。要完整地复制一个对象，需要深拷贝（这是一个可以单独写一篇文章的主题）。
```
// 引用数据类型赋值
var a = {name: '张三'};
var b = a;
console.log(a); // {name: "张三"}
console.log(b); // {name: "张三"}
```

函数是 Object ，
数组是 Object ，
可以简单但不严谨地理解为，除了原始类型之外都是 Object 。

### null 和 undefined

- 一个变量已声明未赋值是 undefined
- 直接使用未声明的变量会抛错误
- 也可以直接给变量赋值 undefined 
- null 一般是需要特意赋值或者是原型链的尽头
- null 和 undefined 转换为布尔值时都是 false
- null 转换数据类型 number 时会转换为 0
- undefined 转换数据类型 number 时会转换为 NaN
- 试图访问对象不存在的属性时会返回 undefined

NaN 是一个特殊的值，但在 es2015 里， NaN 是 Number 的一个属性。
NaN 最好只用来判断一个变量是不是数字。

### 类型检测

typeof 只能检测原始数据类型。
数组，对象这类的全都是返回 object 。
但 null 也是返回 object 。
但函数返回的是 function 。

笔者认为的检测类型最安全的方法是 Object.prototype.toString.call(variable)

## 对象和函数

### 对象

对象分类：
1. 内置对象
    - 由 es 标准中定义的对象，在任何的 es 的环境中都可以使用，例如：Object Function Array Math Date 等
2. 宿主对象
    - 由 js 的运行环境提供的对象，例如由浏览器提供的对象：BOM（浏览器对象模型） DOM（文档对象模型）
3. 自定义对象
    - 由开发者创建的对象

在 js 里每一个对象都有一个原型。
对象的原型也是一个对象。
对象会继承原型的属性和方法。
对象会覆盖原型里同名的属性和方法。
所有对象的原型最终都会指向 Object.prototype 。
Object.prototype 的原型是 null 。
可以通过 \_\_proto\_\_ 属性或 Object.getPrototypeOf() 来访问原型。

### 函数

函数可以理解成一个变量。
函数的类型是 Object 。
函数名和变量名相同时会提示语法错误。
Function 是一种对象。
function 是一个用于声明对象的关键字。

```
// 一个函数的声明
function a(){};
// 也可以写成这样
var a = function(){};
```

函数都有一个名为 prototype 的属性，这个属性的值是一个对象。
这个对象会被称为函数的原型对象。
原型对象会有一个名为 constructor 的属性，这个属性会指向函数本身。

prototype 和 \_\_proto\_\_ 是不一样的。
prototype 只有函数才有， \_\_proto\_\_ 所有对象都有。
函数也有 \_\_proto\_\_ 属性。

所有函数的原型最终都会指向 Function.prototype 。
Function.prototype 的原型是 Object.prototype 。
Object.prototype 的原型是 null 。

Function 的 prototype 和 \_\_proto\_\_ 是相等的
```
console.log(Object.is(Object.getPrototypeOf(Function), Function.prototype)); // true
```

### new 运算符

new 关键字会进行如下的操作：
1. 创建一个空的简单 JavaScript 对象（即{}）；
1. 为步骤1新创建的对象添加属性 \_\_proto\_\_ ，将该属性链接至构造函数的原型对象 ；
1. 将步骤1新创建的对象作为 this 的上下文 ；
1. 如果该函数没有返回对象，则返回 this 。

例子
```
(function(){
    let a = function(){};
    let b = new a();
    console.log(Object.is(b.__proto__, a.prototype)); // true;
    console.log(Object.is(a, a.prototype.constructor)); // true;
    console.log(Object.is(a.__proto__, Function.prototype)); // true;
    console.log(Object.is(Function.prototype.__proto__, Object.prototype)); // true;
})();
```

根据上面的例子， a 会被称为构造函数， b 会被称为 a 的实例。
a 本质上只是一个普通的函数，但使用 new 运算符创建新的对象 b 时， a 就可以被称为构造函数。
在一些语境下 a 也会被称为类。

参考
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new
- https://zh.javascript.info/constructor-new

## 原型链

需要关注这三个属性
- prototype
    - 这个属性只有函数才有
    - 指向函数的原型对象
- constructor
    - 这个属性只有函数的原型对象才有
    - 指向函数本身
- \_\_proto\_\_
    - 这个属性只要是对象都有
    - 指向对象的原型

在访问对象的属性时，会先查找自身的属性，如果没有找一级一级地向上查找原型的属性。
试图访问对象不存在的属性时会遍历整个原型链。

```
@startuml
(null)
(Object.prototype)
(Function.prototype)
(Array.prototype)
(function Function) as funFunction
(function Object) as funObject
(function Array)as funArray
(function Example)as funExample
(Example.prototype)
(exampleObj)
(exampleArr)
(var obj = new Object<U+0028><U+0029>) as obj1
(var fun = new Function<U+0028><U+0029>) as fun1

Object.prototype --> null : "<U+005F>_proto__"
Function.prototype --> Object.prototype : "<U+005F>_proto__"
Example.prototype --> Object.prototype : "<U+005F>_proto__"
Array.prototype --> Object.prototype : "<U+005F>_proto__"
funFunction --> Function.prototype : "<U+005F>_proto__"
funObject --> funFunction : "<U+005F>_proto__"
funArray --> funFunction : "<U+005F>_proto__"
funExample --> funFunction : "<U+005F>_proto__"
exampleObj --> Example.prototype : "<U+005F>_proto__"
exampleArr --> Array.prototype : "<U+005F>_proto__"
obj1 --> Object.prototype : "<U+005F>_proto__"
fun1 --> Function.prototype : "<U+005F>_proto__"

funArray --> Array.prototype : "prototype"
funExample --> Example.prototype : "prototype"
funFunction --> Function.prototype : "prototype"
funObject --> Object.prototype : "prototype"

Array.prototype --> funArray : "constructor"
Example.prototype --> funExample : "constructor"
Function.prototype --> funFunction : "constructor"
Object.prototype --> funObject : "constructor"
@enduml
```

![js 的原型链](/static/img/md_js_prototype_plantuml.jpg)

这个图里， function Excemple 是自定义的函数。
function Array 是 js 的内置函数。

### in 和 hasOwnProperty 的区别

- 都是用来判断对象是否存在某个属性
- hasOwnProperty 只能判断是否是属于自身的属性，不会查找原型链上的属性
- in 能查找原型链上的属性

例子
```
(function(){
    let Person = function() {};
    Person.prototype.lastName = "Deng";
    let person = new Person();
    person.age = 12;
    console.log(person.hasOwnProperty('lastName')); // false
    console.log(person.hasOwnProperty('age')); // true
    console.log('lastName' in person); // true
    console.log('age' in person); // true
})()
```

### getPrototypeOf 和 \_\_proto\_\_

`__proto__` 是已经废弃了的属性 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto

标准是使用 Object.getPrototypeOf() 方法替代 `__proto__`

## 其它

原生原型不应该被扩展，除非它是为了与新的 JavaScript 特性兼容。

不建议重新定义原型，不要重新定义函数的 prototype 属性。

直接通过 console.log 输出的对象数据时，总是和预期的有一点不一样。
可能大概是因为这样，所以 es2015 才会要求使用 Object.getPrototypeOf() 方法获取对象原型而不是通过 \_\_proto\_\_ 属性获取对象原型。

js 是一种函数优先的编程语言，函数可以作为变量、参数、返回值。
js 也是一种面向对象的编程语言，但和 Java C++ 不同的是， js 并没有区分 类 和 对象。
js 只有对象，并使用原型链的方式来实现对象的继承。

class 只是原型链的语法糖。

除了原型链之外 js 还有很多语法细节上的坑，例如 this 闭包 事件循环 IIFE

## 参考

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

https://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html

https://www.liaoxuefeng.com/wiki/1022910821149312/1023021997355072

https://zh.javascript.info/prototype-inheritance

<!--
this
    this的指向随着调用环境的变化而变化
    this的值是在调用时计算出来的，它的值并不取决于方法声明的位置
作用域和闭包
    执行上下文
        全局执行上下文
        函数执行上下文
        eval函数执行上下文
    使用var声明变量时，变量会被自动添加到最接近的上下文。
    使用var声明会被拿到函数或全局作用域的顶部，位于作用域中所有代码之前，这个现象就叫变量提升。
    使用let关键字声明的变量，会有自己的作用域块，它的作用域是块级的，块级作用域由最近的一对的花括号{}届定。
    var可以重复声明，let不可以重复声明
    常量声明
        使用const关键字声明的变量，必须赋予初始值，一经声明，在其生命周期的任何时候都不能再重新赋予新值。
        使用const声明的obj可以修改它的属性
        如果想让整个对象都不能修改，可以使用Object.freeze()
            const obj1 = Object.freeze({ name: "大白" });
    变量的生存周期
        变量如果处在全局上下文中，如果我们不主动销毁，那么它的生存周期则是永久的。
        变量如果处在函数上下文中，它会随着函数调用的结束而被销毁。
        删除一个变量 del variable
        删除一个对象的属性 del object.attribute
    闭包
        函数上下文中的变量会随着函数执行结束而销毁，如果我们通过某种方式让函数中的变量不让其随着函数执行结束而销毁，那么这种方式就称之为闭包 。
        闭包是由函数以及声明该函数的词法环境组合而成的。
        该环境包含了这个闭包创建时作用域内的任何局部变量。
        在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。
        闭包让你可以在一个内层函数中访问到其外层函数的作用域。
        闭包的例子
            ```
            var selfAdd = function() {
                var a = 1;
                return function() {
                    a++;
                    console.log(a);
                };
            };
            const addFn = selfAdd();
            addFn(); // 2
            addFn(); // 3
            addFn(); // 4
            addFn(); // 5
            ```
            ```
            function makeAdder(x) {
                return function(y) {
                    return x + y;
                };
            }
            var add5 = makeAdder(5);
            var add10 = makeAdder(10);
            console.log(add5(2));  // 7
            console.log(add10(2)); // 12
            ```
        闭包的作用之一是模拟对象的私有方法
箭头函数和普通的匿名函数
    this的指向：使用function定义的函数，this的指向随着调用环境的变化而变化，
    而箭头函数中的this指向是固定不变的，一直指向定义函数的环境。
    箭头函数没有自己的this，它会捕获自己在定义时（注意，是定义时，不是调用时）所处的外层执行环境的this，并继承这个this值。所以，箭头函数中this的指向在它被定义的时候就已经确定了，之后永远不会改变。
    call()、apply()、bind()无法改变箭头函数中this的指向
    不能使用new操作符(作为构造函数使用)
    不能使用原型属性
    箭头函数不绑定arguments,取而代之用rest参数
    箭头函数没有this，没有arguments，没有super，箭头函数里的this取决于上下文
函数的 bind call apply 这几个方法有什么作用？
重写原型对象
原型链的继承方式
class 语法糖的本质
    可以使用 class 来声明类，可以使用 extends 来实现继承
    寄生式组合继承结合构造函数的静态方法继承来实现的
立即调用函数表达式
    https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE
js 的事件循环
    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop
js 的各种循环方法
    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Loops_and_iteration
    数组的遍历
        for; while; do...while;
        for (let key in arr) {
            console.log(arr[key]);
        }
        for (let item of arr) {
            console.log(item);
        }
        map;forEach;every;some;filter;reduce
        Array.prototype.forEach.call
        Array.prototype.map.call
        Array.prototype.map.call
    对象的遍历
        自身属性 继承属性
        可枚举属性 不可枚举属性
        for...in
        Object.keys()
        Object.values()
        Object.entries()
        Object.getOwnPropertyNames()
        Object.getOwnPropertySymbols()
        Reflect.ownKeys()
        令对象可以使用 for of 遍历
            for…of 循环是 ES6 新增的一种遍历方式，它可以直接获取可迭代对象的值，而不需要索引或键名。
            但是，对象本身不是可迭代的，所以不能直接用 for…of 遍历对象的属性2。
            如果想要用 for…of 遍历对象的属性，需要给对象添加一个 Symbol.iterator 属性，
            这个属性是一个生成器函数，可以返回一个迭代器对象。
            迭代器对象有一个 next() 方法，可以返回对象属性的键值对。
            (function(){
                let obj = {a: 1, b: 2, c: 3};
                for (let key in obj) {
                    console.log(key, obj[key]);
                }
                obj[Symbol.iterator] = function* () {
                    let keys = Object.keys(this);
                    for (let i = 0; i < keys.length; i++) {
                        yield [keys[i], this[keys[i]]];
                    }
                };
                for (let [key, value] of obj) {
                    console.log(key, value);
                }
            })()
如何判断变量的类型
    判断数组 Array.isArray()
    基本类型用 typeof
        但 object array null 都是返回 object
    用 instanceof 也可以
        typeof适用于简单的内置类型，如字符串、布尔值、数字和函数，
        instanceof适用于复杂的内置类型，如正则表达式、数组和对象
    判断对象
        js 中判断一个变量是不是 object 的方法有几种，但是没有一种是完美的，
        因为 js 的类型系统有一些特殊的情况，比如 null 和数组也是 object 类型。
        typeof obj === 'object' && obj !== null; // 个人更喜欢这种方法
        obj instanceof Object && obj !== null;
        这两种方式都无法区分普通对象 数组 和 函数
    用 Object.prototype.toString 最稳
        Object.prototype.toString.call({}); // '[object Object]'
        Object.prototype.toString.call([]); // '[object Array]'
        Object.prototype.toString.call(function(){}); // '[object Function]'
        Object.prototype.toString.call(1); // '[object Number]'
        Object.prototype.toString.call('1'); // '[object String]'
        Object.prototype.toString.call(true); // '[object Boolean]'
        Object.prototype.toString.call(null); // '[object Null]'
        Object.prototype.toString.call(); // '[object Undefined]'
        Object.prototype.toString.call(BigInt("0x1fffffffffffff")); // '[object BigInt]'
        Object.prototype.toString.call(Symbol(42)); // '[object Symbol]'
如何判断对象是否有某个属性
    in 和 hasOwnProperty
    hasOwnProperty 自身的属性
    in 自身的属性和原型链上的属性
        例子
            'attr' in {} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 没有 attr
            'attr' in {attr:null} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
            'attr' in {attr:undefined} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
            'attr' in {attr:''} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
            'attr' in {attr:0} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
            'attr' in {attr:false} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
            'attr' in {attr:NaN} ? 'obj 有 attr' : 'obj 没有 attr'; // obj 有 attr
如何判断数组是否包含某个值
    array.indexOf() 返回第一次出现给定元素的下标，如果不存在则返回 -1
    Array.includes() 如果元素存在返回true，不存在返回false
    遍历一次就知道了。。。
数组和对象的区别
    在js中数组是对象的一种
    console.log({} instanceof Object); // true
    console.log([] instanceof Object); // true
    Object.prototype.toString.call({}); // '[object Object]'
    Object.prototype.toString.call([]); // '[object Array]'
    Object.prototype.toString.call(function(){}); // '[object Function]'
    数组的索引一定是数字
    除了 数组 对象 外还有啊 Map 和 类型化数组（typed array）
    Map 也是一种对象
    类型化数组 也是一种对象
        类型化数组不是普通数组，调用 Array.isArray() 会返回 false
浅拷贝和深拷贝
    浅拷贝
        对象
            let copy = Object.assign({}, original);
        数组
            let arr2 = arr1.concat([]);
            let arr2 = arr1.slice();
            arr2 是一个新数组，但依然是浅拷贝
            js 里还有超级多的方法能复制数组，但我个人认为这个最简单
        直接复制 let arr2 = arr1 ，复制引用而不是值
            这个语句只是将 arr1 的内存地址赋值给了 arr2。这意味着 arr1 和 arr2 都指向同一个数组对象，而不是两个独立的数组。
            如果你更改 arr1 或 arr2 中的任何元素，这些更改都会反映在两个变量中，因为它们引用的是同一个数组对象。
        浅拷贝类似于这样，就是对象第一层属性的直接复制
            let obj2 = {}；
            for (let key in obj) {
                obj2[key] = obj[key];
            }
    深拷贝通常可以通过JSON.parse(JSON.stringify(object))来实现，但这种方法不能复制函数和循环引用的对象。
        let copy = JSON.parse(JSON.stringify(original));
    underscore
        在 Underscore.js 中，有一个用于浅拷贝的方法叫做 _.clone(object)，但它只会复制对象的第一层属性，不会处理嵌套的对象或数组。
        如果需要深拷贝，你可以自己实现一个递归的深度克隆函数。
    jquery
       let obj2 jQuery.extend(true, {}, obj1); // 这是深拷贝
       let obj2 jQuery.extend(false {}, obj1); // 这是浅拷贝
       jquery 的 extend 方法原本是用于合并对象的
       jquery 中还有一个 clone 方法， clone 方法是用来复制 dom 节点的
    lodash
        let deepCopy = _.cloneDeep(original); // 这是深拷贝
        lodash 是 underscore 的超集
    这篇文章推荐使用 lodash 的 cloneDeep 方法，而不是自己写深拷贝的方法
        https://zh.javascript.info/object-copy
    深拷贝大致的方法
        function deepClone(obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }
            if (typeof obj === 'function') {
                // 如果是函数，可以选择返回一个新的函数
                // 这里只是简单地返回原函数，但你可以根据需要进行更复杂的操作
                return obj;
            }
            let clonedObj = Array.isArray(obj) ? [] : {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = deepClone(obj[key]);
                }
            }
            return clonedObj;
        }



new 运算符
function User(name) {
  // this = {};（隐式创建）

  // 添加属性到 this
  this.name = name;
  this.isAdmin = false;

  // return this;（隐式返回）
  // 也可以显示返回其它值
}
let user = new User();

函数的类型是对象。
    name —— 函数的名字。通常取自函数定义，但如果函数定义时没设定函数名，JavaScript 会尝试通过函数的上下文猜一个函数名（例如把赋值的变量名取为函数名）。
    length —— 函数定义时的入参的个数。Rest 参数不参与计数。

如果函数是通过函数表达式的形式被声明的（不是在主代码流里），并且附带了名字，
那么它被称为命名函数表达式（Named Function Expression）。
这个名字可以用于在该函数内部进行自调用，例如递归调用等。

普通的函数表达式：
let sayHi = function(who) {
  alert(`Hello, ${who}`);
};

命名函数表达式
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // 使用 func 再次调用函数自身
  }
};


在浏览器中 setTimeout 和 setInterval 的 this 是指向 window 的
所以，在定时器里执行函数时最好再包装一层函数
例如这样
setTimeout(sayHi, 1000); // 没有包装的
setTimeout(function(){sayHi();}, 1000); // 用匿名函数包装的
setTimeout(()=>sayHi(), 1000); // 用箭头函数包装的
setTimeout(sayHi(), 1000); // 一般情况下这是错误的，传入的是 sayHi() 函数的返回值，



节流(throttle)
防抖(debounce)
在JavaScript中，**防抖（debounce）和节流（throttle）**都是用来控制函数执行频率的技术，
但它们的应用场景和行为方式有所不同。
**防抖（debounce）**
    是指当事件被触发后，延迟一段时间再执行回调，如果在这段延迟时间内事件又被触发，则重新计算延迟时间。
    防抖适用于那些你希望在一系列连续的事件触发结束后只执行一次的情况，比如输入框的实时搜索功能。
**节流（throttle）**
    则是确保函数在一定时间内只执行一次，即使事件持续触发也不会增加更多的调用。
    节流适用于那些你希望无论事件触发频率多高，都保持一定的执行频率的情况，比如滚动事件的处理。
简单来说，防抖是“停下来再执行”，而节流是“按时执行”。

**防抖的应用场景**:
1. **搜索框搜索输入**：当用户停止输入一段时间后，才开始搜索查询，避免每次键入都触发查询。
2. **窗口大小调整（resizing）**：只在用户完成窗口大小调整后，才执行计算布局的操作。
3. **表单验证**：当用户完成输入后，才进行表单验证。
4. **按钮提交**：防止用户多次点击提交，只在最后一次点击后一段时间执行。
**节流的应用场景**:
1. **滚动事件处理**（如无限滚动加载或滚动监听）：确保滚动事件不会过于频繁地触发，可能会导致浏览器卡顿。
2. **游戏中的按键响应**：限制玩家的操作频率，例如射击按钮。
3. **性能监测**：限制监测数据的记录频率。
4. **动画控制**：确保动画在规定时间内只执行一次，避免多次触发导致的性能问题。
这些场景展示了如何根据不同的需求选择使用防抖或节流技术来优化用户体验和应用性能。


// 防抖函数示例
function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

// 节流函数示例
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


-->
