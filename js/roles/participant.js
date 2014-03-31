function Participant(){
	this.callees = [];
	this.apiKey = "xoxb2qrmo5xt7qfr";
	return this;
}

Participant.prototype.sendMessage = function(){
	var message = $("#userInput").val();
	$("#userInput").val("");
	var string = "";
	string = "<p class='bubble outgoing'>"+message+"</p>";
	$("#messages").append(string);
	$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
	this.conn.send({user:message});
};

Participant.prototype.sendState = function(message){
	this.conn.send({state:message});
};

Participant.prototype.sendVideoId = function(message){
	this.conn.send({videoId:message});
};

Participant.prototype.sendTime = function(message){
	this.conn.send({time:message});
};

Participant.prototype.sendSyncVideo = function(message){
	this.sendVideoId({videoId:message});	
};

Participant.prototype.sendSyncUserId = function(message){
	this.conn.send({userId:message});
};

Participant.prototype.sendRoomFull = function(message){
	this.conn.send({roomFull:message});
};

Participant.prototype.sendCallClosed = function(message){
	console.log(message);
	this.conn.send({callClosed:message});
};

Participant.prototype.handleMessage = function(data){
	console.log(data);
	if(data.user){//message from user
		var string = "";
		string = "<p class='bubble incoming'>"+data.user+"</p>";
		$("#messages").append(string);
		$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
	}else if(data.userId){
		this.callees.push(data.userId);
		console.log(this.callees);
	}else if(data.videoId){
		console.log(data.videoId);
		loadVideo(data.videoId);
	}else if(data.state){
		//player
		handleState(data.state);
	}else if(data.time){
		console.log(data.time);
		player.seekTo(data.time);	
	}else if(data.roomFull){
		alert("The room is full");
		this.peer.destroy();
	}else if(data.callClosed){
		$("#callEndButton").hide();
		$("#callButton").show();
	}
};

Participant.prototype.startCall = function(){
	
	var participant = this;
	
	var target = participant.callees[0];
		
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
	navigator.getUserMedia({
		audio: true,
		video: true
	},function(stream){
		console.log("called");
		participant.call = participant.peer.call(target, stream);
		participant.call.on('stream', function(remoteStream){
			var v = document.getElementById("partner");
			console.log(v);
			v.src = remoteStream;
			v.play();
		});
	},function(error){
		console.log(error);	
	});
};

Participant.prototype.endCall = function(){
	$("#callEndButton").hide();
	$("#callButton").show();
	this.call.close();
	this.sendCallClosed(true);
};