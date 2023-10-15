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
		  
		  $profileName.text(userData.name);
		  $profileNotes.text(userData.notes);
		  $profilePermalink.text(userData.permalink);

		} else {
		  // docSnap.data() will be undefined in this case
		  console.log("No such document!");
		}

		if ( user && user.uid == userShown ) {
			this.initEditMode();
		} else {

		}


		//
		$("#send-message-button").click(() => {
			let destinationUser = userId;
			location.href = `./send-login.html?with=${destinationUser}`;
		});
		//

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

		const editContainer = '<div><a href="#" class="edit-button">EDIT</a>---CONTENT---</div>'

		let profileEdit = editContainer.replace('---CONTENT---', $profileName.prop('outerHTML') );
		$profileName.replaceWith(profileEdit);

		profileEdit = editContainer.replace('---CONTENT---', $profileNotes.prop('outerHTML') );
		$profileNotes.replaceWith(profileEdit);

		profileEdit = editContainer.replace('---CONTENT---', $profilePermalink.prop('outerHTML') );
		$profilePermalink.replaceWith(profileEdit);

		$(document).on('click','.edit-button', (e) => {
			const field = $(e.target).siblings().eq(0).attr('data-field');
	   		const value = prompt('');
	   		this.saveValue(field, value);
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