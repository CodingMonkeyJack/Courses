'''
Created on Apr 5, 2014

@author: lilong
'''
from utility import *
from SVMClassifier import SVMClassifier
from BayesClassifier import BayesClassifier

if __name__ == '__main__':
    slangDict = loadSlangDict("dataset/SlangDict.txt")       #we still need to check the slang dict later
    
    #svmClassifier = SVMClassifier(slangDict)
    #svmClassifier.train()
    #svmClassifier.test()
    
    bayesClassifier = BayesClassifier(slangDict)
    bayesClassifier.classify()