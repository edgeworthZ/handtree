from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
app.config['MONGO_URI'] = "mongodb://0.0.0.0:27017/test"
mongo = PyMongo(app)
treeCollection = mongo.db.mytree

@app.route('/', methods=['GET'])
@cross_origin()
def hello():
    return "Hello Succession";

@app.route('/tree/list', methods=['GET'])
@cross_origin()
def get_tree_list():
    query = treeCollection.find()
    output = []

    for ele in query:
        #data_inv = ele["inventory"]
        output.append({
            "name": ele["name"],
            "nickname": ele["nickname"],
            "today": int(ele["today"]),
            "alltime": int(ele["alltime"]),
            "inventory": ele["inventory"],
            "activetree": ele["activetree"],
            "activephase": int(ele["activephase"]),
            "day": int(ele["day"])
        })
    return {"result": output}

@app.route('/tree/wash/<user>',methods=['PATCH'])
@cross_origin()
def wash(user):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    counter_t = int(query["today"] + 1)
    counting_t = {"$set":{"today":counter_t}}
    treeCollection.update_one(query,counting_t)
    query = treeCollection.find_one_or_404(filt)
    counter_o = int(query["alltime"] + 1)
    counting_o = {"$set":{"alltime":counter_o}}
    treeCollection.update_one(query,counting_o)

    proc = False
    if counter_o == 20:
        nt = "ROSE"
        proc = True
    elif counter_o == 40:
        nt = "TULIP"
        proc = True
    elif counter_o == 60:
        nt = "CARNATION"
        proc = True
    
    if proc is True:
        query = treeCollection.find_one_or_404(filt)
        changing = {"$push":{"inventory":nt}}
        treeCollection.update_one(query,changing)
        return {'result': 'Handwashing counter updated & add new tree from achivement'}

    return {'result': 'Handwashing Counter Updated'}

@app.route('/tree/dailyreset',methods=['PATCH'])
@cross_origin()
def dailyreset():
    query = treeCollection.find()
    for ele in query:
        counting = {"$set":{"today":0}}
        treeCollection.update_one(ele,counting)
    return {'result': 'Daily Reset'}

@app.route('/tree/changenickname/<user>/<name>',methods=['PATCH'])
@cross_origin()
def changenickname(user,name):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"nickname":name}}
    treeCollection.update_one(query,changing)
    return {'result': 'Name changed'}

@app.route('/tree/addtree/<user>/<tree>',methods=['PATCH'])
@cross_origin()
def addtree(user,tree):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    '''inventory = query["inventory"]
    inventory.append("grass")
    ntree = []
    for tr in inventory:
        ntree.append(tr)
    ntree.append(tree)'''
    changing = {"$push":{"inventory":tree}}
    treeCollection.update_one(query,changing)
    return {'result': 'Add new tree'}

@app.route('/tree/changephase/<user>',methods=['PATCH'])
@cross_origin()
def changephase(user):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    phase = int(query["activephase"] + 1)
    changing = {"$set":{"activephase":phase}}
    treeCollection.update_one(query,changing)
    return {'result':'Phase changed'}

@app.route('/tree/updateday/<user>',methods=['PATCH'])
@cross_origin()
def updateday(user):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    day = int(query["day"] + 1)
    changing = {"$set":{"day":day}}
    treeCollection.update_one(query,changing)
    return {'result':'Day changed'}

@app.route('/tree/changetree/<user>/<tree>',methods=['PATCH'])
@cross_origin()
def changetree(user,tree):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"activetree":tree}}
    treeCollection.update_one(query,changing)
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"activephase":1}}
    treeCollection.update_one(query,changing)
    return {'result':'Tree changed'}

@app.route('/tree/reset/<user>',methods=['PATCH'])
@cross_origin()
def reset(user):
    filt = {"name":user}
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"activetree":"SUNFLOWER"}}
    treeCollection.update_one(query,changing)
    
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"activephase":1}}
    treeCollection.update_one(query,changing)
    
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"today":0}}
    treeCollection.update_one(query,changing)
    
    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"alltime":0}}
    treeCollection.update_one(query,changing)

    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"nickname":user}}
    treeCollection.update_one(query,changing)
    
    query = treeCollection.find_one_or_404(filt)
    default = ["Sunflower"]
    changing = {"$set":{"inventory":default}}
    treeCollection.update_one(query,changing)

    query = treeCollection.find_one_or_404(filt)
    changing = {"$set":{"day":1}}
    treeCollection.update_one(query,changing)

    return {'result': 'Reset a user'}
	
if __name__ == "__main__":
    app.run(host='0.0.0.0', port='55554', debug=True)
