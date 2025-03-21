import React, { useState, useEffect } from "react";
import { LocationOn, AccessTime, CheckCircle, Pending,ThumbUp,Comment} from "@mui/icons-material";
import SearchIssue from "./SearchIssue";

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

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

  const initialIssues = [
    {
      id: 1,
      title: "Open Manhole on Main Street",
      date: "2025-01-25",
      location: "Main Street, City Center",
      category: "Roads",
      status: "Pending",
      image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
      description: "An open manhole poses a serious hazard to pedestrians and vehicles.",
      comments: [
        { user: "John Doe", text: "This needs urgent attention!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
        { user: "Jane Smith", text: "Reported to the municipality.", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
      ],
      likes: 10,
      latitude: 51.505,
      longitude: -0.09,
    },
    {
      id: 2,
      title: "Streetlight Not Working",
      date: "2025-01-20",
      location: "5th Avenue, Downtown",
      category: "Electricity",
      status: "Resolved",
      image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
      description: "The streetlight on 5th Avenue was broken for weeks.",
      comments: [
        { user: "Alice Johnson", text: "It’s finally fixed!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
      ],
      likes: 5,
      latitude: 51.515,
      longitude: -0.1,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIssues(initialIssues);
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

    if (filters.pending || filters.resolved || filters.inProgress) {
      updatedIssues = updatedIssues.filter((issue) =>
        (filters.pending && issue.status === "Pending") ||
        (filters.resolved && issue.status === "Resolved") ||
        (filters.inProgress && issue.status === "In Progress")
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading issues...</div>
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
          <p className="text-gray-600 mt-2">{issue.description}</p>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              {issue.category}
            </span>
          </div>
          <p className="mt-4 text-gray-500 flex items-center">
            <LocationOn className="text-gray-400 mr-2" />
            {issue.location}
          </p>
          <p className="mt-2 text-gray-500 flex items-center">
            <AccessTime className="text-gray-400 mr-2" />
            Reported on: {new Date(issue.date).toLocaleDateString()}
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
              {issue.status === "Resolved" && <CheckCircle className="inline-block mr-2" />}
              {issue.status === "In Progress" && <Pending className="inline-block mr-2" />}
              {issue.status}
            </p>
            
            <div className="flex items-center">
              <p className="mr-4 flex items-center text-gray-500">
                <ThumbUp className="text-gray-400 mr-2" />
                {issue.likes} Likes
              </p>
              <p className="flex items-center text-gray-500">
                <Comment className="text-gray-400 mr-2" />
                {issue.comments.length} Comments
              </p>
            </div>
          </div>
        </div>
        
        ))}
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
  <DialogTitle>{selectedIssue?.title}</DialogTitle>
  <DialogContent>
    <div className="mb-4">
      <img
        src={selectedIssue?.image}
        alt={selectedIssue?.title}
        className="w-full h-64 object-cover rounded-md"
      />
    </div>

    <div className="flex items-center space-x-4 mt-2">
      <div className="flex items-center">
        <AccessTime className="text-gray-400 mr-2" />
        <p className="text-gray-600">
          Reported on: {new Date(selectedIssue?.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center">
        <LocationOn className="text-gray-400 mr-2" />
        <p className="text-gray-600">{selectedIssue?.location}</p>
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
        {selectedIssue?.status === "Resolved" && (
          <CheckCircle className="inline-block mr-2" />
        )}
        {selectedIssue?.status === "In Progress" && (
          <Pending className="inline-block mr-2" />
        )}
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
              src={comment.avatar}
              alt={comment.user}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-semibold">{comment.user}</p>
              <p className="text-gray-600">{comment.text}</p>
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
