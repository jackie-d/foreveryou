import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const module = {

    firebase: null,
	
	init: function(firebase) {
        this.firebase = firebase;

        this.startupHome();

        const that = this;
		$('#quick-signup-submit').click(function(){
			that.signupByEmail();
		});

		$('#strip-signup-submit').click(function(){
			that.signupByEmail(true);
		});

		$('#signup-google-button').click(function(){
			that.signupByGoogle();
		});
    },

    startupHome: function() {
        $("#description-image-toggler").click(() => {
            $("#description-image-toggler img:first-child").toggle();
            $("#description-image-toggler img:last-child").toggle();
        });
    },

    signupByEmail: function(isStripSignup = false) {

		const auth = getAuth(this.firebase);

		let $email = $('#quick-signup-email');
		let $password = $('#quick-signup-password');

		if ( isStripSignup ) {
			$email = $("#strip-signup-email");
			$password = $("#strip-signup-password");
		}

		const email = $email.val();
		const password = $password.val();
	
		createUserWithEmailAndPassword(auth, email, password)
		  .then((userCredential) => {
		    // Signed up 
		    const user = userCredential.user;
		    console.log(user);
		    location.href = "./?create=true";
		  })
		  .catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
			alert(error.message);
		    // ..
		  });

	},

	signupByGoogle: function() {
		const provider = new GoogleAuthProvider();

		const auth = getAuth();
		signInWithPopup(auth, provider)
		  .then((result) => {
		    const credential = GoogleAuthProvider.credentialFromResult(result);
		    const token = credential.accessToken;
		    const user = result.user;

		    location.href = "./?create=true";
		  }).catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
		    const email = error.customData.email;
		    const credential = GoogleAuthProvider.credentialFromError(error);
		    console.log('error', error);
		  });
	}

};

export default module;