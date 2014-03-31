function Callee(){
	Participant.apply(this);
	
	var callee = this;
	
	$("#overlay").hide();
	$("#player").css("margin-left","0");
	$("#syncForm").show();
	$("#rightOverlay").hide();

	callee.peer = new Peer({key: callee.apiKey});
	callee.conn = this.peer.connect(getURLParameter('id'));
	callee.peer.on('open', function(id){
		callee.userId = id;
	});
	
	callee.conn.on('open', function(id){
		setTimeout(function(){
			callee.sendSyncUserId(callee.userId);
			setTimeout(function(){
				var string = "";
				string = "<p class='bubble outcoming'>You are now connected</p>";
				$("#messages").append(string);
				$("#messages").animate({scrollTop: $("#messages").prop("scrollHeight")},500);
			}, 500);
		}, 1000);

		callee.conn.on('data', function(data){
			callee.handleMessage(data);
		});
	});	

	callee.peer.on('call', function(call){
		callee.call = call;
		console.log("callee is answering call");
		$("#callButton").hide();
		$("#callEndButton").show();
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
				localStream = vendorURL.createObjectURL(stream);
			}
			this.call.answer(localStream);
			var v = document.getElementById("partner");
				console.log(v);
				v.src = localStream;
				v.play();
			this.call.on('stream', function(remoteStream){
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
}

Callee.prototype = new Participant();