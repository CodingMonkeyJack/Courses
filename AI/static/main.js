var serverAddr = "http://127.0.0.1:8888";

$(document).ready(function(){
	function showTweets(tweets){
		var $table = $("#table").find("table").first();
		$table.find("tr").remove();
		
		tweets.forEach(function(tweet){
			var $row = $("<tr></tr>");
			var $id = $("<td></td>");
			$id.text(tweet["id"]);
			
			var $text = $("<td></td>");
			$text.text(tweet["text"]);

			var $date = $("<td></td>");
			$date.text(tweet["date"]);
			
			var $polarity = $("<td></td>");
			$polarity.text(tweet["polarity"]);
			
			$row.append($id);
			$row.append($text);
			$row.append($date);
			$table.append($row);
		});
	}
	
	function showStat(tweets){
		var negCnt = 0, posCnt = 0;
		tweets.forEach(function(tweet){
			if(parseInt(tweet["polarity"]) == 0){
				negCnt++;
			}else{
				posCnt++;
			}
		});
		negCnt = 100;
		posCnt = 50;
		
		var dataset = [{'label': 'negative', 'value': negCnt},
		               {'label': 'positive', 'value': posCnt}];
		
		//pie chart
		var pie = d3.layout.pie().value(function(d){return d.value}),
			w = 200,
			h = 200,
			outerRadius = w / 2,
			innerRadius = 0,
			arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius),
			color = d3.scale.category10();
		
		var svg = d3.select("#pieChart").select("svg");
		if(svg.empty()){
			svg = d3.select("#pieChart")
					.append("svg")
					.attr("width", w)
					.attr("height", h);
		}
		
		svg.selectAll("g.arc").remove();
		
		var arcs = svg.selectAll("g.arc")
				.data(pie(dataset))
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
		})
		.attr("d", arc);
		
		arcs.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d, i) {
				return d.data.label;
			});
		
		//bar chart
		w = 200;
		h = 200;
		var margin = {top: 20, right: 20, bottom: 40, left: 20},
	    	width = w - margin.left - margin.right,
	    	height = h - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    	.domain(["positive", "negative"])
		    	.rangePoints([0, width], 1);
		var xRange = x.range();

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var svg = d3.select("#barChart").select("svg");
		if(svg.empty()){
			svg = d3.select("#barChart")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		}	    
		
		var yScale = d3.scale.linear()
					.domain([0, Math.max(parseInt(posCnt), parseInt(negCnt)) + 1])
					.range([height, 0]);
		
		var xAxisGroup = svg.select("g.x.axis");
		if(xAxisGroup.empty()){
			xAxisGroup = svg.append("g")
		    				.attr("class", "x axis")
		    				.attr("transform", "translate(0," + height + ")");
		}
		
		xAxisGroup.call(xAxis);
		
		svg.selectAll("rect").remove();
		
		var bars = svg.selectAll("rect")
					 .data(dataset)
					 .enter()
					 .append("rect")
					 .attr("x", function(d, i){
						 return xRange[i];
					 })
					 .attr("y", function(d){
						 return yScale(d.value);
					 })
					 .attr("height", function(d){
						 return height - yScale(d.value);
					 })
					 .attr("width", 10)
					 .attr("fill", "blue");
	}
	
	$("#search").click(function(){
		var keyword = $("#keyword").val();
		
		if(keyword.length > 0){
			$.get(serverAddr + "/classify", {"keyword": keyword}, function(data){
				tweets = JSON.parse(data);
				showStat(tweets);
				showTweets(tweets);
			});
		}		
	});
});