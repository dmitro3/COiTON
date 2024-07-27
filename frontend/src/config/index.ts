// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDipWEYFv73cOgsRlRl34o7_HXMNLC6OfM",
  authDomain: "coiton.firebaseapp.com",
  projectId: "coiton",
  storageBucket: "coiton.appspot.com",
  messagingSenderId: "896456261840",
  appId: "1:896456261840:web:93c992343f956c59421ed5",
  measurementId: "G-EFR2F91PR0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
