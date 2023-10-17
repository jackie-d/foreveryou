import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,
	user: null,
	
	init: function(firebase, user) {

		this.firebase = firebase;
		this.user = user;

		this.initChats();
	},

	initChats: async function() {

		this.db = getFirestore(this.firebase);

		const chatsRef = collection(this.db, 'chat', this.user.uid, 'chat');

		const querySnapshot = await getDocs(chatsRef);

		console.log(querySnapshot);

		querySnapshot.forEach((doc) => {
		  	console.log(doc.id, " => ", doc.data());
			let chat = doc.data();
			$('#results').append(
				
				$('<a>')
					.attr('class', 'list-group-item list-group-item-action')
					.attr('href', `./chat.html?from=${doc.id}`)
					.text(`${doc.id}`)
				
			)
			
		});

	}

};

export default module;