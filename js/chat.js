function Chat(){
	if(getURLParameter("id") === null){ //User will be caller
		var caller = new Caller(); //$.extend({}, new Participant(), new Caller());
		role = caller;		
	} else { 
		var callee = new Callee();
		role = callee;
	}
}