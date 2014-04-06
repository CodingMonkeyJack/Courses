'''
Created on Mar 31, 2014

@author: lilong
'''
import tornado.ioloop, tornado.web
import os, json, csv, nltk, itertools, re, string, math, sys
from TwitterSearch import * 
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords, wordnet
from collections import OrderedDict

sys.path.append("libsvm-3.18/python")

from svmutil import *


def containsAlpha(token):
    for c in token: 
        if c.isalpha(): 
            return True
    return False

#map the pos tag in treebank to the pos tag in wordnet, only verb, adjective, adverb, noun are left
def getWordNetPos(treebankPos):
    if treebankPos.startswith("NN"): return "n"
    elif treebankPos.startswith("JJ"): return "a"
    elif treebankPos.startswith("RB"): return "r"
    elif treebankPos.startswith("VB"): return "v"
    else: return None

#convert gooood to goood
def convertWord(word):
    newWord = ""
    curLetter = ''
    curFreq = 0
    
    for letter in word:
        if letter != curLetter:
            curLetter = letter
            curFreq = 1
            newWord += letter
        elif curFreq < 3:
            curFreq += 1
            newWord += letter
    return newWord
    
def loadSlangDict(file):
    slangDict = {}
    with open(file, "r") as slangFile:
        for line in slangFile:
            words = line.split()
            key = words[0].lower()
            value = " ".join([word.lower() for word in words[1:]])
            slangDict[key] = value
    return slangDict

'''
Check Agarwaletal11 paper
(1) Tokenization
(2) All tokens are transformed into the lowercase
(3) Delete URL and @name
(4) Remove the stop words, punctuation, numbers
'''
def processTweet(tweetText, slangDict):
    tweetText = re.sub(r"http\S*|@\S*", "", tweetText)   #delete the url and @name
    words = tweetText.split()
    for word in words:
        key = word.lower()
        if slangDict.has_key(key):
            tweetText = tweetText.replace(word, slangDict[key])
    sents = sent_tokenize(tweetText)
    lmtzr = nltk.stem.wordnet.WordNetLemmatizer()
    posTokens = []
    
    '''if flag == 1:
        print "PRE:" + preText
        print "POS:" + tweetText
        print "**************************************"'''
            
    for sent in sents:
        sentTokens = word_tokenize(sent)
        taggedTokens = nltk.pos_tag(sentTokens)
        for taggedToken in taggedTokens:
            token = convertWord(taggedToken[0].lower())
            if token not in stopwords.words("english") and string.punctuation.find(token) == -1 and containsAlpha(token) and len(token) > 1:
                pos = getWordNetPos(taggedToken[1])
                if pos is not None: 
                    posTokens.append([lmtzr.lemmatize(token, pos), pos])
    return posTokens


class TokenMeta2:
    def __init__(self, pos, freq, order):
        self.pos = pos              #pos tag
        self.freq = freq
        self.order = order
        
#Get the whole features
def preprocessing2(file, tokenDict, tweetFeatureList, slangDict):
    with open(file, "r") as trainingFile:
        reader = csv.reader(trainingFile)
        keyOrder = 1
        
        svmInput = open("svminput", "w")
        
        for tweet in reader:
            featureList = {}
            tweetText = tweet[5]
            taggedTokens = processTweet(tweetText, slangDict)             
            
            for taggedToken in taggedTokens:
                token = taggedToken[0]
                if tokenDict.has_key(token):
                    tokenDict[token].freq = tokenDict[token].freq + 1
                else:
                    tokenDict[token] = TokenMeta2(taggedToken[1], 1, keyOrder)
                    keyOrder += 1
                key = tokenDict[token].order
                if featureList.has_key(key):
                    featureList[key] = featureList[key] + 1
                else:
                    featureList[key] = 1
                
            featureList = OrderedDict(sorted(featureList.items(), key = lambda t: t[0]))
            polarityFlag = int(tweet[0])
            input = ""
            if polarityFlag == 0:   #negative
                input += "-1\t"
            elif polarityFlag == 4: #positive
                input += "+1\t"
            input += "\t".join("%s:%s" % (key,val) for (key,val) in featureList.items())
            input += "\n"
            svmInput.write(input)
            tweetFeatureList.append(featureList)
        svmInput.flush()
        svmInput.close()
                  
class Preprocess():
    def __init__(self):
        print "init"

class SVMClassifier():
    def __init__(self, slangDict):
        self.slangDict = slangDict
    
    def printDict(self, dict):
        print len(dict)
        for key in dict.keys():
            print key + " " + str(dict[key].pos) + " " + str(dict[key].freq) + " " + str(dict[key].order)
        print "****************************"
        
    def __getFeatures(self):
        tokenDict = {}
        tweetFeatureList = []
        preprocessing2("dataset/trainingSample.csv", tokenDict, tweetFeatureList, self.slangDict)
        tokenDict = OrderedDict(sorted(tokenDict.items(), key = lambda t: t[1].order))
        #self.printDict(tokenDict)
        print "#################################################"     
        
    def train(self):
        self.__getFeatures()
        print "file done"
        y, x = svm_read_problem("svminput")
        m = svm_train(y, x, '-c 4')
        svm_save_model("svminput", m)

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
    slangDict = loadSlangDict("dataset/SlangDict.txt")
    svmClassifier = SVMClassifier(slangDict)
    svmClassifier.train()
    #application.listen(8888)
    #tornado.ioloop.IOLoop.instance().start()