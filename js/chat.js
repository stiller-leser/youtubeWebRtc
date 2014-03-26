function Chat(){
	
	var chat = this;
	var conn;
	var connected = false;
	chat.call = 0;
	chat.callees = [];
	chat.peer = 0;
	var userId;
	var hasGetUserMedia = false;
	
	if(getURLParameter("id") === null){ //User will be caller
		chat.peer = new Peer({key: 'xoxb2qrmo5xt7qfr'});

		chat.peer.on('open', function(id) {
			var link = addUrlParam(document.location.search, "id", id);
			$("#header").html("Send this link to your friends<br/><a href='"+link+"' target='_blank'>"+link+"</a>");
			chat.userId = id;
		});
		
		chat.peer.on('connection', function(conn) {
			chat.conn = conn;
			console.log(chat.callees.length);
			if(chat.callees.length < 1){//no caller
				
				setTimeout(function(){
					$("#rightOverlay").hide();
					var string = "";
					string = "<p class='bubble outcoming'>Your partner joined the room</p>";
					$("#messages").append(string);
					$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
				}, 1500);

				setTimeout(function(){
					chat.sendSyncVideo(playerConf.videoId);
					chat.sendSyncUserId(chat.userId);
				}, 1000);

				// Receive messages
				chat.conn.on('data', function(data) {
					chat.handleMessage(data);
				});
			} else { //more than one caller
				setTimeout(function(){
					chat.sendRoomFull(true);
				}, 1000);
			}
		});
		
		chat.peer.on('call', function(call){
			console.log("caller is answering call");
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
			navigator.getUserMedia({
				video: true
			},function(stream){
				var localStream = null;
				if(navigator.mozGetUserMedia){
					localStream = localMediaStream;
				}else{
					var vendorURL = window.URL || window.webkitURL;
					localStream = vendorURL.createObjectURL(localMediaStream);
				}
				call.answer(localStream);
				call.on('stream', function(remoteStream){
					console.log("caller is receiving stream");
					console.log("callers remote stream");
					console.log(remoteStream);
					var v = document.getElementById("partner");
					console.log(v);
					v.src = URL.createObjectURL(remoteStream);
					v.play();
				});
			},
			function(err){	
				console.log("caller error next line");
				console.log(err);
				call.answer();
				call.on('stream', function(remoteStream){
					console.log("caller is receiving stream");
					console.log("callers remote stream");
					console.log(remoteStream);
					var v = document.getElementById("partner");
					console.log(v);
					v.src = URL.createObjectURL(remoteStream);
					v.play();
				});
			});
		});
		
	} else { //User will be callee
		$("#overlay").hide();
		$("#player").css("margin-left","0");
		$("#syncForm").show();
		$("#rightOverlay").hide();
		
		chat.peer = new Peer({key: 'xoxb2qrmo5xt7qfr'});
		chat.conn = chat.peer.connect(getURLParameter('id'));
		chat.peer.on('open', function(id){
			chat.userId = id;
		});
		
		chat.peer.on('call', function(call){
			chat.call = call;
			console.log("callee is answering call");
			$("#callButton").hide();
			$("#callEndButton").show();
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
			navigator.getUserMedia({
				video: true
			},function(stream){
				var localStream = null;
				if(navigator.mozGetUserMedia){
					localStream = localMediaStream;
				}else{
					var vendorURL = window.URL || window.webkitURL;
					localStream = vendorURL.createObjectURL(stream);
				}
				chat.call.answer(localStream);
				var v = document.getElementById("partner");
					console.log(v);
					v.src = localStream;
					v.play();
				chat.call.on('stream', function(remoteStream){
					console.log("callee is receiving stream");
					console.log("callees remote stream");
					console.log(remoteStream);
					var v = document.getElementById("partner");
					console.log(v);
					v.src = URL.createObjectURL(remoteStream);
					v.play();
				});
			},
			function(err){
				console.log("callee error next line");
				console.log(err);	
				call.answer();
				call.on('stream', function(remoteStream){
					console.log("callee is receiving stream");
					console.log("callees remote stream");
					console.log(remoteStream);
					var v = document.getElementById("partner");
					console.log(v);
					v.src = URL.createObjectURL(remoteStream);
					v.play();
				});
			});
		});
		
		chat.conn.on('open', function(id){
			setTimeout(function(){
				chat.sendSyncUserId(chat.userId);
				setTimeout(function(){
					var string = "";
					string = "<p class='bubble outcoming'>You are now connected</p>";
					$("#messages").append(string);
					$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
				}, 500);
			}, 1000);
			
			chat.conn.on('data', function(data){
				chat.handleMessage(data);
			});
		});	
	}
}

Chat.prototype.sendMessage = function(){
	var message = $("#userInput").val();
	$("#userInput").val("");
	var string = "";
	string = "<p class='bubble outgoing'>"+message+"</p>";
	$("#messages").append(string);
	$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
	chat.conn.send({user:message});
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

Chat.prototype.sendSyncVideo = function(message){
	chat.sendVideoId({videoId:message});	
};

Chat.prototype.sendSyncUserId = function(message){
	chat.conn.send({userId:message});
};

Chat.prototype.sendRoomFull = function(message){
	chat.conn.send({roomFull:message});
};

Chat.prototype.sendCallClosed = function(message){
	console.log(message);
	chat.conn.send({callClosed:message});
};

Chat.prototype.handleMessage = function(data){
	console.log(data);
	if(data.user){//message from user
		var string = "";
		string = "<p class='bubble incoming'>"+data.user+"</p>";
		$("#messages").append(string);
		$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
	}else if(data.userId){
		chat.callees.push(data.userId);
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
		alert("Der Raum ist voll");
		chat.peer.destroy();
	}else if(data.callClosed){
		$("#callEndButton").hide();
		$("#callButton").show();
	}
};

Chat.prototype.startCall = function(){
	var target = chat.callees[0];
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
	navigator.getUserMedia({
		video: true
	},function(stream){
		console.log("called");
		chat.call = chat.peer.call(target, stream);
		chat.call.on('stream', function(remoteStream){
			var v = document.getElementById("partner");
			console.log(v);
			v.src = remoteStream;
			v.play();
		});
	});
};

Chat.prototype.endCall = function(){
	$("#callEndButton").hide();
	$("#callButton").show();
	chat.call.close();
	chat.sendCallClosed(true);
};