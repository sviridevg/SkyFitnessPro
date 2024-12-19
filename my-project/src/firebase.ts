import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAZwFyvnV5MTOo45tEXxcEo85MLH97_mHg",
  authDomain: "skyfitnesspro-84c01.firebaseapp.com",
  databaseURL:
    "https://skyfitnesspro-84c01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skyfitnesspro-84c01",
  storageBucket: "skyfitnesspro-84c01.appspot.com",
  messagingSenderId: "144423868403",
  appId: "1:144423868403:web:5389ca8b9e582e81572486",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
