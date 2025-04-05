import { auth, db } from "../firebaseConfig";
import { serverTimestamp, doc, setDoc,collection } from "firebase/firestore";

const createReport = async (
  title,
  description,
  category,
  department = "General",
  address = null,
  photoUrls = []
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (!title || !description || !category) {
      throw new Error("Title, description, and category are required");
    }

    // Create a document reference with auto-generated ID
    const reportRef = doc(collection(db, "reports")); // Fixed this line
    const reportId = reportRef.id;

    const reportData = {
      id: reportId,
      title,
      description,
      category,
      department,
      reportedBy: {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
      },
      reportedDate: serverTimestamp(),
      address,
      photoUrls,
      isVerifiedByAdmin: false,
      status: "pending",
      lastUpdated: serverTimestamp(),
      likes: [],
      comments: [],
      likeCount: 0,
      commentCount: 0
    };

    await setDoc(reportRef, reportData);
    console.log("Report created successfully with ID:", reportId);
    return reportData;

  } catch (error) {
    console.error("Error creating report:", error.message);
    throw error;
  }
};

export { createReport };