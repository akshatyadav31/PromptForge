import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

export async function handleAuthRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      // The signed-in user info.
      const user = result.user;
      console.log("User signed in:", user.displayName);
      return user;
    }
  } catch (error: any) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    
    console.error("Auth redirect error:", { errorCode, errorMessage, email });
    throw error;
  }
}