import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tabs, Tab, Typography } from "@mui/material";

const issuesData = [
  { id: 1, title: "Water Leakage", description: "Severe leakage in Block A.", reportedBy: "John", department: "Maintenance", status: "Pending", date: "2025-03-12", isVerifiedByAdmin: true, images: ["https://via.placeholder.com/150"] },
  { id: 2, title: "Garbage Dump", description: "Trash piling up in street", reportedBy: "Alice", department: "Sanitation", status: "In Progress", date: "2025-03-11", isVerifiedByAdmin: true, images: ["https://via.placeholder.com/150"] },
  { id: 3, title: "Traffic Issue", description: "Unbearable traffic congestion", reportedBy: "Bob", department: "Traffic", status: "Pending", date: "2025-03-10", isVerifiedByAdmin: false, images: ["https://via.placeholder.com/150"] },
];

export default function DeptIssues() {
  const [tab, setTab] = useState(0);
  const [issues, setIssues] = useState(issuesData);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const openStatusModal = (issue, status) => {
    setSelectedIssue(issue);
    setUpdateStatus(status);
    setStatusModalOpen(true);
  };

  const openDetailsModal = (issue) => {
    setSelectedIssue(issue);
    setDetailsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    const updatedIssues = issues.map((issue) =>
      issue.id === selectedIssue.id ? { ...issue, status: updateStatus } : issue
    );
    setIssues(updatedIssues);
    setStatusModalOpen(false);
    setUpdateDescription("");
  };

  const filteredIssues = tab === 0 ? issues.filter((i) => i.isVerifiedByAdmin) : issues.filter((i) => !i.isVerifiedByAdmin);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Department Issues</h2>

      {/* Tabs for Verified & Not Verified Issues */}
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
        <Tab label="Verified Issues" />
        <Tab label="Not Verified Issues" />
      </Tabs>

      {/* Issues Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Reported By</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <React.Fragment key={issue.id}>
                <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => openDetailsModal(issue)}>
                  <td className="py-2 px-4">{issue.title}</td>
                  <td className="py-2 px-4">{issue.description}</td>
                  <td className="py-2 px-4">{issue.reportedBy}</td>
                  <td className="py-2 px-4">{issue.date}</td>
                  <td className="py-2 px-4">{issue.status}</td>
                </tr>
                {tab === 0 && (
                  <tr>
                    <td colSpan={5} className="py-2 px-4">
                      {issue.status === "Pending" && (
                        <Button onClick={() => openStatusModal(issue, "In Progress")} color="warning">Mark In Progress</Button>
                      )}
                      {issue.status === "In Progress" && (
                        <Button onClick={() => openStatusModal(issue, "Resolved")} color="success">Mark Resolved</Button>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
        <DialogTitle>Update Issue Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            label="Provide a description"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleStatusUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Issue Details Modal */}
      {/* <Dialog open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} 
      container={document.body}
      sx={{
    zIndex: 12000,
    '& .MuiPaper-root': {
      zIndex: 12000
    }
  }}> */}
        <Dialog
  open={detailsModalOpen}
  onClose={() => setDetailsModalOpen(false)}
  
  >
        <DialogTitle>Issue Details</DialogTitle>
        <DialogContent
          sx={{
      overflowY: 'auto',
      flexGrow: 1,
    }}
        >
          {selectedIssue && (
            <div>
              <Typography><strong>Title:</strong> {selectedIssue.title}</Typography>
              <Typography><strong>Description:</strong> {selectedIssue.description}</Typography>
              <Typography><strong>Reported By:</strong> {selectedIssue.reportedBy}</Typography>
              <Typography><strong>Department:</strong> {selectedIssue.department}</Typography>
              <Typography><strong>Status:</strong> {selectedIssue.status}</Typography>
              <Typography><strong>Date:</strong> {selectedIssue.date}</Typography>
              {selectedIssue.images.map((img, index) => (
                <img key={index} src={img} alt="Issue" className="mt-4 w-32 h-32 rounded" />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsModalOpen(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
      {/* Issue Details Modal */}
{/* Issue Details Modal */}


  <DialogTitle>Issue Details</DialogTitle>
  <DialogContent dividers>
    {selectedIssue && (
      <div className="space-y-4">
        <Typography><strong>Title:</strong> {selectedIssue.title}</Typography>
        <Typography><strong>Description:</strong> {selectedIssue.description}</Typography>
        <Typography><strong>Reported By:</strong> {selectedIssue.reportedBy}</Typography>
        <Typography><strong>Department:</strong> {selectedIssue.department}</Typography>
        <Typography><strong>Status:</strong> {selectedIssue.status}</Typography>
        <Typography><strong>Date:</strong> {selectedIssue.date}</Typography>
        <div className="flex flex-wrap gap-4 mt-4">
          {selectedIssue.images.map((img, index) => (
            <img key={index} src={img} alt="Issue" className="w-32 h-32 rounded object-cover" />
          )}
        </div>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDetailsModalOpen(false)} color="secondary">Close</Button>
  </DialogActions>
</Dialog>
    </div>
  );
}
