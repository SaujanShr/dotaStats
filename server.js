const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const axios = require("axios");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.use(cors({
    origin: '*'
}));

// Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => 
{
    res.render(__dirname + "/views/page.ejs");
});

app.get("/update", (req, res) =>
{
    updateDatabase();
})

app.listen(3000);

var con = connectSQL("localhost", "client", "Hahoo123");

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

function query(statement)
{
    con.query(statement, function(err, result)
    {
        if (err) throw err;
        console.log("Result: " + result);
        return result;
    });
}

async function htmlGet(url)
{
    return await axios.get(url);
}

/*
function htmlGet(url)
{
    var options = {
        host: url,
        port: 80,
        path: '/',
        method: 'GET'
      };

      https.get("https://www.google.com/index.html", function(res) {
        console.log(res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(data) {
            console.log(data);
        });
        }).on('error', function(err) {
            console.log(err);
        });
}*/

async function updateDatabase()
{
    console.log("Updating...");

    let html = await htmlGet("https://dota2protracker.com/");
    let htmlDoc = (new JSDOM(html.data)).window.document;

    // Get list of heroes.
    let heroTable = htmlDoc.querySelector('[*|class="table-wrapper table-small top-hero-table"]')
                           .getElementsByClassName("td-hero-pic");
    
    let heroList = [];
    for (let i = 0; i < heroTable.length; i++)
    {
        heroList.push(heroTable[i].getAttribute("data-order"));
    }
    console.log(heroList);
    // Get a list of all the hero data.
    // [heroName, position, playRate, winRate]
    let heroData = [];
    /*
    for(let i = 0; i < heroList.length; i++)
    {
        console.log("Hero " + i + " scraping...")
        html = await htmlGet("https://dota2protracker.com/hero/" + heroList[i].split(" ").join("%20"));
        htmlDoc = (new JSDOM(html.data)).window.document;

        let heroRoleHeaders = htmlDoc.querySelector('[*|class="content-box-lvl-2 roles"]')
                                     .getElementsByClassName("content-box-lvl-3");

        for (let j = 0; j < heroRoleHeaders.length; j++)
        {
            let role = heroRoleHeaders[j].querySelector('[*|class="header-role-info"]')
                                         .textContent;
            if (role.includes("Most Played"))
                role = role.replace("Most Played", "");
            role = role.trim();

            let htmlRoleStats = heroRoleHeaders[j].querySelector('[*|class="header-role-stats"]')
                                                  .getElementsByClassName("stat-info");
            let roleStats = [];
            roleStats.push(htmlRoleStats[0].textContent);
            roleStats.push(htmlRoleStats[1].textContent);
            roleStats[0] = roleStats[0].substring(0, roleStats[0].indexOf("matches")).trim();
            roleStats[1] = roleStats[1].trim().substring(10).trim();

            heroData.push([heroList[i], role, roleStats[0], roleStats[1]]);
        }
    }
    
    console.log(heroData);

    let queryStr = `DROP DATABASE IF EXISTS dota2;
                    CREATE DATABASE dota2;
                    USE dota2;
                    CREATE TABLE heroList (
                        Hero VARCHAR(255),
                        Position VARCHAR(255),
                        Playrate VARCHAR(255),
                        Winrate VARCHAR(255)
                    );`

    for (let i = 0; i < heroData.length; i++)
    {
        queryStr += 'INSERT INTO heroList (Hero, Position, Playrate, Winrate) VALUES ("' + heroData[i][0] + '" , "' + heroData[i][1] + '", "' + heroData[i][2] + '", "' + heroData[i][3] + '");';
    }

    let queryArr = queryStr.split(";");
    for (let i = 0; i < queryArr.length; i++)
    {
        if (queryArr[i].trim() != "")
            query(queryArr[i]);
    }*/
}