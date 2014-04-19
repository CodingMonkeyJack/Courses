'''
Created on Apr 5, 2014

@author: lilong
'''
import re, nltk, string, enchant
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords, wordnet

'''
Check Agarwaletal11 paper
(1) Tokenization
(2) All tokens are transformed into the lowercase
(3) Delete URL and @name
(4) Remove the stop words, punctuation, numbers
'''
def processTweet(tweetText, slangDict):
    print "PRE:" + tweetText
    
    tweetText = re.sub(r"http\S*|@\S*", "", tweetText)   #delete the url and @name
    words = tweetText.split()
    #expand the abbr.
    for word in words:
        key = word.lower()
        if slangDict.has_key(key):
            #print "WORD:" + word
            tweetText = tweetText.replace(word, slangDict[key])
    
    #print "POS:" + tweetText
    
    sents = sent_tokenize(tweetText)
    lmtzr = nltk.stem.wordnet.WordNetLemmatizer()
    enchantDict = enchant.Dict("en_US")
    posTokens = []
            
    for sent in sents:
        sentTokens = word_tokenize(sent)
        taggedTokens = nltk.pos_tag(sentTokens)
        
        print taggedTokens
        
        for taggedToken in taggedTokens:
            token = convertWord(taggedToken[0].lower())
            if token not in stopwords.words("english") and string.punctuation.find(token) == -1 and containsAlpha(token) and len(token) > 1:
                pos = getWordNetPos(taggedToken[1])
                if pos is not None: 
                    token = lmtzr.lemmatize(token, pos)
                    if(enchantDict.check(token)):
                        posTokens.append([token, pos])
    print posTokens
    return posTokens

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
    
'''
1. convert gooood to goood
2. change the negation words to 'not'
'''
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
    
    negList = ["n't", "no", "never", "can't", "cannot", "couldn't", "doesn't", "didn't", "don't", "shouldn't", "shan't", "won't", "wouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "daren't", "needn't", "oughtn't", "mightn't", "mustn't"]
    if newWord in negList:
        newWord = "never"       #'not' is a stopword, never is not
    return newWord

def loadSlangDict(file):
    slangDict = {}
    with open(file, "r") as slangFile:
        for line in slangFile:
            words = line.split('-')
            key = words[0].strip()
            value = words[1].strip()
            #print "key:" + key + " value:" + value
            slangDict[key] = value
    return slangDict
    
    