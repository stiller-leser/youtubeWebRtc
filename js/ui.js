$("#loadVideo").bind('click', function(e){
	e.preventDefault();
	$("#overlay").hide();
	$("#header").show();
	$("#player").show();
	$("#syncForm").show();
	var url = $("#vsrc").val();
	getVideoId(url);
});

$("#syncVideo").bind('click',function(e){
	e.preventDefault();
	chat.sendVideoId(playerConf.videoId);
});

$("#syncTime").bind('click',function(e){
	e.preventDefault();
	chat.sendTime(player.getCurrentTime());
});

$("#userInput").bind('keyup', function(e){
	e.preventDefault();
	if(e.keyCode === 13){
		chat.sendMessage();
	}
});

$("#send").bind('click', function(e){
	e.preventDefault();
	chat.sendMessage();
});

if(chat.hasGetUserMedia){
	$("#callButton").bind('click', function(e){
		e.preventDefault();
		chat.call();
	});
} else {
	$("#callButton").attr("diabled","disabled");
};

//Resize the video player
$(window).resize(function(){
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var sideFactor = 0.35;
	
	var wMinusRight = Math.round(w - (w*sideFactor));
	var aspectRatio = 16/9;
	var height169 = (wMinusRight * aspectRatio) * sideFactor;
	
	player.setSize(wMinusRight, height169);
});
