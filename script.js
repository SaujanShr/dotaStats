function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

async function updateDatabase()
{
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

    // Get a list of hero data.
    // [pos, heroName, playRate, winRate]
    let heroData = []
    for(let i = 0; i < heroList.length; i++)
    {
        html = httpGet("https://dota2protracker.com/hero/" + heroList[i].split(" ").join("%20"));
        htmlDoc = parser.parseFromString(html, 'text/html');

        let heroRoleHeaders = htmlDoc.querySelector('[*|class="content-box-lvl-2 roles"]')
                                     .getElementsByClassName("content-box-header");

        for (let i = 0; i < heroRoleHeaders.length; i++)
        {
            let role = heroRoleHeaders.querySelector('[*|class="header-role-info"]')
                                      .textContext;
            console.log(role);
        }
    }
}