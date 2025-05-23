import firebase from './firebase-loader.js';

import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";


let user = null;
let authModule = null;
let userModule = null;


$(() => {init()});

async function init() {

	console.log('init');

	user = await initAuth();
	initNotification();

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
		case 'search':
			initSearch();
			break;
		case 'chats':
			initChats();
			break;
		case 'home':
			initHome();
			break;
		default:
			console.log('Init default case page id');
	}

}


function initAuth(){
	return import("./services/auth.js").then((authModuleExport) => {
		authModule = authModuleExport.default;
		return authModule.init(firebase).then((user) => {

			return import("./services/user.js").then((userModuleExport) => {
				userModule = userModuleExport.default;
				return userModule.init(firebase, user).then(() => {
					userModule.getUserInstance().then(userData => {
						initLayoutOnAuth(userData);
					});
					return user;
				});
			});

		})
	});
}


	let toastBootstrap;


function initNotification() {
	const messaging = getMessaging(firebase);

	const toast = `<div class="toast-container position-fixed bottom-0 end-0 p-3">
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
  <div class="toast-header">
    <!--<img src="..." class="rounded me-2" alt="...">-->
    <strong class="me-auto toast-title">Bootstrap</strong>
    <!--<small class='label'>11 mins ago</small>-->
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    <span>Hello, world! This is a toast message.</span>
	<div class="mt-2 pt-2 border-top">
      <a type="button" class="btn btn-primary btn-sm toast-link" href="#">Read now</a>
    </div>
  </div>
</div>
  </div>

`;


	onMessage(messaging, (payload) => {
		console.log('Message received. ', payload);

		if ( payload.data.action == 'sending' ) {
			return;
		}

		if ( location.pathname == '/chat.html' && location.search.indexOf('=' + payload.data.fromId ) != -1 ) {
				return;
		}

		let $toast = $(toast);
		$toast.find('.toast-body span').text(payload.data.body);
		$toast.find('.toast-title').text('You got a new message');
		// 			window.open(event.notification.data.url);
	  const destinationUrl = self.location.protocol + '//' + self.location.host + '/chat.html?with=' + payload.data.fromId
	  $toast.find('.toast-link').attr('href', destinationUrl);
		$toast.appendTo('body');

		if ( toastBootstrap ) toastBootstrap.hide();
		toastBootstrap = new bootstrap.Toast($toast.get(0), {autohide: false})
		toastBootstrap.show();
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

function initSearch() {
	import("./pages/search.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initChats() {
	import("./pages/chats.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initHome() {
	import("./pages/home.js").then((module) => {
		module = module.default;
		module.init(firebase, user);
	});
}

function initLayoutOnAuth(userData) {

	let url = new URL(window.location.href)
	let params = new URLSearchParams(url.search);
	if ( params.get('create') && !userData) {
		userData = {};
	}

	if ( userData ) {
		$('#topbar-user').show();
		$(".navbar .navbar-brand").attr("href", "./");
	} else {
		$('#topbar-signup').show();
	}

	if ( userData?.imageSrc ) {
		$('#navbar-profile-picture').attr('src', userData.imageSrc);
	}

	// handle signout button
	$('.signout-button').click(async () => {
		await userModule.removeFcmToken();
		authModule.signOut().then(() => {
			location.href = './';
		}).catch((error) => {
			console.log(error);
		});
	})

}