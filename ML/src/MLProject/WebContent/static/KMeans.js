/*
 * 1. high-dimensional dataset
 * 2. cluster partial dataset
 * 3. add point operation
 * */
function loadKMeansControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	var controlHolder = $("<form></form>");
	var increaseKControl = $("<button id='incrK'>increase k</button>")
							.attr('class', 'pure-button pure-button-active');
	var decreaseKControl = $("<button id='decrK'>decrease k</button>")
							.attr('class', 'pure-button pure-button-active');
	
	var initCentersHolderControl = $("<div></div>");
	var initCentersRandomRadio = $("<input type='radio' name='initcenters' value='random'/>");
	var initCentersRandomLabel = $("<label></label>")
								.attr('class', 'pure-radio');
	initCentersRandomLabel.append(initCentersRandomRadio).append('Random');
	var initCentersSelectRadio = $("<input type='radio' name='initcenters' value='select'/>");
	var initCentersSelectLabel = $("<label></label>")
								.attr('class', 'pure-radio');
	initCentersSelectLabel.append(initCentersSelectRadio).append('Select');
	var clusterButton = $("<button id='cluster'>cluster</button>")
						.attr('class', 'pure-button pure-button-active');
	
	initCentersHolderControl.append(initCentersRandomLabel);
	initCentersHolderControl.append(initCentersSelectLabel);
	initCentersHolderControl.append(clusterButton);
	
	controlHolder.append(initCentersHolderControl);
	controlHolder.append(increaseKControl);
	controlHolder.append(decreaseKControl);
	controlHolder.attr('class', 'pure-form');
	paramHolder.append(controlHolder);
	
	clusterButton.click(function(e) {
		numClusters = initCenters.length;
		console.log('clusters:' + numClusters);
		kmeansClustering(numClusters);
	});
	
	$("input[name='initcenters']").change(function() {
		var value = $(this).val();
		if(value == 'random') initCenters = null;
		else initCenters = [];
	});
	
	// select centers
	$("#space").click(function(e) {
		var parentOffset = $('#spacesvg').offset();
		var offX = e.pageX - parentOffset.left;
		var offY = e.pageY - parentOffset.top;
		
		d3.select('#spacesvg').append("circle")
	    .attr("class", "initcenter")
	    .attr("r", 5)
	    .attr("cx", offX)
	    .attr("cy", offY)
	    .style({'fill': 'red', 'opacity': 0.6});
		
		var centerX = x.invert(offX - margin.left), centerY = y.invert(offY - margin.top);
		initCenters.push([centerX, centerY]);
	});
	
	increaseKControl.click(function() {
		// console.log('incrK');
		numClusters += 1;
		kmeansClustering(numClusters);
	});
	
	decreaseKControl.click(function() {
		// console.log('decrK');
		numClusters -= 1;
		kmeansClustering(numClusters);
	});
}

function colorPoints(centroids, clusters) {
	var numClusters = centroids.length;
	var color = d3.scale.category10();

	var svg = d3.select("#spaceg");
	d3.selectAll(".dot")
    .style("fill", function(d) {
    	var idx = parseInt(d3.select(this).attr("idx"));
    	for(var i = 0; i < clusters.length; ++i) {
    		if(clusters[i].indexOf(idx) != -1) {
    			return color(i);
    		}
    	}
    });
}

function kmeansClustering(k) {
	var km = new kMeans({
		K: k,
		initCentroids: initCenters
	});

	var normData = data.map(function(d) { return [d.x, d.y];});
	km.cluster(normData);
	
	while (km.step()) {
		km.findClosestCentroids();
		km.moveCentroids();

		// console.log(km.centroids);

		if(km.hasConverged()) break;
	}
	
	// console.log('Finished in:', km.currentIteration, ' iterations');
	// console.log(km.centroids, km.clusters);
	
	colorPoints(km.centroids, km.clusters);
}