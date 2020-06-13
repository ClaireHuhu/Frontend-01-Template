const EOF = Symbol('EOF');
const css = require('css');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{ type: "document", children: [] }] // 方便提取整个dom树;document.getElementsByTagName('html')[0].parentNode =>document
let rules = []; // css rulues

function emit(token) {

    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = { // 创建 元素
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;

        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCSS(element);  // 创建元素后,开始计算该元素的样式

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;

        console.log('push', element)
    } else if (token.type === 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match");
        } else {
            // 出栈时,保证 属性 已经挂在到 element 上
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop();            
        }
    } else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
            // console.log(top.children)

    }
}

// -------------------------------- html 解析 --------------------------------------

function data(c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
        return;
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data;
    }
}

function tagOpen(c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else {
        return;
    }
}

function tagName(c) {
    if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        emit(currentToken);
        return data;
    } else if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName = currentToken.tagName + c;
        return tagName;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function afterAttributeName(c) {
    if (c == "/") {
        return selfClosingStartTag
    } else {
        emit(currentToken)
        return data
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\n\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "\"") {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else if (c === '>') {

    } else {
        return UnquotedAttributeValue(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\n\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}


function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c);
    } else if (c.match('>')) {

    } else if (c === EOF) {

    } else {

    }
}

function selfClosingStartTag(c) {
    if (c === '>' || c === '/') {
        currentToken.isSelfClosing = true;
        // currentToken.type = 'selfClosingTag';
        emit(currentToken);
        return data
    } else if (c === EOF) {

    } else {
        return beforeAttributeName
    }
}

// -------------------------------- css 解析---------------------------------------
function addCSSRules (string) {
    var ast = css.parse(string);
    console.log(JSON.stringify(ast));
    rules.push(...ast.stylesheet.rules);
}

function computeCSS (element) {
    const elements = stack.slice().reverse();  // 复制,从当前堆栈中获得 当前元素 及其 父元素

    for(let rule of rules) {
        let selectors = rule.selectors[0].split(" ").reverse();

        if (!match(selectors[0],element)) {   // 当前的元素 一定匹配 最后的选择器
            continue;
        }

        let i = 1;
        let matched = false;
        for (let j = 0; j < elements.length ;j ++) {
            if (match(selectors[i],elements[j])) {
                i ++;
            }
        }

        if(i >= selectors.length) {
            matched = true;
        }

        
        if (matched) { // 匹配成功
            const sp = specificity(rule.selectors[0]);

            if(!element.computedStyle) {
                element.computedStyle = {};
            }

            rule.declarations.forEach(function(item) {
                if (!element.computedStyle[item.property]) {
                    element.computedStyle[item.property] = {};
                }
                if(!element.computedStyle[item.property].specificity) {
                    element.computedStyle[item.property].value = item.value;
                    element.computedStyle[item.property].specificity = sp;
                } else if (compare(element.computedStyle[item.property].specificity,sp) < 0){
                    element.computedStyle[item.property].value = item.value;
                    element.computedStyle[item.property].specificity = sp;
                }
            })
            console.log("Element", element)
        }
        
    }
}

function match (selector, element) {
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector[0] === '#') {
        var attr = element.attributes.filter(item =>{return item.name === 'id'})[0];
        if(attr && attr.value === selector.replace('#','')) {
            return true
        }
    } else if (selector[0] === '.') {
        var attr = element.attributes.filter(item =>{return item.name === 'class'})[0];
        if(attr && (attr.value.indexOf(selector.replace('.',''))!= -1)) {
            return true
        }
    } else {
        if (selector === element.tagName) {
            return true
        }
    }
    return false
}

function specificity(selector) {
    const sp = [0,0,0,0];
    var selectorParts  = selector.split(' ');
    for (let part of selectorParts ) {
        if (part[0] === '#') {
            sp[1] += 1
        } else if (part[0] === '.') {
            sp[2] += 1
        } else {
            sp[3] += 1
        }
    }

    return sp;
}

function compare(sp1,sp2) {
    if (sp1[1] - sp2[1]) {                // 比较 specificity
        return sp1[1] - sp2[1]
    }
    if (sp1[2] - sp2[2]) {
        return sp1[1] - sp2[1]
    }
    return sp1[3] -sp2[3]
}

module.exports.parseHTML = function(string) {
    console.log('--------res---------');
    console.log(string);

    let state = data;
    for (let c of string) {
        state = state(c);
    }

    state = state(EOF); //用Symbol标示结束，将状态机置为结束状态，避免状态机还处于等待状态

}