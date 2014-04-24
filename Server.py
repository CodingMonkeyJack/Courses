'''
Created on Mar 31, 2014

@author: lilong
'''
import tornado.ioloop, tornado.web
import os, json, time
from TwitterSearch import * 
from BayesClassifier import BayesClassifier
from utility import *

def encodeTweet(obj):
    if isinstance(obj, Tweet):
        return obj.__dict__
    return obj

#Tweet Class
class Tweet:
    def __init__(self, name, text, date, polarity):
        self.name = name
        self.text = text
        self.date = date
        self.polarity = polarity

#get sizeLimit tweets from the Twitter
def getTweets(keyword):
    sizeLimit = 1000
    curSize = 0
    tweetList = []
    
    try:
        tso = TwitterSearchOrder() 
        tso.setKeywords([keyword]) 
        tso.setLanguage("en") 
        tso.setCount(100) 
        tso.setIncludeEntities(False) 
        
        ts = TwitterSearch(
            consumer_key = 'L70HW9enbuZU16KUGVLWXQ',
            consumer_secret = 'C0bEJVSBlM5MK3wtjUMdfNEW1N7WUivHkoWCI8icNA0',
            access_token = '803704459-RyWDnsKaMUYz3ciF6JgMAyViRCm5fKyULQxKLsRD',
            access_token_secret = 'z2XWKWkvjZTv7eDUqnKu53aDY6ZwAisQIIxOKxz42p0wi'
        )
        
        for tweet in ts.searchTweetsIterable(tso): 
            tweetsSize = ts.getStatistics()["tweets"]
            curSize += tweetsSize 
            tweetTime = time.strftime('%Y-%m-%d %H:%M:%S', time.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y'))
            polarity = bayesClassifier.classifyTweet(tweet["text"])
            
            tweetEntity = Tweet(tweet["user"]["screen_name"], tweet["text"], tweetTime, polarity)
            tweetList.append(tweetEntity)
            
            polarity = not(polarity)
            
            if curSize > sizeLimit:
                break
        return json.dumps(tweetList, default = encodeTweet)        

    except TwitterSearchException as e: 
        print(e)
        
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ClassifierHandler(tornado.web.RequestHandler):
    def get(self):
        keyword = self.get_argument("keyword")
        tweets = getTweets(keyword)
        print keyword
        self.write(tweets)
        self.flush()
        self.finish()
        
settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static")
}

application = tornado.web.Application(
                [(r"/", MainHandler),
                (r"/classify", ClassifierHandler),
                (r"/main.js", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
                (r"/style.css", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
                (r"/jquery-1.11.0.min.js", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
                ], **settings);

if __name__ == "__main__":    
    slangDict = loadSlangDict("dataset/slangDict.txt")       #we still need to check the slang dict later
    emotionDict = loadEmotionDict("dataset/emotionDict.txt")
    bayesClassifier = BayesClassifier(slangDict, emotionDict)
    bayesClassifier.train()
    
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()