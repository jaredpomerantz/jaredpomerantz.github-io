import pandas as pd
import json

df = pd.read_json("C:/Users/pomer/Documents/website/allplayers.json").transpose()
output = pd.DataFrame([df.full_name, df.position, df.team])

jsonoutput = output.to_json()
print(jsonoutput)
with open("C:/Users/pomer/Documents/website/refined.json", "w") as outfile:
    json.dump(jsonoutput, outfile)