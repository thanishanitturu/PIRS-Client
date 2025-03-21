import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ThumbsUp, MessageSquare, MapPin, Calendar, Building, CheckCircle } from "lucide-react";

const IssueGrid = ({issues}) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [likes, setLikes] = useState(
    issues.reduce((acc, issue) => ({ ...acc, [issue.id]: issue.likes }), {})
  );
  const [userLiked, setUserLiked] = useState({});
  const [newComment, setNewComment] = useState("");

  const handleLike = (id) => {
    setLikes((prev) => {
      const isLiked = userLiked[id];
      return {
        ...prev,
        [id]: isLiked ? prev[id] - 1 : prev[id] + 1,
      };
    });
    setUserLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddComment = (id) => {
    if (newComment.trim()) {
      const updatedIssues = issues.map((issue) => {
        if (issue.id === id) {
          return {
            ...issue,
            comments: [
              ...issue.comments,
              { user: "Current User", text: newComment, avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
            ],
          };
        }
        return issue;
      });
      issues = updatedIssues;
      setNewComment("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 text-gray-800">
      {
      issues.length==0?<h1>No issues found...</h1>:
      issues.map((issue) => (
        <div key={issue.id} className="bg-white shadow-md rounded-lg overflow-hidden p-4">
          <img src={issue.image} alt={issue.title} className="w-full h-40 object-cover rounded-md" />
          <div className="mt-4">
            <h3 className="text-lg font-bold text-blue-600">{issue.title}</h3>
            <p className="text-sm text-gray-500">{issue.date} • {issue.location}</p>
            <p className="text-sm mt-1"><strong>Category:</strong> {issue.category}</p>
            <p className="text-sm"><strong>Status:</strong> {issue.status}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button className="flex items-center space-x-1 text-blue-600" onClick={() => handleLike(issue.id)}>
              <ThumbsUp size={18} /> <span>{likes[issue.id] || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600" onClick={() => setSelectedIssue(issue)}>
              <MessageSquare size={18} /> <span>Comment</span>
            </button>
          </div>
        </div>
      ))}

      {selectedIssue && (
        <Dialog open={true} onClose={() => setSelectedIssue(null)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-600">{selectedIssue.title}</h2>
            <p className="text-sm text-gray-500">{selectedIssue.date} • {selectedIssue.location}</p>
            <img src={selectedIssue.image} alt={selectedIssue.title} className="w-full h-40 object-cover rounded-md mt-4" />
            <p className="mt-2"><strong>Category:</strong> {selectedIssue.category}</p>
            <p><strong>Status:</strong> {selectedIssue.status}</p>
            <p className="mt-2">{selectedIssue.description}</p>
      
            <h3 className="mt-4 text-lg font-semibold">Comments</h3>
            <div className="mt-2 space-y-2">
              {selectedIssue.comments.map((comment, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
                  <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{comment.user}</p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Add a comment..."
              ></textarea>
              <button
                onClick={() => handleAddComment(selectedIssue.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Comment
              </button>
            </div>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setSelectedIssue(null)}>
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default IssueGrid;
