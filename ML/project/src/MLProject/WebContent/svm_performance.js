var svm = require("svm");
var fs = require("fs");
var math = require('mathjs');
var filePrefix = 'SVMData/sample_';
var numPoints = [244, 366, 490, 734];
var results = [];
var svm = new svm.SVM();

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

function crossValid(data, holdPercent) {
	var testSize = Math.floor(data.length * holdPercent);
	var testIdxs = math.randomInt([1, testSize], data.length)[0];
	var testData = [], trainData = [], trainLabels = [], testLabels = [];
	for(var i = 0; i < data.length; ++i) {
		if(testIdxs.indexOf(i) > -1) {
			testData.push(data[i].slice(0, 3)); 
			testLabels.push(data[i][3]);
		} else {
			trainData.push(data[i].slice(0, 3));
			trainLabels.push(data[i][3]);
		}
	}
	return [trainData, testData, trainLabels, testLabels];
}

for(var i = 0; i < numPoints.length; ++i) {
	var filePath = filePrefix + numPoints[i] + '.csv';
	var file = fs.readFileSync(filePath);
	var data = file.toString();
	var rows = getRows(data);
	
	var holdPercent = 0.1;
	
	var result = {};
	result['num_points'] = numPoints[i];
	result['hold_percent'] = holdPercent;
	
	var trainTestData = crossValid(rows, holdPercent);
	var trainData = trainTestData[0], testData = trainTestData[1],
		trainLabels = trainTestData[2], testLabels = trainTestData[3];
	
	var startTime = (new Date()).getTime();
	svm.train(trainData, trainLabels, {C: 1.0});
	var classifyLabels = svm.predict(testData);
	var endTime = (new Date()).getTime();
	result['time'] = endTime - startTime;
	results.push(result);
}
var resultFilePath = 'SVMData/result.json';
var resultsStr = JSON.stringify(results);
fs.writeFileSync(resultFilePath, resultsStr);
