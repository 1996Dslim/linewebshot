import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_AK,
  authDomain: process.env.VUE_APP_FB_DOMAIN,
  projectId: process.env.VUE_APP_FB_PID,
  storageBucket: process.env.VUE_APP_FB_SB,
  messagingSenderId: process.env.VUE_APP_FB_SID,
  appId: process.env.VUE_APP_FB_AID,
};

firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebase.auth();

if (!firebaseAuth.currentUser) {
  firebaseAuth.signInAnonymously()
    .then(() => {
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log('FB USER...', user);
        } else {
          // User is signed out
        }
      });
    }).catch((error) => {
      console.error(error);
    });
}

const firebaseStorage = firebase.storage();
const firebaseStore = firebase.firestore();

export default { firebaseAuth, firebaseStorage, firebaseStore }
