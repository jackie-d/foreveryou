import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


const module = {

	firebase: null,
	
	init: function(firebase) {
		console.log(firebase);

		this.firebase = firebase;

		const that = this;
		$('#loginButton').click(function(){
			that.loginByEmail();
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