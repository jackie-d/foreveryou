import { getFirestore, collection, query, or, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,
	
	init: function(firebase) {

		this.firebase = firebase;

		const that = this;
		$('#search').click(function(){
			that.search();
		});
		$('#term').keypress((e) => {
			if ( e.keyCode == 13 ) {
				that.search();
			}
		});
	},

	search: async function() {

		const term = $('#search-term').val();

		this.db = getFirestore(this.firebase);

		const usersRef = collection(this.db, "users");

		console.log(term);

		const q = query(usersRef, or( where("permalink", "==", term), where("name", "==", term)));
		const querySnapshot = await getDocs(q);

		$('#results').empty();
		querySnapshot.forEach((doc) => {
		  	console.log(doc.id, " => ", doc.data());
			let userData = doc.data();
			if ( ! userData.permalink ) return;
			$('#results').append(
				
						$('<a>')
						.attr('class', 'list-group-item list-group-item-action')
						.attr('href', `./${userData.permalink}`)
						.text(`@${userData.permalink} - ${userData.name ?? 'No name specified'}`)
				
			)
			
		});

	}

};

export default module;