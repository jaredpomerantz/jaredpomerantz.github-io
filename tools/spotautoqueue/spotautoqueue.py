import spotipy
import time
from spotipy.oauth2 import SpotifyOAuth

scope = ["user-read-currently-playing", "app-remote-control", "streaming", "playlist-read-private", "playlist-read-collaborative", "user-modify-playback-state", "user-read-playback-state"]

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

sequencemap = {"2SLwbpExuoBDZBpjfefCtV": "1NhjYYcYTRywc0di98xHxf", "0YFqKxV9uNu6LUeYkLOKRS": "0vjeOZ3Ft5jvAi9SBFJm1j", "1SkzK37qLSi7Sp6PwYTC0A": "5FEXPoPnzueFJQCPRIrC3c"}

current_song = None
current_song_id = None

while True:
    print("-----------------------------------------------")
    try:
        temp = sp.current_user_playing_track()
        queue = sp.queue()
        if current_song_id != temp['item']['id']:
            current_song = temp
            current_song_id = current_song['item']['id']
            if current_song_id in sequencemap and queue['queue'][0]['id'] != current_song_id:
                sp.add_to_queue(sequencemap[current_song_id])
        print("Now Playing:")
        print(current_song_id + ": " + current_song['item']['name'])
        print()
        print("Queue:")
        for i in range(3):
            print(queue['queue'][i]['id'] + ": " + queue['queue'][i]['name'])

    except TypeError:
        print("music currently paused")
  
    time.sleep(5)