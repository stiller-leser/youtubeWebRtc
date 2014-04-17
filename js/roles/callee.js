function Callee() {
    Participant.apply(this);

    var callee = this;

    $('#overlay').hide();
    $('#player').css('margin-left' , '0');
    $('#syncForm').show();
    $('#rightOverlay').hide();

    callee.peer = new Peer({key: callee.apiKey});
    callee.conn = this.peer.connect(getURLParameter('id'));
    callee.peer.on('open', function(id) {
        callee.userId = id;
    });

    callee.conn.on('open', function(id) {
        setTimeout(function() {
            callee.sendSyncUserId(callee.userId);
            setTimeout(function() {
                var string = '';
                string = '<p class="bubble outcoming">You are now connected</p>';
                $('#messages').append(string);
                $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')},500);
            }, 500);
        }, 1000);

        callee.conn.on('data', function(data) {
            callee.handleMessage(data);
        });
    });

    callee.peer.on('call', function(call) {
        console.log('callee is answering call');
        showCallSettingsButtons();
        callee.call = call;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia({
            audio: true,
            video: true
        },function(stream) {
            stream.getAudioTracks()[0].enabled = false;
            call.answer(stream);
            callee.handleCall();  
            console.log('called'); 
        },function(error) {
            console.log(error);
        });
    });
}

Callee.prototype = new Participant();
