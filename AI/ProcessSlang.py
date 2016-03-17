'''
Created on Apr 9, 2014

@author: lilong
'''
import re

if __name__ == '__main__':
    with open("dataset/preSlangDict.txt") as preSlangDict:
        posSlangDict = open("dataset/posSlangDict.txt", "w")
        for line in preSlangDict:
            line = line.lower()
            line = re.sub(r"[\s]+-[\s]+", "\t", line)
            posSlangDict.write(line)
        posSlangDict.close()