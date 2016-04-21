import numpy as np
import random
from scipy.spatial import distance
import matplotlib.pyplot as plt

class Point:
    def __init__(self, value, label):
        self.value = value
        self.label = label
        self.dist = float('inf')
        
def genData(num):
    data = []
    for i in xrange(num):
        coin = random.random()      #flip coin
        if coin > 0.5:
            value = np.random.multivariate_normal(mu1, I, 1)
            label = 1;
        else:
            value = np.random.multivariate_normal(mu2, I, 1)
            label = -1
        data.append(Point(value, label))
    return data

if __name__ == "__main__":
    errors1 = []
    errors2 = []
    ps = xrange(1, 102, 10)
     
    for p in ps:
        mu1 = np.zeros(p)
        mu2 = np.zeros(p)
        mu2[0] = 3
        I = np.identity(p)
         
        #training dataset
        trainPoints = genData(200)
        testPoints = genData(1000)
         
        #1NN
        errorNum = 0
        for testPoint in testPoints:
            dist = float("inf")
            classifyLabel = 0
            for trainPoint in trainPoints:
                curDist = distance.euclidean(testPoint.value, trainPoint.value)
                if curDist < dist:
                    dist = curDist
                    classifyLabel = trainPoint.label
            if classifyLabel != testPoint.label:
                errorNum += 1
        errors1.append(errorNum * 1.0 / 1000)
          
        #3NN      
        errorNum = 0
        for testPoint in testPoints:
            nearPoints = [Point(0, 0), Point(0, 0), Point(0, 0)]    #sorted by distance, maintain the nearest points so far
            classifyLabel = 0
            testLabel = testPoint.label
             
            for trainPoint in trainPoints:
                curDist = distance.euclidean(testPoint.value, trainPoint.value)
                if curDist < nearPoints[-1].dist: # the last one in the array has the largest distance
                    trainPoint.dist = curDist
                    nearPoints[-1] = trainPoint
                    nearPoints = sorted(nearPoints, key=lambda point: point.dist)
            posNum = 0
            negNum = 0
            for nearPoint in nearPoints:
                if nearPoint.label > 0:
                    posNum += 1
                else:
                    negNum += 1
            if posNum > negNum:
                classifyLabel = 1
            else:
                classifyLabel = -1
            if classifyLabel != testLabel:
                errorNum += 1
        errors2.append(errorNum * 1.0 / 1000)
    print (errors1)
    print (errors2)
    fig, ax = plt.subplots()
    ax.plot(ps, errors1, 'ro', label='1NN')
    ax.plot(ps, errors2, 'g^', label='3NN')
    legend = ax.legend(loc='upper center', shadow=True)
    plt.show()
    plt.show()