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
    numPoints = [500, 1000, 1500, 2000]
    for numPoint in numPoints:
        points = np.asarray(genMultiNormData(numPoint))
        filePath = 'kmeansData/mulNorm_' + str(numPoint) + '.csv'
        with open(filePath, 'w') as dataFile:
            np.savetxt(filePath, points, delimiter=",")


def genLinearRegressionData():
    def fun(x):
        return 5 * x + 6;
    
    numPoints = [100000, 2000000, 500000, 1000000]
    for numPoint in numPoints:
        noiseScale = 30
        xs = np.random.random_sample(numPoint) * 10
        ys = [fun(x) + random.random() * noiseScale for x in xs]
        points = []
        for x, y in zip(xs, ys):
            point = [x, y]
            points.append(point)
        points = np.asarray(points)
        filePath = 'regression/linear_' + str(numPoint) + '.csv'
        np.savetxt(filePath, points, delimiter=",")

def genSVMData():
    sampleRates = [0.001, 0.0015, 0.002, 0.003]
    with open('SVMData/Skin_NonSkin.txt') as file:
        tsvin = csv.reader(file, delimiter='\t')
        skinData = []
        nonSkinData = []
        for line in tsvin:
            label = int(line[3].strip())
            row = [int(col) for col in line]
            if label == 1:
                skinData.append(row)
            else:
                nonSkinData.append(row)
        numPoints = len(skinData) + len(nonSkinData)
        for sampleRate in sampleRates:
            numSample = int(math.floor(numPoints * sampleRate / 2))
            skinSample = random.sample(skinData, numSample)
            nonSkinSample = random.sample(nonSkinData, numSample)
            allSample = np.asarray(skinSample + nonSkinSample)
            filePath = 'SVMData/sample_' + str(numSample * 2) + ".csv"
            np.savetxt(filePath, allSample, delimiter=",")
               
if __name__ == '__main__':
    genKMeansData()
    #genLinearRegressionData()
    #genSVMData()