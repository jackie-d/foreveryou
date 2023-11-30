import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const module = {

	firebase: null,
	user: null,
	db: null,
	
	init: function(firebase, user) {

		this.firebase = firebase;
		this.user = user;

		this.db = getFirestore(firebase);

		const that = this;
		$('#continue-button').click(function(){
			that.continueToChat();
		});

		$('#setup-notifications-button').click(function(){
			
			that.registerFCM();

		});
	},

	continueToChat: function() {

		var url = new URL(window.location);
		var destinationUser = url.searchParams.get("with");
	    location.href = './chat.html?with=' + destinationUser;
		
	},

	registerFCM: function() {

		const messaging = getMessaging(this.firebase);

		let that = this;

		getToken(messaging, {vapidKey: "BDNT2mEmglPVrW0fVFyUbQlWiisOAsBteAHtg38KfYanPe6HdMyYtpm0JNqiNqPRT0bcivGeHurdOCG8fB6PXGU"})
		.then((currentToken) => {
		  if (currentToken) {
		    // Send the token to your server and update the UI if necessary
		    // ...
		    console.log(currentToken);
			that.saveUserFcmToken(currentToken);
			alert('You will receive a Push Notification for new messages.');
		  } else {
		    // Show permission request UI
		    console.log('No registration token available. Request permission to generate one.');
		    that.requestPermission();
		  }
		}).catch((err) => {
		  console.log('An error occurred while retrieving token. ', err);
		  that.requestPermission();
		});

	},

	requestPermission: function() {
		console.log('Requesting permission...');
		const that = this;
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
				that.registerFCM();
			}
		});
	},

	saveUserFcmToken: async function(currentToken) {
		const userRef = doc(this.db, "users", this.user.uid);

		const payload = {
			fcmToken: currentToken
		};

		await setDoc(userRef, payload, {merge: true});
	}

};

export default module;