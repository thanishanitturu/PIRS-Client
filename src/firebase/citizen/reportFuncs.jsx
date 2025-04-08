import { auth, db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, arrayUnion, getDoc,collection,getDocs,runTransaction } from "firebase/firestore";

const createReport = async (
  title,
  description,
  category,
  department = "General",
  address = null,
  photoUrls = [],
  position,userData
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
        name: userData.name || "",
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
    console.log(reportData);

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

    // console.log("✅ Reports fetched successfully:", reports);
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

    return allReports;

  } catch (error) {
    console.error("❌ Error fetching all user reports:", error.message);
    throw error;
  }
};

const addCommentToReport = async (reportId, commentObj) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!commentObj?.text?.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    const reportsCollectionRef = collection(db, "reports");
    const snapshot = await getDocs(reportsCollectionRef);

    let found = false;

    for (const docSnap of snapshot.docs) {
      const userReports = docSnap.data().reports || [];
      const reportIndex = userReports.findIndex(report => report.id === reportId);

      if (reportIndex !== -1) {
        found = true;

        const updatedReport = {
          ...userReports[reportIndex],
          comments: [...(userReports[reportIndex].comments || []), commentObj],
          commentCount: (userReports[reportIndex].commentCount || 0) + 1,
          lastUpdated: new Date().toISOString()
        };

        const updatedReports = [...userReports];
        updatedReports[reportIndex] = updatedReport;

        const userDocRef = doc(db, "reports", docSnap.id);
        await updateDoc(userDocRef, {
          reports: updatedReports
        });

        console.log("✅ Comment successfully added to report!");
        return updatedReport;
      }
    }

    if (!found) {
      throw new Error("Report not found in any user's reports");
    }

  } catch (error) {
    console.error("❌ Error adding comment:", error.message);
    throw error;
  }
};

const updateLikeStatus = async (reportId, likeAction) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userUid = user.uid;

    // Step 1: Fetch all documents inside "reports" collection
    const reportsCollectionRef = collection(db, "reports");
    const snapshot = await getDocs(reportsCollectionRef);

    let found = false;
    let targetUserDocId = null;
    let targetReportIndex = -1;

    // Step 2: Search for the report inside every user document
    for (const docSnap of snapshot.docs) {
      const reportsArray = docSnap.data().reports || [];
      const index = reportsArray.findIndex(report => report.id === reportId);

      if (index !== -1) {
        found = true;
        targetUserDocId = docSnap.id;
        targetReportIndex = index;
        break;
      }
    }

    if (!found) {
      throw new Error("Report not found");
    }

    // Step 3: Now we know which user doc contains the report
    const userDocRef = doc(db, "reports", targetUserDocId);

    // Step 4: Run transaction to update like
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) throw new Error("User document disappeared!");

      const reports = userDoc.data().reports || [];
      const report = reports[targetReportIndex];

      const likedBy = report.likedBy || [];
      const isLiked = likedBy.includes(userUid);

      if ((likeAction && !isLiked) || (!likeAction && isLiked)) {
        const updatedReport = {
          ...report,
          likeCount: likeAction
            ? (report.likeCount || 0) + 1
            : Math.max((report.likeCount || 0) - 1, 0),
          likedBy: likeAction
            ? [...likedBy, userUid]
            : likedBy.filter(id => id !== userUid),
          lastUpdated: new Date().toISOString()
        };

        const updatedReports = [...reports];
        updatedReports[targetReportIndex] = updatedReport;

        transaction.update(userDocRef, { reports: updatedReports });
      }
    });

    console.log("✅ Successfully updated like status");
    return { success: true };

  } catch (error) {
    console.error("❌ Error updating like status:", error.message);
    return { success: false, error: error.message };
  }
};

const fetchUserReportsStatistics = async () => {
  try {
   
    const querySnapshot = await getDocs(collection(db, "reports"));
    
   
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
