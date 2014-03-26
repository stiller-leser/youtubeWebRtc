$("#loadVideo").bind('click', function(e){
	e.preventDefault();
	$("#overlay").hide();
	$("#header").show();
	$("#player").show();
	$("#syncForm").show();
	$("#player").css("margin-left","0");
	resizePlayer();
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
		e.preventDefault();
		chat.sendMessage();
	}
});

$("#send").bind('click', function(e){
	e.preventDefault();
	chat.sendMessage();
});

if(util.supports.audioVideo){
	$("#callButton").bind('click', function(e){
		e.preventDefault();
		$("#callButton").hide();
		$("#callEndButton").show();
		chat.startCall();
	});
	$("#callEndButton").bind('click', function(e){
		e.preventDefault();
		$("#callEndButton").hide();
		$("#callButton").show();
		chat.endCall();
	});
} else {
	$("#callButton").attr("diabled","disabled");
}

var resizePlayer = function(){
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var sideFactor = 0.35;
	
	var wMinusRight = Math.round(w - (w*sideFactor));
	var aspectRatio = 16/9;
	var height169 = (wMinusRight * aspectRatio) * sideFactor;
	
	player.setSize(wMinusRight, height169);	
	
	//and now make the right div as high as the left one
	$("#right").css("height",$("#left").css("height"));
};

//Resize the video player
$(window).resize(function(){
	resizePlayer();
});
