import { auth, db, storage } from "../firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,signOut
} from "firebase/auth";
import { doc, setDoc, getDoc,updateDoc } from "firebase/firestore";

const registerUser = async (name, email, password, role, address, department, phone, photo) => {
  try {
    // 1. Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Save user data into Firestore
    const userData = {
      name: name,
      email: email,
      address: address,
      department: department || "",
      phone: phone,
      photoURL: photo,
      role: role,
      uid: user.uid,  // Store UID within the document
      createdAt: new Date().toISOString()  // Simple timestamp
    };

    await setDoc(doc(db, "users", user.uid), userData);
    console.log("Firestore document created successfully!");

    return user;

  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

const loginUser = async (email, password, requiredRole = null) => {
  try {
    // Authenticate user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user details from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      throw new Error("User not found in Firestore");
    }

    const userData = userDoc.data();
    // console.log("User details:", userData);

    // Check if user has a role field
    if (!userData.role) {
      throw new Error("User role not defined");
    }

    // If a specific role is required, verify it matches
    if (requiredRole && userData.role !== requiredRole) {
      throw new Error(`User does not have required ${requiredRole} role`);
    }

    return { uid: user.uid, ...userData };
    
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};


const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user:", userId, error);
    return null;
  }
};

const updateUserProfile = async (uid, updatedData) => {
  try {
    if (!uid) {
      throw new Error("User ID is required for updating profile.");
    }

    // 1. Reference to the user's document
    const userRef = doc(db, "users", uid);

    // 2. Update fields
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // Optional: track last update time
    });

    console.log("User profile updated successfully!");
    return true; // or return some status if you want

  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw error;
  }
};

export { registerUser, loginUser,getUserData,updateUserProfile};