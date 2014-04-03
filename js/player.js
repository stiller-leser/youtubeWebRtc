var playerConf = {
    videoId: '',
    changed: false
};

function onPlayerReady() {
    $('#videoSource').show();
    loadVideo(playerConf.videoId);
}

function onPlayerStateChange() {
    role.sendState(player.getPlayerState());
}

var getVideoId = function(url) {
    var videoId = url.split('v=')[1];
    var ampersandPos = videoId.indexOf('&');
    if (ampersandPos != -1) {
        videoId = videoId.substring(0, ampersandPos);
    }
    playerConf.videoId = videoId;
    loadVideo(videoId);
};

var loadVideo = function(videoId) {
    player.cueVideoById(videoId);
};

var play = function() {
    player.playVideo();
};

var stop = function() {
    player.stopVideo();
};

var pause = function() {
    player.pauseVideo();
};

var handleState = function(state) {
    if (playerConf.changed === false) {
        switch (state) {
            case -1: //player is not yet started
                stop();
                role.sendTime(player.getCurrentTime());                
            break;
            case 0: //video ended
                stop();
                role.sendTime(player.getCurrentTime());                
            break;
            case 1: //video is playing
                play();
            break;
            case 2: //video is paused
                pause();
                role.sendTime(player.getCurrentTime());
            break;
        }
        playerConf.changed = true;
        setTimeout(function() {
            playerConf.changed = false;
        }, 1000);
    }
};
