import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { 
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaListAlt, 
  FaBell, FaTrash, FaCheck, FaArrowUp, FaArrowDown, 
  FaChartLine, FaChartPie, FaClipboardList
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { getReportsByDepartment } from "../../../firebase/dept/issueFuncs";
import { formatDepartmentName } from "../../../utilities/utilities";

const DepartmentDashboard = () => {
  const { role } = useContext(AppContext);
  const department = role.replace("DeptAdmin","");
  const [deptReports, setDeptReports] = useState([]);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const departmentName = capitalize(department);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    unresolved: 0,
    resolved: 0,
    progress: 0
  });
  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const departmentColors = {
    Water: {
      bg: "bg-blue-500",
      text: "text-blue-500",
      chart: "#3b82f6",
      light: "bg-blue-50"
    },
    Sanitation: {
      bg: "bg-green-500",
      text: "text-green-500",
      chart: "#10b981",
      light: "bg-green-50"
    },
    Electricity: {
      bg: "bg-yellow-500",
      text: "text-yellow-500",
      chart: "#f59e0b",
      light: "bg-yellow-50"
    },
    default: {
      bg: "bg-red-500",
      text: "text-red-500",
      chart: "#ef4444",
      light: "bg-red-50"
    }
  };

  const currentDept = departmentColors[departmentName] || departmentColors.default;

  useEffect(() => { 
    const getDeptsData = async() => {
      const res = await getReportsByDepartment(localStorage.getItem("deptname"));
      setDeptReports(res);

      // Calculate current stats
      const newCounts = {
        total: res.length,
        pending: 0,
        unresolved: 0,
        resolved: 0,
        progress: 0,
      };

      // Calculate performance trend for last 3 months
      const currentDate = new Date();
      const months = [
        { 
          name: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)
                .toLocaleString('default', { month: 'short' }),
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1) 
        },
        { 
          name: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                .toLocaleString('default', { month: 'short' }),
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1) 
        },
        { 
          name: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                .toLocaleString('default', { month: 'short' }),
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) 
        }
      ];

      const trendData = months.map(month => {
        const monthStart = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
        const monthEnd = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);
        
        const monthReports = res.filter(report => {
          if (!report.reportedDate) return false;
          const reportDate = new Date(report.reportedDate);
          return reportDate >= monthStart && reportDate <= monthEnd;
        });

        return {
          month: month.name,
          resolved: monthReports.filter(r => r.status === 'resolved').length,
          pending: monthReports.filter(r => r.status === 'pending').length,
          progress: monthReports.filter(r => r.status === 'progress').length
        };
      });

      res.forEach(report => {
        if (report.status === 'pending') newCounts.pending++;
        else if (report.status === 'unresolved') newCounts.unresolved++;
        else if (report.status === 'resolved') newCounts.resolved++;
        else if (report.status === 'progress') newCounts.progress++;
      });

      setStats(newCounts);
      setPerformanceTrend(trendData);
    };

    getDeptsData();
  }, [departmentName]);

  const performanceChange = performanceTrend.length > 0 
    ? performanceTrend[performanceTrend.length - 1].resolved - performanceTrend[0].resolved
    : 0;
  
  const pieData = [
    { name: "Resolved", value: stats.resolved, color: "#22c55e" },
    { name: "In Progress", value: stats.progress, color: "#3b82f6" },
    { name: "Pending", value: stats.pending, color: "#eab308" },
    { name: "Unresolved", value: stats.unresolved, color: "#ef4444" },
  ];

  const statusCards = [
    { 
      icon: <FaListAlt className="text-2xl" />, 
      label: "Total Issues", 
      value: stats.total,
      bg: "bg-gray-100"
    },
    { 
      icon: <FaCheckCircle className="text-2xl text-green-500" />, 
      label: "Resolved", 
      value: stats.resolved,
      bg: "bg-green-50"
    },
    { 
      icon: <FaHourglassHalf className="text-2xl text-blue-500" />, 
      label: "In Progress", 
      value: stats.progress,
      bg: "bg-blue-50"
    },
    { 
      icon: <FaBell className="text-2xl text-yellow-500" />, 
      label: "Pending", 
      value: stats.pending,
      bg: "bg-yellow-50"
    },
    { 
      icon: <FaTimesCircle className="text-2xl text-red-500" />, 
      label: "Unresolved", 
      value: stats.unresolved,
      bg: "bg-red-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {formatDepartmentName(localStorage.getItem("deptname"))} Dashboard
          </h1>
          <p className="text-gray-600">Overview of department performance and issues</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <span className={`px-4 py-2 rounded-full text-white ${currentDept.bg} font-medium`}>
            {formatDepartmentName(localStorage.getItem("deptname"))}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === "overview" ? `${currentDept.text} border-b-2 ${currentDept.bg}` : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaChartLine className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === "analytics" ? `${currentDept.text} border-b-2 ${currentDept.bg}` : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaChartPie className="inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === "reports" ? `${currentDept.text} border-b-2 ${currentDept.bg}` : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaClipboardList className="inline mr-2" />
            Reports
          </button>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statusCards.map((card, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg shadow-sm border ${card.bg} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-full bg-white shadow-sm">
                {card.icon}
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Trend Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Performance Trend</h2>
              <div className={`px-3 py-1 rounded-full text-sm ${performanceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {performanceChange >= 0 ? (
                  <FaArrowUp className="inline mr-1" />
                ) : (
                  <FaArrowDown className="inline mr-1" />
                )}
                {Math.abs(performanceChange)} {performanceChange >= 0 ? 'Increase' : 'Decrease'}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentDept.chart} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={currentDept.chart} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke={currentDept.chart} 
                    fillOpacity={1} 
                    fill="url(#colorResolved)" 
                    name="Resolved Issues"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {deptReports.slice(0, 5).map((report, index) => (
                <div key={index} className="flex items-start p-3 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-full ${currentDept.light} mr-3`}>
                    {report.status === 'resolved' ? (
                      <FaCheckCircle className={`text-lg ${currentDept.text}`} />
                    ) : report.status === 'progress' ? (
                      <FaHourglassHalf className={`text-lg ${currentDept.text}`} />
                    ) : (
                      <FaTimesCircle className={`text-lg ${currentDept.text}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{report.title || "Untitled Issue"}</h3>
                    <p className="text-sm text-gray-500">{report.description?.substring(0, 60)}...</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span>{new Date(report.reportedDate).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span className={`capitalize ${report.status === 'resolved' ? 'text-green-500' : report.status === 'progress' ? 'text-blue-500' : 'text-yellow-500'}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Issues Breakdown */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-center">Issues Breakdown</h2>
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className={`p-3 rounded-lg ${currentDept.light} text-center hover:shadow-md transition-all`}>
                <FaCheck className={`mx-auto mb-1 ${currentDept.text}`} />
                <span className="text-sm">Resolve Issue</span>
              </button>
              <button className={`p-3 rounded-lg ${currentDept.light} text-center hover:shadow-md transition-all`}>
                <FaHourglassHalf className={`mx-auto mb-1 ${currentDept.text}`} />
                <span className="text-sm">Set Progress</span>
              </button>
              <button className={`p-3 rounded-lg ${currentDept.light} text-center hover:shadow-md transition-all`}>
                <FaBell className={`mx-auto mb-1 ${currentDept.text}`} />
                <span className="text-sm">Notify User</span>
              </button>
              <button className={`p-3 rounded-lg ${currentDept.light} text-center hover:shadow-md transition-all`}>
                <FaTrash className={`mx-auto mb-1 ${currentDept.text}`} />
                <span className="text-sm">Delete Issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;