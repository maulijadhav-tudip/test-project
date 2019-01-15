from app import flaskapp
from flask import request, Response
from bson import json_util
import json
import requests
from .login import *
from werkzeug import secure_filename
import os
import csv
from .ravello import *

@flaskapp.route('/api/mode', methods=['POST', 'GET'])
def mode():
    settings = flaskapp.config['SETTINGS_COLLECTION'].find_one()
    if request.method == "GET":
        return json.dumps(settings['mode'], default=json_util.default)

    if request.method == 'POST':
        flaskapp.config['SETTINGS_COLLECTION'].update_one({
            '_id': settings['_id']
        },
            {'$set': {"mode": request.form['mode']
                      }}, upsert=True)
        return Response("OK")

@flaskapp.route('/api/userquestions', methods=['POST', 'GET'])
def userquestions():
    settings = flaskapp.config['SETTINGS_COLLECTION'].find_one()
    if request.method == "GET":
        # return json.dumps(settings['userquestions'], default=json_util.default)
        return json.dumps("OK")

    if request.method == 'POST':
        flaskapp.config['SETTINGS_COLLECTION'].update_one({
            '_id': settings['_id']
        },
            {'$set': {"userquestions": request.form['userquestions']
                      }}, upsert=True)
        return Response("OK")

@flaskapp.route('/api/settings', methods=['POST', 'GET'])
@login_required(role="admin")
def settings():
    settings = flaskapp.config['SETTINGS_COLLECTION'].find_one()

    if request.method == "GET":
        return json.dumps(settings, default=json_util.default)

    if request.method == 'POST':
        cursor = flaskapp.config['SETTINGS_COLLECTION'].find()
        print("**********************",request.form)
        flaskapp.config['SETTINGS_COLLECTION'].update_one({
            '_id': settings['_id']
        },
            {'$set': {"title": request.form['title'],
                      "welcome": request.form['welcome'],
                      "logo": request.form['logo'],
                      "userquestions" : request.form['userquestions'] == "true"
                      }}, upsert=True)
        return Response("OK")

@flaskapp.route('/api/title')
def title():
    settings = flaskapp.config['SETTINGS_COLLECTION'].find_one()
    data = {"title":settings['title'], "welcome":settings['welcome'], "logo":settings['logo']}
    return json.dumps(data, default=json_util.default)


@flaskapp.route('/api/buckets', methods=['POST', 'GET'])
@login_required(role="admin")
def buckets_view():
    settings = flaskapp.config['SETTINGS_COLLECTION'].find_one()
    if request.method == "GET":
        return buckets()
    if request.method == "POST":
        flaskapp.config['SETTINGS_COLLECTION'].update_one({
            '_id': settings['_id']
        },
            {'$set': {"bucket": json.loads(request.form['bucket'])
                      }}, upsert=True)
        return Response("OK")
