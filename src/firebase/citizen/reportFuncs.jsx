import { ReceiptPoundSterling } from "lucide-react";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, arrayUnion, getDoc,collection,getDocs,runTransaction } from "firebase/firestore";

const createReport = async (
  title,
  description,
  category,
  department = "General",
  address = null,
  photoUrls = [],
  position
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!title || !description || !category) {
      throw new Error("Title, description, and category are required");
    }

    const userDocRef = doc(db, "reports", user.uid);

    // Check if user document already exists
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // Create a new document for the user if it doesn't exist
      await setDoc(userDocRef, {
        userId: user.uid,
        reports: [],
      });
    }

    // Create report object
    const reportData = {
      id: Date.now().toString(), // unique ID
      title,
      description,
      category,
      department,
      reportedBy: {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
      },
      address,
      photoUrls,
      position,
      isVerifiedByAdmin: false,
      status: "pending",
      likes: [],
      comments: [],
      likeCount: 0,
      commentCount: 0,
      reportedDate: new Date().toISOString(),   
      lastUpdated: new Date().toISOString()      
    };

    // Update the reports array with new report
    await updateDoc(userDocRef, {
      reports: arrayUnion(reportData),
    });

    console.log("✅ Report successfully added to user's reports array!");
    return "Report created successfully!";
    
  } catch (error) {
    console.error("❌ Error creating report:", error.message);
    throw error;
  }
};



const getUserReports = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch reports.");
    }

    const userDocRef = doc(db, "reports", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log("No reports found for this user.");
      return []; 
    }

    const userData = userDocSnap.data();
    const reports = userData.reports || [];

    console.log("✅ Reports fetched successfully:", reports);
    return reports;

  } catch (error) {
    console.error("❌ Error fetching user reports:", error.message);
    throw error;
  }
};


const getAllUserReports = async () => {
  try {
    const reportsCollectionRef = collection(db, "reports");

    // Fetch all documents under 'reports' collection
    const querySnapshot = await getDocs(reportsCollectionRef);

    let allReports = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.reports && Array.isArray(data.reports)) {
        allReports = [...allReports, ...data.reports]; 
      }
    });

    console.log("✅ All user reports fetched:", allReports);
    return allReports;

  } catch (error) {
    console.error("❌ Error fetching all user reports:", error.message);
    throw error;
  }
};



const addCommentToReport = async (userId, reportId, commentText) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!commentText.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    const userDocRef = doc(db, "reports", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User report document not found");
    }

    // Get current reports array
    const reports = userDocSnap.data().reports;
    const reportIndex = reports.findIndex(report => report.id === reportId);

    if (reportIndex === -1) {
      throw new Error("Report not found");
    }

    // Create new comment object
    const newComment = {
      user: {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email || "",
        avatar: user.photoURL || "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg"
      },
      text: commentText,
      timestamp: new Date().toISOString()
    };

    // Create updated report object
    const updatedReport = {
      ...reports[reportIndex],
      comments: [...reports[reportIndex].comments, newComment],
      commentCount: reports[reportIndex].commentCount + 1,
      lastUpdated: new Date().toISOString()
    };

    // Create updated reports array
    const updatedReports = [...reports];
    updatedReports[reportIndex] = updatedReport;

    // Update the document with the new reports array
    await updateDoc(userDocRef, {
      reports: updatedReports
    });

    console.log("✅ Comment successfully added to report!");
    return updatedReport;

  } catch (error) {
    console.error("❌ Error adding comment:", error.message);
    throw error;
  }
};
const updateLikeStatus = async (userId, reportId, likeAction) => {
  try {
    // 1. Get reference to the user's document
    const userDocRef = doc(db, "reports", userId);
    console.log(reportId);
    
    // 2. Use transaction to ensure data consistency
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) throw new Error("User not found");
      
      const reports = userDoc.data().reports || [];
      const reportIndex = reports.findIndex(r => r.id === reportId);
      if (reportIndex === -1) throw new Error("Report not found");
      
      const report = reports[reportIndex];
      const likedBy = report.likedBy || [];
      const isLiked = likedBy.includes(userId);
      
      // Only proceed if the action changes the current state
      if ((likeAction && !isLiked) || (!likeAction && isLiked)) {
        const updatedReport = {
          ...report,
          likeCount: likeAction 
            ? (report.likeCount || 0) + 1 
            : Math.max((report.likeCount || 0) - 1, 0),
          likedBy: likeAction
            ? [...likedBy, userId]
            : likedBy.filter(id => id !== userId),
          lastUpdated: new Date().toISOString()
        };
        
        const updatedReports = [...reports];
        updatedReports[reportIndex] = updatedReport;
        
        transaction.update(userDocRef, { reports: updatedReports });
      }
    });
    console.log("succesed liked");
    return { success: true };
  } catch (error) {
    console.error("Error updating like status:", error);
    return { success: false, error: error.message };
  }
};


const fetchUserReportsStatistics = async () => {
  try {
    // 1. Fetch all documents from the reports collection
    const querySnapshot = await getDocs(collection(db, "reports"));
    
    // 2. Process each user's reports
    const usersStats = querySnapshot.docs.map(doc => {
      const userData = doc.data();
      const reports = userData.reports || [];
      
      // 3. Calculate statistics for this user
      const stats = {
        total: reports.length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        pending: reports.filter(r => r.status === 'pending').length,
        inProgress: reports.filter(r => r.status === 'in-progress').length,
        unresolved: reports.filter(r => r.status === 'unresolved').length,
        // Add more statuses if needed
      };
      
      // 4. Calculate resolution percentage
      stats.resolutionRate = stats.total > 0 
        ? Math.round((stats.resolved / stats.total) * 100)
        : 0;

      // 5. Return the user object with stats
      return {
        userId: userData.userId,
        stats: stats
      };
    });

    return usersStats;
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return []; // Return empty array on error
  }
};


export { createReport,getUserReports,getAllUserReports,addCommentToReport,updateLikeStatus,fetchUserReportsStatistics};
