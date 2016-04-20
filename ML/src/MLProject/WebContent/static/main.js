function bindImportEvent() {
	$('#import').click(function() {
		var method = $(this).text().trim();
		var datasetName = $("#dataselect").val();
		$.get("/loadData", {'datasetName': datasetName}, function(dataStr) {
			data = JSON.parse(dataStr);
		});
	});
}

function binPlotEvent() {
	$('#plot').click(function() {
		plotScatterplot(data);
	});
}

function initDatasetlist() {
	$.get("/datalist", function(dataListStr) {
		dataList = JSON.parse(dataListStr);
		var datanamesList = dataList.map(function(item) { return item['dataset'];});
		
		$.each(datanamesList, function(i, value) { 
			$('#dataselect').append(
					$("<option></option>")
					.attr("value", value)
					.attr("idx", i)
					.text(value)); 
		});
		bindDataChangeEvent();
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
		else if(method == 'Regression') loadRegressionControls();
		else if(method == 'SVM') loadSVMControls();
		$('#paramMethod').text(method + ' parameters:');
	});
}

function bindDataChangeEvent() {
	$('#dataselect').change(function() {
		var datasetIdx = $("#dataselect :selected").attr('idx');
		var datasetsAttrs = dataList.map(function(item) { return item['dimensions'];}),
			datasetAttrs = datasetsAttrs[datasetIdx];
		var attrGroup = $('div#attrgroup');
		attrGroup.children().remove();
		
		// show data attributes
		for(var i = 0; i < datasetAttrs.length; ++i) {
			var attrLabel = $('<div></div>')
							.attr('class', 'attr')
							.text(datasetAttrs[i]);
			attrGroup.append(attrLabel);
		}
		$('div.attr').draggable({
			helper : 'clone',
			stop: function(event, ui) {
				if($(this).overlaps('div#space')) {
					$('div#spaceAttrs').append($(this).clone());
					$('div#spaceAttrs').children().draggable();
					$('div#spaceAttrs').children().draggable({
						helper: 'originial',
						stop: function() {
							$(this).draggable("destroy");
							$(this).remove();
						}
					});
				}
			}
		});
	});
}

$(window).load(function() {
	initDatasetlist();
	bindImportEvent();
	bindMethodEvent();
	binPlotEvent();
});