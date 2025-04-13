import { deleteUser,createUserWithEmailAndPassword} from "firebase/auth";
import { deleteDoc, collection, query, where, getDocs,doc,updateDoc,setDoc,serverTimestamp,getDoc,arrayUnion} from "firebase/firestore";
import { auth,db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid"; 

const fetchAllUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);
  
      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Skip users with role "admin"
        if (userData.role !== "admin") {
          users.push({
            id: doc.id,
            ...userData,
          });
        }
      });
  
      // console.log("Fetched users (excluding admins):", users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error.message);
      throw error;
    }
};

const deleteUserAccount = async (userId) => {
    try {
      // 1. First delete all user-related documents from other collections
      const collectionsToClean = ['reports', 'notifications'];
      console.log(userId);
      for (const collectionName of collectionsToClean) {
        const q = query(
          collection(db, collectionName),
          where("userId", "==", userId)
        );
        
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
      }
  
      // 2. Delete from Firestore users collection
      await deleteDoc(doc(db, "users", userId));
  
      // 3. Delete from Authentication (if current user)
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteUser(user);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
};


const editUserDetails = async (userId, updatedData) => {
    try {
      // Remove any authentication-related fields if present
      const { email, password, ...safeUserData } = updatedData;
  
      // Update user document in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, safeUserData);
  
      return { success: true, message: "User details updated successfully" };
    } catch (error) {
      console.error("Error updating user:", error);
      return { 
        success: false, 
        message: "Failed to update user details" 
      };
    }
};



const addAuthority = async (authorityData) => {
  try {
      // 1. First validate the input data
      if (!authorityData.email || !authorityData.password || !authorityData.name) {
          throw new Error("Missing required fields");
      }

      // 2. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
          auth,
          authorityData.email,
          authorityData.password
      );

      // 3. Create the user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
          uid:userCredential.user.uid,
          name: authorityData.name,
          email: authorityData.email,
          phone: authorityData.phone || "",
          department: authorityData.department || "",
          role: "dept",  // Explicitly set role
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
      });

      console.log("Authority added successfully:", userCredential.user.uid);
      return userCredential.user.uid;
      
  } catch (error) {
      console.error("Error adding authority:", error.message);
      
      // Clean up if user was created but Firestore failed
      if (error.code === 'firestore-error' && userCredential?.user) {
          await deleteUser(userCredential.user);
          console.warn("Rolled back auth user due to Firestore failure");
      }
      
      throw error;
  }
};

const getUserByDepartment = async(departmentName)=>{
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("department", "==", departmentName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Since only one user per department
      return {
        uid: userDoc.uid,
        ...userDoc.data()
      };
    } else {
      console.log("No user found for department:", departmentName);
      return null;
    }
  } catch (error) {
    console.error("Error getting user by department:", error);
    return null;
  }
}


const sendNotificationToUser = async (userId, notification) => {
  const notificationDocRef = doc(db, "notifications", userId);

  const docSnap = await getDoc(notificationDocRef);

  // Create notification with a generated id
  const notificationWithId = {
    ...notification,
    id: uuidv4() // generate a unique id for this notification
  };

  if (docSnap.exists()) {
    // Update notifys array
    await updateDoc(notificationDocRef, {
      notifys: arrayUnion(notificationWithId)
    });
  } else {
    // Create new document with userId and notifys array
    await setDoc(notificationDocRef, {
      userId: userId,
      notifys: [notificationWithId]
    });
  }
};

export {fetchAllUsers,deleteUserAccount,editUserDetails,addAuthority,getUserByDepartment,sendNotificationToUser}