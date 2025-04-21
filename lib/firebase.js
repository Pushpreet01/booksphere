import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  Timestamp
} from 'firebase/firestore';
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function signUp(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export function onUserStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signOut() {
  return await firebaseSignOut(auth);
}

export async function createProfile(username, uid) {
  return await setDoc(doc(db, 'profiles', uid), { username });
}

export async function addReview({ bookId, uid, username, rating, comment, bookTitle }) {
  return await addDoc(collection(db, 'reviews'), {
    bookId,
    uid,
    username,
    rating,
    comment,
    bookTitle, // Store the book title in the review document
    createdAt: Timestamp.fromDate(new Date()),
  });
}

export async function fetchReviewsByBook(bookId) {
  const q = query(collection(db, 'reviews'), where('bookId', '==', bookId));
  return await getDocs(q);
}

export async function fetchReviewsByUser(username) {
  const q = query(collection(db, 'reviews'), where('username', '==', username));
  return await getDocs(q);
}

export async function fetchAllReviews() {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  return await getDocs(q);
}