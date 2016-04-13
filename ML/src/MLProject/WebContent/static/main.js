var getParamControl = function(param, val) {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	if($.isArray(val)) {
		
	} else {
		var controlHolder = $("<div></div>");
		var labelControl = $("<label>" + param + "</label>");
		var valControl = $('<input>').attr({
			type: 'text',
		    text: val
		});
		controlHolder.append(labelControl);
		controlHolder.append(valControl);
		paramHolder.append(controlHolder);
	}
}

function bindImportEvent() {
	$('#import').click(function() {
		var datasetName = $("#dataselect").val();
		// console.log(datasetName);
		$.get("/loadData", {'datasetName': datasetName}, function(dataStr) {
			// console.log(dataStr);
			data = JSON.parse(dataStr);
			console.log(data);
		});
	});
}

function initDatasetlist() {
	$.get("/datalist", function(dataListStr) {
		var dataList = JSON.parse(dataListStr);
		var datanamesList = dataList.map(function(item) { return item['dataset'];});
		$.each(datanamesList, function(i, value) { 
			$('#dataselect').append(
					$("<option></option>")
					.attr("value", value)
					.text(value)); 
		});
	});
}

$(window).load(function() {
	initDatasetlist();
	bindImportEvent();
	/* $('.method').click(function(){
		var method = $(this).text().trim();
		$.get("/params", {method: method}, function(paramStr) {
			var paramObj = JSON.parse(paramStr);
			var params = Object.keys(paramObj);
			for(var param in params) {
				var val = paramObj[param];
				var control = getParamControl(param, val);
			}
		});
	});*/
	// kmeansClustering();
	// var exampleData = [{'x': 1, 'y': 2}, {'x': 3, 'y': 1}, {'x': 10, 'y': 11}];
	// plotScatterplot(exampleData);
});