import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,
	user: null,
	db: null,
	
	init: async function(firebase, user) {

		this.firebase = firebase;
		this.user = user;

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

  		let userData = null;
  		let userId = null;

		if ( querySnapshot.size > 0 ) {

			querySnapshot.forEach((doc) => {
			  	console.log(doc.id, " => ", doc.data());
				userData = doc.data();
				userId = doc.id;
			});

		} else {

			const querySnapshot = await getDocs(usersRef);

			const docRef = doc(this.db, "users", userShown);
			const docSnap = await getDoc(docRef);

			console.log("Document data:", docSnap.data());
	  		userData = docSnap.data();
	  		userId = docSnap.id;

		}


		if ( userData ) {
		  
		  $profileName.text(userData.name ?? 'No name specified');
		  $profileNotes.text(userData.notes ?? 'No notes specified');
		  $profilePermalink.text('@' + userData.permalink);

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

			$('#send-message-button').attr('disabled', '');
			$('#permalink-button').show();
		} else {

		}


		//
		$("#send-message-button").click(() => {
			let destinationUser = userId;
			location.href = `./send-login.html?with=${destinationUser}`;
		});
		//

		$('#permalink-button').click(() => {
			let permalink = location.protocol + '//' + location.host + '/' + userData.permalink;
			/*alert(`Your permalink is: ${permalink}`);*/
			navigator.share({ url: permalink });
		});

	},

	getUserShown: function(user) {
		let urlPath = window.location.pathname;
		const urlPathParts = urlPath.split('/');
		let userShown = urlPathParts[urlPathParts.length - 1] != '' ? urlPathParts[urlPathParts.length - 1] : user?.uid;

		if ( !userShown ) {
			let url = new URL(window.location.href)
			let params = new URLSearchParams(url.search);
			let uid = params.get('uid');
			userShown = uid;
		}

		return userShown ?? null;
	},

	initEditMode: function() {
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

		$('#profile-data').on('click','.edit-button', (e) => {
			const field = $(e.currentTarget).siblings().eq(0).attr('data-field');
	   		let value = prompt($(e.currentTarget).siblings().eq(0).attr('data-desc'));
	   		if ( !value ) return;
	   		this.saveValue(field, value);
	   		if ( field == 'permalink' ) value = '@' + value;
	   		$(e.currentTarget).siblings().eq(0).text(value);
		}) 
	},

	saveValue: async function(field, value) {

		const userRef = doc(this.db, "users", this.user.uid);

		const payload = {};
		payload[field] = value;

		await setDoc(userRef, payload, {merge: true});
	}

};

export default module;