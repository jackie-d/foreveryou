import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";

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

		$('#setup-notifications-button').click(function(){
			const messaging = getMessaging(this.firebase);

			getToken(messaging, {vapidKey: "BDNT2mEmglPVrW0fVFyUbQlWiisOAsBteAHtg38KfYanPe6HdMyYtpm0JNqiNqPRT0bcivGeHurdOCG8fB6PXGU"})
			.then((currentToken) => {
			  if (currentToken) {
			    // Send the token to your server and update the UI if necessary
			    // ...
			    console.log(currentToken);
			  } else {
			    // Show permission request UI
			    console.log('No registration token available. Request permission to generate one.');
			    that.requestPermission();
			  }
			}).catch((err) => {
			  console.log('An error occurred while retrieving token. ', err);
			  // ...
			});

		});
	},

	continueToChat: function() {

		var url = new URL(window.location);
		var destinationUser = url.searchParams.get("with");
	    location.href = './chat.html?with=' + destinationUser;
		
	},

	requestPermission: function() {
		console.log('Requesting permission...');
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			}
		});
	}

};

export default module;