

const module = {

	firebase: null,
	user: null,
	
	init: function(firebase, user) {

		this.firebase = firebase;
		this.user = user;

		const that = this;
		$('#continue-button').click(function(){
			that.continueToChat();
		});
	},

	continueToChat: function() {

		var url = new URL(window.location);
		var destinationUser = url.searchParams.get("with");
	    location.href = './chat.html?with=' + destinationUser;
		
	}

};

export default module;