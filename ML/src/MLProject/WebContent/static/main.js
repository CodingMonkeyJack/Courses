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
		$.get("/loadData", {'datasetName': datasetName}, function(dataStr) {
			data = JSON.parse(dataStr);
			plotScatterplot(data);
			kmeansClustering(2, null);
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

function plotScatterplot(data) {
	var spaceWidth = 500, spaceHeight = 500;
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = spaceWidth - margin.left - margin.right,
	height = spaceHeight - margin.top - margin.bottom;

	var x = d3.scale.linear()
	.range([0, width]);

	var y = d3.scale.linear()
	.range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	var svg = d3.select("#space").append("svg")
	.attr("id", "spacesvg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("id", "spaceg")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
	    d.x = +d.x;
	    d.y = +d.y;
	});


	x.domain(d3.extent(data, function(d) { return d.x; })).nice();
	y.domain(d3.extent(data, function(d) { return d.y; })).nice();

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("class", "label")
	.attr("x", width)
	.attr("y", -6)
	.style("text-anchor", "end")
	.text("X");

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("class", "label")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Y")
	
	svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("idx", function(d, i) {return i;})
    .attr("r", 5)
    .attr("cx", function(d) { return x(d.x); })
    .attr("cy", function(d) { return y(d.y); })
    .style("fill", function(d) { return color('random'); });
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
});