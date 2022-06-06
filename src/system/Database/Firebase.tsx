import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {firebaseConfigSG} from "system/Database/keys/SGconfig";
import {firebaseConfigUS} from "system/Database/keys/USconfig";

function initFirebase() {
    console.log(firebaseConfigUS, firebaseConfigSG);
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfigSG);
    }
}

initFirebase();
const db = firebase.database();
export {firebase, db};
