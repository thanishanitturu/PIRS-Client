import { auth,db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, arrayUnion, getDoc,collection,getDocs,runTransaction } from "firebase/firestore";



const getUserNotifications = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required to fetch notifications.");
      }
  
      // Reference to the user's notifications document
      const notificationsDocRef = doc(db, "notifications", userId);
      const notificationsDocSnap = await getDoc(notificationsDocRef);
  
      if (!notificationsDocSnap.exists()) {
        // console.log("No notifications found for this user.");
        return []; 
      }
  
      const notificationsData = notificationsDocSnap.data();
      const notifications = notificationsData.notifys || [];

  
      // Optionally sort by timestamp (newest first)
      notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      // console.log(notifications)
      console.log("✅ Notifications fetched successfully");
      return notifications;
  
    } catch (error) {
      console.error("❌ Error fetching notifications:", error.message);
      throw error;
    }
};


const markNotifyAsRead = async (userId, notificationId) => {
  try {
    if (!userId || !notificationId) {
      throw new Error("User ID and Notification ID are required.");
    }

    const notificationsDocRef = doc(db, "notifications", userId);
    
    // Get the existing notifications first
    const notificationsDocSnap = await getDoc(notificationsDocRef);
    
    if (!notificationsDocSnap.exists()) {
      throw new Error("No notifications found for this user.");
    }

    const notificationsData = notificationsDocSnap.data();
    const updatedNotifys = (notificationsData.notifys || []).map((notify) => {
      if (notify.id === notificationId) {
        return { ...notify, isRead: true }; // Mark it as read
      }
      return notify;
    });

    // Update the document
    await updateDoc(notificationsDocRef, {
      notifys: updatedNotifys,
    });

    // console.log("✅ Notification marked as read successfully");
    return "Notfication Marked as read Successfully...";

  } catch (error) {
    console.error("❌ Error marking notification as read:", error.message);
    throw error;
  }
};


const delNotification = async (userId, notificationId) => {
  try {
    if (!userId || !notificationId) {
      throw new Error("User ID and Notification ID are required.");
    }

    const notificationsDocRef = doc(db, "notifications", userId);

    // Get the existing notifications first
    const notificationsDocSnap = await getDoc(notificationsDocRef);

    if (!notificationsDocSnap.exists()) {
      throw new Error("No notifications found for this user.");
    }

    const notificationsData = notificationsDocSnap.data();

    // Filter out the notification to be deleted
    const updatedNotifys = (notificationsData.notifys || []).filter(
      (notify) => notify.id !== notificationId
    );

    // Update the document with the remaining notifications
    await updateDoc(notificationsDocRef, {
      notifys: updatedNotifys,
    });

    // console.log("✅ Notification deleted successfully");
    return "Notification deleted successfully...";

  } catch (error) {
    console.error("❌ Error deleting notification:", error.message);
    throw error;
  }
};



export {getUserNotifications,markNotifyAsRead,delNotification};