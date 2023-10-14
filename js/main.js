import firebase from './firebase-loader.js';


$(document).ready(function() {

	initAuth();

	const pageId = $('body').attr("id");
	switch(pageId) {
		case 'signup':
			initSignup();
			break;
		case 'login':
			initLogin();
			break;
		default:
			console.log('Init default case page id');
	}

});


function initAuth(){
	import("./services/auth.js").then((authModule) => {
		authModule = authModule.default;
		authModule.init(firebase).then((user) => {
			initLayoutOnAuth(user);
		})
	});
}


function initSignup() {
	import("./pages/signup.js").then((signupModule) => {
		signupModule = signupModule.default;
		signupModule.init(firebase);
	});
}

function initLogin() {
	import("./pages/login.js").then((loginModule) => {
		loginModule = loginModule.default;
		loginModule.init(firebase);
	});
}

function initLayoutOnAuth(user) {

	console.log(user);


	if ( user ) {
		$('#topbar-user').show();
	} else {
		$('#topbar-signup').show();
	}


}