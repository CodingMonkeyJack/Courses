import numpy as np
import matplotlib.pyplot as plt
import random
import csv
import simplejson as json

def genKMeansData():
    means1 = [2, 10]
    cov1 = [[5, 0], [0, 5]]
    x1, y1 = np.random.multivariate_normal(means1, cov1, 50).T
    points = []
    for x, y in zip(x1, y1):
        point = {}
        point['x'] = x
        point['y'] = y
        points.append(point)
    #plt.plot(x1, y1, 'x')
    
    means2 = [15, 10]
    cov2 = [[5, 0], [0, 5]]
    x2, y2 = np.random.multivariate_normal(means2, cov2, 50).T
    for x, y in zip(x2, y2):
        point = {}
        point['x'] = x
        point['y'] = y
        points.append(point)
    
    with open('data/dataset1.json', 'w') as dataFile:
        json.dump(points, dataFile)
    #plt.plot(x2, y2, 'o')
    #plt.show()

def genLinearRegressionData():
    def fun(x):
        return 5 * x + 6;
    noiseScale = 30
    xs = np.random.random_sample(100) * 10
    ys = [fun(x) + random.random() * noiseScale for x in xs]
    points = []
    for x, y in zip(xs, ys):
        point = {}
        point['x'] = x
        point['y'] = y
        points.append(point)
    # print (points)
    with open('data/dataset2.json', 'w') as dataFile:
        json.dump(points, dataFile)
    #plt.plot(xs, ys, 'o') 
    #plt.show()
    
def csvToJson():
    points = []
    with open('data/dataset3.csv', 'r') as inputFile:
        inputReader = csv.reader(inputFile)
        for row in inputReader:
            point = {}
            point['pregnant_times'] = row[0]
            point['glucose_concentration'] = row[1]
            point['blood_pressure'] = row[2]
            point['skin_fold_thickness'] = row[3]
            point['serum_insulin'] = row[4]
            point['body_mass_index'] = row[5]
            point['diabetes_pedigree'] = row[6]
            point['age'] = row[7]
            if int(row[8]) == 0:
                point['class'] = -1
            else:
                point['class'] = 1
            points.append(point)
    with open('data/dataset3.json', 'w') as dataFile:
        json.dump(points, dataFile)
#irs dataset
def csvToJson():
    points = []
    i = 0
    with open('data/iris.data.txt', 'r') as inputFile:
        inputReader = csv.reader(inputFile)
        for row in inputReader:
            print (row)
            i += 1
            type = row[4]
            if type == 'Iris-virginica':
                continue
            point = {}
            point['sepal_length'] = row[0]
            point['sepal_width'] = row[1]
            point['petal_length'] = row[2]
            point['petal_width'] = row[3]
            if type == 'Iris-setosa':
                point['class'] = 1
            else:
                point['class'] = -1
            points.append(point)
    with open('data/dataset3.json', 'w') as dataFile:
        json.dump(points, dataFile)

if __name__ == '__main__':
    #genKMeansData()
    #genLinearRegressionData()
    csvToJson()