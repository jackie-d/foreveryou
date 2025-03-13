import { getFirestore, collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


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

		const chatroomRef = collection(this.db, 'userChats', this.user.uid, 'otherUser');

		const chatroomsSnapshot = await getDocs(chatroomRef);

		console.log(chatroomsSnapshot.size);

		console.log( chatroomsSnapshot.docs );

		if ( chatroomsSnapshot.size > 0 ) {
			$('#list-no-item-label').hide();
		}

		chatroomsSnapshot.forEach(async (chatroomOtherUserSnap) => {
		  	console.log(chatroomOtherUserSnap.id, " => ", chatroomOtherUserSnap.data());

			let chatroom = chatroomOtherUserSnap.data();

			const otherUser = await getDoc(doc(this.db, 'users', chatroomOtherUserSnap.id)).then(data => data?.data());

			console.log(otherUser);

			var date = new Date(chatroom.timestamp);
			var formattedDate= (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
	
			const $listItem = $('#source-list-item').clone();
			$listItem.find('.date').text(formattedDate);
			$listItem.find('.excerpt').text(chatroom.lastMessage);
			const nickname = '@' + (otherUser.permalink ?? '');
			$listItem.find('.username').text(nickname);
			$listItem.find('.nickname').text(otherUser.name ?? nickname);
			$listItem.attr('href', './chat.html?with=' + chatroomOtherUserSnap.id);
			$listItem.show();
			$('#chats-list').append($listItem);
		});

	}

};

export default module;