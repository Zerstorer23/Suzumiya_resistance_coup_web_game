import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {firebaseConfigSG} from "system/Database/keys/SGconfig";
import {firebaseConfigUS} from "system/Database/keys/USconfig";
import {DS} from "system/Debugger/DS";

function initFirebase() {
    if (firebase.apps.length === 0) {
        const config = DS.serverSG ? firebaseConfigSG : firebaseConfigUS;
        firebase.initializeApp(config);
    }
}

initFirebase();
const db = firebase.database();
export {firebase, db};
