import csv, math

from utility import *

class TokenMeta:
    def __init__(self, pos, freq):
        self.pos = pos              #pos tag
        self.freq = freq

'''
This is the implementation for the naive Bayes, we will implement the variant of the naive bayes later
'''
class BayesClassifier():    
    def __init__(self, slangDict):
        self.slangDict = slangDict
        
    def __preprocessing(self, file, posDict, negDict, slangDict):
        with open(file, "r") as trainingFile:
            posCnt = negCnt = 0
            
            reader = csv.reader(trainingFile)
            for tweet in reader:
                tweetText = tweet[5]
                taggedTokens = processTweet(tweetText, slangDict)             
                polarityFlag = int(tweet[0])
                if polarityFlag == 0:   #negative
                    tokenDict = negDict
                    negCnt += 1
                elif polarityFlag == 4: #positive
                    tokenDict = posDict
                    posCnt += 1
                else:
                    continue
                for taggedToken in taggedTokens:
                    token = taggedToken[0]
                    if tokenDict.has_key(token):
                        tokenDict[token].freq = tokenDict[token].freq + 1
                    else:
                        tokenDict[token] = TokenMeta(taggedToken[1], 1) 
            return negCnt, posCnt
        
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
            print key + " " + str(dict[key].pos) + " " + str(dict[key].freq)
        print "****************************"
    
    #If we use this method, we can increase the accuracy from 44.5% to 48.7%
    def __shrinkFeatures(self, preDict):
        posDict = {}
        for key in preDict.keys():
            if preDict[key].pos == "a" or preDict[key].pos == "r":
                posDict[key] = preDict[key].freq
            elif preDict[key].freq > 4:
                posDict[key] = min(preDict[key].freq, 20)
        return posDict
    
    def classify(self):
        posDict = {}
        negDict = {}
        negCnt, posCnt = self.__preprocessing("dataset/trainingSample.csv", posDict, negDict, self.slangDict)
        preNegProb = math.log(float(negCnt) / (negCnt + posCnt))
        prePosProb = math.log(float(posCnt) / (negCnt + posCnt))
        correctCnt = totalCnt = 0
        
        #self.__printDict(negDict)
        #self.__printDict(posDict)
        negDict = self.__shrinkFeatures(negDict)
        posDict = self.__shrinkFeatures(posDict)
        #print negDict
        #print posDict 
        
        with open("dataset/testdata.csv", "r") as testFile:
            reader = csv.reader(testFile)
            for tweet in reader:
                if(int(tweet[0]) == 2): #we don't consider the neutral class current now
                    continue
                totalCnt += 1   
                tokens = processTweet(tweet[5], self.slangDict)
                posProb = prePosProb + self.__calculate(tokens, posDict)
                negProb = preNegProb + self.__calculate(tokens, negDict)
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