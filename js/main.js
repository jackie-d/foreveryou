import firebase from './firebase-loader.js';

let user = null;


$(() => {init()});

async function init() {

	console.log('init');

	user = await initAuth();

	const pageId = $('body').attr("id");
	switch(pageId) {
		case 'signup':
			initSignup();
			break;
		case 'login':
			initLogin();
			break;
		case 'profile':
			initProfile();
			break;
		case 'guest-login':
			initGuestLogin();
			break;
		case 'chat':
			initChat();
			break;
		case 'guest-notification':
			initGuestNotification();
			break;
		default:
			console.log('Init default case page id');
	}

}


function initAuth(){
	return import("./services/auth.js").then((authModule) => {
		authModule = authModule.default;
		return authModule.init(firebase).then((user) => {
			initLayoutOnAuth(user);
			return user;
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
		loginModule.init(firebase, user);
	});
}

function initProfile() {
	import("./pages/profile.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initGuestLogin() {
	import("./pages/guest-login.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initChat() {
	import("./pages/chat.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initGuestNotification() {
	import("./pages/guest-notification.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
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