import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyC1zGDWs94YopdpuyeKQcuivqA2z9gRECU",
  authDomain: "instagram-clone-acf72.firebaseapp.com",
  databaseURL: "https://instagram-clone-acf72.firebaseio.com",
  projectId: "instagram-clone-acf72",
  storageBucket: "instagram-clone-acf72.appspot.com",
  messagingSenderId: "119727803190",
  appId: "1:119727803190:web:24621e6eb01339cd1a8197",
  measurementId: "G-NJ0MVC72K3",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
