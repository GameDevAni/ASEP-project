// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-nw4ul2TWXJLW6-JpGhFZjWUylCoRXb8",
  authDomain: "strayaid-1b071.firebaseapp.com",
  projectId: "strayaid-1b071",
  storageBucket: "strayaid-1b071.firebasestorage.app",
  messagingSenderId: "950654866966",
  appId: "1:950654866966:web:62944c3a2f2d283efc0737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function(){
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById('signUpButton');
signUp.addEventListener('click', (event) =>{
  event.preventDefault();
  const name = document.getElementById('rName').value;
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
  .then ((userCredential)=>{
    const user = userCredential.user;
    const userData = {
      email: email,
      name: name,
    };
    showMessage('Account Created Successfully', 'signUpMessage')
    const docRef = doc(db, "users", user.uid);
    setDoc(docRef, userData)
    .then(()=>{
      window.location.href = 'index.html';
    })
    .catch((error)=>{
      console.error("error writing document", error)
    });
  })
  .catch((error)=>{
    const errorCode = error.code;
    if(errorCode=='auth/email-already-in-use'){
      showMessage('Email Address ALready Exists!!', 'signUpMessage');
    }
    else{
      showMessage('Unable to create user', 'signUpMessage');
    }
  })
});

const signIn=document.getElementById('signInButton');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('rEmail').value;
   const password=document.getElementById('rPassword').value;
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email,password)
   .then((userCredential)=>{
       showMessage('login is successful', 'signInMessage');
       const user=userCredential.user;
       localStorage.setItem('loggedInUserId', user.uid);
       window.location.href='homepage.html';
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
           showMessage('Incorrect Email or Password', 'signInMessage');
       }
       else{
           showMessage('Account does not Exist', 'signInMessage');
       }
   })
});