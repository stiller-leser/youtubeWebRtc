function Chat(){
	
	var chat = this;
	var conn;
	var connected = false;
	chat.callees = [];
	chat.peer = 0;
	var userId;
	var hasGetUserMedia = false;
	
	if(getURLParameter("id") === null){ //User will be caller
		chat.peer = new Peer({key: 'xoxb2qrmo5xt7qfr'});

		chat.peer.on('open', function(id) {
			$("#header").html("Send this link to your friends<br/>127.0.0.1/webRTC/" + addUrlParam(document.location.search, "id", id));
			chat.userId = id;
		});
		
		chat.peer.on('connection', function(conn) {
			chat.conn = conn;
			chat.connected = true;
			
			// Receive messages
			chat.conn.on('data', function(data) {
				chat.handleMessage(data);
			});
		});
		
		chat.peer.on('call', function(call){
			console.log("caller got called");
			call.answer(chat.getMediaStream());
			call.on('stream', function(stream){
				console.log("caller receives stream");
				var video = window.document.getElementById("partner");
				video.src = stream;
				video.play();
			});
		});
		
	} else { //User will be callee
		$("#overlay").hide();
		$("#player").show();
		$("#syncForm").show();
		
		chat.peer = new Peer({key: 'xoxb2qrmo5xt7qfr'});
		chat.conn = chat.peer.connect(getURLParameter('id'));
		chat.peer.on('open', function(id){
			chat.userId = id;
		});
		
		chat.peer.on('call', function(call){
			console.log("callee got called");
			call.answer(chat.getMediaStream());
			call.on('stream', function(stream){
				console.log("callee is receiving stream");
				var video = window.document.getElementById("partner");
				video.src = stream;
				video.play();
			});
		});
		
		chat.conn.on('open', function(id){
			chat.conn.on('data', function(data){
				chat.handleMessage(data);
			});
		});	
	}
}

Chat.prototype.getMediaStream = function(){
	var navigator = window.navigator;
	navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);
	navigator.getMedia({
		video: true
	}, function(localMediaStream){
		if(navigator.mozGetUserMedia){
			return localMediaStream;
		}else{
			var vendorURL = window.URL || window.webkitURL;
			return vendorURL.createObjectURL(localMediaStream);
		}
	});
};

Chat.prototype.call = function(){
	var target = chat.callees[0];
	console.log(target);
	var call = chat.peer.call(chat.callees[0], chat.getMediaStream());
};

Chat.prototype.answerCall = function(){
	
};

Chat.prototype.sendMessage = function(){
	var message = $("#userInput").val();
	$("#userInput").val("");
	var string = "";
	string = "<p class='bubble outgoing'>"+message+"</p>";
	$("#messages").append(string);
	$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
	chat.conn.send({userId: chat.userId,
					user:message});
};

Chat.prototype.sendState = function(message){
	chat.conn.send({state:message});
};

Chat.prototype.sendVideoId = function(message){
	chat.conn.send({videoId:message});
};

Chat.prototype.sendTime = function(message){
	chat.conn.send({time:message});
};

Chat.prototype.handleMessage = function(data){
	console.log(data);
	if(data.user){//message from user
		var string = "";
		string = "<p class='bubble incoming'>"+data.user+"</p>";
		$("#messages").append(string);
		$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
		if(chat.callees.indexOf(data.userId) === -1){
			chat.callees.push(data.userId);	
		}
	}else if(data.videoId){
		console.log(data.videoId);
		loadVideo(data.videoId);
	}else if(data.state){
		//player
		handleState(data.state);
	}else if(data.time){
		console.log(data.time);
		player.seekTo(data.time);	
	}
};