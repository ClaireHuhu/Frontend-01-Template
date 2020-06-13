const http = require('http');

const hostname = '127.0.0.1';
const port = 8001;

const server = http.createServer((req, res) => {
    console.log('req--------------------s');
    console.log(req.headers);
    console.log('req--------------------e');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'application/plain' });
    res.end(`<html maaa=a >
    <head>
        <style>
        #container{
            width:500px;
            height:300px;
            display:flex;
            background-color:rgb(255,255,255);
        }
        #container #myid{
          width:200px;
          height:100px;
          background-color:rgb(255,0,0)
        }
        #container .c1{
          flex:1;
          background-color:rgb(0,255,0)
        }
        </style>
    </head>
    <body>
        <div id="container">
            <div id="myid"></div>
            <div class="c1"></div>
        </div>
    </body>
    </html>`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});