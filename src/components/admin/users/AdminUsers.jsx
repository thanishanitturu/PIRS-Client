import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaEdit, FaTrash, FaSpinner, FaTimes, FaPlus, FaUserShield, FaUser } from "react-icons/fa";
import { editCitizen, deleteCitizen } from "./Citizenfunc";
import { deleteAuthority, editAuthority } from "./Authorityfunc";
import { AppContext } from "../../../context/AppContext";
import { addAuthority, fetchAllUsers } from "../../../firebase/admin/manageUserFuncs";
import { Loader } from "lucide-react";
import emailjs from 'emailjs-com';
import { generateDepartmentEmail } from "../../../utilities/utilities";

emailjs.init('f2aUITqQLMWTLNT75');

const AdminUsers = () => {
  const [users, setUsers] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingAuthority, setAddingAuthority] = useState(false);
  const [newAuthority, setNewAuthority] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    department: "", 
    password: "",
    id: ""
  });
  
  const { setSnackbar } = useContext(AppContext);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const res = await fetchAllUsers();
        const deptUsers = res.filter(user => user.role === "dept");
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
      // const tempPassword = generateTempPassword();
  
      // 2. Add to Firestore
      const authorityDataForFirestore = {
        ...newAuthority,
        email: generatedEmail,
        password:newAuthority.password
      };
      console.log(authorityDataForFirestore);
  
      const res = await addAuthority(authorityDataForFirestore);
      console.log(newAuthority);
      // 3. Try sending email (but don't fail the whole operation if this fails)
      const emailSent = await sendWelcomeEmail({
        name: newAuthority.name,
        department: newAuthority.department,
        officialEmail:newAuthority.email,
        password:newAuthority.password,
        loginUrl: "https://poirs-621c0.web.app/"
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
      console.log(error)
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
    console.log(authorityData)
    const templateParams = {
      name: authorityData.name,
      department: authorityData.department,
      official_email: authorityData.officialEmail,
      password:authorityData.password,
      login_url:authorityData.loginUrl,
      to_email:authorityData.officialEmail
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
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">User Management</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => setSelectedRole("citizen")}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition ${
                  selectedRole === "citizen" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                <FaUser className="mr-3" />
                Citizens
              </button>
              
              <button
                onClick={() => setSelectedRole("authority")}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition ${
                  selectedRole === "authority" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                <FaUserShield className="mr-3" />
                Authorities
              </button>
              
              <button 
                onClick={openAddModal}
                className="w-full flex items-center px-4 py-2 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus className="mr-3" />
                Add Authority
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedRole === "citizen" ? "Citizen Users" : "Authority Users"}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedRole === "citizen" 
                  ? `Total Citizens: ${users?.length || 0}` 
                  : `Total Authorities: ${authorities?.length || 0}`}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {selectedRole === "citizen" ? "Address" : "Department"}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!users ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex justify-center items-center h-32">
                          <Loader className="animate-spin h-8 w-8 text-blue-600" />
                        </div>
                      </td>
                    </tr>
                  ) : (selectedRole === "citizen" ? users : authorities).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No {selectedRole === "citizen" ? "citizens" : "authorities"} found
                      </td>
                    </tr>
                  ) : (
                    (selectedRole === "citizen" ? users : authorities).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {selectedRole === "citizen" ? item.address : item.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="text-red-600 hover:text-red-900 ml-2"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal (same as before) */}
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

      {/* Add Authority Modal (same as before) */}
      {addingAuthority && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={closeAddModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">Add Authority</h3>
            {["name", "email", "phone", "department","password"].map((field) => (
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












