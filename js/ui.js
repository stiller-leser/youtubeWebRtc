$('#loadVideo').bind('click', function(e) {
    e.preventDefault();
    $('#overlay').hide();
    $('#header').show();
    $('#player').show();
    $('#syncForm').show();
    $('#player').css('margin-left' , '0');
    resizePlayer();
    var url = $('#vsrc').val();
    getVideoId(url);
});

$('#syncVideo').bind('click' , function(e) {
    e.preventDefault();
    role.sendVideoId(playerConf.videoId);
});

$('#syncTime').bind('click' , function(e) {
    e.preventDefault();
    role.sendTime(player.getCurrentTime());
});

$('#userInput').bind('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        role.sendMessage();
    }
    role.sendPartnerIsTyping(true);
});

$('#userInput').bind('keyup', function(e) {
    e.preventDefault();
    role.sendPartnerStoppedTyping(true);
});

$('#send').bind('click', function(e) {
    e.preventDefault();
    role.sendMessage();
});

if (util.supports.audioVideo) {
    $('#callButton').bind('click', function(e) {
        showCallSettingsButtons();
        e.preventDefault();
        role.startCall();
    });

    $('#callEndButton').bind('click', function(e) {
        e.preventDefault();
        role.endCall();
        hideCallSettingsButtons();
    });

    $('#activateMicrophoneButton').bind('click', function(e) {
        e.preventDefault();
        role.unmuteMicrophone();
        $('#activateMicrophoneButton').hide();
        $("#deactivateMicrophoneButton").show();
    });

    $('#deactivateMicrophoneButton').bind('click', function(e) {
        e.preventDefault();
        role.muteMicrophone();
        $('#deactivateMicrophoneButton').hide();
        $("#activateMicrophoneButton").show();
    });

    $('#muteCallerButton').bind('click', function(e) {
        e.preventDefault();
        role.muteCaller();
        $('#muteCallerButton').hide();
        $("#unmuteCallerButton").show();
    });

    $('#unmuteCallerButton').bind('click', function(e) {
        e.preventDefault();
        role.unmuteCaller();
        $('#unmuteCallerButton').hide();
        $("#muteCallerButton").show();
    });

    $('#partner').bind('click', function(e) {
        e.preventDefault();
        var elem = document.getElementById('partner');

        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            }
        }
    });
    
} else {
    $('#callButton').attr('diabled' , 'disabled');
}

var resizePlayer = function() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var sideFactor = 0.35;
    var wMinusRight = Math.round(w - (w * sideFactor));
    var aspectRatio = 16 / 9;
    var height169 = (wMinusRight * aspectRatio) * sideFactor;
    player.setSize(wMinusRight, height169);
    //and now make the right div as high as the left one
    $('#right').css('height' , $('#left').css('height'));
};

//Resize the video player
$(window).resize(function() {
    resizePlayer();
});
