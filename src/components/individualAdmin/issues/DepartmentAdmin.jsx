import React, { useState, useContext } from "react";
import { FaTrash, FaSearch, FaCheckCircle, FaSpinner, FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { AppContext } from "../../../context/AppContext";

const issuesData = [
  { id: 2, title: "Garbage Dump", description: "Trash is piling up in the street", reportedBy: "Alice", department: "Sanitation", status: "Pending", date: "2025-03-11", isVerifiedByAdmin: true, images: ["https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg","https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg"] },
  { id: 3, title: "Traffic Issue", description: "Traffic congestion is unbearable", reportedBy: "Bob", department: "Traffic", status: "Resolved", date: "2025-03-10", isVerifiedByAdmin: false, images: ["https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg","https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg"] },
];

export default function DepartmentAdmin() {
  const [issues, setIssues] = useState(issuesData);
  const [selectedTab, setSelectedTab] = useState("new");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [resolutionDescription, setResolutionDescription] = useState("");
  const { role, setSnackbar, snackbar } = useContext(AppContext);
  const department = role.replace("DeptAdmin",""); // Corrected this line
  // Optional: Capitalize the department name
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const formattedDepartment = capitalize(department);

  const [loading, setLoading] = useState(false);

  // Filter issues based on the department
  const filteredIssues = issues.filter(issue => {
    const matchesTab = selectedTab === "new" ? !issue.isVerifiedByAdmin : issue.isVerifiedByAdmin;
    const matchesSearch = issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment = issue.department === formattedDepartment;
    const matchesStatus = statusFilter ? issue.status === statusFilter : true;
    const matchesDate = (!dateFilter.start || new Date(issue.date) >= new Date(dateFilter.start)) &&
                        (!dateFilter.end || new Date(issue.date) <= new Date(dateFilter.end));

    return matchesTab && matchesSearch && matchesDepartment && matchesStatus && matchesDate;
  });

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {  
      setIssues(issues.filter(issue => issue.id !== issueToDelete));
      setSnackbar({ message: "Issue Deleted successfully", severity: "success", open: true });
      setIsConfirmOpen(false);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyAll = () => {
    setLoading(true);
    setTimeout(() => {  
      const updatedIssues = issues.map(issue => {
        if (!issue.isVerifiedByAdmin && issue.department === formattedDepartment) {
          return { ...issue, isVerifiedByAdmin: true };
        }
        return issue;
      });
      setSnackbar({ message: "All issues verified successfully", severity: "success", open: true });
      setIssues(updatedIssues);
      setLoading(false);
    }, 1000);
  };

  const handleEditStatus = (issueId, newStatus, resolutionDescription) => {
    setLoading(true);
    setTimeout(() => {  
      const updatedIssues = issues.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, status: newStatus, resolutionDescription };
        }
        return issue;
      });
      setSnackbar({ message: "Issue status updated successfully", severity: "success", open: true });
      setIssues(updatedIssues);
      setLoading(false);
      setIsEditModalOpen(false);
      sendEmailToUser(issueId, newStatus, resolutionDescription);
    }, 1000);
  };

  const sendEmailToUser = (issueId, newStatus, resolutionDescription) => {
    const issue = issues.find(issue => issue.id === issueId);
    const emailContent = `Your issue titled "${issue.title}" has been updated to status "${newStatus}". Resolution Description: ${resolutionDescription}`;
    console.log(`Sending email to ${issue.reportedBy}: ${emailContent}`);
    // Implement your email sending logic here
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const noNewIssues = selectedTab === "new" && filteredIssues.length === 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{formattedDepartment} - Manage Issues</h2>
      <div className="flex space-x-4 mb-6">
        <button className={`p-2 rounded ${selectedTab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setSelectedTab('new')}>Newly Reported Issues</button>
        <button className={`p-2 rounded ${selectedTab === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setSelectedTab('verified')}>Verified Issues</button>
      </div>

      {noNewIssues ? (
        <div className="text-center text-gray-500 py-6">
          No newly reported issues.
        </div>
      ) : (
        <>
          {selectedTab === "new" && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleVerifyAll}
                className="p-2 bg-green-500 text-white rounded flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-lg" />
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" /> Verify All
                  </>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or description"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <FaSearch className="absolute top-3 right-3 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <table className="min-w-full border rounded-lg mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-center">Title</th>
                <th className="p-2 text-center">Description</th>
                <th className="p-2 text-center">Reported By</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Date</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }}>
                  <td className="p-2 text-center">{issue.title}</td>
                  <td className="p-2 text-center">{issue.description}</td>
                  <td className="p-2 text-center">{issue.reportedBy}</td>
                  <td className="p-2 text-center">{issue.status}</td>
                  <td className="p-2 text-center">{formatDate(issue.date)}</td>
                  <td className="p-2 text-center flex gap-2">
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIssue(issue);
                        setEditedStatus(issue.status);
                        setIsEditModalOpen(true);
                      }}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIssueToDelete(issue.id);
                        setIsConfirmOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Issue Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedIssue.title}</h2>
            <div className="space-y-2">
              <p><strong>Description:</strong> {selectedIssue.description}</p>
              <p><strong>Reported By:</strong> {selectedIssue.reportedBy}</p>
              <p><strong>Status:</strong> {selectedIssue.status}</p>
              <p><strong>Date:</strong> {formatDate(selectedIssue.date)}</p>
              <div className="flex gap-2 mt-4">
                {selectedIssue.images.map((img, index) => (
                  <img key={index} src={img} alt="Issue" className="w-24 h-24 rounded-lg border" />
                ))}
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        )}
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Issue Status</h2>
            <div className="space-y-2">
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <textarea
                value={resolutionDescription}
                onChange={(e) => setResolutionDescription(e.target.value)}
                placeholder="Describe how many days the issue will take to resolve..."
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                onClick={() => handleEditStatus(selectedIssue.id, editedStatus, resolutionDescription)}
              >
                Save
              </button>
              <button
                className="w-full bg-gray-500 text-white p-2 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this issue?</p>
          <div className="mt-4 flex gap-2">
            <button
              className="w-full bg-red-500 text-white p-2 rounded flex items-center justify-center"
              onClick={handleDelete}
            >
              {loading ? <FaSpinner className="animate-spin text-xl" /> : "Delete"}
            </button>
            <button className="w-full bg-gray-500 text-white p-2 rounded" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}