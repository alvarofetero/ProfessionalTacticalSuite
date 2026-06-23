// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrH9aX0rgXw6o9PJF1cNTAEBZbNj44U7E",
  authDomain: "tacticaldraw-248ab.firebaseapp.com",
  projectId: "tacticaldraw-248ab",
  storageBucket: "tacticaldraw-248ab.firebasestorage.app",
  messagingSenderId: "831815296659",
  appId: "1:831815296659:web:5413108a60a58acf1f4f66",
  measurementId: "G-1PJK2C030H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);