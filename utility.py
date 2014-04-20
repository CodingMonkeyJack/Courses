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
def processTweet(tweetText, slangDict, emotionDict):
    orgText = tweetText
    
    tweetText = re.sub(r"http\S*|@\S*", "", tweetText)   #delete the url and @name
    
    flag = 0
    for key in emotionDict.keys():
        if tweetText.find(key) != -1:
            flag = 1
            tweetText = tweetText.replace(key, "." + emotionDict[key] + ".")
    if flag == 1:
        print "PRE:" + orgText
        print "POS:" + tweetText
    
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
        
        if flag == 1:
            print taggedTokens
        
        for taggedToken in taggedTokens:
            token = trimWord(convertWord(taggedToken[0].lower()))
            if token not in stopwords.words("english") and string.punctuation.find(token) == -1 and len(token) > 1:
                pos = getWordNetPos(taggedToken[1])
                if pos is not None: 
                    token = lmtzr.lemmatize(token, pos)
                    if(enchantDict.check(token)) or (token == "exsad") or (token == "exhappy"):
                        posTokens.append([token, pos])
    if flag == 1:
        print posTokens
    return posTokens 

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

#trim this '.happy' '...happpy...' type of word to 'happy'
def trimWord(word):
    wordLen = len(word)
    i = 0
    j = wordLen - 1
    while not(word[i].isalpha() and word[j].isalpha()) and i < j:
        if not(word[i].isalpha()):
            i += 1
        elif not(word[j].isalpha()):
            j -= 1
    if i < j:
        word = word[i:j + 1]
    else:
        word = ""
    #print word
    return word
    
            

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
        
  
def loadEmotionDict(file):
    emotionDict = {}
    
    lineNum = 0
    
    with open(file, "r") as emotionFile:
        for line in emotionFile:
            lineNum += 1
            #print "lineNum:" + str(lineNum)
            words = line.split()
            #print words
            wordLen = len(words)
            polarity = words[wordLen - 1]
            for i in range(wordLen - 1):
                emotionDict[words[i]] = polarity
    #for key in emotionDict.keys():
    #    print key + ":" + emotionDict[key]
    return emotionDict
            
