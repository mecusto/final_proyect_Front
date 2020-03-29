import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBaYaChURjABW6kNE0D5yQaIU88RxhFAL4",
  authDomain: "jammer-documents.firebaseapp.com",
  databaseURL: "https://jammer-documents.firebaseio.com",
  projectId: "jammer-documents",
  storageBucket: "jammer-documents.appspot.com",
  messagingSenderId: "74638218427",
  appId: "1:74638218427:web:8ce7ba1fc2f8de7d4bc59e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;