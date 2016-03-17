import csv, math
from collections import OrderedDict
from utility import *

class TokenMeta:
    def __init__(self, pos, freq):
        self.pos = pos              #pos tag
        self.freq = freq
        self.MIScore = 0
        
class Tweet:
    def __init__(self, label, tokens):    #label indicates which class this tweets belong to, 0: negative 4: positive
        self.label = label
        self.tokens = [token[0] for token in tokens]

'''
This is the implementation for the naive Bayes, we will implement the variant of the naive bayes later
'''
class BayesClassifier():    
    def __init__(self, slangDict, emotionDict):
        self.slangDict = slangDict
        self.emotionDict = emotionDict
        self.negTweetList = []
        self.posTweetList = []
        self.negDict = {}
        self.posDict = {}
        
    def __preprocessing(self, file, posDict, negDict):
        with open(file, "r") as trainingFile:
            posCnt = negCnt = 0
            
            reader = csv.reader(trainingFile)
            for tweet in reader:
                tweetText = tweet[5]
                taggedTokens = processTweet(tweetText, self.slangDict, self.emotionDict)                        
                polarityFlag = int(tweet[0])
                tweet = Tweet(polarityFlag, taggedTokens)                
                
                if polarityFlag == 0:   #negative
                    tokenDict = negDict
                    negCnt += 1
                    self.negTweetList.append(tweet)
                elif polarityFlag == 4: #positive
                    tokenDict = posDict
                    posCnt += 1
                    self.posTweetList.append(tweet)
                else:
                    continue
                for taggedToken in taggedTokens:
                    token = taggedToken[0]
                    token, freq = self.__checkExPolarity(token)
                    
                    if tokenDict.has_key(token):
                        tokenDict[token].freq = tokenDict[token].freq + freq
                    else:
                        tokenDict[token] = TokenMeta(taggedToken[1], freq) 
            return negCnt, posCnt
    
    def __checkExPolarity(self, word):
        freq = 1
        if word == "exhappy":
            word = "happy"
            freq = 2
        elif word == "exsad":
            word =  "sad"
            freq = 2
        return word, freq 
        
    def __calculate(self, taggedTokens, polarityDict):
        freqSum = len(taggedTokens)
        prob = 0
        
        for taggedToken in taggedTokens:
            if polarityDict.has_key(taggedToken[0]):
                freqSum += polarityDict[taggedToken[0]]

        for taggedToken in taggedTokens:
            if polarityDict.has_key(taggedToken[0]):
                prob += math.log((polarityDict[taggedToken[0]] + 1) * 1.0 / freqSum) #if we add the frequency the accuracy will be much lower
            else:
                prob += math.log(1.0 / freqSum)
        return prob
    
    def __printDict(self, dict):
        print len(dict)
        for key in dict.keys():
            print key + " " + str(dict[key].pos) + " " + str(dict[key].freq) + " " + str(dict[key].MIScore)
        print "****************************"
    
    def __shrinkFeaturesWithFreq(self, preDict):
        posDict = {}
        for key in preDict.keys():
            if preDict[key].pos == "a" or preDict[key].pos == "r":
                #posDict[key] = min(preDict[key].freq, 20)   #improve to 54%
                posDict[key] = min(preDict[key].freq, 1)   #improve to 54%
            elif preDict[key].freq > 4:
                #posDict[key] = min(preDict[key].freq, 20)
                posDict[key] = min(preDict[key].freq, 1)
        return posDict
    
    def __shrinkFeaturesWithMI(self, wordDict, label):
        if label == 0:  #negative
            inList = self.negTweetList
            outList = self.posTweetList
        else:
            inList = self.posTweetList
            outList = self.negTweetList
        
        N = len(inList) + len(outList) + 4
        for key in wordDict.keys():
            N11 = 1
            N10 = 1
            for tweet in inList:
                if key in tweet.tokens:
                    N11 += 1
            for tweet in outList:
                if key in tweet.tokens:
                    N10 += 1
                    
            N01 = len(inList) - N11 + 2
            N00 = len(outList) - N10 + 2
            N0dot = N01 + N00
            Ndot0 = N10 + N00
            N1dot = N11 + N10
            Ndot1 = N01 + N11
            NList = [N, N01, N10, N00, N11, N0dot, Ndot0, N1dot, Ndot1]
            #print NList
            
            wordDict[key].MIScore = N11 * 1.0 / N * math.log(N * N11 * 1.0 / (N1dot * Ndot1), 2) + N01 * 1.0 / N * math.log(N * N01 * 1.0 / (N0dot * Ndot1), 2)  
            + N10 * 1.0 / N * math.log(N * N10 * 1.0 / (N1dot * Ndot0), 2) + N00 * 1.0 / N * math.log(N * N00 * 1.0 / (N0dot * Ndot0), 2)

        wordDict = OrderedDict(sorted(wordDict.items(), key = lambda word: word[1].MIScore, reverse = True))
        shrinkFactor = 0.8
        shrinkedSize = math.floor(shrinkFactor * len(wordDict))
        newWordDict = {}
        counter = 0
        
        for key in wordDict.keys():
            newWordDict[key] = min(wordDict[key].freq, 20)
            counter += 1
            if counter > shrinkedSize:
                break
        return newWordDict        
    
    def train(self):
        posDict = {}
        negDict = {}
        negCnt, posCnt = self.__preprocessing("dataset/trainingSample.csv", posDict, negDict)
        preNegProb = math.log(float(negCnt) / (negCnt + posCnt))
        prePosProb = math.log(float(posCnt) / (negCnt + posCnt))
        correctCnt = totalCnt = 0
        
        #self.__printDict(negDict)
        #self.__printDict(posDict)
        self.negDict = self.__shrinkFeaturesWithFreq(negDict)
        self.posDict = self.__shrinkFeaturesWithFreq(posDict)
        #negDict = self.__shrinkFeaturesWithMI(negDict, 0)
        #posDict = self.__shrinkFeaturesWithMI(posDict, 4)
        print "Training is done."
    
    def classifyTweet(self, tweet):
        tokens = processTweet(tweet, self.slangDict, self.emotionDict)
        posProb = self.__calculate(tokens, self.posDict)
        negProb = self.__calculate(tokens, self.negDict)
        if posProb > negProb:
            label = 4
        else:
            label = 0
        return label
    
    def classify(self):
        with open("dataset/testdata.csv", "r") as testFile:
            reader = csv.reader(testFile)
            for tweet in reader:
                if(int(tweet[0]) == 2): #we don't consider the neutral class current now
                    continue
                totalCnt += 1   
                tokens = processTweet(tweet[5], self.slangDict, self.emotionDict)
                posProb = prePosProb + self.__calculate(tokens, self.posDict)
                negProb = preNegProb + self.__calculate(tokens, self.negDict)
                if posProb > negProb:
                    label = 4
                else:
                    label = 0
                if label == int(tweet[0]):
                    correctCnt += 1
        print correctCnt
        print totalCnt
        accuracy = float(correctCnt) / totalCnt
        print accuracy