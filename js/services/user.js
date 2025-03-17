import { doc, getDoc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,

	user: null,
	userData: null,

	db: null,
	
	init: async function(firebase, user) {

        this.firebase = firebase;
        this.user = user;

        return await (() => {})();
	},

	loadUser: async function() {
		if ( !this.user ) {
			return;
		}

		this.db = getFirestore(this.firebase);

		const userRef = doc(this.db, "users", this.user.uid);
		const userSnap = await getDoc(userRef);
		this.userData = userSnap.data();

		return this.userData;
	},

	getUserInstance: async function() {
		if ( !this.userData ) {
			await this.loadUser();
		}
		return this.userData;
	},

	removeFcmToken: async function() {
		const userRef = doc(this.db, "users", this.user.uid);

		const payload = {
			fcmToken: null
		};

		await setDoc(userRef, payload, {merge: true});
	},

	initNewUser: async function(user) {
		this.db = getFirestore(this.firebase);
		
		const userRef = doc(this.db, "users", user.uid);

		const payload = {
			isUser: true
		};

		await setDoc(userRef, payload, {merge: true});
	}

};

export default module;