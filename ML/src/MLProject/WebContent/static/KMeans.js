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

		console.log(km.centroids);

		if(km.hasConverged()) break;
	}
	
	console.log('Finished in:', km.currentIteration, ' iterations');
	console.log(km.centroids, km.clusters);
	
	colorPoints(km.centroids, km.clusters);
}