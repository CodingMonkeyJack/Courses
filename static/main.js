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
			
			//var $polarity = $("<td></td>");
			//$polarity.text(tweet["polarity"]);
			
			$row.append($id);
			$row.append($text);
			$row.append($date);
			$table.append($row);
		});
	}
	
	$("#search").click(function(){
		var keyword = $("#keyword").val();
		
		if(keyword.length > 0){
			$.get(serverAddr + "/classify", {"keyword": keyword}, function(data){
				tweets = JSON.parse(data);
				showTweets(tweets);
			});
		}		
	});
});