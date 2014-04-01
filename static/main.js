var serverAddr = "http://127.0.0.1:8888";

$(document).ready(function(){
	function showTweets(tweets){
		
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