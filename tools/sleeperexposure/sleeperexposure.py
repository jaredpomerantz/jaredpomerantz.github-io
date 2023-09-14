import sleeperpy
import json
import matplotlib.pyplot as plt

username = "p0m1"

def getplayerfrequencies(username):
    file = open("C:/Users/pomer/Documents/website/allplayers.json")
    allplayers = json.load(file)

    account = sleeperpy.User.get_user(username)

    leagues = sleeperpy.Leagues.get_all_leagues(account['user_id'], 'nfl', 2023)

    numOfLeagues = len(leagues)

    playermap = {}
    for league in leagues:
        rosters = sleeperpy.Leagues.get_rosters(league['league_id'])
        for roster in rosters:
            if account['user_id'] == roster['owner_id']:
                for player in roster['players']:
                    try:
                        newplayer = allplayers[player]['full_name']
                    except KeyError:
                        newplayer = player
                    if newplayer in playermap:
                            playermap[newplayer] += 1
                    else:
                        playermap[newplayer] = 1
                break

    sorted_playermap = dict(reversed(sorted(playermap.items(), key=lambda x:x[1])))

    players = list(sorted_playermap.keys())[0:9]
    frequencies = list(sorted_playermap.values())[0:9]

    plt.bar(players, frequencies)
    plt.xlabel("Player Name")
    plt.ylabel("Frequency")
    plt.title("Highest owned players for " + username + " in their " + str(numOfLeagues) + " leagues")
    plt.show()

    return sorted_playermap


sorted_playermap = getplayerfrequencies(username)