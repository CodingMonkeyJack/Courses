function loadSVMControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	var controlHolder = $("<form></form>");
	var kernelHolder = $("<div></div>");
	var linearKernelRadio = $("<input type='radio' name='kernel' value='linear' checked/>"),
		linearKernelLabel = $("<label></label>"),
		rbfKernelRadio = $("<input type='radio' name='kernel' value='rbf'/>"),
		rbfKernelLabel = $("<label></label>");
	linearKernelLabel.append(linearKernelRadio)
					.append('Linear')
					.attr('class', 'pure-radio');
	rbfKernelLabel.append(rbfKernelRadio)
					.append('Rbf')
					.attr('class', 'pure-radio');
	
	kernelHolder.append(linearKernelLabel);
	kernelHolder.append(rbfKernelLabel);
	
	var crossValidHolder = $("<div></div>");
	var crossValidLabel = $("<label style='margin-left: 10px'>Cross Validation:</label>"),
		crossValidInput = $("<input type='text' id='crossValidInput' value=0.1>");
	crossValidHolder.append(crossValidLabel);
	crossValidHolder.append(crossValidInput);
	
	paramHolder.append(kernelHolder);
	paramHolder.append("<br/>");
	paramHolder.append(crossValidHolder);
	paramHolder.append("<br/>");
	
	var classifyButton = $("<button id='classify'>Classify</button>")
						.attr('class', 'pure-button');
	paramHolder.append(classifyButton);
	$("#classify").click(function() {
		svmClassify();
	});
	
	var spaceDiv = $('div#space');
	spaceDiv.height(500);
	var spaceAttrHolder = $("<div id='spaceAttrs'></div>"),
		resultHolder = $("<div id='spaceResult'></div>");
	spaceDiv.append(spaceAttrHolder);
	spaceDiv.append(resultHolder);
}

function crossValid(holdPercent) {
	var testSize = Math.floor(data.length * holdPercent);
	var testIdxs = math.randomInt([1, testSize], data.length)[0];
	var testData = [], trainData = [];
	for(var i = 0; i < data.length; ++i) {
		if(testIdxs.indexOf(i) > -1) testData.push(data[i]);
		else trainData.push(data[i]);
	}
	// console.log(trainData);
	// console.log(testData);
	return [trainData, testData];
}

function getNormData(curData, attrs) {
	var normData = curData.map(function(point) {
		var newPoint = [];
		for(var i = 0; i < attrs.length; ++i) {
			newPoint.push(point[attrs[i]]);
		}
		return newPoint;
	});
	return normData;
}

function showClassifyResult(classifyLabels, testLabels) {
	var posCorr = 0, posIncorr = 0,
		negCorr = 0, negIncorr = 0;
	for(var i = 0; i < classifyLabels.length; ++i) {
		if(parseInt(testLabels[i]) == 1) {
			if(parseInt(classifyLabels[i]) == 1) posCorr += 1;
			else posIncorr += 1;
		} else {
			if(parseInt(classifyLabels[i]) == -1) negCorr += 1;
			else negIncorr += 1;
		}
	}
	var accuracy = (posIncorr + negIncorr) * 1.0 / testLabels.length;
	var	precision = posCorr * 1.0 / (posCorr + negIncorr);
	var	recall = posCorr * 1.0 / (posCorr + posIncorr);
	
	var accuracyLabel = $("<label style='margin-right: 20px'>Accuracy:</label>"),
		accuracyValLabel = $("<label></label><br/><br/>").text(accuracy),
		precisionLabel = $("<label style='margin-right: 20px'>Precision:</label>"),
		precisionValLabel = $("<label></label><br/><br/>").text(precision),
		recallLabel = $("<label style='margin-right: 20px'>Recall:</label>"),
		recallValLabel = $("<label></label>").text(recall);
	var resultDiv = $('div#spaceResult');
	
	resultDiv.children().remove();
	resultDiv.append(accuracyLabel);
	resultDiv.append(accuracyValLabel);
	resultDiv.append(precisionLabel);
	resultDiv.append(precisionValLabel);
	resultDiv.append(recallLabel);
	resultDiv.append(recallValLabel);
	
	
}

function svmClassify() {
	var crossValidHoldPercent = parseFloat($('#crossValidInput').val()),
		kernel = $("input[name='kernel']:checked").val();
	var trainTestData = crossValid(crossValidHoldPercent);
	var trainData = trainTestData[0], testData = trainTestData[1];
	var attrDivList = $('div#spaceAttrs').children();
	var attrs = [];
	attrDivList.each(function() {
		attrs.push($(this).text());
	});
	var normTrainData = getNormData(trainData, attrs),
		normTestData = getNormData(testData, attrs);
	var trainLabels = trainData.map(function(point) {return parseInt(point['class']);}),
		testLabels = testData.map(function(point) {return parseInt(point['class']);});
	var svm = new svmjs.SVM();
	svm.train(normTrainData, trainLabels, {C: 1.0});
	var classifyLabels = svm.predict(normTestData);
	console.log(testLabels);
	console.log(classifyLabels);
	showClassifyResult(classifyLabels, testLabels);
}