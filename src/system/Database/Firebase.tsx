import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {firebaseConfigSG} from "system/Database/keys/SGconfig";

function initFirebase() {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfigSG);
    }
}

initFirebase();
const db = firebase.database();
export {firebase, db};
