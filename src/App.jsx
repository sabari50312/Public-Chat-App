import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  getFirestore,
  Timestamp,
  limitToLast,
} from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import Chat from "./Chat";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const messageRef = collection(db, "messages");
const q = query(messageRef, orderBy("time"), limitToLast(15));

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [lastWriteTime, setLastWriteTime] = useState(null);

  useEffect(() => {
    getMessages().catch((e) => {
      console.log(e);
    });
    console.log("User changed to", user);
  }, [user]);

  function authenticate() {
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          setUser(result.user);
          console.log("Successfully logged in");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    console.log("logged out");
  }

  async function getMessages() {
    const msgs = await getDocs(q);
    const msglist = [];

    msgs.forEach((msg) => {
      msglist.push({
        text: msg.data().text,
        time: msg.data().time,
        user: msg.data().user,
        photo: msg.data().photo,
      });
    });
    setMessages(msglist);
  }

  async function sendMessage(msg) {
    if (user) {
      // Check if it has been at least 1 second since the last write
      const currentTime = Date.now();
      if (!lastWriteTime || currentTime - lastWriteTime >= 5000) {
        setLastWriteTime(currentTime);
        const docRef = await addDoc(messageRef, {
          text: String(msg),
          time: Timestamp.fromDate(new Date()),
          user: user.email,
          photo: user.photoURL,
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
      } else
        window.alert("Please wait 5 seconds before sending another message");
      return false;
    }
  }

  return (
    <>
      <h2 className="heading">Pooblic Chat App</h2>
      {user ? (
        <>
          <SignOut logout={logout} />
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            getMessages={getMessages}
            user={user}
          />
        </>
      ) : (
        <SignIn authenticate={authenticate} />
      )}
    </>
  );
}

export default App;
