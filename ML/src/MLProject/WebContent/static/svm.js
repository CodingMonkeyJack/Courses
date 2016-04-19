function loadSVMControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	var controlHolder = $("<div></div>");
	var kernelHolder = $("<div></div>");
	var linearKernelRadio = $("<input type='radio' name='kernel' value='linear'/>"),
		linearKernelLabel = $("<label>linear</label>"),
		rbfKernelRadio = $("<input type='radio' name='kernel' value='rbf'/>"),
		rbfKernelLabel = $("<label>Rbf</label>");
	kernelHolder.append(linearKernelRadio);
	kernelHolder.append(linearKernelLabel);
	kernelHolder.append(rbfKernelRadio);
	kernelHolder.append(rbfKernelLabel);
	
	var crossValidHolder = $("<div></div>");
	var crossValidLabel = $("<label>Cross Validation:</label>"),
		crossValidInput = $("<input type='text' id='crossValidInput'>");
	crossValidHolder.append(crossValidLabel);
	crossValidHolder.append(crossValidInput);
	
	paramHolder.append(kernelHolder);
	paramHolder.append("<br/>");
	paramHolder.append(crossValidHolder);
	paramHolder.append("<br/>");
	
	var classifyButton = $("<button id='classify'>Classify</button>");
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
	var testSize = Math.floor(data.length * crossValidHoldPercent);
	var testIdxs = math.randomInt([1, testSize], data.length);
}

function svmClassify() {
	//var crossValidHoldPercent = parseFloat($('#crossValidInput').val()),
	//	kernel = $("input[name='kernel']:checked").val();
	var attrDivList = $('div#spaceAttrs').children();
	var attrs = [];
	attrDivList.each(function() {
		attrs.push($(this).text());
	});
	console.log(attrs);
}