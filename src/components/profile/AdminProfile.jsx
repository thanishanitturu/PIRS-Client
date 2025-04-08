import { useState, Fragment, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { getUserData } from "../../firebase/citizen/authFuncs";

export default function AdminProfile() {
  const [userData, setUserData] = useState(null); // Initialize as null
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

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setUserData({ ...updatedUserData, photoURL: previewImage });
      setSnackbar({ message: "Profile Updated successfully", type: "success", open: true });
      setLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  // Loading state
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
    <div className="flex h-screen w-screen">
      {/* Left Section */}
      <div className="w-1/3 h-full bg-gray-100 flex flex-col p-6">
        <h1 className="text-6xl font-bold text-gray-800 mb-10">Public Issue Reporting System</h1>
        <img 
          src="https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" 
          alt="PIRS" 
          className="w-full h-auto object-cover mt-6 rounded-lg" 
        />
      </div>

      {/* Right Section */}
      <div className="w-2/3 h-full flex flex-col items-center p-10 bg-white shadow-lg">
        <img 
          src={userData?.photoURL} 
          alt="Admin" 
          className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 mb-4" 
        />
        <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-lg mt-6">
          <p className="font-semibold">Email:</p> <p>{userData?.email}</p>
          <p className="font-semibold">Role:</p> <p>{userData?.role}</p>
          <p className="font-semibold">Contact:</p> <p>{userData?.phone}</p>
          <p className="font-semibold">Address:</p> <p>{userData?.address || "NA"}</p>
        </div>

        <button 
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" 
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      <Transition show={isEditing} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditing(false)}>
          <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center">
            <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition-transform duration-300 ease-in" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-96">
                <Dialog.Title className="text-xl font-bold">Edit Profile</Dialog.Title>
                <div className="mt-4 space-y-3">
                  <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto border" />
                  <input type="text" name="name" value={updatedUserData.name || ""} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded-md" />
                  <input type="email" name="email" value={updatedUserData.email || ""} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-md" />
                  <input type="text" name="phone" value={updatedUserData.phone || ""} onChange={handleChange} placeholder="Contact" className="w-full p-2 border rounded-md" />
                  <input type="text" name="address" value={updatedUserData.address || ""} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-md" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
                </div>
                <div className="mt-4 flex justify-between">
                  <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center" onClick={handleUpdate} disabled={loading}>
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