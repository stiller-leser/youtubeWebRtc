function Participant() {
    this.callees = [];
    this.apiKey = 'xoxb2qrmo5xt7qfr';
    return this;
}

Participant.prototype.sendMessage = function() {
    var message = $('#userInput').val();
    $('#userInput').val('');
    var string = '';
    string = '<p class="bubble outgoing">' + message + '</p>';
    $('#messages').append(string);
    $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight')} , 500);
    this.conn.send({ user: message});
};

Participant.prototype.sendState = function(message) {
    if (this.conn) {
        this.conn.send({state: message});
    }
};

Participant.prototype.sendVideoId = function(message) {
    this.conn.send({videoId: message});
};

Participant.prototype.sendTime = function(message) {
    this.conn.send({time: message});
};

Participant.prototype.sendSyncVideo = function(message) {
    this.sendVideoId({videoId: message});
};

Participant.prototype.sendSyncUserId = function(message) {
    this.conn.send({userId: message});
};

Participant.prototype.sendRoomFull = function(message) {
    this.conn.send({roomFull: message});
};

Participant.prototype.sendCallClosed = function(message) {
    console.log(message);
    this.conn.send({callClosed: message});
};

Participant.prototype.sendPartnerIsTyping = function(message) {
    this.conn.send({isTyping: message});
};

Participant.prototype.sendPartnerStoppedTyping = function(message) {
    this.conn.send({stoppedTyping: message});
};

Participant.prototype.handleMessage = function(data) {
    console.log(data);
    if (data.user) { //message from user
        var string = '';
        string = '<p class="bubble incoming">' + data.user + '</p>';
        $('#messages').append(string);
        $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight')},500);
    }else if (data.userId) {
        this.callees.push(data.userId);
        console.log(this.callees);
    }else if (data.videoId) {
        console.log(data.videoId);
        loadVideo(data.videoId);
    }else if (data.state) {
        //player
        handleState(data.state);
    }else if (data.time) {
        console.log(data.time);
        player.seekTo(data.time);
    }else if (data.roomFull) {
        alert('The room is full');
        this.peer.destroy();
    }else if (data.callClosed) {
        hideCallSettingsButtons();
        if (this.localStream) {
            this.localStream.stop();
        }
    }else if (data.isTyping) {
        $("#partnerIsTyping").show();
    }else if (data.stoppedTyping) {
    	$("#partnerIsTyping").hide();
    }
};

Participant.prototype.getMediaStream = function() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var localStream = null;

    navigator.getUserMedia({
        audio: true,
        video: true
    },function(stream) {
        if (navigator.mozGetUserMedia) {
            localStream = stream;
        }else {
            var vendorURL = window.URL || window.webkitURL;
            localStream = vendorURL.createObjectURL(stream);
        }
        return localStream;
    },function(err) {
        console.log(err);
    });
};

Participant.prototype.startCall = function() {
    var participant = this;
    var target = participant.callees[0];
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({
        audio: true,
        video: true
    },function(stream) {
        console.log('called');
        stream.getAudioTracks()[0].enabled = false;
        participant.localStream = stream;
        participant.call = participant.peer.call(target, stream);
    },function(error) {
        console.log(error);
    });
};

Participant.prototype.endCall = function() {
    this.call.close();
    if (this.localStream) {
        this.localStream.stop();
    }
    this.sendCallClosed(true);
};

Participant.prototype.showVideo = function() {
    var v = document.getElementById('partner');
    console.log(v);
    //this.remoteStream.getAudioTracks()[0].enabled = false;
    v.src = URL.createObjectURL(this.remoteStream);
    v.play();
};

Participant.prototype.unmuteMicrophone = function() {
    this.localStream.getAudioTracks()[0].enabled = true;
};

Participant.prototype.muteMicrophone = function() {
    this.localStream.getAudioTracks()[0].enabled = false;
};

Participant.prototype.muteCaller = function() {
    var v = document.getElementById('partner');
    v.muted = true;
};

Participant.prototype.unmuteCaller = function() {
    var v = document.getElementById('partner');
    v.muted = false;
};
