'''
Created on Mar 31, 2014

@author: lilong
'''
import tornado.ioloop
import tornado.web
import os
import json
from TwitterSearch import * 

def encodeTweet(obj):
    if isinstance(obj, Tweet):
        return obj.__dict__
    return obj

#Tweet Class
class Tweet:
    def __init__(self, tweetID, tweet, date):
        self.id = tweetID
        self.tweet = tweet
        self.date = date

#get sizeLimit tweets from the Twitter
def getTweets(keyword):
    sizeLimit = 200
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
            tweetEntity = Tweet(tweet["id"], tweet["text"], tweet["created_at"])
            tweetList.append(tweetEntity)
            
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
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "lib_path": os.path.join(os.path.dirname(__file__), "lib")
}

application = tornado.web.Application(
                [(r"/", MainHandler),
                (r"/classify", ClassifierHandler),
                (r"/main.js", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
                (r"/jquery-1.11.0.min.js", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
                ], **settings);

if __name__ == '__main__':
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()