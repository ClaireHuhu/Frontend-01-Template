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
    res.end(`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
          background: "red"
        }
    </style>
</head>
<body>
</body>
</html>`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});