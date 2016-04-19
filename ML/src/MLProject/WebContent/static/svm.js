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
}

function svmClassify() {
	var crossValidHoldPercent = $('#crossValidInput').val(),
		kernel = $("input[name='kernel']:checked").val();
	console.log(crossValidHoldPercent + ' ' + kernel);
}