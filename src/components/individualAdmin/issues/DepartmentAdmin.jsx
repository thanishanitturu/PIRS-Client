import React, { useState, useContext, useEffect } from "react";
import { FaTrash, FaSearch, FaCheckCircle, FaSpinner, FaEdit, FaFilter, FaTimes } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { AppContext } from "../../../context/AppContext";
import { getReportsByDepartment, updateReportById } from "../../../firebase/dept/issueFuncs";
import { sendNotificationToUser } from "../../../firebase/admin/manageUserFuncs";
import { formatDepartmentName } from "../../../utilities/utilities";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [resolutionDescription, setResolutionDescription] = useState("");
  const { setSnackbar } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
  
      await updateReportById(issueId, updatedData);
      
      setIssues(updatedIssues);
      setSnackbar({ 
        message: "Issue status updated successfully", 
        severity: "success", 
        open: true 
      });
      
      sendNotificationToUser(issueId, newStatus, resolutionDescription);
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

  const sendNotificationToUser = async (issueId, newStatus, resolutionDescription) => {
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

  const statusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'unresolved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Filters - Mobile */}
      {showFilters && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}></div>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="End Date"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setStatusFilter("");
                  setDateFilter({ start: "", end: "" });
                }}
                className="w-full py-2 bg-gray-200 rounded text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Filters - Desktop */}
      <div className="hidden md:block w-64 bg-white shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="End Date"
              />
            </div>
          </div>
          
          <button 
            onClick={() => {
              setStatusFilter("");
              setDateFilter({ start: "", end: "" });
            }}
            className="w-full py-2 bg-gray-200 rounded text-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{formatDepartmentName(localStorage.getItem("deptname"))} - Issue Management</h2>
          <button 
            onClick={() => setShowFilters(true)}
            className="md:hidden p-2 bg-white border rounded shadow flex items-center gap-2"
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          <div className="flex border-b">
            <button 
              className={`px-4 py-2 font-medium ${selectedTab === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('new')}
            >
              New Reports ({unVerifiedIssues.length})
            </button>
            <button 
              className={`px-4 py-2 font-medium ${selectedTab === 'verified' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('verified')}
            >
              Verified ({issues.length - unVerifiedIssues.length})
            </button>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              No {selectedTab === "new" ? "new" : "verified"} issues found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map(issue => (
              <div 
                key={issue.id} 
                className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }}
              >
                {issue.photoUrls && issue.photoUrls.length > 0 && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={issue.photoUrls[0]} 
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate">{issue.title}</h3>
                    {selectedTab === "verified" && issue.status !== "resolved" && (
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                          setEditedStatus(issue.status);
                          setResolutionDescription(issue.resolutionDescription || "");
                          setIsEditModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{issue.reportedBy?.name || "Anonymous"}</span>
                    <span>{formatDate(issue.reportedDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        {selectedIssue && (
          <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedIssue.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor(selectedIssue.status)}`}>
                  {selectedIssue.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Reported By</p>
                  <p>{selectedIssue.reportedBy?.name || "Anonymous"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Reported</p>
                  <p>{formatDate(selectedIssue.reportedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{selectedIssue.address || "Not provided"}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedIssue.description}</p>
              </div>
              
              {selectedIssue.resolutionDescription && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Resolution Details</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedIssue.resolutionDescription}</p>
                </div>
              )}
              
              {(selectedIssue.photoUrls?.length > 0 || selectedIssue.images?.length > 0) && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Attachments</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...(selectedIssue.photoUrls || []), ...(selectedIssue.images || [])].map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt="Issue" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-90"
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {selectedIssue.isVerifiedByAdmin && selectedIssue.status !== "resolved" && (
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    onClick={() => {
                      setEditedStatus(selectedIssue.status);
                      setResolutionDescription(selectedIssue.resolutionDescription || "");
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit /> Edit Status
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <button 
            onClick={() => setIsEditModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
          
          <h2 className="text-xl font-bold mb-4">Update Issue Status</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Details</label>
            <textarea
              value={resolutionDescription}
              onChange={(e) => setResolutionDescription(e.target.value)}
              placeholder="Describe the resolution or progress..."
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => setIsEditModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              onClick={() => handleEditStatus(selectedIssue?.id, editedStatus, resolutionDescription)}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Update"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}