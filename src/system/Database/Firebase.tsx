// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/messaging";
import { decode, encode } from "base-64";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FIRE_API_KEY = decode(
  "QUl6YVN5QjhKVnpKbnlDbjFudjAzTGFlYjJvWDNrTUdQOEkyN3Rn"
);
export const FIRE_PROJECT_ID = "hamang-coup";
const firebaseConfig = {
  apiKey: FIRE_API_KEY,
  authDomain: `${FIRE_PROJECT_ID}.firebaseapp.com`,
  projectId: FIRE_PROJECT_ID,
  databaseURL: `https://${FIRE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  storageBucket: "hamang-coup.appspot.com",
  messagingSenderId: decode("ODUwMTQ2OTU2MjQ4"),
  appId: decode("MTo4NTAxNDY5NTYyNDg6d2ViOjQyOWViZTVlYTI3ZDMyM2VjZTU4YWQ="),
  measurementId: "G-60X6BN6DZE",
};

function initFirebase() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}
initFirebase();
const db = firebase.database();
//const messaging = firebase.messaging();
//hhhhh
export { firebase, db };
