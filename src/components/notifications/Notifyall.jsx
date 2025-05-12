import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { delNotification, markNotifyAsRead } from "../../firebase/notifications/notifyFuncs";
import { Loader, Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function Notifyall() {
  const { notifications, setNotifications, setSnackbar } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState({
    unread: true,
    read: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const markAsRead = async (id) => {
    const userId = localStorage.getItem("uid");
    await markNotifyAsRead(userId, id);
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, isRead: true} : notif
    ));
    setSnackbar({open: true, message: "Notification marked as read", severity: "success"});
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem("uid");
      await delNotification(userId, id);
      setNotifications(notifications.filter(notif => notif.id !== id));
      setSnackbar({
        open: true,
        message: "Notification deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete notification",
        severity: "error"
      });
    }
  };
  
  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Mail className="text-blue-600" />
        Notifications
      </h1>
      
      {/* Unread Notifications Section */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer"
          onClick={() => toggleSection('unread')}
        >
          <div className="flex items-center gap-2">
            <Mail className="text-blue-600" />
            <h2 className="font-medium text-gray-800">
              Unread ({unreadNotifications.length})
            </h2>
          </div>
          {expandedSection.unread ? <ChevronUp /> : <ChevronDown />}
        </div>

        {expandedSection.unread && (
          <div className="mt-3 space-y-3">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 relative"
                >
                  <button 
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="pr-6">
                    <h3 className="font-medium text-gray-900">{notification.department}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(notification.timestamp.toDate()).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-3 text-sm w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No unread notifications
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Read Notifications Section */}
      <div>
        <div 
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => toggleSection('read')}
        >
          <div className="flex items-center gap-2">
            <MailOpen className="text-gray-500" />
            <h2 className="font-medium text-gray-800">
              Read ({readNotifications.length})
            </h2>
          </div>
          {expandedSection.read ? <ChevronUp /> : <ChevronDown />}
        </div>

        {expandedSection.read && (
          <div className="mt-3 space-y-3">
            {readNotifications.length > 0 ? (
              readNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-300 relative opacity-90"
                >
                  <button 
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="pr-6">
                    <h3 className="font-medium text-gray-900">{notification.department}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.timestamp.toDate()).toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <MailOpen className="h-3 w-3" /> Read
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No read notifications
              </div>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-10">
          <MailOpen className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-500">No notifications available</p>
        </div>
      )}
    </div>
  );
}