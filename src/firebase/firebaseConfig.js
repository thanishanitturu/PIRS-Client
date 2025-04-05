
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDWDYJquj-c9_Tan6CEkMl-2biEQuyRFmA",
  authDomain: "poirs-621c0.firebaseapp.com",
  projectId: "poirs-621c0",
  storageBucket: "poirs-621c0.firebasestorage.app",
  messagingSenderId: "902167319583",
  appId: "1:902167319583:web:ba08b5b4af7834f5f1f12a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };