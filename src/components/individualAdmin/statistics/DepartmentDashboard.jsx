import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { 
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaListAlt, 
  FaBell, FaTrash, FaCheck, FaArrowUp, FaArrowDown 
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { getReportsByDepartment } from "../../../firebase/dept/issueFuncs";

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

  const currentDept = {
    color: departmentName === "Water" ? "bg-blue-500" : 
           departmentName === "Sanitation" ? "bg-green-500" :
           departmentName === "Electricity" ? "bg-yellow-500" : "bg-red-500",
    chartColor: departmentName === "Water" ? "#3b82f6" : 
               departmentName === "Sanitation" ? "#10b981" :
               departmentName === "Electricity" ? "#f59e0b" : "#ef4444"
  };

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

  const statistics = [
    { icon: "📊", label: "Total Issues", value: stats.total },
    { icon: "✅", label: "Resolved", value: stats.resolved },
    { icon: "🔄", label: "In Progress", value: stats.progress },
    { icon: "⏳", label: "Pending", value: stats.pending },
    { icon: "❌", label: "Unresolved", value: stats.unresolved },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center md:flex-row md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left mb-2 md:mb-0">
          {localStorage.getItem("deptname")} Dashboard
        </h1>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-white ${currentDept.color}`}>
            {departmentName}
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
  {statistics.map((stat, index) => (
    <div 
      key={index} 
      className="flex items-center space-x-2 text-gray-600 border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
    >
      <span className="text-2xl">{stat.icon}</span>
      <span className="font-semibold text-lg">{stat.label}:</span>
      <span className="text-xl">{stat.value}</span>
    </div>
  ))}
</div>


          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3 text-center">Issues Breakdown</h2>
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3 text-center">Monthly Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceTrend}>
                    <XAxis dataKey="month" />
                    <YAxis 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''} 
  allowDecimals={false}
/>
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
                    <Bar 
                      dataKey="progress" 
                      fill="#10b981" 
                      name="In Progress" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-center">
                <p className="flex items-center justify-center text-sm">
                  {performanceChange >= 0 ? (
                    <FaArrowUp className="text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-1" />
                  )}
                  <span>
                    {Math.abs(performanceChange)} {performanceChange >= 0 ? 'more' : 'fewer'} 
                    resolved issues compared to 3 months ago
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;