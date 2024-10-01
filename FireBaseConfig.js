import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCp1SCMDziHTBfQ4o0c8WktCHiMGSaLDZA", 
  authDomain: "todoapp-37c3a.firebaseapp.com", 
  projectId: "todoapp-37c3a", 
  storageBucket: "todoapp-37c3a.appspot.com", 
  messagingSenderId: "136198658502", 
  appId: "1:136198658502:android:a19ebdd3c37ecb7011bac7", 
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);