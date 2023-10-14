// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVLFLSTaIBGVUDeYyTNMt9I69TsaozKsA",
  authDomain: "foreveryou-27e01.firebaseapp.com",
  projectId: "foreveryou-27e01",
  storageBucket: "foreveryou-27e01.appspot.com",
  messagingSenderId: "198719782417",
  appId: "1:198719782417:web:6432ddad3fa200e287fbb0",
  measurementId: "G-9XLT9434GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;