// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC27VQHL1hfDSB8gRz-7pp4fOBr6tDtJkQ",
    authDomain: "achievo-f2bf1.firebaseapp.com",
    projectId: "achievo-f2bf1",
    storageBucket: "achievo-f2bf1.firebasestorage.app",
    messagingSenderId: "40420392341",
    appId: "1:40420392341:web:238599b3c37395edec0a9c",
    measurementId: "G-67WZJCN9DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);