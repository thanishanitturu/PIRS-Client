import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore";

const registerUser = async (name, email, password,role,address,department,phone,photo) => {
  try {
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      address:address,
      department:department,
      phone:phone,
      photo:photo,
      role: role,
      uid: user.uid,
      createdAt: new Date()
    });

    console.log("User registered and stored in Firestore:", user.uid);
    return user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};



const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User details:", userDoc.data());
        return { uid: user.uid, ...userDoc.data() };
      } else {
        throw new Error("User not found in Firestore");
      }
    } catch (error) {
      console.error("Error logging in user:", error.message);
      throw error;
    }
  };
  
export {registerUser,loginUser}