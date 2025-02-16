import { useState } from "react";

export default function Notifyall({notifications,markAsRead}) {
  // const [notifications, setNotifications] = useState([
  //   { id: 1, department: "Sanitation", message: "Your garbage collection issue is under review.", time: "10:30 AM", date: "Jan 30, 2025", read: false },
  //   { id: 2, department: "Electricity Board", message: "Power outage in your area has been reported.", time: "09:15 AM", date: "Jan 30, 2025", read: false },
  //   { id: 3, department: "Water Department", message: "Your water leakage complaint is being addressed.", time: "08:45 AM", date: "Jan 30, 2025", read: false },
  //   { id: 4, department: "Traffic Police", message: "Your traffic signal issue has been forwarded.", time: "07:30 AM", date: "Jan 29, 2025", read: false },
  //   { id: 5, department: "Municipality", message: "Streetlight repair request is in progress.", time: "06:20 AM", date: "Jan 29, 2025", read: false },
  // ]);

  // const markAsRead = (id) => {
  //   setNotifications((prev) =>
  //     prev.map((notif) =>
  //       notif.id === id ? { ...notif, read: true } : notif
  //     )
  //   );
  // };

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
