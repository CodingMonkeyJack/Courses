var fs = require("fs");
var regression = require('regression');
var filePrefix = 'regressionData/linear_';
var numPoints = [100000, 2000000, 500000, 1000000];
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
	console.log(filePath);
	var file = fs.readFileSync(filePath);
	var data = file.toString();
	var points = getRows(data);
	
	var result = {};
	result['num_points'] = numPoints[i];
	
	var startTime = (new Date()).getTime();
	regression('linear', points);
	var endTime = (new Date()).getTime();
	result['regression_time'] = (endTime - startTime);
	
	var startTime = (new Date()).getTime();
	var loss = 0;
	var m = 5, b = 10;
	for(var j = 0; j < points.length; ++j) {
		var pointX = points[j][0], pointY = points[j][1];
		var diff = (m * pointX + b - pointY);
		loss += diff * diff;
	}
	var endTime = (new Date()).getTime();
	result['update_time'] = (endTime - startTime);
	results.push(result);
}
var resultFilePath = 'regressionData/result.json';
var resultsStr = JSON.stringify(results);
fs.writeFileSync(resultFilePath, resultsStr);
