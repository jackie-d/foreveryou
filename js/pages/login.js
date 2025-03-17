import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


const module = {

	firebase: null,
	
	init: function(firebase) {
		console.log(firebase);

		this.firebase = firebase;

		const that = this;
		$('#loginButton').click(function(){
			that.loginByEmail();
		});

		$('#login-button-google').click(function(){
			that.loginByGoogle();
		});

		$('#login-button-facebook').click(function(){
			that.loginByFacebook();
		});
	},

	loginByEmail: function() {

		const auth = getAuth(this.firebase);

		const email = $('#email').val();
		const password = $('#password').val();
	
		signInWithEmailAndPassword(auth, email, password)
		  .then((userCredential) => {
		    // Signed in 
		    const user = userCredential.user;
		    console.log(user);

			const redirectUrl = this.getRedirectLocation();

		    location.href = redirectUrl;
		  })
		  .catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
			console.log(errorCode);
			alert(errorMessage);
		  });

	},

	loginByGoogle: function() {
		const provider = new GoogleAuthProvider();

		const auth = getAuth();
		signInWithPopup(auth, provider)
		  .then((result) => {
		    const credential = GoogleAuthProvider.credentialFromResult(result);
		    const token = credential.accessToken;
		    const user = result.user;

			const redirectUrl = this.getRedirectLocation();

		    location.href = redirectUrl;
		  }).catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
		    const email = error.customData.email;
		    const credential = GoogleAuthProvider.credentialFromError(error);
		    console.log('error', error);
		  });
	},

	loginByFacebook: function() {

	},

	getRedirectLocation: function() {
		let destinationUrl = './';

		var currentUrl = new URL(window.location);
		var withUser = currentUrl.searchParams?.get("with");
		if ( withUser ) {
			destinationUrl = './send-notification.html?with=' + withUser;
		}

		return destinationUrl;
	}

};

export default module;