/*
 * 1. high-dimensional dataset
 * 2. cluster partial dataset
 * */
function loadKMeansControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	var controlHolder = $("<div></div>");
	var increaseKControl = $("<button id='incrK'>increase k</button>");
	var decreaseKControl = $("<button id='decrK'>decrease k</button>");
	
	var initCentersHolderControl = $("<div></div>");
	var initCentersRandomRadio = $("<input type='radio' name='initcenters' value='random'/>");
	var initCentersRandomLabel = $("<label></label>").text('Random');
	var initCentersSelectRadio = $("<input type='radio' name='initcenters' value='select'/>");
	var initCentersSelectLabel = $("<label></label>").text('Select');
	initCentersHolderControl.append(initCentersRandomRadio);
	initCentersHolderControl.append(initCentersRandomLabel);
	initCentersHolderControl.append(initCentersSelectRadio);
	initCentersHolderControl.append(initCentersSelectLabel);
	
	controlHolder.append(initCentersHolderControl);
	controlHolder.append(increaseKControl);
	controlHolder.append(decreaseKControl);
	paramHolder.append(controlHolder);
	
	$("input[name='initcenters']").change(function() {
		var value = $(this).val();
		if(value == 'random') initCenters = null;
		else initCenters = [];
	});
	
	$("#space").click(function() {
		
	});
	
	var svg = d3.select("#spaceg").append("circle")
	
	
	increaseKControl.click(function() {
		console.log('incrK');
		numClusters += 1;
		kmeansClustering(numClusters, null);
	});
	
	decreaseKControl.click(function() {
		console.log('decrK');
		numClusters -= 1;
		kmeansClustering(numClusters, null);
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

function kmeansClustering(k, centroids) {
	var km = new kMeans({
		K: k,
		initCentroids: centroids
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