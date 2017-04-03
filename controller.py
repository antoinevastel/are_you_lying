from flask import Flask, render_template, request
from flask import jsonify
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('display_fingerprint.html')


@app.route('/headers')
def get_headers():
    print(request.headers)
    headers = dict()
    for header in request.headers:
        headers[header[0]] = header[1]
    return jsonify(headers)
