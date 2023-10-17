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
		document: "chat/{userId}/chat/{guestId}/messages/{message}",
		maxInstances: 2
	}, async (event) => {

		console.log('message');
		
	const timestap = event.params.message;
	const userId = event.params.userId;
	const guestId = event.params.guestId;

	const message = event.data.after.data();
	let text = message.message;

	const textLength = 20;
	if ( text.length > textLength ) {
		text = text.substring(0, textLength) + '...';
 	}


 	const userSenderId = message.uid;

 	const recipientId = userSenderId == userId ? guestId : userId;

	//
    let db = admin.firestore();
    const userSnap = await db.collection("users").doc(recipientId).get();

    if ( !userSnap.exists ) {
    	throw new Error(`onChatMessage error: user ${recipientId} does not exist`);
    }	

	const user = userSnap.data();
	const fcmToken = user.fcmToken;

	if ( !fcmToken ) {
		console.log(`onChatMessage info: No FCM token for user ${recipientId}`);
		return;
	}

   	//
	const payload = {
		token: fcmToken,
		data: {
			body: text,
			fromId: guestId,

		}
	};

	if ( userSenderId == userId ) {
		payload['data']['fromId'] = userId
		payload['data']['action'] = 'receiving'
	} else {
		payload['data']['fromId'] = guestId
		payload['data']['action'] = 'sending'
	}

	admin.messaging().send(payload).then((response) => {
		// Response is a message ID string.
		console.log('Successfully sent message:', response);
		return {success: true};
	}).catch((error) => {
		console.log('onChatMessage error', error);
		return {error: error.code};
	});

});