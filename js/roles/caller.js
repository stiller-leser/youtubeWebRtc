function Caller(){
	Participant.apply(this);
	
	var caller = this;
	
	caller.peer = new Peer({key: caller.apiKey});
	
	caller.peer.on('open', function(id) {
		console.log("here");
		var link = addUrlParam(document.location.search, "id", id);
		$("#header").html("Send this link to your friends<br/><a href='"+link+"' target='_blank'>"+link+"</a>");
		caller.userId = id;
	});

	caller.peer.on('connection', function(conn) {
		caller.conn = conn;
		console.log(caller.callees.length);
		if(caller.callees.length < 1){//no caller
			setTimeout(function(){
				$("#rightOverlay").hide();
				var string = "";
				string = "<p class='bubble outcoming'>Your partner joined the room</p>";
				$("#messages").append(string);
				$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
			}, 1500);

			setTimeout(function(){
				caller.sendSyncVideo(playerConf.videoId);
				caller.sendSyncUserId(caller.userId);
			}, 1000);

			// Receive messages
			caller.conn.on('data', function(data) {
				caller.handleMessage(data);
			});
		} else { //more than one caller
			setTimeout(function(){
				caller.sendRoomFull(true);
			}, 1000);
		}
	});

	caller.peer.on('call', function(call){
		$("#callButton").hide();
		$("#callEndButton").show();
		console.log("caller is answering call");
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		navigator.getUserMedia({
			audio: true,
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
}

Caller.prototype = new Participant();