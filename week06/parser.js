const EOF = Symbol('EOF');

let currentToken = null;

function emit(token) {
    if (token.type != 'text') {
        console.log(token);
    }
}

function data(c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        // todo emit
        return;
    } else {
        return data;
    }
}

function tagOpen(c) {
    if (c === '/') {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        // todo Create a new start tag token, set its tag name to the empty string
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
    } else if (c === '=') {
        return beforeAttributeName
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else if (c === '/') {
        return selfClosingStartTag;
    } else {
        return beforeAttributeName
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
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