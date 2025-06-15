import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithRedirect(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const onAuthStateChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);

// Firestore functions
export const savePromptToFirestore = async (promptData: {
  originalInput: string;
  transformedPrompt: string;
  frameworks: string[];
  parameters: any;
  useCase: string;
  userId: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "prompts"), {
      ...promptData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving prompt:", error);
    throw error;
  }
};

export const getUserPrompts = async (userId: string) => {
  try {
    const q = query(
      collection(db, "prompts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        originalInput: data.originalInput,
        transformedPrompt: data.transformedPrompt,
        frameworks: data.frameworks,
        parameters: data.parameters,
        useCase: data.useCase,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching user prompts:", error);
    throw error;
  }
};

export const getAllPublicPrompts = async () => {
  try {
    const q = query(
      collection(db, "prompts"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching public prompts:", error);
    throw error;
  }
};