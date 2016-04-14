// demo: http://www.shodor.org/interactivate/activities/Regression/
/*
 * TODO: calculate residuals
 * */
var m, b, newB;
var startX, endX;

function loadRegressionControls() {
	var paramHolder = $("div#params");
	paramHolder.children().remove();
	
	var regTypeHolder = $("<div></div>");
	var linearRadio = $("<input type='radio' name='regtypes' value='linear'/>");
	var linearLabel = $("<label></label>").text('Linear Regression');
	var runButton = $("<button id='run'>Run</button>");
	regTypeHolder.append(linearRadio);
	regTypeHolder.append(linearLabel);
	regTypeHolder.append(runButton);
	paramHolder.append(regTypeHolder);
	runButton.click(function() {
		// var value = $("input[name='regtypes']").val();
		regressionFit();
	});
	
	var statusHolder = $("<div></div>");
	var funLabel = $("<label>Function:<label>"),
		realFunLabel = $("<label id='funLabel'></label>");
	statusHolder.append(funLabel);
	statusHolder.append(realFunLabel);
	paramHolder.append(statusHolder);
}

function drawCircle(svg, posX, posY) {
	svg.append("circle")
    .attr("class", "regpoint")
    .attr("r", 5)
    .attr("cx", posX)
    .attr("cy", posY)
    .style({'fill': 'red', 'opacity': 0.6});
}

function getFunExpression(m, b) {
	return "Y = " + m + " * X + " + b;
}

function regressionFit() {
	var normData = data.map(function(d) { return [d.x, d.y];});
	var normXs = data.map(function(d) { return d.x;});
	
	startX = math.min(normXs);
	endX = math.max(normXs);
	
	var result = regression('linear', normData);
	m = result['equation'][0];
	b = result['equation'][1];
	newB = b;
	var startY = m * startX + b, endY = m * endX + b;
//	console.log('m:' + m + ' b:' + b);
//	console.log(startX + ' ' + endX);
//	console.log(startY + ' ' + endY);
	var startPosX = x(startX) + margin.left, startPosY = y(startY) + margin.top,
		endPosX = x(endX) + margin.left, endPosY = y(endY) + margin.top;
	
	var svg = d3.select('#spacesvg');
	
	drawCircle(svg, startPosX, startPosY);
	drawCircle(svg, endPosX, endPosY);
	
	svg.append("line")
	.attr("id", "regline")
	.attr("x1", startPosX)
	.attr("y1", startPosY)
	.attr("x2", endPosX)
	.attr("y2", endPosY) //stroke="gray" ="5"  
	.attr("stroke", "gray")
	.attr("stroke-width", 5);
	
	var funStr = getFunExpression(m, b);
	$('#funLabel').text(funStr);
	
	console.log(y.range() + ' ' + y.domain());
	
	$('#regline')
	  .draggable()
	  .bind('mousedown', function(event, ui) {
		  var x1StartX = d3.select(this).attr('x1'),
		  	  y1StartY = d3.select(this).attr('y1'),
		  	  x2StartX = d3.select(this).attr('x2'),
		  	  y2StartY = d3.select(this).attr('y2');
		  
		  d3.select(this)
		  .attr('mouseStartX', event.pageX)
		  .attr('mouseStartY', event.pageY)
		  .attr('x1StartX', x1StartX)
		  .attr('y1StartY', y1StartY)
		  .attr('x2StartX', x2StartX)
		  .attr('y2StartY', y2StartY);
		  $(event.target.parentElement).append(event.target);
	  })
	  .bind('drag', function(event, ui){
		  var diffX = event.pageX - parseFloat(d3.select(this).attr('mouseStartX')),
		  	  diffY = event.pageY - parseFloat(d3.select(this).attr('mouseStartY'));
		  var newX1 = parseFloat(d3.select(this).attr('x1StartX')) + diffX,
		  	  newX2 = parseFloat(d3.select(this).attr('x2StartX')) + diffX,
		  	  newY1 = parseFloat(d3.select(this).attr('y1StartY')) + diffY,
		  	  newY2 = parseFloat(d3.select(this).attr('y2StartY')) + diffY;

		  d3.select(this).attr('x1', newX1);
		  d3.select(this).attr('x2', newX2);
		  d3.select(this).attr('y1', newY1);
		  d3.select(this).attr('y2', newY2);
		  
		  var valDiffY = -(y.domain()[1] - y.domain()[0]) * 1.0 / (y.range()[0] - y.range()[1]) * diffY;
		  newB = b + valDiffY;
		  var funStr = getFunExpression(m, newB);
		  $('#funLabel').text(funStr);
		  // console.log('startY:' + (m * startX + newB) + ' endY:' + (m * endX + newB));
		  d3.select(this).attr('newB', newB);
	  }).bind('mouseup', function(event, ui) {
		  b = newB;
	  });
}