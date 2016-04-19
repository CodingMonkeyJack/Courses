// demo: http://www.shodor.org/interactivate/activities/Regression/
/*
 * TODO: 
 * */
var m, b, newB;
var startX, endX;
var normData; 	// [[x, y]]

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
		realFunLabel = $("<label id='funLabel'></label><br/>");
	var squareLossLabel = $("<label>Square Loss:<label>");
	var squareLossValLabel = $("<label id='squareLoss'>Square Loss:<label>");
	
	statusHolder.append(funLabel);
	statusHolder.append(realFunLabel);
	statusHolder.append(squareLossLabel);
	statusHolder.append(squareLossValLabel);
	paramHolder.append(statusHolder);
}

function drawCircle(svg, posX, posY) {
	svg.append("circle")
    .attr("class", "regpoint")
    .attr("r", 7)
    .attr("cx", posX)
    .attr("cy", posY)
    .style({'fill': 'red', 'opacity': 0.6});
}

function drawLine(svg, startX, startY, endX, endY) {
	svg.append("line")
	.attr("id", "regline")
	.attr("x1", startX)
	.attr("y1", startY)
	.attr("x2", endX)
	.attr("y2", endY) //stroke="gray" ="5"  
	.attr("stroke", "gray")
	.attr("stroke-width", 5);
}

function updateStatus(m, b) {
	var funStr = "Y = " + m + " * X + " + b;
	$('#funLabel').text(funStr);
	
	var loss = 0;
	for(var i = 0; i < normData.length; ++i) {
		var pointX = normData[i][0], pointY = normData[i][1];
		var diff = m * pointX + b;
		loss += diff * diff;
	}
	$('#squareLoss').text(loss);
}

function bindEndPointsEvent() {
	$('.regpoint')
	.draggable()
	.bind('mousedown', function(event, ui) {
		event.stopPropagation();
		
		var startX = d3.select(this).attr('cx'),
		startY = d3.select(this).attr('cy');
		var regLine = d3.select('#regline');
		var x1 = regLine.attr('x1'), y1 = regLine.attr('y1');
		var position = 'start';
		if(startX == x1 && startY == y1) position = 'start';
		else position = 'end';

		d3.select(this)
		.attr('position', position)
		.attr('mouseStartX', event.pageX)
		.attr('mouseStartY', event.pageY)
		.attr('startX', startX)
		.attr('startY', startY);
		$(event.target.parentElement).append(event.target);
		
	})
	.bind('drag', function(event, ui){
		event.stopPropagation();
		
		var diffX = event.pageX - parseFloat(d3.select(this).attr('mouseStartX')),
		diffY = event.pageY - parseFloat(d3.select(this).attr('mouseStartY'));
		var newX = parseFloat(d3.select(this).attr('startX')) + diffX,
		newY = parseFloat(d3.select(this).attr('startY')) + diffY;

		d3.select(this).attr('cx', newX);
		d3.select(this).attr('cy', newY);
		
		var regLine = d3.select('#regline');
		var newValX1, newValY1, newValX2, newValY2;

		if(d3.select(this).attr('position') == 'start') {
			regLine.attr('x1', newX);
			regLine.attr('y1', newY);
			
			newValX1 = x.invert(newX - margin.left);
			newValY1 = y.invert(newY - margin.top);
			newValX2 = x.invert(parseFloat(regLine.attr('x2')) - margin.left);
			newValY2 = y.invert(parseFloat(regLine.attr('y2')) - margin.top);
		} else {
			regLine.attr('x2', newX);
			regLine.attr('y2', newY);
			
			newValX1 = x.invert(parseFloat(regLine.attr('x1')) - margin.left);
			newValY1 = y.invert(parseFloat(regLine.attr('y1')) - margin.top);
			newValX2 = x.invert(newX - margin.left);
			newValY2 = y.invert(newY - margin.top);
		}
		
		// console.log(newValX1 + " " + newValY1 + "," + newValX2 + " " + newValY2);
		
		m = (newValY1 - newValY2) / (newValX1 - newValX2);
		b = newValY1 - m * newValX1;

		updateStatus(m, b);
	});
}

function bindLineEvent() {
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
		  
		  updateStatus(m, newB);
		  
		  // console.log('startY:' + (m * startX + newB) + ' endY:' + (m * endX + newB));
		  d3.select(this).attr('newB', newB);
		  $('.regpoint').remove();
		  
		  var svg = d3.select('#spacesvg');			// todo: change position instead of removal
		  drawCircle(svg, newX1, newY1);
		  drawCircle(svg, newX2, newY2);
		  bindEndPointsEvent();
	  }).bind('mouseup', function(event, ui) {
		  b = newB;
	  });
}

function regressionFit() {
	normData = data.map(function(d) { return [d.x, d.y];});
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
	drawLine(svg, startPosX, startPosY, endPosX, endPosY);
	
	updateStatus(m, b);
	
	bindLineEvent();
	bindEndPointsEvent();
}