import numpy as np
import matplotlib.pyplot as plt
import random
import csv
import simplejson as json
import math

def genMultiNormData(numPoint):
    eachNumPoint = (int)(math.floor(numPoint / 2))
    
    means1 = [2, 10]
    cov1 = [[5, 0], [0, 5]]
    x1, y1 = np.random.multivariate_normal(means1, cov1, eachNumPoint).T
    points = []
    for x, y in zip(x1, y1):
        point = [x, y]
        points.append(point)
    #plt.plot(x1, y1, 'x')
    
    means2 = [15, 10]
    cov2 = [[5, 0], [0, 5]]
    x2, y2 = np.random.multivariate_normal(means2, cov2, eachNumPoint).T
    for x, y in zip(x2, y2):
        point = [x, y]
        points.append(point)
    return points
        
def genKMeansData():
    numPoints = [1000, 2000, 5000, 10000, 20000]
    for numPoint in numPoints:
        points = np.asarray(genMultiNormData(numPoint))
        filePath = 'kmeansData/mulNorm_' + str(numPoint) + '.csv'
        with open(filePath, 'w') as dataFile:
            np.savetxt(filePath, points, delimiter=",")

if __name__ == '__main__':
    genKMeansData()