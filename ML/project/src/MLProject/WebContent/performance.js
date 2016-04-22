var kMeans = require('kmeans-js');
var fs = require("fs");
var filePrefix = 'kmeansData/mulNorm_';
var numPoints = [1000, 2000, 5000, 10000, 20000];
var numClusters = [2, 5, 10, 20];
var results = [];

function getRows(data) {
	var rows = [];
	var lines = data.split('\n');
	for(var i = 0; i < lines.length; ++i) {
		var line = lines[i];
		if(line.length == 0) continue;
		var columns = line.split(',').map(function(col) { return parseFloat(col);});
		rows.push(columns);
	}
	return rows;
}

for(var i = 0; i < numPoints.length; ++i) {
	var filePath = filePrefix + numPoints[i] + '.csv';
	var file = fs.readFileSync(filePath);
	var data = file.toString();
	var rows = getRows(data);
	
	var result = {};
	result['num_points'] = numPoints[i];
	
	for(var j = 0; j < numClusters.length; ++j) {
		result['num_clusters'] = numClusters[j];
		
		var numCluster = numClusters[j];
		var km = new kMeans({
		    K: numCluster
		});
		
		var startTime = (new Date()).getTime();
		km.cluster(data);
		while (km.step()) {
		    km.findClosestCentroids();
		    km.moveCentroids();

		    if(km.hasConverged()) break;
		}
		var endTime = (new Date()).getTime();
		
		result['time'] = (endTime - startTime);
		results.push(result);
	}
}
var resultFilePath = 'kmeansData/result.json';
var resultsStr = JSON.stringify(results);
fs.writeFileSync(resultFilePath, resultsStr);
