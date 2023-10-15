import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,
	user: null,
	with: null,
	db: null,

	fyId: null,
	guestId: null,
	
	init: function(firebase, user) {
		console.log(firebase);

		this.firebase = firebase;
		this.user = user;
		this.db = getFirestore(firebase);

		var url = new URL(window.location);
		this.with = url.searchParams.get("with");

		this.from = url.searchParams.get("from");

		this.fyId = this.with ?? user.uid;
		this.guestId = this.with ? user.uid : this.from;

		$('#send-button').click(() => { this.sendMessage() });
		$('#message-text').keyup((e) => {
		   var code = e.keyCode ? e.keyCode : e.which;
		   if (code == 13 && !e.shiftKey ) {  // Enter keycode
		     this.sendMessage();
		   }
		});

		this.initListen();
		
	},

	sendMessage: async function() {
		const timestamp = Date.now();
		const messageInput = document.getElementById("message-text");
		const message = messageInput.value;

		// clear the input box
		messageInput.value = "";

		//auto scroll to bottom
		/*document
		.getElementById("messages")
		.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });*/

		if ( this.from ) {
			notifyGuest(message);
		}

		await setDoc(doc(this.db, "chat", `${this.fyId}/chat/${this.guestId}/messages/${timestamp}`), {
		  uid: this.user.uid,
		  message: message
		});
	},

	initListen: function() {

		console.log(this.fyId);

		const unsub = onSnapshot(collection(this.db, "chat", `${this.fyId}/chat/${this.guestId}/messages`), (doc) => {
		    console.log("Current data: ", doc.docChanges().map(e => e.doc.data()));
		    this.addToUI(doc.docChanges().map(e => e.doc.data()));
		});

	},

	addToUI: function(messages) {
		let $myBubble = $('#my-bubble');
		let $otherBubble = $('#other-bubble');

		let $container = $('#chat-container');

		let $bubble;
		messages.forEach(m => {
			if ( m.uid == this.user.uid ) {
				$bubble = $myBubble.clone();
			} else {
				$bubble = $otherBubble.clone();
			}
			$bubble.find('.text-content').text(m.message);
			$bubble.removeClass('d-none');
			$container.append($bubble);
		})

		$container.parent().animate({scrollTop: $container.height()});
	},

	notifyGuest: async function() {
		this.db = getFirestore(firebase);

		const usersRef = collection(this.db, "users", this.from);

		const q = query(usersRef, where("permalink", "==", userShown));
		const querySnapshot = await getDocs(q);

		let userData;

		querySnapshot.forEach((doc) => {
		  	console.log(doc.id, " => ", doc.data());
			userData = doc.data();
			userId = doc.id;

		});


		if ( userData.notificationMode == 'email' ) {
			let email = userData.notificationDestination;
		} else {

		}

	}

};

export default module;