import { debugErrorMap} from 'firebase/auth';
import {db} from '../firebaseConfig'
import { auth } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  updateDoc,
} from 'firebase/firestore';

const verifyAllReports = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "reports"));
      const batch = writeBatch(db);
      let totalReportsUpdated = 0;
  
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        
        if (userData.reports?.length) {
          const updatedReports = userData.reports.map(report => ({
            ...report,
            isVerifiedByAdmin: true,
            lastUpdated: new Date().toISOString()
          }));
          
          batch.update(userDoc.ref, { reports: updatedReports });
          totalReportsUpdated += updatedReports.length;
        }
      });
  
      if (totalReportsUpdated === 0) {
        throw new Error("No reports found to verify");
      }
  
      await batch.commit();
      return `Successfully verified ${totalReportsUpdated} reports`;
    } catch (error) {
      console.error("Verification failed:", error);
      throw new Error(`Failed to verify reports: ${error.message}`);
    }
};
const deleteReport = async (reportId) => {
  console.log(reportId);
  try {
    if (!reportId) throw new Error("Report ID is required");

    const usersRef = collection(db, "reports");
    const usersSnapshot = await getDocs(usersRef);
    const batch = writeBatch(db);
    let reportFound = false;
    let deletedReportUserId = null;

    // Search through all user documents
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const reports = userData.reports || [];
      
      // Find the report in this user's reports array
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex !== -1) {
        reportFound = true;
        deletedReportUserId = userDoc.id; // Save userId

        // Create new array without the report
        const updatedReports = [
          ...reports.slice(0, reportIndex),
          ...reports.slice(reportIndex + 1)
        ];
        
        // Queue the update
        batch.update(userDoc.ref, { reports: updatedReports });
      }
    });

    if (!reportFound) {
      throw new Error("Report not found in any user's collection");
    }

    await batch.commit();

    return {
      success: true,
      message: "Report successfully deleted",
      userId: deletedReportUserId
    };
    
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete report: ${error.message}`);
  }
};



const deleteReportAdmin = async (reportId) => {
  try {
    const adminUser = auth.currentUser;
    if (!adminUser) {
      throw new Error("Admin not authenticated");
    }

    // 1. Search all user reports to find the report
    const reportsCollectionRef = collection(db, "reports");
    const querySnapshot = await getDocs(reportsCollectionRef);

    let reportFound = false;
    let targetUserDocId = null;
    let deletedReportUserId = null; // Stores the userId of the report owner

    for (const userDoc of querySnapshot.docs) {
      const userReports = userDoc.data().reports || [];
      const foundReport = userReports.find(report => report.id === reportId);
      
      if (foundReport) {
        reportFound = true;
        targetUserDocId = userDoc.id;
        deletedReportUserId = foundReport.reportedBy.uid; // Extract userId from report
        break;
      }
    }

    if (!reportFound) {
      throw new Error("Report not found");
    }

    // 2. Remove the report from the user's reports array
    const userDocRef = doc(db, "reports", targetUserDocId);
    const userDocSnap = await getDoc(userDocRef);

    const updatedReports = userDocSnap.data().reports.filter(
      report => report.id !== reportId
    );

    await updateDoc(userDocRef, { reports: updatedReports });

    console.log("✅ Admin successfully deleted the report!");
    return { 
      success: true, 
      message: "Report deleted by admin",
      userId: deletedReportUserId // Return the userId of the report owner
    };
    
  } catch (error) {
    console.error("❌ Admin report deletion failed:", error.message);
    throw error;
  }
};
export {verifyAllReports,deleteReport,deleteReportAdmin};