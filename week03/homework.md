### convertStringToNumber
```JavaScript
function convertStringToNumber(str) {
    var x = 10;
    if(/^0X/i.test(str)) {
        x = 16;
        str = str.substring(2);
    }
    if(/^OO/i.test(str)) {
        x = 8;
        str = str.substring(2);
    }
    if(/^OB/i.test(str)) {
        x = 2;
        str = str.substring(2);
    }
    let exponent = str.split('e')[1].split('').reverse()||[];
    let chars = str.split('e')[0].toUpperCase().split('.');
    let int = chars[0].split('').reverse();
    let decimal = chars[1]?(chars[1] && chars[1].split('')):[];

    let res = tem = 0;
    const ZERO_CODE = '0'.codePointAt(0);
    const A_CODE = 'A'.codePointAt(0);
    
    int.forEach((item, index) => {
        let itemCode = item.codePointAt(0);
        if (/[A-F]/.test(item)) {
            itemCode = ZERO_CODE + 10 + item.codePointAt(0) - A_CODE;
        }
        tem = itemCode - ZERO_CODE;
        tem *= x ** index;
        res += tem;
    })

    decimal.forEach((item, index) => {
        tem = item.codePointAt(0) - ZERO_CODE;
        tem /= x ** (index + 1);
        res += tem;
    })

    exponent.forEach((item,index) => {
        tem = item.codePointAt(0) - ZERO_CODE;
        tem *= 10 ** (10 ** index * tem);
        res *= tem;
    })
    return res
}

// convertStringToNumber('12.1');
// convertStringToNumber('0x11');
// convertStringToNumber('12.1e11');

```

### convertNumberToString
```JavaScript
function convertNumberToString(number, x = 10) {
    let integer = Math.floor(number);
    let faction = number - integer;
    let string = ''
    let strArr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

    while (integer > 0) {
        string = strArr[integer % x] + string;
        integer = Math.floor(integer / x);
    }
    if (faction > 0) {
        string += '.'
        while (faction > 0) {
            string = string + strArr[Math.floor(faction * x)];
            faction = faction * x - Math.floor(faction * x);
        }
    }
    return string
}
//convertNumberToString(11,16);
```
### 找出 JavaScript 标准里有哪些对象是我们无法实现出来的，都有哪些特性？写一篇文章，放在学习总结里。

> 对应标准9.4节 Built-in Exotic Object Internal Methods and Slots

#### Bound Function Exotic Objects
Bound Function （绑定函数） 即 Function.prototype.bind() 创建的函数对象，它包含了原函数对象。绑定函数能够被调用，因为其包含[[Call]]，甚至可以包含[[Construct]]内部方法。

绑定函数对象，没有一般函数对象有的内部插槽，但是包含3个独有的内部插槽。
[[BoundTargetFunction]] - 包装的函数对象
[[BoundThis]] - 在调用包装函数时始终作为 this 值传递的值。
[[BoundArguments]] - 列表，在对包装函数做任何调用都会优先用列表元素填充参数列表。

绑定函数对象提供所有内部必要的方法。
[[Call]] - 将绑定函数中的内部插槽值当作参数传入到Call函数中。
[[Construct]] - 将绑定函数中的内部插槽值当作参数传入到Construct函数中。
BoundFunctionCreate - 绑定函数创建的过程。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

### Array Exotic Objects
数组对象是怪异函数对象（exotic object)是因为数组属性的属性名是一个索引。每个数组有个length的属性，其值通常是小于2的32次方的非负整数。length的值会比属性最大的索引大1。当数组改变时，length也改变维持比属性最大的索引大1.而当length改变的时候，属性也会相应的改变。

[[DefineOwnProperty]] - 内部方法，定义属性
ArrayCreate
ArraySpeciesCreate 
ArraySetLength

### String Exotic Objects
字符串特异对象，封装了一个字符串值，并暴露出与该字符串值的各个代码单元元素相对应的 虚拟整数索引属性。它还拥有一个length属性，即封装的字符串中元素的数量，length属性不可写也不可配置。

字符串特异对象对一些内部方法进行了新的定义
[[GetOwnProperty]]
[[DefineOwnProperty]]
[[OwnPropertyKeys]]
StringCreate
StringGetOwnProperty

字符串奇异对象具有与普通对象相同的内部插槽。 它们还具有[[StringData]]内部插槽。

### Argument Exotic Objects
参数对象的数组索引属性映射到与其关联的函数调用时的各个参数上。

插槽 [[ParameterMap]] ，Object.prototype.toString.call(arguments) // "[object Arguments]"

内部方法进行了新的定义
[[GetOwnProperty]]
[[DefineOwnProperty]]
[[Get]]
[[Set]]
[[Delete]]
CreateUnmappedArgumentsObject
CreateMappedArgumentsObject


### Integer-Indexed Exotic Objects
整数索引的奇异对象是对整数索引属性键执行特殊处理的奇异对象。
特殊内部插槽：
[[ViewedArrayBuffer]]
[[ArrayLength]]
[[ByteOffset]]
[[TypedArrayName]]

内部方法进行了新的定义
[[GetOwnProperty]]
[[HasProperty]]
[[DefineOwnProperty]]
[[Get]]
[[Set]]
[[OwnPropertyKeys]]
IntegerIndexedObjectCreate
IntegerIndexedElementGet 
IntegerIndexedElementSet

### Module Namespace Exotic Objects
特殊内部插槽：

[[Module]]
[[Exports]]
[[Prototype]]


### Immutable Prototype Exotic Objects
原型不可变特异对象。此处是Object.prototype，它是所有正常对象的默认原型，已经不可能给它设置原型了


### Proxy Object
内部插槽：

[[ProxyHandler]]
[[ProxyTarget]]
