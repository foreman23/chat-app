// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2kRhPj42-JrLGQtfZkbTnk2VGjKMMXiI",
  authDomain: "tangoh-2b4f6.firebaseapp.com",
  projectId: "tangoh-2b4f6",
  storageBucket: "tangoh-2b4f6.appspot.com",
  messagingSenderId: "271808293716",
  appId: "1:271808293716:web:f65be3821e519d42d576c1",
  measurementId: "G-PJ80DND236"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();

export { auth };