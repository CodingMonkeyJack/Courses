import matplotlib.pyplot as plt
import simplejson as json
from matplotlib.backends.backend_pdf import PdfPages

def plotSVM():
    with open('SVMData/result.json', 'r') as result:
        data = json.loads(result.read())
        num_points = [item['num_points'] for item in data]
        run_times = [item['time'] for item in data]
        
        plt.figure()
        plt.plot(num_points, run_times, 'bs', num_points, run_times)
        plt.xlabel('num of points')
        plt.ylabel('run time (ms)')
        #plt.show()
        plt.savefig('figs/svm_result.pdf', bbox_inches='tight')

def plotKmeans():
    with open('kmeansData/result.json', 'r') as result:
        data = json.loads(result.read())
        num_points = list(set([int(item['num_points']) for item in data]))
        lines = []
        
        plt.figure()
        for num_point in num_points:
            num_clusters = [item['num_clusters'] for item in data if int(item['num_points']) == num_point]
            run_times = [item['time'] for item in data if int(item['num_points']) == num_point]
            line, = plt.plot(num_clusters, run_times, '-s')
            lines.append(line)
            plt.legend(lines, num_points, title="num of points", loc="upper left")
        plt.xlabel('num of clusters')
        plt.ylabel('run time (ms)')
        plt.savefig('figs/kmeans_result.pdf', bbox_inches='tight')

def plotRegression():
    with open('regressionData/result.json', 'r') as result:
        data = json.loads(result.read())
        num_points = [item['num_points'] for item in data]
        run_times = [item['time'] for item in data]
        
        plt.figure()
        plt.plot(num_points, run_times, 'bs', num_points, run_times)
        plt.xlabel('num of points')
        plt.ylabel('run time (ms)')
        #plt.show()
        plt.savefig('figs/regression_result.pdf', bbox_inches='tight')

if __name__ == '__main__':
    #plotSVM()
    #plotKmeans()
    plotRegression()