const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    res.setHeader('Content-Type', 'text/html');
    fs.readFile('page.html', (err, data) => {
        if (err)
        {
            console.log(err);
            res.end();
        }
        else {
            res.end(data);
        }
    });
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