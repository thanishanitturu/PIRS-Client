import React, { useState, useEffect,useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { 
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaListAlt, 
  FaBell, FaTrash, FaCheck, FaArrowUp, FaArrowDown 
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";

// 1. Department Data Configuration
const departmentConfig = {
  Water: {
    color: "bg-blue-500",
    chartColor: "#3b82f6",
    issues: {
      total: 67,
      resolved: 20,
      pending: 35,
      unresolved: 12
    },
    performanceTrend: [
      { month: "Jan", resolved: 12, pending: 8 },
      { month: "Feb", resolved: 15, pending: 10 },
      { month: "Mar", resolved: 20, pending: 15 },
    ]
  },
  Sanitation: {
    color: "bg-green-500",
    chartColor: "#10b981",
    issues: {
      total: 92,
      resolved: 45,
      pending: 30,
      unresolved: 17
    },
    performanceTrend: [
      { month: "Jan", resolved: 30, pending: 15 },
      { month: "Feb", resolved: 40, pending: 20 },
      { month: "Mar", resolved: 45, pending: 30 },
    ]
  },
  Electricity: {
    color: "bg-yellow-500",
    chartColor: "#f59e0b",
    issues: {
      total: 58,
      resolved: 35,
      pending: 15,
      unresolved: 8
    },
    performanceTrend: [
      { month: "Jan", resolved: 25, pending: 10 },
      { month: "Feb", resolved: 30, pending: 12 },
      { month: "Mar", resolved: 35, pending: 15 },
    ]
  },
  Traffic: {
    color: "bg-red-500",
    chartColor: "#ef4444",
    issues: {
      total: 110,
      resolved: 70,
      pending: 25,
      unresolved: 15
    },
    performanceTrend: [
      { month: "Jan", resolved: 50, pending: 20 },
      { month: "Feb", resolved: 60, pending: 22 },
      { month: "Mar", resolved: 70, pending: 25 },
    ]
  }
};

// 2. Dynamic Department Dashboard Component
const DepartmentDashboard = () => {
  const { role } = useContext(AppContext);
  const department = role.replace("DeptAdmin",""); // Corrected this line
  // Optional: Capitalize the department name
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const departmentName = capitalize(department);

  const [notifications, setNotifications] = useState([]);
  const currentDept = departmentConfig[departmentName] || departmentConfig.Water;

  // Load sample notifications
  useEffect(() => {
    const sampleNotifications = [
      { 
        id: 1, 
        message: `New ${departmentName.toLowerCase()} issue reported in Zone 5`, 
        time: "10:30 AM", 
        date: new Date().toLocaleDateString(), 
        read: false 
      },
      { 
        id: 2, 
        message: `Pending ${departmentName.toLowerCase()} complaints need review`, 
        time: "09:15 AM", 
        date: new Date().toLocaleDateString(), 
        read: false 
      }
    ];
    setNotifications(sampleNotifications);
  }, [departmentName]);

  // Calculate performance metrics
  const performanceChange = currentDept.issues.resolved - 
    currentDept.performanceTrend[0].resolved;
  
  const pieData = [
    { name: "Resolved", value: currentDept.issues.resolved, color: "#22c55e" },
    { name: "Pending", value: currentDept.issues.pending, color: "#eab308" },
    { name: "Unresolved", value: currentDept.issues.unresolved, color: "#ef4444" },
  ];

  const statsCards = [
    { 
      title: "Total Issues", 
      count: currentDept.issues.total, 
      color: currentDept.color, 
      icon: <FaListAlt size={30} /> 
    },
    { 
      title: "Resolved", 
      count: currentDept.issues.resolved, 
      color: "bg-green-500", 
      icon: <FaCheckCircle size={30} /> 
    },
    { 
      title: "Pending", 
      count: currentDept.issues.pending, 
      color: "bg-yellow-500", 
      icon: <FaHourglassHalf size={30} /> 
    },
    { 
      title: "Unresolved", 
      count: currentDept.issues.unresolved, 
      color: "bg-red-500", 
      icon: <FaTimesCircle size={30} /> 
    },
  ];

  // Notification handlers
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {departmentName} Department Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-white ${currentDept.color}`}>
            {departmentName}
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <div key={index} className={`p-4 ${stat.color} text-white rounded-lg shadow flex items-center`}>
                <div className="mr-3">{stat.icon}</div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold">{stat.title}</h3>
                  <p className="text-xl md:text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Issues Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Monthly Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentDept.performanceTrend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="resolved" 
                      fill={currentDept.chartColor} 
                      name="Resolved Issues" 
                    />
                    <Bar 
                      dataKey="pending" 
                      fill="#eab308" 
                      name="Pending Issues" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded">
                <p className="flex items-center text-sm">
                  {performanceChange >= 0 ? (
                    <FaArrowUp className="text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-1" />
                  )}
                  <span>
                    {Math.abs(performanceChange)} {performanceChange >= 0 ? 'more' : 'fewer'} 
                    resolved issues compared to last month
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notifications */}
        <div className="bg-white rounded-lg shadow p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FaBell className={`mr-2 ${currentDept.color}`} />
              Notifications
            </h2>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {notifications.filter(n => !n.read).length} New
            </span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notifications</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map(notification => (
                <li 
                  key={notification.id} 
                  className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.date} • {notification.time}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Mark as read"
                        >
                          <FaCheck size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Usage Example:
// <DepartmentDashboard departmentName="Water" />
// <DepartmentDashboard departmentName="Sanitation" />
// <DepartmentDashboard departmentName="Electricity" />
// <DepartmentDashboard departmentName="Traffic" />

export default DepartmentDashboard;