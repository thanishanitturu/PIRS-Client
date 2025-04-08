import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { delNotification, markNotifyAsRead } from "../../firebase/notifications/notifyFuncs";
import {Loader,Trash2} from "lucide-react"

export default function Notifyall() {
  const { notifications, setNotifications,setSnackbar } = useContext(AppContext);
  const[loading,setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const markAsRead = async (id) => {
    const userId = localStorage.getItem("uid");
    const response = await markNotifyAsRead(userId, id);
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, isRead: true} : notif
    ));
    setSnackbar({open:true,message:"Notification Read Succesfully...",severity:"success"});
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem("uid");
      const response = await delNotification(userId, id);
      
      // Update local state by removing the deleted notification
      setNotifications(notifications.filter(notif => notif.id !== id));
      
      // Show success notification
      setSnackbar({
        open: true,
        message: "Notification deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      
      // Show error notification
      setSnackbar({
        open: true,
        message: "Failed to delete notification",
        severity: "error"
      });
    }
  };
  
  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const readNotifications = notifications.filter((notif) => notif.isRead);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full bg-gray-50 rounded-lg p-6 min-h-[90vh]">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading Notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h1>
      
      {/* Unread Notifications Section */}
      {unreadNotifications.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white p-4 rounded-lg shadow-md border border-blue-200 relative"
              >
                <button 
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 pr-6">{notification.department}</h3>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notification.date} at {notification.time}</p>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 active:scale-95 transition transform duration-150"
                >
                  Mark as Read
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Read Notifications Section */}
      {readNotifications.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 opacity-80 relative"
              >
                <button 
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 pr-6">{notification.department}</h3>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                <div className="text-xs text-gray-500">
                  {notification?.timestamp && new Date(notification.timestamp).toLocaleString()}
                </div>
                <div className="mt-3 text-center text-green-600 text-sm font-medium">
                  ✓ Read
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


       {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No notifications available</p>
        </div>
      )}
    </div>
     
  
  );
}