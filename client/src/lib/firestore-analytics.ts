import { addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { analyticsCollection } from "./firestore-collections";

export interface AnalyticsEvent {
  userId: string;
  eventType: 'prompt_created' | 'prompt_viewed' | 'prompt_copied' | 'prompt_exported' | 'framework_applied';
  eventData: {
    promptId?: string;
    frameworks?: string[];
    useCase?: string;
    parameters?: any;
    aiModel?: string;
    enhancementType?: string;
  };
  timestamp: Date;
}

export const trackEvent = async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
  try {
    await addDoc(analyticsCollection, {
      ...event,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Don't throw - analytics should not break the app
  }
};

export const getUserAnalytics = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      analyticsCollection,
      where("userId", "==", userId),
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        eventType: data.eventType,
        eventData: data.eventData,
        timestamp: data.timestamp?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return [];
  }
};

export const getFrameworkUsageStats = async (userId: string) => {
  try {
    const analytics = await getUserAnalytics(userId);
    const frameworkStats: Record<string, number> = {};
    
    analytics.forEach((event: any) => {
      if (event.eventType === 'framework_applied' && event.eventData?.frameworks) {
        event.eventData.frameworks.forEach((framework: string) => {
          frameworkStats[framework] = (frameworkStats[framework] || 0) + 1;
        });
      }
    });
    
    return frameworkStats;
  } catch (error) {
    console.error("Error calculating framework stats:", error);
    return {};
  }
};