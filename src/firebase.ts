// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2Knt8upk5xFch4aq0ALxT2OoIpc7ZgWE",
  authDomain: "infi-mobile.firebaseapp.com",
  projectId: "infi-mobile",
  storageBucket: "infi-mobile.appspot.com",
  messagingSenderId: "1042737341632",
  appId: "1:1042737341632:web:f9d53e3994d1718dcf7925",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const db = getFirestore();
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

export const auth = getAuth(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db)
  .then(() => console.log("persistence activé"))
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.error("Multiple tabs open, persistence can only be enabled in one tab at a a time");
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.error("The current browser does not support all of the features required to enable persistence");
    }
    console.error(err);
  });
