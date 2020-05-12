
本周作业
1) 写一个正则表达式 匹配所有 Number 直接量
```JavaScript
const DecimalLiteral = /(^(0|([1-9]\d+))\.(\d+)?([eE][\+-]?\d+)?$)|(^\.\d+([eE][\+-]?\d+)?$)|(^(0|([1-9]\d+))([eE][\+-]?\d+)?$)/;
const BinaryIntegerLiteral = /^(0b|0B)[01]+$/;
const OctalIntegerLiteral = /^(0o|0O)[0-7]+$/;
const HexIntegerLiteral = /^(0x|0X)[0-9a-fA-F]+$/;

const NumericLiteral = /((^(0|([1-9]\d+))\.(\d+)?([eE][\+-]?\d+)?$)|(^\.\d+([eE][\+-]?\d+)?$)|(^(0|([1-9]\d+))([eE][\+-]?\d+)?$))|(^(0b|0B)[01]+$)|(^(0o|0O)[0-7]+$)|(^(0x|0X)[0-9a-fA-F]+$)/;
```

2) 写一个 UTF-8 Encoding 的函数
```JavaScript
function encoding(code) {
    var length = code.length;
    var res = [];
   
    if(length < 8) {
        for(let i=0;i<8 - length;i++){
          code = '0'+code
        }
        res.push(code)
    } else {
        let num = Math.floor(length / 6);
        let total = num * 6 + (6 - num );
        let pre = '';
      
        for(let i=0;i<total - length;i++) {
          code = '0' + code;
        }
        let tem = code;
        while(tem.length > 6) {
          res.unshift('10'+ tem.substring(tem.length - 6,tem.length+1));
          tem = tem.substring(0, tem.length - 6)
        }
        for(let j=0;j<num;j++){
          pre = '1'+pre;
        }
     
       res.unshift(pre+'10'+tem);
    }
  return res
}
function UTF8_Encoding(string){
    var res = [];
    for(let i=0;i< string.length;i++) {
        let code = string.charCodeAt(i).toString(2);
        let test = encoding(code)
        res = res.concat(test);
    }
    return res;
}
UTF8_Encoding('测')
```
3 )写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
```JavaScript

const DoubleStringCharacter1 = /[^"\\\n\r]/;
const DoubleStringCharacter2 = /\\((['"\\bfnrtv]|([^0-9xu'"\\bfnrtv\u000A\u000D\u2028\u2029]))|((?<![0-9])0)|(x[0-9a-fA-F]{2})|((u[0-9a-fA-F]{4})|(u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})})))/;
const DoubleStringCharacter3 = /\\(\u000A|((?<!\u000A)\u000D)|\u2028|\u2029|(\u000D\u000A))/;


const StringLiteral = /^("(([^"\\\n\r]|(\\((['"\\bfnrtv]|([^0-9xu'"\\bfnrtv\u000A\u000D\u2028\u2029]))|((?<![0-9])0)|(x[0-9a-fA-F]{2})|((u[0-9a-fA-F]{4})|(u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))))|(\\(\u000A|((?<!\u000A)\u000D)|\u2028|\u2029|(\u000D\u000A))))+)?")|('(([^'\\\n\r]|(\\((['"\\bfnrtv]|([^0-9xu'"\\bfnrtv\u000A\u000D\u2028\u2029]))|((?<![0-9])0)|(x[0-9a-fA-F]{2})|((u[0-9a-fA-F]{4})|(u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))))|(\\(\u000A|((?<!\u000A)\u000D)|\u2028|\u2029|(\u000D\u000A))))+)?')$/;

```
4) 完成一篇本周的学习总结
