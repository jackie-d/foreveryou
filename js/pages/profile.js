import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";


const module = {

	firebase: null,
	user: null,
	db: null,
	userData: null,
	userId: null,
	storage: null,
	
	init: async function(firebase, user) {

		this.firebase = firebase;
		this.user = user;
		this.storage = getStorage(firebase);

		const $profileName = $('#profile-name');
		const $profileNotes = $('#profile-notes');
		const $profilePermalink = $('#profile-permalink');
		const $profileContainer = $('#profile-image-container');

		const userShown = this.getUserShown(user);

		// TODO
		if ( !userShown ) {
			window.location.href = './home.html';
			return;
		}

		this.db = getFirestore(firebase);

		const usersRef = collection(this.db, "users");

		const q = query(usersRef, where("permalink", "==", userShown));
		const querySnapshot = await getDocs(q);

  		let userId = null;

		if ( querySnapshot.size > 0 ) {

			querySnapshot.forEach((doc) => {
			  	console.log(doc.id, " => ", doc.data());
				this.userData = doc.data();
				userId = doc.id;
			});

		} else {

			const querySnapshot = await getDocs(usersRef);

			const docRef = doc(this.db, "users", userShown);
			const docSnap = await getDoc(docRef);

			console.log("Document data:", docSnap.data());
	  		this.userData = docSnap.data();
	  		this.userId = userId = docSnap.id;

		}


		if ( this.userData ) {
		  
		  $profileName.text(this.userData.name ?? 'No name specified');
		  $profileNotes.text(this.userData.notes ?? 'No notes specified');
		  $profilePermalink.text('@' + this.userData.permalink);
		  if ( this.userData.imageSrc ) {
		  	  $profileContainer.html($('<img data-field="imageSrc">').attr('src', this.userData.imageSrc));
		  }

		} else {
			// docSnap.data() will be undefined in this case
			console.log("No such document!");

			//
			let url = new URL(window.location.href)
			let params = new URLSearchParams(url.search);
			let create = params.get('create');

			if ( create == 'true' ) {
				const userRef = doc(this.db, "users", this.user.uid);

				const payload = {
					isUser: true
				};

				await setDoc(userRef, payload, {merge: true});
			} else {
				location.href = './home.html';
			}
			//

		}

		if ( user && user.uid == userShown ) {
			this.initEditMode();

			$('#send-message-button').hide();
			$('#permalink-group').show();

			this.registerFCM();
		} else {

		}


		//
		$("#send-message-button").click(() => {
			let destinationUser = userId;
			location.href = `./send-login.html?with=${destinationUser}`;
		});
		//

		$('#permalink-button, #permalink-share-button').click(() => {
			let permalink = location.protocol + '//' + location.host + '/' + this.userData.permalink;
			navigator.share({ url: permalink });
		});

		$('#permalink-show-button').click(() => {
			let permalink = location.protocol + '//' + location.host + '/' + this.userData.permalink;
			alert(`Your permalink is: \n${permalink}`);
		});

		$('#permalink-copy-button').click(() => {
			let permalink = location.protocol + '//' + location.host + '/' + this.userData.permalink;
			navigator.clipboard.writeText(permalink);
		});

	},

	getUserShown: function(user) {
		let urlPath = window.location.pathname;
		const urlPathParts = urlPath.split('/');
		let userShown = urlPathParts[urlPathParts.length - 1] != '' ? urlPathParts[urlPathParts.length - 1] : '';

		if ( !userShown ) {
			let url = new URL(window.location.href)
			let params = new URLSearchParams(url.search);
			let uid = params.get('uid');
			userShown = uid;
		}

		return userShown ?? user?.uid ?? null;
	},

	initEditMode: async function() {
		const $profileName = $('#profile-name');
		const $profileNotes = $('#profile-notes');
		const $profilePermalink = $('#profile-permalink');
		const $profileContainer = $('#profile-image-container');

		const editContainer = '<div class="edit-container"><a href="#" class="edit-button"><span class="fa fa-pencil"></span></a>---CONTENT---</div>'

		let profileEdit = editContainer.replace('---CONTENT---', $profileName.prop('outerHTML') );
		$profileName.replaceWith(profileEdit);

		profileEdit = editContainer.replace('---CONTENT---', $profileNotes.prop('outerHTML') );
		$profileNotes.replaceWith(profileEdit);

		profileEdit = editContainer.replace('---CONTENT---', $profilePermalink.prop('outerHTML') );
		$profilePermalink.replaceWith(profileEdit);

		profileEdit = editContainer.replace('---CONTENT---', $profileContainer.children().prop('outerHTML') );
		$profileContainer.children().replaceWith(profileEdit);

		const that = this;

		$('#profile-data').on('click','.edit-button', async (e) => {
			const field = $(e.currentTarget).siblings().eq(0).attr('data-field');
			let value;
			if ( $(e.currentTarget).closest('#profile-image-container').length ) {
				const timestamp = (new Date()).getTime();
				const imagesRef = ref(this.storage, `images/${this.userId}_${timestamp}.jpg`);	
				const promise = new Promise(function(resolve, reject) {
					$('<input type="file">')
						.on('change', async (e) => {
			      			let firstFile = e.target.files[0];
		      				await uploadBytes(imagesRef, firstFile);
		      				resolve(true);
						})
						.click();
				});
				const a = await promise;

				value = await getDownloadURL(imagesRef);
		   		if ( !value ) return;
		   		this.saveValue(field, value);
		   		$(e.currentTarget).siblings().eq(0).attr('src', value);
			} else {
		   		value = prompt($(e.currentTarget).siblings().eq(0).attr('data-desc'));
		   		if ( !value ) return;
		   		this.saveValue(field, value);
		   		if ( field == 'permalink' ) {
		   			value = '@' + value;
		   			that.userData.permalink = value;
		   		}
		   		$(e.currentTarget).siblings().eq(0).text(value);
			}
		}) 
	},

	saveValue: async function(field, value) {

		const userRef = doc(this.db, "users", this.user.uid);

		const payload = {};
		payload[field] = value;

		await setDoc(userRef, payload, {merge: true});
	},

	registerFCM: async function() {

			console.log('Register FCM');

			const messaging = getMessaging(this.firebase);

			let that = this;

			getToken(messaging, {vapidKey: "BDNT2mEmglPVrW0fVFyUbQlWiisOAsBteAHtg38KfYanPe6HdMyYtpm0JNqiNqPRT0bcivGeHurdOCG8fB6PXGU"})
			.then(async (currentToken) => {
			  if (currentToken) {
			    // Send the token to your server and update the UI if necessary
			    // ...
			    console.log(currentToken);

			    const userRef = doc(this.db, "users", this.user.uid);

				const payload = {
					fcmToken: currentToken
				};

				await setDoc(userRef, payload, {merge: true});

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
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
				this.registerFCM();
			}
		});
	}

};

export default module;