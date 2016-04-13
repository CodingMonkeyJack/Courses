function kmeansClustering() {
	var data = [[1, 2, 3], [1, 3, 10], [1, 3, 10], [69, 10, 25]];

	var km = new kMeans({
		K: 2,
		initCentroids: [[1, 2, 3], [69, 10, 25]]
	});

	km.cluster(data);
	while (km.step()) {
		km.findClosestCentroids();
		km.moveCentroids();

		console.log(km.centroids);

		if(km.hasConverged()) break;
	}

	console.log('Finished in:', km.currentIteration, ' iterations');
	console.log(km.centroids, km.clusters);
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
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
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
    .attr("r", 10)
    .attr("cx", function(d) { console.log(x(d.x)); return x(d.x); })
    .attr("cy", function(d) { console.log(y(d.y)); return y(d.y); })
    .style("fill", function(d) { return color('random'); });
}