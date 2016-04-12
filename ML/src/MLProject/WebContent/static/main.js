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

$(window).load(function() {
	$('.method').click(function(){
		var method = $(this).text().trim();
		$.get("/params", {method: method}, function(paramStr) {
			var paramObj = JSON.parse(paramStr);
			var params = Object.keys(paramObj);
			for(var param in params) {
				var val = paramObj[param];
				var control = getParamControl(param, val);
			}
		});
	});
	// kmeansClustering();
	var exampleData = [{'x': 1, 'y': 2}, {'x': 3, 'y': 1}, {'x': 10, 'y': 11}];
	plotScatterplot(exampleData);
});