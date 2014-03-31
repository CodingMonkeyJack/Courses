'''
Created on Mar 31, 2014

@author: lilong
'''
import tornado.ioloop
import tornado.web
import os
from TwitterSearch import * 

#get sizeLimit tweets from the Twitter
def getTweets(keyword):
    sizeLimit = 1000
    curSize = 0
    try:
        tso = TwitterSearchOrder() 
        tso.setKeywords([keyword]) 
        tso.setLanguage('en') 
        tso.setCount(100) 
        tso.setIncludeEntities(False) 
        
        ts = TwitterSearch(
            consumer_key = 'L70HW9enbuZU16KUGVLWXQ',
            consumer_secret = 'C0bEJVSBlM5MK3wtjUMdfNEW1N7WUivHkoWCI8icNA0',
            access_token = '803704459-RyWDnsKaMUYz3ciF6JgMAyViRCm5fKyULQxKLsRD',
            access_token_secret = 'z2XWKWkvjZTv7eDUqnKu53aDY6ZwAisQIIxOKxz42p0wi'
         )

        for tweet in ts.searchTweetsIterable(tso): 
            tweetsSize = ts.getStatistics()['tweets']
            curSize += tweetsSize 
            print( '%d curID: %d\n\n' % (tweet['id'], curSize))
            if curSize > sizeLimit:
                break

    except TwitterSearchException as e: 
        print(e)
        
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ClassifierHandler(tornado.web.RequestHandler):
    def post(self):
        keyword = self.get_argument("keyword")
        getTweets(keyword)
        
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