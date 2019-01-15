# Contains main views for login and routing
from app import flaskapp
from flask import request, redirect, render_template, url_for,  Response
from bson import json_util
from werkzeug.security import generate_password_hash
import json
import time
import datetime
from .user import User
from .ravello import *
from .azure.functions import create_or_assign_azure_to_user
from .login import *
from .lists import verify_email
import logging

# Home page


@flaskapp.route('/api/login')
@login_required()
def login():
        auth = request.authorization
        user = flaskapp.config['USERS_COLLECTION'].find_one(
            {"email": auth['username']})

        if 'expirationTime' in user.keys() and user['expirationTime'] < datetime.datetime.utcnow():
            return jsonify({ "status": "Error"}), 403

        flaskapp.config['USERS_COLLECTION'].update_one({
            "email": auth['username']
        }, {
            '$set': {
                'loggedIn':  True
            }
        })

        token = generate_auth_token(user)
        if user['role'] == "student":
            if user['lab']['type'] == "ravello":
                create_or_assign_env_to_user(user)
            elif user['lab']['type'] == "azure":
                create_or_assign_azure_to_user(user)

        return jsonify({ "status": "OK",'token': token.decode('ascii'), 'role':user['role'] }), 200


@flaskapp.route('/api/userverify', methods=['POST'])
def verify_user():
    enteredClass = flaskapp.config['CLASS_COLLECTION'].find_one(
        {"secret": request.form['secret'], "id": request.form['id']})
    current = datetime.datetime.utcnow()

    if not enteredClass:
        return Response(""), 404 #Class does not exist

    if (enteredClass['startTime'] - datetime.timedelta(minutes=15)) < current and (enteredClass['endTime'] + datetime.timedelta(minutes=15)) > current:
        return json.dumps(enteredClass, default=json_util.default)

    else:
        return Response(""), 400 #Class currently not in session


@flaskapp.route('/api/userregister', methods=['POST'])
def register_user():
    if flaskapp.config['USERS_COLLECTION'].find_one({"email": request.form['email']}):
        return Response(""), 400

    if verify_email(request.form['email']):
        enteredClass = flaskapp.config['CLASS_COLLECTION'].find_one(
            {"secret": request.form['secret'], "id": request.form['id']})
        flaskapp.config['CLASS_COLLECTION'].update_one(
            {"secret": enteredClass['secret'],
                "id": enteredClass['id']},
            {'$inc': {"active": 1}})

        current = datetime.datetime.utcnow()
        duration = int((enteredClass['endTime'] -
                        current + datetime.timedelta(minutes=15)).total_seconds() / 60)

        user = flaskapp.config['USERS_COLLECTION'].find_one(
            {"email": request.form["email"]})
        if user:
            if user['lab']['type'] == "ravello":
                delete_app_by_email(request.form["email"])
            elif user['lab']['type'] == "azure":
                delete_azure_by_email(request.form["email"])

        flaskapp.config['USERS_COLLECTION'].delete_many({
            'email': request.form['email']
        })
        flaskapp.config['USERS_COLLECTION'].insert_one(
            {"email": request.form['email'],
             "password": generate_password_hash(request.form['password'], method='pbkdf2:sha256'),
             "role": "student",
             "duration": duration,
             "createdApp": False,
             "createdToken": False,
             "token": "",
             "env": "",
             "tokenID": "",
             "loggedIn": True,
             "sfdc": enteredClass['sfdc'],
             "startTime": enteredClass['startTime'] - datetime.timedelta(minutes=15),
             "endTime": enteredClass['endTime'] + datetime.timedelta(minutes=int(enteredClass['endBuffer'])),
             "publishedTime": "",
             "lab": enteredClass['lab']

             })

        user = flaskapp.config['USERS_COLLECTION'].find_one(
            {"email": request.form['email']})


        # Create an entry for archival purposes
        student = {
            "classId": request.form['id'],
            "className": enteredClass['name'],
            "firstName": request.form['first'],
            "lastName": request.form['last'],
            "email": request.form['email'],
            "loginTime": current,
            "sfdc": enteredClass['sfdc'],
            "company": request.form['company'],
            "title": request.form['title'],
            "GPDR1": request.form['GPDR1'],
            "GPDR2": request.form['GPDR2'],
        }
        flaskapp.config['CLASS_ARCHIVES'].insert_one(student)

        token = generate_auth_token(user)
        if user['role'] == "student":
            if user['lab']['type'] == "ravello":
                publish_or_assign_env_to_user(user,enteredClass)
            elif user['lab']['type'] == "azure":
                create_or_assign_azure_to_user(user)

        return jsonify({ "status": "OK",'token': token.decode('ascii'), 'role':user['role'] }), 200

    return Response(""), 401


# Get current user


@flaskapp.route('/api/user')
@login_required(role=["student", "admin", "instructor"])
def get_current_user():
    auth = request.authorization
    user = verify_auth_token(auth['username'])
    return json.dumps(user, default=json_util.default)

# Get Time on server


@flaskapp.route('/api/time')
def server_time():
    return datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')


@flaskapp.route('/api/ravello/create-tests', methods=['POST'])
def create_template():
    # print(request.data)
    print('*******************8', request.form['name'])
    test_template = {
            "name": request.form['name'],
            "description":request.form['description'],
            "testnames":["test1",
                         "test2",
                         "test3"],
            "testparams":{

                    "vmname":request.form["vmname"],
                    "vmusername":request.form["vmusername"],
                    "vmpassword": request.form["password"]
            }
         }
    flaskapp.config['TEST_COLLECTION'].insert_one(test_template)
    return jsonify({"status": "OK"}), 200


@flaskapp.route('/api/ravello/create-tests', methods=['GET'])
def get_details():
    a = flaskapp.config['TEST_COLLECTION'].find()
    list_details = []
    for i in a:
        list_details.append({"name":i['name'],"description":i['description']})
    return jsonify({"test_details":list_details}), 200


# create test template
@flaskapp.route('/api/ravello/test-template', methods=['POST'])
def create_template():
    test_template = {
            "name": request.form['name'],
            "description": request.form['description'],
            "testNames": ["test1",
                         "test2",
                         "test3"],
            "testParams":{

                    "vmname": request.form["vmname"],
                    "vmusername": request.form["vmusername"],
                    "vmpassword": request.form["password"]
            }
         }
    flaskapp.config['TEST_COLLECTION'].insert_one(test_template)
    return jsonify({"status": "OK"}), 200


# test collection details
@flaskapp.route('/api/ravello/test-templates', methods=['GET'])
def get_details():
    tests = flaskapp.config['TEST_COLLECTION'].find()
    list_details = []
    for i in tests:
        list_details.append({"name": i['name'],"description": i['description']})
    return jsonify({"test_details":list_details}), 200


# create environment
@flaskapp.route('/api/ravello/env-create',methods=['GET'])
def create_env():
    my_env = [{"name": env} for env in ["Env A", "Env B", "Env C", "Env D", "Env E"]]
    flaskapp.config['ENV_COLLECTION'].insert(my_env)
    return jsonify({'ok': True, 'message': 'Listed environment'}), 200


# show test details
@flaskapp.route('/api/ravello/test-detail',methods=['POST','GET'])
def test_details():
    if request.method == 'GET':
        temp_name = flaskapp.config['TEST_COLLECTION'].find({},{"name":1,"_id":0})
        template_count = [temp_name[i] for i in range(temp_name.count())]
        templateName = []
        for i in range(len(template_count)):
            templateName.append(template_count[i]['name'])
        env_name = flaskapp.config['ENV_COLLECTION'].find({},{'name': 1, '_id':0})
        list_env_details = []
        for i in env_name:
            list_env_details.append({"Env":i['name'],"template_name":templateName})
        return jsonify({"env-details": list_env_details}), 200

    if request.method == 'POST':
        test_detail = {
            "name": request.form['name'],
            "status": request.form['testStatus'],
            "assigned": request.form['assigned'],
            "classes": request.form['classes'],
            "templateName": request.form['testTemplate']
        }
        # test_detail = [{},{},{}]
        flaskapp.config['ENV_TEST_DETAILS_COLLECTION'].insert_one(test_detail)
        return jsonify({"status": "OK"}), 200

    return Response("BAD REQUESTS"), 400