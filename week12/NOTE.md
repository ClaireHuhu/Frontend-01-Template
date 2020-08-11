```
<AdditionExpression> ::=
	<MultiplicationExpression> |
    <AdditionExpression> "+" <MultiplicationExpression> |
    <AdditionExpression> "-" <MultiplicationExpression>

<MultiplicationExpression> ::=
	<Number> |
    <MultiplicationExpression> "*" <Number> |
    <MultiplicationExpression> "/" <Number>

// Number 我们先不搞太复杂，直接用正则来表示吧。
// 只有带小数点和不带小数点两种
<Number> ::= (?:0|[1-9][0-9]*)\.[0-9]*|(?:0|[1-9][0-9]*)
```