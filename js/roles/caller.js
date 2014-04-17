function Caller() {
    Participant.apply(this);

    var caller = this;

    caller.peer = new Peer({key: caller.apiKey});

    caller.peer.on('open', function(id) {
        console.log('here');
        var link = document.URL + addUrlParam(document.location.search, 'id', id);
        $('#header').html('<h1>Send this link to your friends<br/><a href="' + link + '" target="_blank">'+link+'</a></h1>');
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
            }, 1000);

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
        console.log("Caller is answering the call");
        caller.call = call;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia({
            audio: true,
            video: true
        },function(stream) {
            stream.getAudioTracks()[0].enabled = false;
            call.answer(stream);
            caller.handleCall();  
            console.log('called'); 
        },function(error) {
            console.log(error);
        });
    });
}

Caller.prototype = new Participant();
