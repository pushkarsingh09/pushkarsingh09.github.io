import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUkbRvtuj3o31TpGnFyvZiBu8BW4wv1yk",
  authDomain: "chatapp-10ecb.firebaseapp.com",
  projectId: "chatapp-10ecb",
  storageBucket: "chatapp-10ecb.firebasestorage.app",
  messagingSenderId: "922184141375",
  appId: "1:922184141375:web:29e7cb470ba2805615468a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();