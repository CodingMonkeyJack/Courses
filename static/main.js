var serverAddr = "http://127.0.0.1:8888";

$(document).ready(function(){
	$("#search" ).click(function(){
		var keyword = $("#keyword").val();
		
		if(keyword.length > 0){
			$.ajax({
				type: "post",
				url: serverAddr + "/classify",
				data:{
					"keyword": keyword
				}
			}).done(function(data){
				console.log(data);
			});
		}		
	});
});