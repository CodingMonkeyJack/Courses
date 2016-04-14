// demo: http://www.shodor.org/interactivate/activities/Regression/
/*
 * TODO: calculate residuals
 * */
function loadRegressionControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	var controlHolder = $("<div></div>");
	
	var regTypeHolder = $("<div></div>");
	var linearRadio = $("<input type='radio' name='regtypes' value='linear'/>");
	var linearLabel = $("<label></label>").text('Linear Regression');
	var runButton = $("<button id='run'>Run</button>");
	regTypeHolder.append(linearRadio);
	regTypeHolder.append(linearLabel);
	regTypeHolder.append(runButton);
	controlHolder.append(regTypeHolder);
	paramHolder.append(controlHolder);
	
	runButton.click(function() {
		// var value = $("input[name='regtypes']").val();
		regressionFit();
	});
}

function regressionFit() {
	var normData = data.map(function(d) { return [d.x, d.y];});
	var normXs = data.map(function(d) { return d.x;});
	var startX = math.min(normXs), endX = math.max(normXs);
	
	var result = regression('linear', normData);
	var m = result['equation'][0], b = result['equation'][1];
	var startY = m * startX + b, endY = m * endX + b;
//	console.log('m:' + m + ' b:' + b);
//	console.log(startX + ' ' + endX);
//	console.log(startY + ' ' + endY);
	var startPosX = x(startX) + margin.left, startPosY = y(startY) + margin.top,
		endPosX = x(endX) + margin.left, endPosY = y(endY) + margin.top;
	
	var svg = d3.select('#spacesvg');
	
	svg.append("circle")
    .attr("class", "regpoint")
    .attr("r", 5)
    .attr("cx", startPosX)
    .attr("cy", startPosY)
    .style({'fill': 'red', 'opacity': 0.6});
	
	svg.append("circle")
    .attr("class", "regpoint")
    .attr("r", 5)
    .attr("cx", endPosX)
    .attr("cy", endPosY)
    .style({'fill': 'red', 'opacity': 0.6});
	
	svg.append("line")
	.attr("id", "regline")
	.attr("x1", startPosX)
	.attr("y1", startPosY)
	.attr("x2", endPosX)
	.attr("y2", endPosY) //stroke="gray" ="5"  
	.attr("stroke", "gray")
	.attr("stroke-width", 5);
	
	$('#regline')
	  .draggable();
	  .bind('mousedown', function(event, ui){
	    // bring target to front
		  console.log('mouse down');
		  $(event.target.parentElement).append( event.target );
	  })
	  .bind('drag', function(event, ui){
	    // update coordinates manually, since top/left style props don't work on SVG
		  console.log('drag');
		  event.target.setAttribute('x', ui.position.left);
		  event.target.setAttribute('y', ui.position.top);
	  });
}