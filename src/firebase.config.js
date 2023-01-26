import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAceG8dYJjIJM2AgUPqu6PKbRjDZ1W_MtI",
  authDomain: "your-place-5920b.firebaseapp.com",
  projectId: "your-place-5920b",
  storageBucket: "your-place-5920b.appspot.com",
  messagingSenderId: "763920118997",
  appId: "1:763920118997:web:a57c2f428e257cdaf51e5c",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
