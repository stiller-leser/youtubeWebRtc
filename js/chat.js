function Chat(){
	
	var chat = this;
	var conn;
	var connected = false;
	chat.callees = [];
	chat.peer = 0;
	var userId;
	var hasGetUserMedia = false;
	
	if(getURLParameter("id") === null){ //User will be caller
		chat.peer = new Peer({key: ''});

		chat.peer.on('open', function(id) {
			var link = addUrlParam(document.location.search, "id", id);
			$("#header").html("Send this link to your friends<br/><a href='"+link+"' target='_blank'>"+link+"</a>");
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
		$("#player").show();
		$("#syncForm").show();
		
		chat.peer = new Peer({key: ''});
		chat.conn = chat.peer.connect(getURLParameter('id'));
		chat.peer.on('open', function(id){
			chat.userId = id;
		});
		
		chat.peer.on('call', function(call){
			console.log("callee is answering call");
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
				call.answer(localStream);
				var v = document.getElementById("partner");
					console.log(v);
					v.src = localStream;
					v.play();
				call.on('stream', function(remoteStream){
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
			chat.conn.on('data', function(data){
				chat.handleMessage(data);
			});
		});	
	}
}

Chat.prototype.call = function(){
	var target = chat.callees[0];
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
	navigator.getUserMedia({
		video: true
	},function(stream){
		console.log("called");
		var call = chat.peer.call(target, stream);
		call.on('stream', function(remoteStream){
			var v = document.getElementById("partner");
			console.log(v);
			v.src = remoteStream;
			v.play();
		});
	});
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