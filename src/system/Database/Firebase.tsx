// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FIRE_API_KEY = "AIzaSyB8JVzJnyCn1nv03Laeb2oX3kMGP8I27tg";
export const FIRE_PROJECT_ID = "hamang-coup";
const firebaseConfig = {
  apiKey: FIRE_API_KEY,
  authDomain: `${FIRE_PROJECT_ID}.firebaseapp.com`,
  projectId: FIRE_PROJECT_ID,
  databaseURL: `https://${FIRE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  storageBucket: "hamang-coup.appspot.com",
  messagingSenderId: "850146956248",
  appId: "1:850146956248:web:429ebe5ea27d323ece58ad",
  measurementId: "G-60X6BN6DZE",
};

function initFirebase() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}
initFirebase();
const db = firebase.database();
export { firebase, db };
