import React, { useState, useEffect } from "react";
import { LocationOn, AccessTime, CheckCircle, Pending, ThumbUp, Comment, HourglassEmpty, Error } from "@mui/icons-material";
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

  useEffect(() => {
    setTimeout(async () => {
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
        (filters.unresolved && issue.status === "unresolved")
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
      <div className="flex items-center justify-center min-h-[60vh] w-full bg-gray-50 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading your Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-blue">Logged Issues</h1>
      
      <div className="mb-4">
        <SearchIssue onSearch={handleSearch} onFilterChange={handleFilterChange} />
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No issues match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white shadow-sm md:shadow-md rounded-lg p-3 md:p-4 border border-gray-100 md:border-gray-200 cursor-pointer transition hover:shadow-md"
              onClick={() => handleIssueClick(issue)}
            >
              <h2 className="text-lg md:text-xl font-bold text-gray-700 line-clamp-1">{issue.title}</h2>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base line-clamp-2">
                {issue.description}
              </p>

              <div className="mt-2 md:mt-3">
                <span className="inline-block px-2 py-1 text-xs md:text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
                  {issue.category}
                </span>
              </div>

              <div className="mt-2 md:mt-3 flex items-center text-xs md:text-sm text-gray-500">
                <LocationOn className="text-gray-400 mr-1" style={{ fontSize: '1rem' }} />
                <span className="line-clamp-1">{issue.address}</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center text-xs md:text-sm text-gray-500">
                  <AccessTime className="text-gray-400 mr-1" style={{ fontSize: '1rem' }} />
                  {new Date(issue.reportedDate).toLocaleDateString()}
                </div>

                <div className={`text-xs md:text-sm font-semibold flex items-center ${
                  issue.status === "resolved" ? "text-green-600" :
                  issue.status === "progress" ? "text-yellow-600" :
                  issue.status === "unresolved" ? "text-red-600" : "text-blue-600"
                }`}>
                  {issue.status === "resolved" && <CheckCircle className="mr-1" style={{ fontSize: '1rem' }} />}
                  {issue.status === "progress" && <Pending className="mr-1" style={{ fontSize: '1rem' }} />}
                  {issue.status === "unresolved" && <Error className="mr-1" style={{ fontSize: '1rem' }} />}
                  {issue.status === "pending" && <HourglassEmpty className="mr-1" style={{ fontSize: '1rem' }} />}
                  <span className="capitalize">{issue.status}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end space-x-3">
                <span className="flex items-center text-xs md:text-sm text-gray-500">
                  <ThumbUp className="mr-1" style={{ fontSize: '1rem' }} />
                  {issue.likeCount}
                </span>
                <span className="flex items-center text-xs md:text-sm text-gray-500">
                  <Comment className="mr-1" style={{ fontSize: '1rem' }} />
                  {issue.comments.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="md"
        fullScreen={window.innerWidth < 768} // Full screen on mobile
      >
        <DialogTitle className="text-lg md:text-xl">{selectedIssue?.title}</DialogTitle>
        <DialogContent className="divide-y divide-gray-100">
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedIssue?.photoUrls?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${selectedIssue?.title} - ${index + 1}`}
                  className="w-full h-40 md:h-48 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex items-center text-sm md:text-base">
              <AccessTime className="text-gray-400 mr-2" style={{ fontSize: '1.2rem' }} />
              <span className="text-gray-600">
                Reported on: {new Date(selectedIssue?.reportedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-start text-sm md:text-base">
              <LocationOn className="text-gray-400 mr-2 mt-1" style={{ fontSize: '1.2rem' }} />
              <span className="text-gray-600">{selectedIssue?.address}</span>
            </div>
          </div>

          <div className="py-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm md:text-base font-medium text-gray-700">
                Category: <span className="font-normal">{selectedIssue?.category}</span>
              </span>
              <span className={`text-sm md:text-base font-medium flex items-center ${
                selectedIssue?.status === "resolved" ? "text-green-600" :
                selectedIssue?.status === "progress" ? "text-yellow-600" :
                selectedIssue?.status === "unresolved" ? "text-red-600" : "text-blue-600"
              }`}>
                {selectedIssue?.status === "resolved" && <CheckCircle className="mr-1" />}
                {selectedIssue?.status === "progress" && <Pending className="mr-1" />}
                {selectedIssue?.status === "pending" && <HourglassEmpty className="mr-1" />}
                {selectedIssue?.status === "unresolved" && <Error className="mr-1" />}
                <span className="capitalize">{selectedIssue?.status}</span>
              </span>
            </div>
          </div>

          <div className="py-3">
            <h3 className="text-sm md:text-base font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 text-sm md:text-base">{selectedIssue?.description}</p>
          </div>

          {selectedIssue?.comments?.length > 0 && (
            <div className="py-3">
              <h3 className="text-sm md:text-base font-medium text-gray-700 mb-2">Comments</h3>
              <ul className="space-y-3">
                {selectedIssue?.comments.map((comment, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {comment?.user?.avatar ? (
                          <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {comment?.user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{comment?.user?.name || "Anonymous"}</p>
                      <p className="text-gray-600 text-sm">{comment?.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;