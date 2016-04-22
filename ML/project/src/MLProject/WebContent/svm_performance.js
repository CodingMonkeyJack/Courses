var svm = require("svm");
var fs = require("fs");
var filePrefix = 'SVMData/sample_';
// var numPoints = [490, 980, 2450, 4900, 49010];
var numPoints = [490];
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
	
	var result = {};
	result['num_points'] = numPoints[i];
	
	var trainTestData = crossValid(rows, 0.1);
	var trainData = trainTestData[0], testData = trainTestData[1],
		trainLabels = trainTestData[2], testLabels = trainTestData[3];
	
	var svm = new svmjs.SVM();
	svm.train(normTrainData, trainLabels, {C: 1.0});
	var classifyLabels = svm.predict(testData);
	
}
var resultFilePath = 'kmeansData/result.json';
var resultsStr = JSON.stringify(results);
fs.writeFileSync(resultFilePath, resultsStr);
