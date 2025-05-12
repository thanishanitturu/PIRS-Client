import { useState, Fragment, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader, Edit, User, Mail, Phone, MapPin } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("profile");

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <img 
              src={userData?.photoURL} 
              alt="Profile" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-medium">{userData?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col items-center py-4">
                <img 
                  src={userData?.photoURL} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 mb-3"
                />
                <h2 className="text-xl font-bold text-center">{userData?.name}</h2>
                <p className="text-sm text-gray-500">{userData?.role}</p>
              </div>

              <nav className="mt-6 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "profile" ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "settings" ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Edit className="mr-3 h-5 w-5" />
                  Edit Profile
                </button>
              </nav>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1">
            {activeTab === "profile" ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-1 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{userData?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-1 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact</p>
                        <p className="mt-1 text-sm text-gray-900">{userData?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="mt-1 text-sm text-gray-900">{userData?.address || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="h-24 w-24 rounded-full object-cover border mb-3"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Change Profile Photo
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="w-full text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={updatedUserData.name || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={updatedUserData.email || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={updatedUserData.phone || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={updatedUserData.address || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right space-x-3">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : "Update Profile"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}