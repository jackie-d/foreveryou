import { getFirestore, collection, query, or, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const module = {

	firebase: null,
	
	init: function(firebase) {

		this.firebase = firebase;

		const that = this;
		$('#search-button').click(function(){
			that.search();
		});
		$('#search-term').keypress((e) => {
			if ( e.keyCode == 13 ) {
				that.search();
			}
		});
	},

	search: async function() {

		$('#search-button-icon').show();
		const term = $('#search-term').val();

		this.db = getFirestore(this.firebase);

		const usersRef = collection(this.db, "users");

		console.log(term);

		if ( term.indexOf('@') === 0 )
			term = term.substring(1);

		const q = query(usersRef, or( where("permalink", "==", term), where("name", "==", term)));
		const querySnapshot = await getDocs(q);

		$('#search-button-icon').hide();
		$('#results-box').show();
		$('#results').empty();

		if ( querySnapshot.size > 0 ) {
			$('#results-no-results-label').hide();
		} else {
			$('#results-no-results-label').show();
		}

		querySnapshot.forEach((doc) => {
		  	console.log(doc.id, " => ", doc.data());
			let userData = doc.data();
			if ( ! userData.permalink ) return;
			$('#results').append(
				
					$('<a>')
						.attr('class', 'list-group-item list-group-item-action')
						.attr('href', `./${userData.permalink}`)
						.html(`<span class="results-name">${userData.name ?? 'No name specified'}</span> <span class="results-permalink">@${userData.permalink}</span>`)
				
			)
			
		});

	}

};

export default module;