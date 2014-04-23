'''
Created on Apr 9, 2014

@author: lilong
'''
import codecs

if __name__ == '__main__':
    '''with open("dataset/preSlangDict.txt") as preSlangDict:
        posSlangDict = open("dataset/posSlangDict.txt", "w")
        for line in preSlangDict:
            line = line.lower()
            line = re.sub(r"[\s]+-[\s]+", "\t", line)
            posSlangDict.write(line)
        posSlangDict.close()'''
    
    preEmoticons = codecs.open("dataset/preEmoticons.txt") 
    posEmoticons = open("dataset/emotionDict.txt", "w")
    for line in preEmoticons:
        #line = unicode(line, "UTF-8")
        #line = line.replace(u"\u00A0", " ")
        if "Neutral" in line:
            continue
        line = line.replace(r"Extremely-Positive", "exhappy")
        line = line.replace("Positive", "happy")
        line = line.replace(r"Extremely-Negative", "exsad")
        line = line.replace("Negative", "sad")
        posEmoticons.write(line)
    posEmoticons.close()
    preEmoticons.close()
        
            