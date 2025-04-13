import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaEdit, FaTrash, FaSpinner, FaTimes, FaPlus, FaAddressBook } from "react-icons/fa";
import { editCitizen, deleteCitizen} from "./Citizenfunc";
import {  deleteAuthority, editAuthority } from "./Authorityfunc";
import { AppContext } from "../../../context/AppContext";
import { addAuthority, fetchAllUsers } from "../../../firebase/admin/manageUserFuncs";
import { Loader } from "lucide-react";
import emailjs from 'emailjs-com';
import { generateDepartmentEmail } from "../../../utilities/utilities";
emailjs.init('cAV_xtJvINO-NznWk');

const AdminUsers = () => {
  const [users, setUsers] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingAuthority, setAddingAuthority] = useState(false);
  const [newAuthority, setNewAuthority] = useState({ name: "", email: "", phone: "", department: "",password:"",id:""});
  
  const { setSnackbar } = useContext(AppContext);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const res = await fetchAllUsers();
        
        // Filter users with role "dept" for authorities array
        const deptUsers = res.filter(user => user.role === "dept");
        
        // Filter other users (non-dept) for users array
        const regularUsers = res.filter(user => user.role !== "dept");
        
        setAuthorities(deptUsers);
        setUsers(regularUsers);
        
      } catch (error) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Error while fetching users..."
        });
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsersData();
  }, []);
  

  const openEditModal = (item) => setEditingItem(item);
  const closeEditModal = () => {
    setEditingItem(null);
    setLoading(false);
  };

  const openDeleteModal = (item) => setDeletingItem(item);
  const closeDeleteModal = () => {
    setDeletingItem(null);
    setLoading(false);
  };

  const handleSave = () => {
    if (selectedRole === "citizen") {
      editCitizen(editingItem.id, editingItem, setUsers, setLoading, closeEditModal, setSnackbar);
    } else {
      editAuthority(editingItem.id, editingItem, setAuthorities, setLoading, closeEditModal, setSnackbar);
    }
  };

  const handleDelete = () => {
    if (selectedRole === "citizen") {
      deleteCitizen(deletingItem.id, setUsers, setLoading, closeDeleteModal, setSnackbar);
    } else {
      console.log(deletingItem);
      console.log(deletingItem.id);
      deleteAuthority(deletingItem.id, setAuthorities, setLoading, closeDeleteModal, setSnackbar);
    }
  };

  const openAddModal = () => setAddingAuthority(true);
  const closeAddModal = () => {
    setAddingAuthority(false);
    setNewAuthority({ name: "", email: "", phone: "", department: "",password:"" });
  };


  const handleAddAuthority = async () => {  
    setLoading(true);
    try {
      // 1. Generate credentials
      const generatedEmail = generateDepartmentEmail(newAuthority.department);
      const tempPassword = generateTempPassword();
  
      // 2. Add to Firestore
      const authorityDataForFirestore = {
        ...newAuthority,
        email: generatedEmail,
        password: tempPassword
      };
  
      const res = await addAuthority(authorityDataForFirestore);
  
      // 3. Try sending email (but don't fail the whole operation if this fails)
      const emailSent = await sendWelcomeEmail({
        name: newAuthority.name,
        department: newAuthority.department,
        officialEmail: generatedEmail,
        password: tempPassword,
        loginUrl: "https://pirs-system.gov/login"
      });
  
      // 4. Update state
      const updatedUsers = await fetchAllUsers();
      setAuthorities(updatedUsers.filter(user => user.role === "dept"));
      setUsers(updatedUsers.filter(user => user.role !== "dept"));
  
      setSnackbar({ 
        message: emailSent 
          ? `Authority added successfully! Credentials sent to ${newAuthority.email}`
          : `Authority added but email failed to send. Please manually send credentials.`,
        type: "success",
        open: true 
      });
      
      closeAddModal();
    } catch (error) {
      setSnackbar({
        message: `Failed to add authority: ${error.message}`,
        type: "error",
        open: true
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Updated email sending function
  const sendWelcomeEmail = async (authorityData) => {
    const templateParams = {
      name: authorityData.name,
      department: authorityData.department,
      official_email: authorityData.officialEmail,
      password: authorityData.password,
      login_url: authorityData.loginUrl
    };
  
    try {
      await emailjs.send(
        'service_2igm3qd',
        'template_5m2h1hq',
        templateParams
      );
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };
  
  // Helper function to generate temporary password
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  

  
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin - Manage Users</h2>
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-4">
        {["citizen", "authority"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-md transition ${
              selectedRole === role ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
      </div>
      <button onClick={openAddModal} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
        <FaPlus className="mr-2" /> Add Authority
      </button>
    </div>
  
    <div className="w-full border-collapse shadow-md bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">Name</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">{selectedRole === "citizen" ? "Address" : "Department"}</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
  {!users ? (
    <tr>
      <td colSpan={5} className="p-6">
        <div className="flex flex-col items-center justify-center h-[200px]">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading users...</p>
        </div>
      </td>
    </tr>
  ) : (selectedRole === "citizen" ? users : authorities).length === 0 ? (
    <tr>
      <td colSpan={5} className="p-6">
        <div className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-lg text-gray-700">No data found...</p>
        </div>
      </td>
    </tr>
  ) : (
    (selectedRole === "citizen" ? users : authorities).map((item) => (
      <tr key={item.id} className="text-center border-b hover:bg-gray-100">
        <td className="border p-3">{item.name}</td>
        <td className="border p-3">{item.email}</td>
        <td className="border p-3">{item.phone}</td>
        <td className="border p-3">{selectedRole === "citizen" ? item.address : item.department}</td>
        <td className="border p-3 flex justify-center space-x-2">
          <button onClick={() => openDeleteModal(item)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  
    {/* Delete Modal */}
    {deletingItem && (
      <Dialog 
        open={deletingItem !== null} 
        onClose={closeDeleteModal} 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Confirm Deletion</h2>
          <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deletingItem.email}</span>?</p>
          <div className="mt-4 flex gap-2">
            <button 
              className="w-full bg-gray-500 text-white p-2 rounded transition duration-200 hover:bg-gray-600"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button 
              className="w-full bg-red-500 text-white p-2 rounded flex items-center justify-center transition duration-200 hover:bg-red-600 disabled:bg-red-300"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin text-xl" /> : "Delete"}
            </button>
          </div>
        </div>
      </Dialog>
    )}
  
    {/* Add Authority Modal */}
    {addingAuthority && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <button onClick={closeAddModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
          <h3 className="text-xl font-semibold mb-4">Add Authority</h3>
          {["name", "email", "phone", "department"].map((field) => (
  <div key={field} className="mb-3">
    <label className="block text-gray-700 font-medium capitalize">{field.replace("_", " ")}</label>

    {field === "department" ? (
      <select
        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
        value={newAuthority[field] || ""}
        onChange={(e) => setNewAuthority({ ...newAuthority, [field]: e.target.value })}
      >
        <option value="">Select Department</option>
        <option value="water_supply_department">Water Supply Department</option>
        <option value="electricity_board">Electricity Board</option>
        <option value="municipal_department">Municipal Department/Corporation</option>
        <option value="public_works_department">Public Works Department</option>
        <option value="traffic_control_department">Traffic Control Department</option>
        <option value="parks_department">Parks and Recreation Department</option>
      </select>
    ) : (
      <input
        type={field === "password" ? "password" : "text"}
        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
        value={newAuthority[field] || ""}
        onChange={(e) => setNewAuthority({ ...newAuthority, [field]: e.target.value })}
      />
    )}
  </div>
))}


          <div className="flex justify-end space-x-2">
            <button onClick={closeAddModal} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
            <button onClick={handleAddAuthority} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Add"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminUsers;
