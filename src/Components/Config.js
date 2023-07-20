import firebase from 'firebase/compat/app'

import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB6J0aR2PgstDgsUdZaSvKRppABTYIdFYA",
  authDomain: "startop-1min.firebaseapp.com",
  projectId: "startop-1min",
  storageBucket: "startop-1min.appspot.com",
  messagingSenderId: "570499627476",
  appId: "1:570499627476:web:6af1a4d731e9c3d9d87e41",
  measurementId: "G-1CTJN77YNJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}
