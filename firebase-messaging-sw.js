// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBVLFLSTaIBGVUDeYyTNMt9I69TsaozKsA",
  authDomain: "foreveryou-27e01.firebaseapp.com",
  projectId: "foreveryou-27e01",
  storageBucket: "foreveryou-27e01.appspot.com",
  messagingSenderId: "198719782417",
  appId: "1:198719782417:web:6432ddad3fa200e287fbb0",
  measurementId: "G-9XLT9434GP"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const paramName = payload.data.action == 'sending' ? 'from' : 'action';
  const destinationUrl = self.location.protocol + '//' + self.location.host + '/chat.html?' + paramName + '=' + payload.data.fromId
  const notificationTitle = 'You got a new message on ForeverYou.com';
  const notificationOptions = {
    body: payload.data.body,
    data: { url: destinationUrl }, //the url which we gonna use later
    actions: [{action: "open_url", title: "Read now"}]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', function(event) {

  switch(event.action){
    case 'open_url':
    clients.openWindow(event.notification.data.url);
    break;
  }
}
, false);