import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { ThumbsUp, MessageSquare, MapPin, Calendar,Loader } from "lucide-react";
import { addCommentToReport, getAllUserReports } from "../../../firebase/citizen/reportFuncs";
import { AppContext } from "../../../context/AppContext";
import { updateLikeStatus } from "../../../firebase/citizen/reportFuncs";
import { getUserData } from "../../../firebase/citizen/authFuncs";

const IssueGrid = ({ issues,setIssues,setFilteredIssues }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { allReports, setAllReports, setSnackbar } = useContext(AppContext);
  const [newComment, setNewComment] = useState("");
  const [userLiked, setUserLiked] = useState({});


  useEffect(() => {
    const userId = localStorage.getItem('uid');
    const initialLikedState = issues.reduce((acc, issue) => ({
      ...acc,
      [issue.id]: issue.likedBy?.includes(userId) || false
    }), {});
    setUserLiked(initialLikedState);
  }, [issues]);


  const handleLike = async (reportId) => {
    const userId = localStorage.getItem('uid');
    const currentlyLiked = userLiked[reportId];

    // Optimistic UI update
    setUserLiked(prev => ({ ...prev, [reportId]: !currentlyLiked }));
    setIssues(prev => prev.map(issue => 
      issue.id === reportId ? {
        ...issue,
        likeCount: currentlyLiked ? issue.likeCount - 1 : issue.likeCount + 1,
        likedBy: currentlyLiked
          ? issue.likedBy?.filter(uid => uid !== userId)
          : [...(issue.likedBy || []), userId]
      } : issue
    ));

    try {
      // Update in Firebase
      const result = await updateLikeStatus(reportId, !currentlyLiked);
      
      if (!result.success) {
        // Revert if failed
        revertLikeUpdate(reportId, currentlyLiked);
      }

      // Refresh data
      const freshData = await getAllUserReports();
      setAllReports(freshData);
      setFilteredIssues(freshData);
    } catch (error) {
      console.error("Like operation failed:", error);
      revertLikeUpdate(reportId, currentlyLiked);
    }
  };


  const revertLikeUpdate = async(reportId, wasLiked) => {
    const userId = localStorage.getItem('uid');
    setUserLiked(prev => ({ ...prev, [reportId]: wasLiked }));
    setIssues(prev => prev.map(issue => 
      issue.id === reportId ? {
        ...issue,
        likeCount: wasLiked ? issue.likeCount + 1 : issue.likeCount - 1,
        likedBy: wasLiked
          ? [...(issue.likedBy || []), userId]
          : issue.likedBy?.filter(uid => uid !== userId)
      } : issue
    ));

    const freshData = await getAllUserReports();
    setAllReports(freshData);
    setFilteredIssues(freshData);
  };


  const handleAddComment = async (issueId) => {
    if (!newComment.trim()) return;
  
    let newCommentObj; // Declare here so it's available in catch block
  
    try {
      const userId = localStorage.getItem('uid');
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      // Get fresh user data to ensure we have latest details
      const userData = await getUserData(userId);
      if (!userData) {
        throw new Error("Failed to fetch user data");
      }
  
      // Create the comment object
      newCommentObj = {
        user: {
          uid: userId,
          name: userData.name || "Anonymous",
          avatar: userData.photoURL || "https://via.placeholder.com/40"
        },
        text: newComment,
        timestamp: new Date().toISOString()
      };
  
      // Optimistic UI update
      setSelectedIssue(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newCommentObj],
        commentCount: (prev.commentCount || 0) + 1
      }));
  
      const updatedReports = allReports.map(report => 
        report.id === issueId ? {
          ...report,
          comments: [...(report.comments || []), newCommentObj],
          commentCount: (report.commentCount || 0) + 1
        } : report
      );
  
      // Update all states
      setNewComment("");
      setAllReports(updatedReports);
      setIssues(updatedReports);
      setFilteredIssues(updatedReports);
  
      // Save complete comment object to backend
      await addCommentToReport(issueId, newCommentObj); // Changed this line
  
      // Refresh data
      const freshData = await getAllUserReports();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Comment Added Successfully..."
      });
      
      // Update with fresh data
      setAllReports(freshData);
      setIssues(freshData);
      setFilteredIssues(freshData);
      setSelectedIssue(freshData.find(issue => issue.id === issueId));
  
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message || "Failed to add comment"
      });
      
      // Revert optimistic update
      if (newCommentObj) {
        setSelectedIssue(prev => ({
          ...prev,
          comments: prev.comments?.filter(c => c.timestamp !== newCommentObj.timestamp),
          commentCount: (prev.commentCount || 1) - 1
        }));
      }
    }
  };


  // if () {
  //   return (
  //     <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-lg p-6">
  //       <div className="flex flex-col items-center">
  //         <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
  //         <p className="text-lg text-gray-700">Loading Reports...</p>
  //       </div>
  //     </div>
  //   );
  // }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 text-gray-800">
      {issues.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <h1 className="text-xl text-gray-500">No issues found...</h1>
        </div>
      ) : (
        issues.map((issue) => (
          <div key={issue.id} className="bg-white shadow-md rounded-lg overflow-hidden p-4 hover:shadow-lg transition-shadow">
          {issue.photoUrls?.length > 0 && (
            <img 
              src={issue.photoUrls[0]} 
              alt={issue.title} 
              className="w-full h-40 object-cover rounded-md"
            />
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-bold text-blue-600">{issue.title}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{new Date(issue.reportedDate).toLocaleDateString()}</span>
              
              {issue.address && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin size={14} className="mr-1" />
                  <span>{issue.address.length > 30 ? `${issue.address.substring(0, 30)}...` : issue.address}</span>
                </>
              )}
            </div>
        
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {issue.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {issue.status}
              </span>
            </div>
          </div>
        
          {/* Footer with Like and Comment buttons */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
  <button 
    className={`flex items-center space-x-1 relative ${
      userLiked[issue.id] ? 'text-blue-600' : 'text-gray-600'
    }`}
    onClick={() => handleLike(issue.id)}
  >
    {/* Animated ThumbsUp icon */}
    <div className="relative">
      <ThumbsUp 
        size={18} 
        fill={userLiked[issue.id] ? "currentColor" : "none"}
        className={`transition-all duration-300 ${
          userLiked[issue.id] ? 'scale-125' : 'scale-100'
        }`}
      />
      {/* Optional pulse effect */}
      {userLiked[issue.id] && (
        <div className="absolute inset-0 bg-blue-100 rounded-full opacity-0 animate-ping"></div>
      )}
    </div>
    <span>{issue.likeCount || 0}</span>
  </button>
  
  <button 
    className="flex items-center space-x-1 text-gray-600"
    onClick={() => setSelectedIssue(issue)}
  >
    <MessageSquare size={18} />
    <span>{issue.commentCount || 0}</span>
  </button>
</div>
        </div>
        
        ))
      )}

      {selectedIssue && (
        <Dialog open={true} onClose={() => setSelectedIssue(null)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-600">{selectedIssue.title}</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{new Date(selectedIssue.reportedDate).toLocaleDateString()}</span>
              {selectedIssue.address && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin size={14} className="mr-1" />
                  <span>{selectedIssue.address}</span>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {selectedIssue.photoUrls?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${selectedIssue.title} - ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <p><strong>Category:</strong> {selectedIssue.category}</p>
              <p><strong>Department:</strong> {selectedIssue.department || 'General'}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  selectedIssue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  selectedIssue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedIssue.status}
                </span>
              </p>
              <p className="mt-2 text-gray-700">{selectedIssue.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Comments ({selectedIssue.commentCount || 0})</h3>
                <div className="flex items-center space-x-2">
                  <ThumbsUp size={16} className={userLiked[selectedIssue.id] ? "text-blue-600" : "text-gray-400"} />
                  <span>{selectedIssue.likeCount || 0}</span>
                </div>
              </div>
              
              <div className="mt-3 space-y-3">
                {selectedIssue.comments?.length > 0 ? (
                  selectedIssue.comments.map((comment, idx) => (
                    <div key={idx} className="flex space-x-3">
                      <img src={comment?.user?.avatar} alt={comment.user} className="w-8 h-8 rounded-full mt-1" />
                      <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{comment?.user?.name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm mt-1 text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-2">No comments yet</p>
                )}
              </div>

              <div className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a comment..."
                  rows="3"
                />
                <button
                  onClick={() => handleAddComment(selectedIssue.id)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>

            <button 
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setSelectedIssue(null)}
            >
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
  
};

export default IssueGrid;