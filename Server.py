'''
Created on Mar 31, 2014

@author: lilong
'''
import tornado.ioloop, tornado.web
import os, json, csv, nltk, itertools, re, string, math
from TwitterSearch import * 
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords

def containsAlpha(token):
    for c in token: 
        if c.isalpha(): 
            return True
    return False

'''
Check Agarwaletal11 paper
(1) Tokenization
(2) Delete URL and @name
(3) Remove the stop words, punctuation, numbers
'''
def processTweet(tweetText):
    tweetText = re.sub(r"http\S*|@\S*", "", tweetText)   #delete the url and @name
    #Need to transform the emoticon to the words
    tokenSents = [word_tokenize(sent) for sent in sent_tokenize(tweetText)]
    preTokens = list(itertools.chain.from_iterable(tokenSents))
    tokens = []
    
    for token in preTokens:
        token = token.lower()
        if token not in stopwords.words("english") and string.punctuation.find(token) == -1 and containsAlpha(token):
            tokens.append(token)
    #print tokens
    return tokens

'''
We need to shrink the features
'''
def preprocessing(file, posDict, negDict):
    with open(file, "r") as trainingFile:
        posCnt = negCnt = 0
        
        reader = csv.reader(trainingFile)
        for tweet in reader:
            tweetText = tweet[5]
            tokens = processTweet(tweetText)             
            polarityFlag = int(tweet[0])
            if polarityFlag == 0:   #negative
                tokenDict = negDict
                negCnt += 1
            elif polarityFlag == 4: #positive
                tokenDict = posDict
                posCnt += 1
            else:
                continue
            for token in tokens:
                if tokenDict.has_key(token):
                    tokenDict[token] = tokenDict[token] + 1
                else:
                    tokenDict[token] = 1              
        return negCnt, posCnt

'''
This is the implementation for the naive Bayes, we will implement the variant of the naive bayes later
'''
class BayesClassifier():    
    def __calculate(self, tokens, polarityDict):
        freqSum = len(tokens)
        prob = 0
        
        for token in tokens:
            if polarityDict.has_key(token):
                freqSum += polarityDict[token]

        for token in tokens:
            if polarityDict.has_key(token):
                prob += math.log((polarityDict[token] + 1) * 1.0 / freqSum)
            else:
                prob += math.log(1.0 / freqSum)
        return prob
        
    def classify(self):
        posDict = {}
        negDict = {}
        negCnt, posCnt = preprocessing("dataset/trainingSample.csv", posDict, negDict)
        preNegProb = math.log(float(negCnt) / (negCnt + posCnt))
        prePosProb = math.log(float(posCnt) / (negCnt + posCnt))
        correctCnt = totalCnt = 0
        
        print negDict
        print posDict
        with open("dataset/testdata.csv", "r") as testFile:
            reader = csv.reader(testFile)
            for tweet in reader:
                if(int(tweet[0]) == 2): #we don't consider the neutral class current now
                    continue
                totalCnt += 1   
                tokens = processTweet(tweet[5])
                posProb = prePosProb + self.__calculate(tokens, posDict)
                negProb = preNegProb + self.__calculate(tokens, negDict)
                if posProb > negProb:
                    label = 4
                else:
                    label = 0
                if label == int(tweet[0]):
                    correctCnt += 1
        print totalCnt
        accuracy = float(correctCnt) / totalCnt
        print accuracy
                    

def SVMClassifier():
    print "SVM"

def encodeTweet(obj):
    if isinstance(obj, Tweet):
        return obj.__dict__
    return obj

#Tweet Class
class Tweet:
    def __init__(self, tweetID, text, date):
        self.id = tweetID
        self.text = text
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
    bayesClassifier = BayesClassifier()
    bayesClassifier.classify()
    #application.listen(8888)
    #tornado.ioloop.IOLoop.instance().start()