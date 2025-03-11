const logger = require("firebase-functions/logger");
let admin = require('firebase-admin');

const {
  onDocumentWritten,
  Change,
  FirestoreEvent
} = require ( "firebase-functions/v2/firestore" );

if ( admin.apps.length === 0 ) {
	admin.initializeApp();
}


exports.onChatMessage = onDocumentWritten({
		document: "chat/{chatroomOwnerId}/chat/{chatroomGuestId}/messages/{message}",
		maxInstances: 2
	}, async (event) => {

	console.log('message');
		
	const timestap = event.params.message;
	const chatroomOwnerId = event.params.chatroomOwnerId;
	const chatroomGuestId = event.params.chatroomGuestId;

	const message = event.data.after.data();
	let text = message.message;

	const textLength = 20;
	if ( text.length > textLength ) {
		text = text.substring(0, textLength) + '...';
 	}


 	const userSenderId = message.uid;

 	const recipientId = userSenderId == chatroomOwnerId ? chatroomGuestId : chatroomOwnerId;

	//
    let db = admin.firestore();
    const recipientUserSnap = await db.collection("users").doc(recipientId).get();

    if ( !recipientUserSnap.exists ) {
    	throw new Error(`onChatMessage error: user ${recipientId} does not exist`);
    }	

	const recipientUser = recipientUserSnap.data();
	const recipientFcmToken = recipientUser.fcmToken;

	if ( !recipientFcmToken ) {
		console.log(`onChatMessage info: No FCM token for user ${recipientId}`);
		return;
	}

   	//
	const payload = {
		token: recipientFcmToken,
		data: {
			body: text,
			fromId: userSenderId,
			action: 'receiving'
		}
	};

	// if ( userSenderId == chatroomOwnerId ) {
	// 	payload['data']['fromId'] = chatroomOwnerId
	// 	payload['data']['action'] = 'receiving'
	// } else {
	// 	payload['data']['fromId'] = chatroomGuestId
	// 	payload['data']['action'] = 'sending'
	// }

	admin.messaging().send(payload).then((response) => {
		// Response is a message ID string.
		console.log('Successfully sent message:', response);
		return {success: true};
	}).catch((error) => {
		console.log('onChatMessage error', error);
		return {error: error.code};
	});

});