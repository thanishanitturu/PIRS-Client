import React, { useState, useContext, useEffect } from "react";
import { FaTrash, FaSearch, FaCheckCircle, FaSpinner, FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { AppContext } from "../../../context/AppContext";
import { getReportsByDepartment, updateReportById } from "../../../firebase/dept/issueFuncs";
import { sendNotificationToUser } from "../../../firebase/admin/manageUserFuncs";

export default function DepartmentAdmin() {
  const [issues, setIssues] = useState([]);
  const [unVerifiedIssues, setUnVerifiedIssues] = useState([]);
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
  const { setSnackbar } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // New loading state for initial load

  useEffect(() => {
    const getDeptsData = async () => {
      try {
        setInitialLoading(true);
        const res = await getReportsByDepartment(localStorage.getItem("deptname"));
        const unverifiedissues = res.filter(issue => !issue.isVerifiedByAdmin);
        setIssues(res);
        setUnVerifiedIssues(unverifiedissues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setSnackbar({
          message: "Failed to load issues",
          severity: "error",
          open: true
        });
      } finally {
        setInitialLoading(false);
      }
    };
    getDeptsData();
  }, []);

  // Show loading spinner before tabs while data is loading
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading issues...</p>
        </div>
      </div>
    );
  }

  // Rest of your component remains the same...
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSearchText("");
    setStatusFilter("");
    setDateFilter({ start: "", end: "" });
  };

  const dateFilterMatches = (issueDate, filterStart, filterEnd) => {
    try {
      const date = issueDate?.toDate ? issueDate.toDate() : new Date(issueDate);
      if (isNaN(date.getTime())) return false;

      const startDate = filterStart ? new Date(filterStart) : null;
      if (startDate) startDate.setHours(0, 0, 0, 0);
      
      const endDate = filterEnd ? new Date(filterEnd) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);

      return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    } catch (e) {
      console.error("Date filtering error:", e);
      return false;
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesTab = selectedTab === "new" ? !issue.isVerifiedByAdmin : issue.isVerifiedByAdmin;
    const matchesSearch = issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? issue.status === statusFilter : true;
    const matchesDate = dateFilterMatches(issue.reportedDate || issue.date, dateFilter.start, dateFilter.end);

    return matchesTab && matchesSearch && matchesStatus && matchesDate;
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

  const handleEditStatus = async (issueId, newStatus, resolutionDescription) => {
    setLoading(true);
    try {
      const updatedIssues = issues.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, status: newStatus, resolutionDescription };
        }
        return issue;
      });
      
      const updatedData = {
        status: newStatus,
        resolutionDescription
      };
  
      const res = await updateReportById(issueId, updatedData);
      // console.log(res);
      
      setIssues(updatedIssues);
      setSnackbar({ 
        message: "Issue status updated successfully", 
        severity: "success", 
        open: true 
      });
      
      sendEmailToUser(issueId, newStatus, resolutionDescription);
    } catch (error) {
      console.error("Error updating issue status:", error);
      setSnackbar({
        message: "Failed to update issue status",
        severity: "error",
        open: true
      });
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const sendEmailToUser = async (issueId, newStatus, resolutionDescription) => {
    try {
      const issue = issues.find(issue => issue.id === issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }
  
      const emailContent = `Your issue titled "${issue.title}" has been updated to status "${newStatus}". Resolution Description: ${resolutionDescription}`;
      
      const notification = {
        title: "Status Update",
        message: emailContent,
        timestamp: new Date(),
        department: localStorage.getItem("deptname"),
        isRead: false,
      };
  
      if (!issue.reportedBy?.uid) {
        throw new Error("User ID not found for notification");
      }
  
      await sendNotificationToUser(issue.reportedBy.uid, notification);
      
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Notification sent successfully to ${issue.reportedBy?.name || 'user'}`
      });
  
    } catch (error) {
      console.error("Error sending notification:", error);
      setSnackbar({
        open: true,
        severity: 'error',
        message: error.message || "Failed to send notification"
      });
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date available";
    try {
      const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
      return isNaN(date.getTime()) 
        ? "Invalid date" 
        : date.toLocaleDateString("en-US", { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid date";
    }
  };

  const noNewIssues = selectedTab === "new" && unVerifiedIssues.length === 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{localStorage.getItem("deptname")} - Manage Issues</h2>
      <div className="flex space-x-4 mb-6">
        <button 
          className={`p-2 rounded ${selectedTab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} 
          onClick={() => handleTabChange('new')}
        >
          Unverified Issues
        </button>
        <button 
          className={`p-2 rounded ${selectedTab === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} 
          onClick={() => handleTabChange('verified')}
        >
          Verified Issues
        </button>
      </div>

      {noNewIssues ? (
        <div className="text-center text-gray-500 py-6">
          No unverified issues.
        </div>
      ) : (
        <>
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
              <option value="pending">Pending</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
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
                <th className="p-2 text-center">Address</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Date</th>
                {selectedTab === "verified" && <th className="p-2 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr 
                  key={issue.id} 
                  className={`border-b ${selectedTab === "new" ? "opacity-70 bg-gray-50" : "hover:bg-gray-100"} cursor-pointer`}
                  onClick={() => {
                    setSelectedIssue(issue);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="p-2 text-center">{issue.title}</td>
                  <td className="p-2 text-center">{issue.description}</td>
                  <td className="p-2 text-center">{issue.reportedBy?.name || "Unknown"}</td>
                  <td className="p-2 text-center">{issue.address || "N/A"}</td>
                  <td className="p-2 text-center">{issue.status}</td>
                  <td className="p-2 text-center">{formatDate(issue.reportedDate)}</td>
                  {selectedTab === "verified" && (
                    <td className="p-2 text-center flex gap-2 justify-center">
                      <FaEdit
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                          setEditedStatus(issue.status);
                          setIsEditModalOpen(true);
                        }}
                      />
                      {/* <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIssueToDelete(issue.id);
                          setIsConfirmOpen(true);
                        }}
                      /> */}
                    </td>
                  )}
                </tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr className="text-center text-lg py-3">
                  <td colSpan={selectedTab === "verified" ? 7 : 6} className="py-3 text-red-500">
                    No Issues Found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Issue Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedIssue.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Description:</strong> {selectedIssue.description}</p>
                <p><strong>Reported By:</strong> {selectedIssue.reportedBy?.name || "Unknown"}</p>
                <p><strong>Status:</strong> {selectedIssue.status}</p>
                <p><strong>Address:</strong> {selectedIssue.address || "Not provided"}</p>
                <p><strong>Date:</strong> {formatDate(selectedIssue.reportedDate || selectedIssue.date)}</p>
                {selectedIssue.resolutionDescription && (
                  <p><strong>Resolution:</strong> {selectedIssue.resolutionDescription}</p>
                )}
              </div>
              
              <div>
                {(selectedIssue.images?.length > 0 || selectedIssue.photoUrls?.length > 0) && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Photos:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[...(selectedIssue.images || []), ...(selectedIssue.photoUrls || [])].map((url, index) => (
                        <img 
                          key={`photo-${index}`}
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {selectedIssue.isVerifiedByAdmin && (
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    setEditedStatus(selectedIssue.status);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                {/* <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setIssueToDelete(selectedIssue.id);
                    setIsConfirmOpen(true);
                  }}
                >
                  Delete
                </button> */}
              </div>
            )}
            <button 
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
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
                <option value="pending">Pending</option>
                <option value="progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
              <textarea
                value={resolutionDescription}
                onChange={(e) => setResolutionDescription(e.target.value)}
                placeholder="Describe the resolution or progress..."
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={() => handleEditStatus(selectedIssue.id, editedStatus, resolutionDescription)}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Save"}
              </button>
              <button
                className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                onClick={() => setIsEditModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      {/* <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this issue?</p>
          <div className="mt-4 flex gap-2">
            <button
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
            </button>
            <button 
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              onClick={() => setIsConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog> */}
    </div>
  );
}