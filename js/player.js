var playerConf = {
	videoId: ""
};

function onPlayerReady(){
	$("#videoSource").show();
}

function onPlayerStateChange(){
	//chat.sendState(player.getPlayerState());
}

var getVideoId = function(url){
	var videoId = url.split("v=")[1];
	var ampersandPos = videoId.indexOf("&");
	if (ampersandPos != -1) {
		videoId = videoId.substring(0, ampersandPos);
	}
	playerConf.videoId = videoId;
	loadVideo(videoId);
};

var loadVideo = function(videoId){
	player.cueVideoById(videoId);
};

var play = function(){
	player.playVideo();
};

var stop = function(){
	player.stopVideo();
};

var pause = function(){
	player.pauseVideo();
};

var handleState = function(state){
	switch(state){
		case -1: //player is not yet started
			stop();
		break;
		case 0: //video ended
			stop();
		break;
		case 1: //video is playing
			play();
		break;
		case 2: //video is paused
			pause();
		break;
	}
};