import math
import os
import json
import urllib
import urlparse
import random
import time
from pymongo import (
    MongoClient,
    ASCENDING,
    DESCENDING
)

def weighted_choice(cumsum):
    c = random.random()
    for i, v in enumerate(cumsum):
        if (c < v):
           return i

    return i

def make_poster(term):
    mongo_url = os.environ.get('MONGOHQ_URL', 'mongodb://heroku:26c89fbccb8031920e695ab2bc4e71ba@dharma.mongohq.com:10072/app16438672')
    connection = MongoClient(mongo_url)
    db = connection['app16438672']
    # get classes from fontify: readable, friendly, serious, technical
    #
    params = urllib.urlencode({'term': term})
    url = "http://fontify.herokuapp.com/categories.json?%s"
    f = urllib.urlopen(url % params)
    categories = json.loads(f.read())
    f.close()

    # needed for a known order on the dictionary
    cumsum = []
    
    for category in categories:
        category[1] = math.exp(categories[1])
        tot += category[1]

    for category in categories:
        category[1] = category[1] / tot
        cumsum.append(category[1])
        cumsum[-1] = sum(cumsum[:-2])

    # randomize based on class:
    # for each class there are available options for:
    # 1. fonts
    fonts = {
                "readable": ["helvetica", "verdana"],
                "friendly": ["comic sans ms", "lucida casual"],
                "serious": ["georgia", "times new roman"],
                "technical": ["Consolas", "Menlo", "Monaco", "Courier New"],
            }
    # 2. colors
    colorsets = {
            "readable": [
                            ["CC0000", "000000", "333333", "999999", "FFFFFF"],
                            ["0D0D0D", "BFBFBA", "F2F0EB", "8C8881", "A61212"],
                            ["C5D3D9", "6F730D", "737262", "F2DCB3", "A60303"],
                            ["FDF5E6", "174038", "D01111", "FDC962", "FFFFBB"],
                        ],
            "friendly": [
                            ["D13520", "D6B986", "E7E092", "D8BF00", "13D7F1"],
                            ["CFE4FF", "CECCEA", "FFCED7", "FFECC9", "D9F4D9"],
                            ["3D9299", "14BECC", "00FF83", "FF7985", "CC1481"],
                            ["F2385A", "F5A503", "E9F1DF", "56D9CD", "3AA1BF"],
                        ],
            "serious":  [
                            ["2D396D", "5A669A", "4AA903", "78C60E", "FFFAE6"],
                            ["F2F2F2", "F2E3D5", "A6978F", "594E4D", "0D0D0D"],
                            ["D9DADC", "99987A", "6B6A4B", "5C5C42", "2A2D26"],
                            ["949AA6", "D8E3F2", "BFA474", "D9C6B0", "0D0D0D"],
                        ],
            "technical":[
                            ["012231", "B0D2DB", "5B9DAD", "358195", "77B1BD"],
                            ["262120", "F2BB5A", "FDB813", "DFDFDF", "F2F2F2"],
                            ["181818", "024C8E", "4385B3", "414141", "FFFFFF"],
                        ]
        }
    # 3. alignments
    # 4. background shape type
    # 5. background shape quantity
    # 6. background shape locations in relation to the lines/words/characters of text

    # choose:
    choice = weighted_choice(cumsum)
    font = random.choice(fonts[categories[choice][0]])

    choice = weighted_choice(cumsum)
    colorset =  random.choice(colorsets[categories[choice][0]])
    # put the result in the database
    timestamp = time.time()
    posters_collection = db['posters']
    poster = { 
        "timestamp" : timestamp,
        "font" : font,
        "colorset" : colorset
    }
    posters_collection.insert(poster)