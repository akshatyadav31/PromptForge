import { collection, doc } from "firebase/firestore";
import { db } from "./firebase";

// Collection references
export const promptsCollection = collection(db, "prompts");
export const usersCollection = collection(db, "users");
export const templatesCollection = collection(db, "templates");
export const analyticsCollection = collection(db, "analytics");
export const feedbackCollection = collection(db, "feedback");

// Document reference helpers
export const getPromptDoc = (id: string) => doc(promptsCollection, id);
export const getUserDoc = (id: string) => doc(usersCollection, id);
export const getTemplateDoc = (id: string) => doc(templatesCollection, id);
export const getAnalyticsDoc = (id: string) => doc(analyticsCollection, id);
export const getFeedbackDoc = (id: string) => doc(feedbackCollection, id);

// Firestore indexes that should be created in Firebase Console:
/*
Collection: prompts
- userId (ascending), createdAt (descending)
- useCase (ascending), createdAt (descending)
- frameworks (array-contains), createdAt (descending)

Collection: analytics
- userId (ascending), date (descending)
- eventType (ascending), timestamp (descending)

Collection: templates
- category (ascending), popularity (descending)
- public (ascending), createdAt (descending)
*/