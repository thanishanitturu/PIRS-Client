import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUserByDepartment, sendNotificationToUser } from "../../../firebase/admin/manageUserFuncs";
import { FaBell, FaChartBar, FaTable } from "react-icons/fa";

export default function DeptWiseStats({ departmentData, setSnackbar }) {
  const [hoveredDept, setHoveredDept] = useState(null);
  const [activeTab, setActiveTab] = useState("chart"); // 'chart' or 'table'
  const [expandedDept, setExpandedDept] = useState(null);

  const chartData = departmentData.map((dept) => ({
    name: dept.department,
    Resolved: dept.resolved,
    Pending: dept.pending,
    Progress: dept.progress,
    Unresolved: dept.unresolved,
  }));

  const maxValue = Math.max(
    ...departmentData.map(dept => 
      Math.max(dept.resolved, dept.pending, dept.progress, dept.unresolved)
    )
  );

  const generateTicks = () => {
    const ticks = [];
    const step = Math.ceil(maxValue / 10);
    for (let i = 0; i <= maxValue; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] < maxValue) {
      ticks.push(maxValue);
    }
    return ticks;
  };

  const getResolvingRatio = (resolved, pending, unresolved, progress) => {
    const total = resolved + pending + unresolved + progress;
    return total > 0 ? (resolved / total) * 100 : 0;
  };

  const notifyDepartment = async (deptName) => {
    try {
      const user = await getUserByDepartment(deptName);
      if (!user) {
        setSnackbar({open: true, severity: 'warning', message: `No user found for ${deptName} department`});
        return;
      }

      const notification = {
        title: "Low Resolving Ratio Alert",
        message: `Your department (${deptName}) has a low issue resolving ratio. Please take action.`,
        timestamp: new Date(),
        department: deptName,
        isRead: false,
      };

      await sendNotificationToUser(user.uid, notification);
      setSnackbar({open: true, severity: 'success', message: `Notification sent to ${deptName} department!`});
    } catch (error) {
      console.error("Failed to send notification:", error);
      setSnackbar({open: true, severity: 'error', message: `Error sending notification`});
    }
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Department Performance</h2>
          <p className="text-sm text-gray-500">Track issue resolution by department</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-3 py-2 rounded-md flex items-center ${activeTab === "chart" ? "bg-white shadow" : ""}`}
          >
            <FaChartBar className="mr-2" />
            <span className="hidden sm:inline">Chart</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-2 rounded-md flex items-center ${activeTab === "table" ? "bg-white shadow" : ""}`}
          >
            <FaTable className="mr-2" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Mobile Accordion View */}
      <div className="md:hidden space-y-3">
        {departmentData.map((dept, index) => {
          const resolvingRatio = getResolvingRatio(
            dept.resolved,
            dept.pending,
            dept.unresolved,
            dept.progress
          );
          
          return (
            <div 
              key={index} 
              className="border rounded-lg overflow-hidden"
              onClick={() => setExpandedDept(expandedDept === dept.department ? null : dept.department)}
            >
              <div className={`p-3 flex justify-between items-center ${hoveredDept === dept.department ? "bg-gray-50" : ""}`}>
                <div className="font-medium">{dept.department}</div>
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      resolvingRatio >= 70 ? "bg-green-500" : 
                      resolvingRatio >= 40 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span>{resolvingRatio.toFixed(0)}%</span>
                </div>
              </div>
              
              {expandedDept === dept.department && (
                <div className="p-3 bg-gray-50 border-t">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-xs text-blue-600">Resolved</div>
                      <div className="font-bold">{dept.resolved}</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="text-xs text-yellow-600">Pending</div>
                      <div className="font-bold">{dept.pending}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="text-xs text-purple-600">Progress</div>
                      <div className="font-bold">{dept.progress}</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="text-xs text-red-600">Unresolved</div>
                      <div className="font-bold">{dept.unresolved}</div>
                    </div>
                  </div>
                  
                  {resolvingRatio < 50 && (
                    <button
                      className="w-full py-2 bg-red-100 text-red-600 rounded-md flex items-center justify-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        notifyDepartment(dept.department);
                      }}
                    >
                      <FaBell className="mr-2" />
                      Notify Department
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Views */}
      <div className="hidden md:block">
        {activeTab === "chart" ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  allowDecimals={false}
                  ticks={generateTicks()}
                  domain={[0, maxValue]}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="Resolved" 
                  fill="#4CAF50" 
                  onMouseEnter={() => setHoveredDept("Resolved")}
                  onMouseLeave={() => setHoveredDept(null)}
                />
                <Bar 
                  dataKey="Pending" 
                  fill="#FFC107" 
                  onMouseEnter={() => setHoveredDept("Pending")}
                  onMouseLeave={() => setHoveredDept(null)}
                />
                <Bar 
                  dataKey="Progress" 
                  fill="#03A9F4" 
                  onMouseEnter={() => setHoveredDept("Progress")}
                  onMouseLeave={() => setHoveredDept(null)}
                />
                <Bar 
                  dataKey="Unresolved" 
                  fill="#F44336" 
                  onMouseEnter={() => setHoveredDept("Unresolved")}
                  onMouseLeave={() => setHoveredDept(null)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">Department</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Total</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Resolved</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Pending</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Progress</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Unresolved</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Ratio</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departmentData.map((dept, index) => {
                  const resolvingRatio = getResolvingRatio(
                    dept.resolved,
                    dept.pending,
                    dept.unresolved,
                    dept.progress
                  );
                  
                  return (
                    <tr
                      key={index}
                      className={`${hoveredDept === dept.department ? "bg-gray-50" : ""}`}
                      onMouseEnter={() => setHoveredDept(dept.department)}
                      onMouseLeave={() => setHoveredDept(null)}
                    >
                      <td className="p-3 font-medium">{dept.department}</td>
                      <td className="p-3 text-right">{dept.total}</td>
                      <td className="p-3 text-right">{dept.resolved}</td>
                      <td className="p-3 text-right">{dept.pending}</td>
                      <td className="p-3 text-right">{dept.progress}</td>
                      <td className="p-3 text-right">{dept.unresolved}</td>
                      <td className="p-3 text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          resolvingRatio >= 70 ? "bg-green-100 text-green-800" : 
                          resolvingRatio >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                        }`}>
                          {resolvingRatio.toFixed(0)}%
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {resolvingRatio < 50 && (
                          <button
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 flex items-center"
                            onClick={() => notifyDepartment(dept.department)}
                          >
                            <FaBell className="mr-1" />
                            Notify
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}