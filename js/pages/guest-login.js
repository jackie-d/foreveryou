import { GoogleAuthProvider, getAuth, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


const module = {

	firebase: null,
	user: null,
	
	init: function(firebase, user) {

		this.firebase = firebase;
		this.user = user;

		if ( user ) {
			var url = new URL(window.location);
			var destinationUser = url.searchParams.get("with");
		    location.href = './send-notification.html?with=' + destinationUser;
		    return;
		}

		const that = this;
		$('#google-login').click(function(){
			that.loginByGoogle();
		});
	},

	loginByGoogle: function() {
		const provider = new GoogleAuthProvider();

		const auth = getAuth();
		signInWithPopup(auth, provider)
		  .then((result) => {
		    // This gives you a Google Access Token. You can use it to access the Google API.
		    const credential = GoogleAuthProvider.credentialFromResult(result);
		    const token = credential.accessToken;
		    // The signed-in user info.
		    const user = result.user;

		    var url = new URL(window.location);
			var destinationUser = url.searchParams.get("with");
		    location.href = './send-notification.html?with=' + destinationUser;

		    // IdP data available using getAdditionalUserInfo(result)
		    // ...
		  }).catch((error) => {
		    // Handle Errors here.
		    const errorCode = error.code;
		    const errorMessage = error.message;
		    // The email of the user's account used.
		    const email = error.customData.email;
		    // The AuthCredential type that was used.
		    const credential = GoogleAuthProvider.credentialFromError(error);

		    console.log('error', error);
		    // ...
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
		    location.href="./";
		  })
		  .catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
		  });

	}

};

export default module;