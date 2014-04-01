function Caller() {
    Participant.apply(this);

    var caller = this;

    caller.peer = new Peer({key: caller.apiKey});

    caller.peer.on('open', function(id) {
        console.log('here');
        var link = addUrlParam(document.location.search, 'id', id);
        $('#header').html('Send this link to your friends<br/><a href="' + link + '" target="_blank">'+link+'</a>');
        caller.userId = id;
    });

    caller.peer.on('connection', function(conn) {
        caller.conn = conn;
        console.log(caller.callees.length);
        if (caller.callees.length < 1) {//no caller
            setTimeout(function() {
                $('#rightOverlay').hide();
                var string = '';
                string = '<p class="bubble outcoming">Your partner joined the room</p>';
                $('#messages').append(string);
                $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')},500);
            }, 1500);

            setTimeout(function() {
                caller.sendSyncVideo(playerConf.videoId);
                caller.sendSyncUserId(caller.userId);
            }, 3000);

            // Receive messages
            caller.conn.on('data', function(data) {
                caller.handleMessage(data);
            });
        } else { //more than one caller
            setTimeout(function() {
                caller.sendRoomFull(true);
            }, 1000);
        }
    });

    caller.peer.on('call', function(call) {
         showCallSettingsButtons();

        console.log('caller is answering call');
        var localStream = caller.getMediaStream();

        call.answer(localStream);
        call.on('stream', function(remoteStream) {
            console.log('caller is receiving stream');
            console.log('callers remote stream');
            console.log(remoteStream);
            caller.localStream = localStream;
            caller.remoteStream = remoteStream;
            caller.showVideo();
        });
    });
}

Caller.prototype = new Participant();
