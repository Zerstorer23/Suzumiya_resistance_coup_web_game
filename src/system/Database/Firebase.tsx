import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {firebaseConfigUS} from "system/Database/keys/USconfig";

function initFirebase() {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfigUS);
    }
}

initFirebase();
const db = firebase.database();
export {firebase, db};
