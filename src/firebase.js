import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzd9V7ANbiFCPpSyo9g43sD08omFEq49s",
  authDomain: "todo-womanup-3fce9.firebaseapp.com",
  projectId: "todo-womanup-3fce9",
  storageBucket: "todo-womanup-3fce9.appspot.com",
  messagingSenderId: "1025005417699",
  appId: "1:1025005417699:web:90b89058cbc9ba8dbac1d6",
  measurementId: "G-W6SSJRNXXB",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const storageRef = (id) => ref(storage, `files/${id}`);
const storageDeletFolderRef = (path) => ref(storage, path);
const imageRef = (id, name) => ref(storage, `files/${id}/${name}`);
const listRef = ref(storage, "files/");

export { db, storage, storageRef, listRef, imageRef, storageDeletFolderRef };
