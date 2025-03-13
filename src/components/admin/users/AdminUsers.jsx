import React, { useContext, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaEdit, FaTrash, FaSpinner, FaTimes, FaPlus } from "react-icons/fa";
import { editCitizen, deleteCitizen, users as initialUsers } from "./Citizenfunc";
import { authorities as initialAuthorities, deleteAuthority, editAuthority } from "./Authorityfunc";
import { AppContext } from "../../../context/AppContext";

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [authorities, setAuthorities] = useState(initialAuthorities);
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingAuthority, setAddingAuthority] = useState(false);
  const [newAuthority, setNewAuthority] = useState({ name: "", email: "", phoneNumber: "", department: "" });
  
  const { setSnackbar } = useContext(AppContext);

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
    setNewAuthority({ name: "", email: "", phoneNumber: "", department: "" });
  };
  const handleAddAuthority = () => {  
    setAuthorities([...authorities, { ...newAuthority, id: Date.now() }]);
    setSnackbar({ message: "Authority added successfully", type: "success",open:true });
    closeAddModal();
    console.log(authorities);
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

      <table className="w-full border-collapse shadow-md bg-white rounded-lg">
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
          {(selectedRole === "citizen" ? users : authorities).map((item) => (
            <tr key={item.id} className="text-center border-b hover:bg-gray-100">
              <td className="border p-3">{item.name}</td>
              <td className="border p-3">{item.email}</td>
              <td className="border p-3">{item.phoneNumber}</td>
              <td className="border p-3">{selectedRole === "citizen" ? item.address : item.department}</td>
              <td className="border p-3 flex justify-center space-x-2">
                <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={() => openDeleteModal(item)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit {selectedRole === "citizen" ? "Citizen" : "Authority"}</h3>
            {["name", "email", "phoneNumber", selectedRole === "citizen" ? "address" : "department"].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-gray-700 font-medium">{field}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  value={editingItem[field] || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <button onClick={closeEditModal} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
                {loading ? <FaSpinner className="animate-spin mr-2" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
  <Dialog 
    open={deletingItem !== null} 
    onClose={closeDeleteModal} 
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Confirm Deletion</h2>
      <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deletingItem.name}</span>?</p>
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
            {["name", "email", "phoneNumber", "department"].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-gray-700 font-medium">{field}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  value={newAuthority[field] || ""}
                  onChange={(e) => setNewAuthority({ ...newAuthority, [field]: e.target.value })}
                />
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
