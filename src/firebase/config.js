import app from 'firebase/app';
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzQpWxrqJ5PP8LrHR-uWtuDFrx4MPHabo",
  authDomain: "prueba-8d51d.firebaseapp.com",
  projectId: "prueba-8d51d",
  storageBucket: "prueba-8d51d.appspot.com",
  messagingSenderId: "200535751931",
  appId: "1:200535751931:web:440452174d70f6f8e7045e"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();

