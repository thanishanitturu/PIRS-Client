import React, { useState, useContext, useEffect } from "react";
import { FaTrash, FaSearch, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { AppContext } from "../../../context/AppContext";
import { getAllUserReports } from "../../../firebase/citizen/reportFuncs";
import { deleteReport, verifyAllReports } from "../../../firebase/admin/manageReportFuncs";

export default function AdminIssues() {
  const { allReports, setSnackbar, setAllReports } = useContext(AppContext);
  const [issues, setIssues] = useState(allReports);
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

  useEffect(() => {
    const getReportsData = async () => {
      try {
        setCircularLoading(true);
        const res = await getAllUserReports();
        console.log(res);
        setAllReports(res || []); // Ensure it's never null
        setIssues(res || []); // Ensure it's never null
        
        // Filter newly reported and verified issues
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
      console.log("Delete result:", res);

      // Update local state
      setIssues(prevIssues => prevIssues.filter(issue => issue.id !== selectedIssue.id));
      setNewlyReported(prev => prev.filter(issue => issue.id !== selectedIssue.id));
      setVerifiedIssues(prev => prev.filter(issue => issue.id !== selectedIssue.id));

      // Show success message
      setSnackbar({ 
        message: "Issue deleted successfully", 
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
      console.log(res);
      
      // Update local state
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

  if (circularLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin - Manage Issues</h2>
      <div className="flex space-x-4 mb-6">
        <button 
          className={`p-2 rounded ${selectedTab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} 
          onClick={() => setSelectedTab('new')}
        >
          Newly Reported Issues
        </button>
        <button 
          className={`p-2 rounded ${selectedTab === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} 
          onClick={() => setSelectedTab('verified')}
        >
          Verified Issues
        </button>
      </div>

      {/* Verify All Button (Only for Newly Reported Issues) */}
      {selectedTab === "new" && newlyReported.length > 0 && (
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Filter by Department</option>
          <option value="water_supply_department">Water Supply Department</option>
          <option value="electricity_board">Electricity Board</option>
          <option value="municipal_department">Municipal Department/Corporation</option>
          <option value="public_works_department">Public Works Department</option>
          <option value="traffic_control_department">Traffic Control Department</option>
          <option value="parks_department">Parks and Recreation Department</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Un Resolved</option>
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

      {/* Show message when no issues exist */}
      {(selectedTab === "new" && newlyReported.length === 0) || 
       (selectedTab === "verified" && verifiedIssues.length === 0) ? (
        <div className="text-center text-gray-500 py-6">
          No {selectedTab === "new" ? "newly reported" : "verified"} issues found.
        </div>
      ) : (
        <table className="min-w-full border rounded-lg mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-center">Title</th>
              <th className="p-2 text-center">Description</th>
              <th className="p-2 text-center">Reported By</th>
              <th className="p-2 text-center">Department</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Date</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedTab === "new" 
              ? filteredNewIssues.map(issue => (
                  <tr 
                    key={issue.id} 
                    className="border-b hover:bg-gray-100 cursor-pointer" 
                    onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }}
                  >
                    <td className="p-2 text-center">{issue.title}</td>
                    <td className="p-2 text-center">{issue.description}</td>
                    <td className="p-2 text-center">{issue.reportedBy?.name || "Unknown"}</td>
                    <td className="p-2 text-center">{issue.department}</td>
                    <td className="p-2 text-center">{issue.status}</td>
                    <td className="p-2 text-center">{formatDate(issue.reportedDate)}</td>
                    <td className="p-2 text-center">
                      <FaTrash 
                        className="text-red-500 cursor-pointer" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedIssue(issue); 
                          setIsConfirmOpen(true); 
                        }} 
                      />
                    </td>
                  </tr>
                ))
              : filteredVerifiedIssues.map(issue => (
                  <tr 
                    key={issue.id} 
                    className="border-b hover:bg-gray-100 cursor-pointer" 
                    onClick={() => { setSelectedIssue(issue); setIsModalOpen(true); }}
                  >
                    <td className="p-2 text-center">{issue.title}</td>
                    <td className="p-2 text-center">{issue.description}</td>
                    <td className="p-2 text-center">{issue.reportedBy?.name || "Unknown"}</td>
                    <td className="p-2 text-center">{issue.department}</td>
                    <td className="p-2 text-center">{issue.status}</td>
                    <td className="p-2 text-center">{formatDate(issue.reportedDate)}</td>
                    <td className="p-2 text-center">
                      <FaTrash 
                        className="text-red-500 cursor-pointer" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedIssue(issue); 
                          setIsConfirmOpen(true); 
                        }} 
                      />
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      )}

      {/* Issue Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedIssue.title}</h2>
            <div className="space-y-2">
              <p><strong>Description:</strong> {selectedIssue.description}</p>
              <p><strong>Reported By:</strong> {selectedIssue.reportedBy?.name || "Unknown"}</p>
              <p><strong>Department:</strong> {selectedIssue.department}</p>
              <p><strong>Status:</strong> {selectedIssue.status}</p>
              <p><strong>Date:</strong> {formatDate(selectedIssue.reportedDate)}</p>
              {selectedIssue.photoUrls && selectedIssue.photoUrls.length > 0 && (
                <div>
                  <strong>Photos:</strong>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selectedIssue.photoUrls.map((img, index) => (
                      <img key={index} src={img} alt="Issue" className="w-24 h-24 rounded-lg border object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded" 
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
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
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin text-xl" /> : "Delete"}
            </button>
            <button 
              className="w-full bg-gray-500 text-white p-2 rounded" 
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}