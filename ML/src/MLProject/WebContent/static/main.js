function bindImportEvent() {
	$('#import').click(function() {
		var datasetName = $("#dataselect").val();
		$.get("/loadData", {'datasetName': datasetName}, function(dataStr) {
			data = JSON.parse(dataStr);
			plotScatterplot(data);
			numClusters = 2;
			kmeansClustering(numClusters, null);
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
	var width = spaceWidth - margin.left - margin.right,
	height = spaceHeight - margin.top - margin.bottom;

	x = d3.scale.linear()
	.range([0, width]);

	y = d3.scale.linear()
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

function bindMethodEvent() {
	$('.method').click(function(){
		var method = $(this).text().trim();
		if(method == 'KMeans') loadKMeansControls();
	});
}

$(window).load(function() {
	initDatasetlist();
	bindImportEvent();
	bindMethodEvent();
});