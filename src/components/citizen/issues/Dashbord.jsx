import React, { useState, useEffect } from "react";
import { LocationOn, AccessTime, CheckCircle, Pending,ThumbUp,Comment,HourglassEmpty,Error} from "@mui/icons-material";
import SearchIssue from "./SearchIssue";
import { Loader } from "lucide-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { getUserReports } from "../../../firebase/citizen/reportFuncs";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pending: false,
    resolved: false,
    inProgress: false,
  });
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const[initialIssues,setInitialIssues] = useState([]);
  console.log(localStorage.getItem('uid'));
  
  useEffect(() => {
    setTimeout(async() => {
      const response = await getUserReports(localStorage.getItem("uid"));
      setIssues(response);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let updatedIssues = issues;

    if (searchTerm) {
      updatedIssues = updatedIssues.filter((issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.pending || filters.resolved || filters.progress || filters.unresolved) {
      updatedIssues = updatedIssues.filter((issue) =>
        (filters.pending && issue.status === "pending") ||
        (filters.resolved && issue.status === "resolved") ||
        (filters.progress && issue.status === "progress") || 
        (filters.unresolved && issue.status==="unresolved")
      );
    }

    setFilteredIssues(updatedIssues);
  }, [searchTerm, filters, issues]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIssue(null);
  };

  if (loading) {
    return (
      <div 
      className="flex items-center justify-center min-h-[60vh] w-full bg-gray-50 rounded-lg p-6"
      style={{ minHeight: '70vh' }} // Fallback for older browsers
    >
      <div className="flex flex-col items-center">
        <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-lg text-gray-700">Loading your Reports...</p>
      </div>
    </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Logged Issues</h1>
      <SearchIssue onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          filteredIssues.length === 0 && <h1>No Issues on your Searching....</h1>
        }
        {filteredIssues.map((issue) => (
          <div
          key={issue.id}
          className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
          onClick={() => handleIssueClick(issue)}
        >
          <h2 className="text-xl font-bold text-gray-700">{issue.title}</h2>
          <p className="text-gray-600 mt-2">
  {issue.description.length > 100 ? `${issue.description.slice(0, 100)}...` : issue.description}
</p>

          <div className="mt-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              {issue.category}
            </span>
          </div>
          <p className="mt-4 text-gray-500 flex items-center">
  <LocationOn className="text-gray-400 mr-2" />
  {issue.address.length > 50 ? `${issue.address.slice(0, 40)}...` : issue.address}
</p>
          <p className="mt-2 text-gray-500 flex items-center">
            <AccessTime className="text-gray-400 mr-2" />
            Reported on: {new Date(issue.reportedDate).toLocaleDateString()}
          </p>
        
          <div className="mt-4 flex items-center justify-between">
            <p
              className={`text-sm font-semibold flex items-center ${
                issue.status === "Resolved"
                  ? "text-green-600"
                  : issue.status === "In Progress"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
             {issue.status === "resolved" && <CheckCircle className="inline-block text-green-600 mr-2" />}
{issue.status === "progress" && <Pending className="inline-block text-yellow-600 mr-2" />}
{issue.status === "unresolved" && <Error className="inline-block text-red-600 mr-2" />}
{issue.status === "pending" && <HourglassEmpty className="inline-block text-blue-600 mr-2" />}

              {issue.status}
            </p>
            
            <div className="flex items-center">
              <p className="mr-4 flex items-center text-gray-500">
               {issue.likeCount} &nbsp; <ThumbUp className="text-gray-400 mr-2" />
                {/* {issue.likeCount} Likes */}
              </p>
              <p className="flex items-center text-gray-500">
               {issue.comments.length} &nbsp; <Comment className="text-gray-400 mr-2" />
                {/* {issue.comments.length} Comments */}
              </p>
            </div>
          </div>
        </div>
        
        ))}
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
  <DialogTitle>{selectedIssue?.title}</DialogTitle>
  <DialogContent>
  <div className="mb-4 grid grid-cols-2 md:grid-cols-2 gap-4">
  {selectedIssue?.photoUrls?.map((url, index) => (
    <img
      key={index}
      src={url}
      alt={`${selectedIssue?.title} - ${index + 1}`}
      className="w-full h-48 object-cover rounded-md"
    />
  ))}
</div>


    <div className="flex items-center space-x-4 mt-2">
      <div className="flex items-center">
        <AccessTime className="text-gray-400 mr-2" />
        <p className="text-gray-600">
          Reported on: {new Date(selectedIssue?.reportedDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center">
        <LocationOn className="text-gray-400 mr-2" />
        <p className="text-gray-600">{selectedIssue?.address}</p>
      </div>
    </div>

    <div className="flex items-center space-x-4 mt-4">
      <div className="flex items-center">
        <span className="text-gray-600 font-semibold">Category:</span>
        <span className="ml-2">{selectedIssue?.category}</span>
      </div>
      <div
        className={`flex items-center text-sm font-semibold ${
          selectedIssue?.status === "Resolved"
            ? "text-green-600"
            : selectedIssue?.status === "In Progress"
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        {selectedIssue?.status === "resolved" && (
          <CheckCircle className="inline-block mr-2" />
        )}
        {selectedIssue?.status === "progress" && (
          <Pending className="inline-block mr-2" />
        )}
        {
          selectedIssue?.status ==="pending" && (<HourglassEmpty className="inline-block mr-2"  />)
        }
        {
          selectedIssue?.status==="unresolved" && (<Error className="inline-block mr-2"  />)
        }
        {selectedIssue?.status}
      </div>
    </div>

    <div className="mt-4">
      <strong>Description:</strong>
      <p className="text-gray-600">{selectedIssue?.description}</p>
    </div>

    <div className="mt-4">
      <strong>Comments:</strong>
      <ul className="mt-2">
        {selectedIssue?.comments.map((comment, index) => (
          <li key={index} className="mt-2 flex items-center">
            <img
              src={comment?.user?.avatar}
              alt={comment?.user?.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-semibold">{comment?.user?.name}</p>
              <p className="text-gray-600">{comment?.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default Dashboard;
