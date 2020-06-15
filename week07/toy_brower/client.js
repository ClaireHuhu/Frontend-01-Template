const net = require('net');
const parser = require('./parser.js');
const render = require('./render.js');
const images = require("images");

class Request {
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (this.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map((key) => {
                return `${key}=${this.body[key]}`
            }).join('&')
        } else if (this.headers['Content-Type'] == 'application/json') {
            this.bodyText = JSON.parse(this.body);
        }
        this.headers['Content-length'] = this.bodyText.length;
    }
    toString() {
        var headersText = Object.keys(this.headers).map((key) => {
            return `${key}:${this.headers[key]}`
        }).join('\r\n')
        return `${this.method} ${this.path} HTTP/1.1\r\nHost: ${this.host}\r\n${headersText}\r\n\r\n${this.bodyText}`
    }
    send() {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                var connection = net.createConnection({
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })

                connection.on('data', (data) => {
                    parser.receive(data.toString()); // 将返回的响应传给  ResponseParser ，
                    if (parser.isFinished) {
                        resolve(parser.response);
                    }
                    connection.end();
                });

                connection.on('error', (data) => {
                    reject(data);
                    connection.end();
                });
            }
        })
    }
}

class ResponseParser {
    constructor() {
        this.isFinish = false;
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_VALUE = 3;
        this.WAITING_HEADER_SPACE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/\d.\d (\d+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('').replace('\r\n', '')
        }
    }
    receive(str) {
        for (var i = 0; i < str.length; i++) {
            this.receiveChar(str[i])
        }
    }
    receiveChar(char) {
        if (this.current == this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine = this.statusLine + char;
            }
        } else if (this.current == this.WAITING_STATUS_LINE_END) {

            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current == this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === String.fromCharCode(13)) { // windows
                this.bodyParser = new TrunkedBodyParser();
                this.current = this.WAITING_HEADER_BLOCK_END
            } else {
                this.headerName = this.headerName + char;
            }
        } else if (this.current == this.WAITING_HEADER_SPACE) {

            if (char === ' ') {

                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current == this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue = this.headerValue + char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current == this.WAITING_HEADER_BLOCK_END) {
            if (char == '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current == this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_END = 1;
        this.READ_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.current = this.WAITING_LENGTH;
        this.length = 0;
        this.isFinished = false;
        this.content = [];
    }
    get isFinish() {
        return this.isFinished;
    }
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                this.current = this.WAITING_LENGTH_END;
            } else {
                this.length = this.length * 16; // 16进制
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_END) {
            if (char === '\n') {
                if (this.length === 0) {
                    this.isFinished = true;
                } else {
                    this.current = this.READ_TRUNK;
                }
            }
        } else if (this.current === this.READ_TRUNK) {
            this.length--;
            this.content.push(char);
            if (this.length === 0) {

                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {

                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void async function() {
    var re = new Request({
        port: 8001,
        host: '127.0.0.1',
        body: {
            a: 1
        },
    });
    var response = await re.send();
    var dom = parser.parseHTML(response.body); // 解析之后的响应 body 部分传给 parser

    // render成图片
    let viewport = images(800, 600);
    let divDom = dom.children[0].children[2].children[1].children[3];
    render(viewport, divDom)
    viewport.save("viewport.jpg");
    console.log('-------dom---------');
    console.log(dom);
}()




// --------------------------------------------------------------------------------------

// const net = require('net');

// const client = net.createConnection({
//     port: 8001
// }, () => {
//     console.log('connected to server!');
//     client.write('POST / HTTP/1.1\r\n');
//     client.write('Host:127.0.0.1\r\n');
//     client.write('Content-Length:3\r\n');
//     client.write('Content-Type:application/x-www-form-urlencoded\r\n');
//     client.write('\r\n');
//     client.write('a=1')
//     client.write('\r\n');
// });
// client.on('data', (data) => {
//     console.log('---------s----------')
//     console.log(data.toString());   // 响应报文
//     console.log('---------e--------')
//     client.end();
// });
// client.on('end', () => {
//     console.log('disconnected from server');
// });


// -------------------------------------------------------------------------------------

// const http = require('http');
// http.get({
//     port: 8001,
//     path: '/',
//     headers: {
//         accept: 'application/plain'
//     }
// }, (res) => {
//     console.log('res ---------------------s')
//    console.log(res)
// }).on('error', (e) => {
//   console.error(`Got error: ${e.message}`);
// });