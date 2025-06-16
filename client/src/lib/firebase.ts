import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, Timestamp, doc, updateDoc, deleteDoc, getDoc, enableNetwork, disableNetwork } from "firebase/firestore";

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

// Auth functions with proper error handling for unauthorized domains
export const signInWithGoogle = async () => {
  try {
    // Configure Google provider for broader domain support
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Try popup first (works better in development)
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (popupError: any) {
    console.warn("Popup blocked or failed, trying redirect:", popupError);
    
    // If it's an unauthorized domain error, provide helpful guidance
    if (popupError.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      const helpMessage = `Please add "${currentDomain}" to your Firebase authorized domains in the Firebase Console under Authentication > Settings > Authorized domains.`;
      throw new Error(helpMessage);
    }
    
    // Fallback to redirect for other popup issues
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (redirectError: any) {
      console.error("Sign in failed:", redirectError);
      if (redirectError.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        const helpMessage = `Please add "${currentDomain}" to your Firebase authorized domains in the Firebase Console under Authentication > Settings > Authorized domains.`;
        throw new Error(helpMessage);
      }
      throw redirectError;
    }
  }
};
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

// Additional Firestore operations
export const getPromptById = async (promptId: string) => {
  try {
    const docRef = doc(db, "prompts", promptId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        originalInput: data.originalInput,
        transformedPrompt: data.transformedPrompt,
        frameworks: data.frameworks,
        parameters: data.parameters,
        useCase: data.useCase,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    } else {
      throw new Error("Prompt not found");
    }
  } catch (error) {
    console.error("Error fetching prompt:", error);
    throw error;
  }
};

export const updatePrompt = async (promptId: string, updates: Partial<{
  originalInput: string;
  transformedPrompt: string;
  frameworks: string[];
  parameters: any;
  useCase: string;
}>) => {
  try {
    const docRef = doc(db, "prompts", promptId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return promptId;
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw error;
  }
};

export const deletePrompt = async (promptId: string, userId: string) => {
  try {
    const docRef = doc(db, "prompts", promptId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().userId === userId) {
      await deleteDoc(docRef);
      return true;
    } else {
      throw new Error("Unauthorized or prompt not found");
    }
  } catch (error) {
    console.error("Error deleting prompt:", error);
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
    console.error("Error fetching public prompts:", error);
    throw error;
  }
};

// User preferences and settings
export const saveUserPreferences = async (userId: string, preferences: any) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      preferences,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    // If document doesn't exist, create it
    try {
      await addDoc(collection(db, "users"), {
        userId,
        preferences,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (createError) {
      console.error("Error saving user preferences:", createError);
      throw createError;
    }
  }
};

export const getUserPreferences = async (userId: string) => {
  try {
    const q = query(
      collection(db, "users"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data().preferences;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    throw error;
  }
};

// Network status management
export const enableFirestoreNetwork = () => enableNetwork(db);
export const disableFirestoreNetwork = () => disableNetwork(db);