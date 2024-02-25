import requests

base = "https://urlshortener-162a.onrender.com/"


response = requests.get(base+ "long/http://www.google.com")
print(response.json())