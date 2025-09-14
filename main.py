import json, os
from flask import Flask, request, jsonify
from threading import Lock

app = Flask(_name_)
SAVE_FILE="players.json"
lock=Lock()

def load_players():
    if os.path.exists(SAVE_FILE):
        with open(SAVE_FILE,"r") as f: return json.load(f)
    return {}

def save_players(players):
    with open(SAVE_FILE,"w") as f: json.dump(players,f)

@app.route("/login", methods=["POST"])
def login():
    data=request.json; name=data.get("username")
    if not name: return jsonify({"error":"No username"}),400
    with lock:
        players=load_players()
        if name not in players:
            players[name]={"name":name,"gold":50,"food":30,"soldiers":0,"knights":0,
                           "buildings":{"farm":0,"mine":0,"barracks":0,"stable":0},"wins":0,"attackCount":0}
            save_players(players)
        return jsonify(players[name])

@app.route("/update", methods=["POST"])
def update():
    data=request.json; name=data.get("username"); pdata=data.get("data")
    if not name or not pdata: return jsonify({"error":"Invalid"}),400
    with lock: players=load_players(); players[name]=pdata; save_players(players); return jsonify({"status":"success"})

@app.route("/attack", methods=["POST"])
def attack():
    data=request.json; attacker=data.get("attacker"); defender=data.get("defender")
    if not attacker or not defender: return jsonify({"error":"Invalid"}),400
    with lock:
        players=load_players()
        if attacker not in players or defender not in players: return jsonify({"error":"Player not found"}),404
        atk=players[attacker]; defd=players[defender]
        atk_power=atk["soldiers"]*2+atk["knights"]*5; def_power=defd["soldiers"]*2+defd["knights"]*5
        if atk_power>def_power:
            atk["wins"]+=1; atk["gold"]+=10; atk["food"]+=5
            defd["soldiers"]=max(0,defd["soldiers"]-1); defd["knights"]=max(0,defd["knights"]-1)
            result="Victory"
        else:
            atk["soldiers"]=max(0,atk["soldiers"]-1); atk["knights"]=max(0,atk["knights"]-1)
            result="Defeat"
        players[attacker]=atk; players[defender]=defd; save_players(players)
        return jsonify({"result":result,"attacker":atk,"defender":defd})

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    players=load_players()
    lb=sorted(players.values(), key=lambda x:x["wins"], reverse=True)[:10]
    return jsonify(lb)

if _name=="main_": app.run(port=5000)
