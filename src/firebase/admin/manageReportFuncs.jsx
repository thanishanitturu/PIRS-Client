import { debugErrorMap } from 'firebase/auth';
import {db} from '../firebaseConfig'
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  updateDoc,
  arrayUnion 
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
  try {
    if (!reportId) throw new Error("Report ID is required");

    const usersRef = collection(db, "reports");
    const usersSnapshot = await getDocs(usersRef);
    const batch = writeBatch(db);
    let reportFound = false;

    // Search through all user documents
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const reports = userData.reports || [];
      
      // Find the report in this user's reports array
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex !== -1) {
        reportFound = true;
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
    return "Report successfully deleted";
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete report: ${error.message}`);
  }
};
export {verifyAllReports,deleteReport};