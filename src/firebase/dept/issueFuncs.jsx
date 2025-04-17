import { collection, getDocs,updateDoc,doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const getReportsByDepartment = async (departmentName) => {
  try {
    const reportsRef = collection(db, "reports");
    const snapshot = await getDocs(reportsRef);

    const allReports = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const userReports = data.reports || [];

      const filteredReports = userReports.filter(
        (report) => report.department === departmentName
      );

      allReports.push(...filteredReports);
    });

    return allReports;
  } catch (error) {
    console.error("❌ Error fetching reports by department:", error.message);
    throw error;
  }
};

const updateReportById = async (reportId, updatedData) => {
    try {
      const reportsRef = collection(db, "reports");
      const snapshot = await getDocs(reportsRef);
  
      let reportUpdated = false;
  
      for (const reportDoc of snapshot.docs) {
        const data = reportDoc.data();
        const userReports = data.reports || [];
  
        const reportIndex = userReports.findIndex(
          (report) => report.id === reportId
        );
  
        // If the report is found in this document
        if (reportIndex !== -1) {
          // Update only the required fields
          const updatedReports = [...userReports];
          updatedReports[reportIndex] = {
            ...updatedReports[reportIndex],
            ...updatedData,
          };
  
          // Push the updated array back to Firestore
          await updateDoc(doc(db, "reports", reportDoc.id), {
            reports: updatedReports,
          });
  
          console.log(`✅ Report with ID "${reportId}" updated successfully.`);
          reportUpdated = true;
          break; // Exit the loop early
        }
      }
  
      if (!reportUpdated) {
        console.warn(`⚠️ Report with ID "${reportId}" not found.`);
      }
    } catch (error) {
      console.error("❌ Error updating report:", error.message);
      throw error;
    }
  };

export {getReportsByDepartment,updateReportById}