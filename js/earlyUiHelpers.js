var showCallSettingsButtons = function() {
    $('#callButton').hide();
    $('#callEndButton').show();
    $('#activateMicrophoneButton').show();
    $('#muteCallerButton').show();
};

var hideCallSettingsButtons = function() {
    $('#callButton').show();
    $('#callEndButton').hide();
    $('#activateMicrophoneButton').hide();
    $('#deactivateMicrophoneButton').hide();
    $('#muteCallerButton').hide();
    $('#unmuteCallerButton').hide();
    var v = document.getElementById('partner');
    v.src = '';
};
