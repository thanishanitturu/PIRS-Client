import { useState, Fragment, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { getUserData, updateUserProfile } from "../../firebase/citizen/authFuncs";
import axios from "axios";

export default function AdminProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const { setSnackbar } = useContext(AppContext);

  useEffect(() => {
    const getUserDataFunc = async () => {
      try {
        const resdata = await getUserData(localStorage.getItem("uid"));
        setUserData(resdata);
        setUpdatedUserData(resdata);
        setPreviewImage(resdata.photoURL);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setSnackbar({ message: "Failed to load profile", type: "error", open: true });
      }
    };
    getUserDataFunc();
  }, []);

  const uploadImageToCloudinary = async (currphoto) => {
    const uploadData = new FormData();
    uploadData.append("file", currphoto);
    uploadData.append("upload_preset", "unsigned_upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkzzeiqhh/image/upload",
        uploadData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleChange = (e) => {
    setUpdatedUserData({ ...updatedUserData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let profileUrl = userData.photoURL;
      if (previewImage && previewImage !== userData.photoURL) {
        const file = await fetch(previewImage).then(r => r.blob());
        profileUrl = await uploadImageToCloudinary(file);
      }

      const updatedProfileData = {
        ...updatedUserData,
        photoURL: profileUrl,
      };

      await updateUserProfile(localStorage.getItem("uid"), updatedProfileData);
      setUserData(updatedProfileData);
      setSnackbar({ message: "Profile updated successfully!", type: "success", open: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      setSnackbar({ message: "Failed to update profile", type: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile View - Only Profile Details */}
      <div className="lg:hidden p-6 flex flex-col items-center">
        <img 
          src={userData?.photoURL} 
          alt="Admin" 
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4" 
        />
        <h2 className="text-2xl font-bold text-gray-800 text-center">{userData?.name}</h2>

        <div className="w-full mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-600">{userData?.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Role:</span>
            <span className="text-gray-600">{userData?.role}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Contact:</span>
            <span className="text-gray-600">{userData?.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Address:</span>
            <span className="text-gray-600">{userData?.address || "NA"}</span>
          </div>
        </div>

        <button 
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full max-w-xs" 
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* Desktop View - Optimized Vertical Layout */}
      <div className="hidden lg:flex h-screen w-full">
        {/* Left Section */}
        <div className="w-1/3 h-full bg-gray-100 flex flex-col p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Public Issue Reporting System</h1>
          <img 
            src="https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" 
            alt="PIRS" 
            className="w-full h-auto object-cover mt-8 rounded-lg" 
          />
        </div>

        {/* Right Section - Vertical Flow */}
        <div className="w-2/3 h-full p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center space-y-1">
              {/* Profile Image */}
              <img 
                src={userData?.photoURL} 
                alt="Admin" 
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-300 shadow-md" 
              />
              
              {/* Profile Name */}
              <h2 className="text-4xl font-bold text-gray-800 text-center">{userData?.name}</h2>
              
              {/* Profile Details */}
              <div className="w-full space-y-6 text-lg">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Email</span>
                  <span className="text-gray-600 p-3 bg-gray-50 rounded-lg">{userData?.email}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Role</span>
                  <span className="text-gray-600 p-3 bg-gray-50 rounded-lg">{userData?.role}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Contact</span>
                  <span className="text-gray-600 p-3 bg-gray-50 rounded-lg">{userData?.phone}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Address</span>
                  <span className="text-gray-600 p-3 bg-gray-50 rounded-lg">{userData?.address || "Not specified"}</span>
                </div>
              </div>

              {/* Edit Button */}
              <button 
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium w-full max-w-xs" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Transition show={isEditing} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditing(false)}>
          <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transition-transform duration-300 ease-in" leaveFrom="translate-y-0" leaveTo="translate-y-full">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <Dialog.Title className="text-xl font-bold mb-4">Edit Profile</Dialog.Title>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border mb-2" 
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={updatedUserData.name || ""} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={updatedUserData.email || ""} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={updatedUserData.phone || ""} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input 
                      type="text" 
                      name="address" 
                      value={updatedUserData.address || ""} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center" 
                    onClick={handleUpdate} 
                    disabled={loading}
                  >
                    {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : "Update"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}