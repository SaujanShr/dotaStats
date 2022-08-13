function httpGet(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false); // False for synchronous request
    xhttp.send(null);
    return xhttp.responseText;
}

function queryServer(url, dataType, data)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/" + dataType, false);
    xhttp.send(data);
    return xhttp.responseText;
}

async function updateDatabase()
{
    console.log("Updating...");
    let parser = new DOMParser();
    let html = httpGet("https://dota2protracker.com/");
    let htmlDoc = parser.parseFromString(html, 'text/html');

    // Get list of heroes.
    let heroTable = htmlDoc.querySelector('[*|class="table-wrapper table-small top-hero-table"]')
                           .getElementsByClassName("td-hero-pic");
    let heroList = [];
    for (let i = 0; i < heroTable.length; i++)
    {
        heroList.push(heroTable[i].getAttribute("data-order"));
    }

    // Get a list of all the hero data.
    // [heroName, position, playRate, winRate]
    let heroData = []
    for(let i = 0; i < heroList.length; i++)
    {
        html = httpGet("https://dota2protracker.com/hero/" + heroList[i].split(" ").join("%20"));
        htmlDoc = parser.parseFromString(html, 'text/html');

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

    let queryStr = `DROP SCHEMA IF EXISTS dota2database;
                    CREATE SCHEMA dota2database;
                    USE dota2database;
                    CREATE TABLE heroList (
                        Hero VARCHAR(255)
                        Position VARCHAR(255)
                        Playrate VARCHAR(255)
                        Winrate VARCHAR(255)
                    );`

    for (let i = 0; i < heroData.length; i++)
    {
        queryStr += "INSERT INTO heroList VALUES ('" + heroData[0] + "' , '" + heroData[1] + "', '" + heroData[2] + "', '" + heroData[3] + "');";
    }

    queryServer("localhost:3000", "update", queryStr);
}