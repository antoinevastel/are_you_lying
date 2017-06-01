from flask import Flask, render_template, request
from flask import jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient()
db = client.fpccs

@app.route('/')
def hello_world():
    return render_template('display_fingerprint.html')


@app.route('/headers')
def get_headers():
    headers = dict()
    for header in request.headers:
        headers[header[0]] = header[1]
    return jsonify(headers)


@app.route('/add_fp', methods=["POST"])
def add_fp():
    # to inspect db mongod; mongo; use fpccs; db.incons.find()
    id_inserted = db.incons.insert_one(request.get_json())
    return "201"


@app.route("/old_redirect")
def old_redirect():
    return render_template("fake_page.html")
