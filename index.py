from flask import *
import requests
import json

app = Flask(__name__, template_folder='www')

ids = json.loads(open('www/js/ids.json').read())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/children/<id>')
def children_api(id):
    if id not in ids:
        return 'error' + id
    js = []
    res = ''
    if 'children' in ids[id]:
        res = json.dumps(ids[id]['children'])

    return res

@app.route('/api/stop/<id>')
def stop_api(id):
    if id not in ids:
        return 'error' + id
    r = requests.get('https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?includeReferences=agencies,routes,trips,stops&stopId=' + id + '&minutesBefore=1&minutesAfter=30&key=bkk-web&version=3&appVersion=3.2.4-19639-9a6d560c')

    res = r.text

    return res

@app.route('/<path:path>')
def serve(path):
    print('he')
    return send_from_directory('www', path)
