var chat = new Chat();
if(hasGetUserMedia()){
	chat.hasGetUserMedia = true;
} else {
	alert("Calls won't work with your browser");
}