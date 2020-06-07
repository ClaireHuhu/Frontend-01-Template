const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;

function emit(token) {
    if (token.type != 'text') {
        console.log(token);
    }
}

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
        currentToken.type = 'selfClosingTag';
        emit(currentToken);
        return data
    } else if (c === EOF) {

    } else {
        return beforeAttributeName
    }
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