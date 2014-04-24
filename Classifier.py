'''
Created on Apr 5, 2014

@author: lilong
'''
from utility import *
from SVMClassifier import SVMClassifier
from BayesClassifier import BayesClassifier

if __name__ == '__main__':
    slangDict = loadSlangDict("dataset/slangDict.txt")       #we still need to check the slang dict later
    emotionDict = loadEmotionDict("dataset/emotionDict.txt")
        
    #svmClassifier = SVMClassifier(slangDict, emotionDict)
    #svmClassifier.train()
    #svmClassifier.test()
    
    bayesClassifier = BayesClassifier(slangDict, emotionDict)
    bayesClassifier.classify()