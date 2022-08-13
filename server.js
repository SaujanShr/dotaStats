const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

function getPage(res)
{
    fs.readFile('page.html', (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else {
            res.write(data);
        }
    });
}

function update(req)
{
    let body = "";
    req.on('data', function(data) {
        body += data;
    })
    req.on('end', function() {
        if (body != "")
            query(body);
        console.log("Post received.");
    })
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    res.setHeader('Content-Type', 'text/html');

    switch(req.url)
    {
        case '/favicon.ico':
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            break;
        case '/':
            fs.readFile('page.html', (err, data) => {
                if (err)
                {
                    console.log(err);
                    res.end();
                }
                else {
                    res.write(data);
                    res.end();
                }
            });
            break;
        case '/update':
            update(req);
            res.end();
            break;
    }   
});

server.listen(3000, 'localhost', () => {
    console.log("Listening for requests.")
});



function connectSQL(host, username, password) { 
    var con = mysql.createConnection({
        host: host,
        user: username,
        password: password
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    return con;
}

var con = connectSQL("localhost", "client", "Hahoo123");

function query(statement)
{
    con.query(statement, function(err, result)
    {
        if (err) throw err;
        console.log("Result: " + result);
    });
}