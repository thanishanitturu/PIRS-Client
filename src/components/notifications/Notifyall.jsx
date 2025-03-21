import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

export default function Notifyall() {

  const{notifications,setNotifications} = useContext(AppContext);
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Filter only unread notifications
  const unreadNotifications = notifications.filter((notif) => !notif.read);
  useEffect(()=>{
    markAsRead();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900">{notification.department}</h3>
            <p className="text-gray-700 mt-2">{notification.message}</p>
            <p className="text-sm text-gray-500 mt-1">{notification.date} at {notification.time}</p>

            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
