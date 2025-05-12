import React, { useState, useContext, useEffect } from "react";
import { FaTrash, FaSearch, FaCheckCircle, FaSpinner, FaFilter, FaTimes } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { AppContext } from "../../../context/AppContext";
import { getAllUserReports } from "../../../firebase/citizen/reportFuncs";
import { deleteReport, deleteReportAdmin, verifyAllReports } from "../../../firebase/admin/manageReportFuncs";
import { sendNotificationToUser } from "../../../firebase/admin/manageUserFuncs";

export default function AdminIssues() {
  const { allReports, setSnackbar, setAllReports } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState("new");
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [circularLoading, setCircularLoading] = useState(false);
  const [newlyReported, setNewlyReported] = useState([]);
  const [verifiedIssues, setVerifiedIssues] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getReportsData = async () => {
      try {
        setCircularLoading(true);
        const res = await getAllUserReports();
        setAllReports(res || []);
        
        const newlyReported = res.filter((item) => item.isVerifiedByAdmin === false);
        const verified = res.filter((item) => item.isVerifiedByAdmin === true);
        
        setNewlyReported(newlyReported);
        setVerifiedIssues(verified);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setSnackbar({ message: "Failed to load issues", severity: "error", open: true });
      } finally {
        setCircularLoading(false);
      }
    };
    getReportsData();
  }, []);

  const filterIssues = (issuesToFilter) => {
    return issuesToFilter.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesDepartment = departmentFilter ? issue.department === departmentFilter : true;
      const matchesStatus = statusFilter ? issue.status === statusFilter : true;
      const matchesDate = (!dateFilter.start || new Date(issue.reportedDate) >= new Date(dateFilter.start)) &&
                         (!dateFilter.end || new Date(issue.reportedDate) <= new Date(dateFilter.end));

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  };

  const filteredNewIssues = filterIssues(newlyReported);
  const filteredVerifiedIssues = filterIssues(verifiedIssues);

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      if (!selectedIssue?.id) {
        throw new Error("No issue selected for deletion");
      }

      const res = await deleteReport(selectedIssue.id);

      const notification = {
        title:`${selectedIssue.title} has been deleted..`,
        message: `Your report(${selectedIssue.title}) is not all with any true ness. So , your report has been deleted from the community's report list.`,
        timestamp:new Date(),
        department:"Admin Message",
        isRead: false,
      }; 

      const res2 = await sendNotificationToUser(res.userId,notification);

      setNewlyReported(prev => prev.filter(issue => issue.id !== selectedIssue.id));
      setVerifiedIssues(prev => prev.filter(issue => issue.id !== selectedIssue.id));

      setSnackbar({ 
        message: "Issue deleted and user notified successfully", 
        severity: "success",
        open: true 
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackbar({
        message: error.message || "Failed to delete issue",
        severity: "error",
        open: true
      });
    } finally {
      setIsConfirmOpen(false);
      setLoading(false);
    }
  };

  const handleVerifyAll = async () => {
    setLoading(true);
    try {
      const res = await verifyAllReports();
      
      const updatedNewlyReported = newlyReported.map(issue => ({
        ...issue,
        isVerifiedByAdmin: true
      }));
      
      setVerifiedIssues(prev => [...prev, ...updatedNewlyReported]);
      setNewlyReported([]);
      
      setSnackbar({ 
        message: "All issues verified successfully", 
        severity: "success",
        open: true 
      });
    } catch (error) {
      console.error("Verify all failed:", error);
      setSnackbar({
        message: error.message || "Failed to verify issues",
        severity: "error",
        open: true
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
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

  const departmentColor = (dept) => {
    switch(dept) {
      case 'water_supply_department': return 'bg-blue-50 text-blue-600';
      case 'electricity_board': return 'bg-yellow-50 text-yellow-600';
      case 'municipal_department': return 'bg-green-50 text-green-600';
      case 'public_works_department': return 'bg-purple-50 text-purple-600';
      case 'traffic_control_department': return 'bg-red-50 text-red-600';
      case 'parks_department': return 'bg-teal-50 text-teal-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (circularLoading) {
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Departments</option>
                  <option value="water_supply_department">Water Supply</option>
                  <option value="electricity_board">Electricity</option>
                  <option value="municipal_department">Municipal</option>
                  <option value="public_works_department">Public Works</option>
                  <option value="traffic_control_department">Traffic</option>
                  <option value="parks_department">Parks</option>
                </select>
              </div>
              
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
                  setDepartmentFilter("");
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Departments</option>
              <option value="water_supply_department">Water Supply</option>
              <option value="electricity_board">Electricity</option>
              <option value="municipal_department">Municipal</option>
              <option value="public_works_department">Public Works</option>
              <option value="traffic_control_department">Traffic</option>
              <option value="parks_department">Parks</option>
            </select>
          </div>
          
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
              setDepartmentFilter("");
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
          <h2 className="text-2xl font-semibold text-gray-800">Issue Management</h2>
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
              onClick={() => setSelectedTab('new')}
            >
              New Reports ({newlyReported.length})
            </button>
            <button 
              className={`px-4 py-2 font-medium ${selectedTab === 'verified' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('verified')}
            >
              Verified ({verifiedIssues.length})
            </button>
          </div>
        </div>

        {/* Verify All Button */}
        {selectedTab === "new" && newlyReported.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleVerifyAll}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaCheckCircle /> Verify All New Reports
                </>
              )}
            </button>
          </div>
        )}

        {/* Issues Grid */}
        {(selectedTab === "new" && filteredNewIssues.length === 0) || 
         (selectedTab === "verified" && filteredVerifiedIssues.length === 0) ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              No {selectedTab === "new" ? "new" : "verified"} issues found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedTab === "new" ? filteredNewIssues : filteredVerifiedIssues).map(issue => (
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
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIssue(issue);
                        setIsConfirmOpen(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${departmentColor(issue.department)}`}>
                      {issue.department.replace(/_/g, ' ')}
                    </span>
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
                <span className={`px-3 py-1 rounded-full text-sm ${departmentColor(selectedIssue.department)}`}>
                  {selectedIssue.department.replace(/_/g, ' ')}
                </span>
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
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedIssue.description}</p>
              </div>
              
              {selectedIssue.photoUrls && selectedIssue.photoUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Attachments</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedIssue.photoUrls.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt="Issue" 
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <button 
            onClick={() => setIsConfirmOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
          
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this issue? This action cannot be undone.</p>
          
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}