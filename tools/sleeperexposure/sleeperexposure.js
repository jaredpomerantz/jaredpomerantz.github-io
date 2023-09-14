
async function findexposures(username) {
    document.getElementById("container").replaceChildren()
    document.getElementById("container").innerHTML = "<img id='loadinggif' src='loading.gif'>"

    allplayers = localStorage.getItem('allplayers')
    const response = await fetch("https://api.sleeper.app/v1/user/" + username);
    
    allplayers = JSON.parse(allplayers)
    
    data = await response.json();

    try {
        user_id = data['user_id']
    }
    catch {
        document.getElementById("container").replaceChildren()
        document.getElementById("container").innerHTML = "<h4><b>Username not found! Please try a different username.</b></h4>"
        return
    }

    
    const response2 = await fetch("https://api.sleeper.app/v1/user/" + user_id + "/leagues/nfl/2023")
    leagues = await response2.json();
    numOfLeagues = leagues.length

    if (numOfLeagues == 0) {
        document.getElementById("container").replaceChildren()
        document.getElementById("container").innerHTML = "<h4><b>No leagues were found for the username " + username + ". Please try a different username.</b></h4>"
        return
    }

    playermap = {}
    for (i = 0; i < numOfLeagues; i++) {
        const rostersresponse = await fetch("https://api.sleeper.app/v1/league/" + leagues[i]['league_id'] + "/rosters")
        rosters = await rostersresponse.json()
        numOfRosters = rosters.length
        for (j = 0; j < numOfRosters; j++) {
            if (rosters[j]["owner_id"] == user_id) {
                numOfPlayers = rosters[j]["players"].length
                for (k = 0; k < numOfPlayers; k++) {
                    player = rosters[j]["players"][k]
                    
                    newplayer = allplayers[player]['full_name'] + ", " + allplayers[player]['position'] + ", " + allplayers[player]['team']
                    
                    if (allplayers[player]['full_name'] == null) {
                        newplayer = player + ", Defense, " + player
                    }
                    
                    if (newplayer in playermap) {
                        playermap[newplayer] = playermap[newplayer] + 1
                    }
                    else {
                        playermap[newplayer] = 1
                    }

                }
            break
            }
        }
    }
    var items = Object.keys(playermap).map(function(key) {
        return [key, playermap[key]];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    var chart = anychart.bar()
    if (items.length >= 51) {
        items = items.slice(0, 50)
    }

    colormap = {
        "BAL": "#241773",
        "CIN": "#FB4F14",
        "CLE": "#FF3C00",
        "PIT": "#FFB612",
        "BUF": "#00338D",
        "MIA": "#008E97",
        "NE": "#002244",
        "NYJ": "#125740",
        "HOU": "#03202F",
        "IND": "#002C5F",
        "JAX": "#D7A22A",
        "TEN": "#0C2340",
        "DEN": "#FB4F14",
        "KC": "#E31837",
        "LV": "#000000",
        "LAC": "#0080C6",
        "CHI": "#0B162A",
        "DET": "#0076B6",
        "GB": "#203731",
        "MIN": "#4F2683",
        "DAL": "#003594",
        "NYG": "#0B2265",
        "PHI": "#004C54",
        "WAS": "#5A1414",
        "ATL": "#A71930",
        "CAR": "#0085CA",
        "NO": "#D3BC8D",
        "TB": "#D50A0A",
        "ARI": "#97233F",
        "LAR": "#003594",
        "SF": "#AA0000",
        "SEA": "#002244",
        "null": "#A19F9C"
    }

    maxval = items[0][1]
    
    minval = items[items.length - 1][1]

    console.log(maxval)
    console.log(minval)


    for (i = 0; i < items.length; i++) {
        newval = items[i][1]
        newcolor = anychart.color.lighten("#0e55c7", 0.5 * (maxval - newval) / (maxval - minval))
        items[i].push(newcolor)
    }

    console.log(items)

    var data = anychart.data.set(items)
    var seriesdata = data.mapAs({x: 0, value: 1, fill: 2})
    

    document.getElementById("container").replaceChildren()

    series = chart.bar(seriesdata)
    chart.container('container')
    
    chart.barGroupsPadding(0.4)
    chart.maxPointWidth("50px")
    chart.title("Most Frequently Owned Players for " + username + " in Their " + numOfLeagues + " Leagues on Sleeper")
    chart.yAxis().orientation("top")
    chart.yAxis().title("Number of Shares")
    chart.yGrid().enabled(true);
    chart.yAxis().labels().fontColor("black")
    chart.yAxis().labels().fontWeight("bold")
    chart.yScale().ticks().interval(1)
    series.name("Player Frequency")

    heightperdatapoint = 30

    height = items.length * heightperdatapoint

    heightstring = height + "px"

    document.getElementById("container").style.height = heightstring;
    
    chart.draw()
    

}  
