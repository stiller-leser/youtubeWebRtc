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
        var localStream = callee.getMediaStream();
        console.log(localStream);
        call.answer(localStream);
        callee.handleCall(call);        
    });
}

Callee.prototype = new Participant();
