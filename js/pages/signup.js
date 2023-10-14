import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


const module = {

	firebase: null,
	
	init: function(firebase) {
		console.log(firebase);

		this.firebase = firebase;

		const that = this;
		$('#signupButton').click(function(){
			that.signupByEmail();
		});
	},

	signupByEmail: function() {

		const auth = getAuth(this.firebase);

		const email = $('#email').val();
		const password = $('#password').val();
	
		createUserWithEmailAndPassword(auth, email, password)
		  .then((userCredential) => {
		    // Signed up 
		    const user = userCredential.user;
		    console.log(user);
		    location.href = "./";
		  })
		  .catch((error) => {
		    const errorCode = error.code;
		    const errorMessage = error.message;
		    // ..
		  });

	}

};

export default module;