'''
Created on Apr 5, 2014

@author: lilong
'''
import sys, csv

sys.path.append("libsvm-3.18/python")
from svmutil import *
from collections import OrderedDict
from utility import *

class TokenMeta:
    def __init__(self, pos, freq, order):
        self.pos = pos              #pos tag
        self.freq = freq
        self.order = order
        
class SVMClassifier():
    def __init__(self, slangDict):
        self.slangDict = slangDict
    
    #Get the whole features
    def __preprocessing(self, input, output, tokenDict, tweetFeatureList, slangDict):
        with open(input, "r") as trainingFile:
            reader = csv.reader(trainingFile)
            keyOrder = 1
            
            svmOutput = open(output, "w")
            
            for tweet in reader:
                featureList = {}
                tweetText = tweet[5]
                taggedTokens = processTweet(tweetText, slangDict)             
                
                for taggedToken in taggedTokens:
                    token = taggedToken[0]
                    if tokenDict.has_key(token):
                        tokenDict[token].freq = tokenDict[token].freq + 1
                    else:
                        tokenDict[token] = TokenMeta(taggedToken[1], 1, keyOrder)
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
                else:
                    continue
                input += "\t".join("%s:%s" % (key,val) for (key,val) in featureList.items())
                input += "\n"
                svmOutput.write(input)
                tweetFeatureList.append(featureList)
            svmOutput.flush()
            svmOutput.close()

    def printDict(self, dict):
        print len(dict)
        for key in dict.keys():
            print key + " " + str(dict[key].pos) + " " + str(dict[key].freq) + " " + str(dict[key].order)
        print "****************************"
        
    def __getTrainFeatures(self, inputFile, outputFile):
        tokenDict = {}
        tweetFeatureList = []
        self.__preprocessing(inputFile, outputFile, tokenDict, tweetFeatureList, self.slangDict)
        self.tokenDict = tokenDict   
        
    def __getTestFeatures(self, inputFile, outputFile):
        tokenDict = self.tokenDict
        
        with open(inputFile, "r") as testFile:
            reader = csv.reader(testFile)
            svmOutput = open(outputFile, "w")
            
            for tweet in reader:
                featureList = {}
                tweetText = tweet[5]
                taggedTokens = processTweet(tweetText, self.slangDict)             
                
                for taggedToken in taggedTokens:
                    token = taggedToken[0]
                    if tokenDict.has_key(token):
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
                else:
                    continue
                input += "\t".join("%s:%s" % (key,val) for (key,val) in featureList.items())
                input += "\n"
                svmOutput.write(input)
            svmOutput.flush()
            svmOutput.close()
        
    def train(self):
        self.__getTrainFeatures("dataset/trainingSample.csv", "svmtrain")
        y, x = svm_read_problem("svmtrain")
        m = svm_train(y, x, "-c 4")
        svm_save_model("svm.model", m)
    
    def test(self):
        self.__getTestFeatures("dataset/testdata.csv", "svmtest")     
        y, x = svm_read_problem("svmtest")
        m = svm_load_model("svm.model")
        p_label, p_acc, p_val = svm_predict(y, x, m)
        ACC, MSE, SCC = evaluations(y, p_label)
        print ACC
        print MSE 
        print SCC    