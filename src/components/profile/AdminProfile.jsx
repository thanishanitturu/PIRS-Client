import { useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader } from "lucide-react";
import { AppContext } from "../../context/AppContext";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    name: "John Doe",
    email: "admin@example.com",
    role: "Website Administrator",
    contact: "+123 456 7890",
    address: "123, City Street, NY",
    profilePic: "https://www.w3schools.com/howto/img_avatar.png",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedAdmin, setUpdatedAdmin] = useState(admin);
  const [previewImage, setPreviewImage] = useState(admin.profilePic);
  const {setSnackbar} = useContext(AppContext);

  const handleChange = (e) => {
    setUpdatedAdmin({ ...updatedAdmin, [e.target.name]: e.target.value });
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
      setAdmin({ ...updatedAdmin, profilePic: previewImage });
      setSnackbar({ message: "Profile Updated successfully", type: "success",open:true});
      setLoading(false);
      setIsEditing(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Section */}
      <div className="w-1/3 h-full bg-gray-100 flex flex-col  p-6">
        <h1 className="text-6xl font-bold text-gray-800 mb-10">Public Issue Reporting System</h1>
        <img src="https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" alt="PIRS" className="w-full h-auto object-cover mt-6 rounded-lg" />
      </div>

      {/* Right Section */}
      <div className="w-2/3 h-full flex flex-col items-center p-10 bg-white shadow-lg">
        <img src={admin.profilePic} alt="Admin" className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{admin.name}</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-lg mt-6">
          <p className="font-semibold">Email:</p> <p>{admin.email}</p>
          <p className="font-semibold">Role:</p> <p>{admin.role}</p>
          <p className="font-semibold">Contact:</p> <p>{admin.contact}</p>
          <p className="font-semibold">Address:</p> <p>{admin.address}</p>
        </div>

        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={() => setIsEditing(true)}>
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
                  <input type="text" name="name" value={updatedAdmin.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded-md" />
                  <input type="email" name="email" value={updatedAdmin.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-md" />
                  <input type="text" name="contact" value={updatedAdmin.contact} onChange={handleChange} placeholder="Contact" className="w-full p-2 border rounded-md" />
                  <input type="text" name="address" value={updatedAdmin.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-md" />
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
