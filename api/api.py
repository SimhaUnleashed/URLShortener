from flask import Flask, render_template, request, redirect, url_for,jsonify
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
import random
import string
import os
import json

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)
short_urls  = {}

def generate_short_url():
    tokens = string.ascii_letters + string.digits
    short_url = "".join(random.choice(tokens) for token in range(6))
    return short_url

def post_short_url(long_url):
        with open("allurls.json","r") as f:
            short_urls=json.load(f)
        for data in short_urls:
            if(long_url==short_urls[data]):
                return data
        
        short_url = generate_short_url()
        while short_url in short_urls:
            short_url = generate_short_url()

        short_urls[short_url] = long_url
        
        with open("allurls.json","w") as f:
            json.dump(short_urls,f)
        return short_url

class Long(Resource):
    def get(self,long_url):
        
        url = post_short_url(long_url)
        jsonres = jsonify({"url":url})
        jsonres.headers['Access-Control-Allow-Credentials'] = 'true'
        return jsonres


class Short(Resource):

    def get(self,short_url):
         with open("allurls.json","r") as f:
            short_urls=json.load(f)
            long_url = short_urls.get(short_url)
            if long_url:
                return redirect(long_url)
            else:
                return "URL not found", 404
    
api.add_resource(Long, '/long/<path:long_url>')
api.add_resource(Short, '/<string:short_url>')
    
if __name__ == '__main__':
    
    app.run(debug=True)