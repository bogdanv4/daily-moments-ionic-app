import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBnOuXXbYaH0UEwSS-B5sDuscEyRc7a6aE",
    authDomain: "daily-moments-5d286.firebaseapp.com",
    projectId: "daily-moments-5d286",
    storageBucket: "daily-moments-5d286.appspot.com",
    messagingSenderId: "999252422143",
    appId: "1:999252422143:web:5ef5bd6a11150bf0d8cbca"
  };

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();