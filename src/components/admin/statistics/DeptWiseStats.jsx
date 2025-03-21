import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const departmentData = [
  { dept: "Sanitation1", resolved: 40, pending: 30, unresolved: 15 },
  { dept: "Sanitation", resolved: 40, pending: 30, unresolved: 15 },
  { dept: "Electrical", resolved: 90, pending: 25, unresolved: 10 },
  { dept: "Water Supply", resolved: 20, pending: 35, unresolved: 12 },
  { dept: "Roads & Transport", resolved: 100, pending: 20, unresolved: 18 },
];

const chartData = departmentData.map((dept) => ({
  name: dept.dept,
  Resolved: dept.resolved,
  Pending: dept.pending,
  Unresolved: dept.unresolved,
}));

export default function DeptWiseStats() {
  const [hoveredDept, setHoveredDept] = useState(null);

  // Function to calculate resolving ratio
  const getResolvingRatio = (resolved, pending, unresolved) => {
    const total = resolved + pending + unresolved;
    return total > 0 ? (resolved / total) * 100 : 0;
  };

  // Dummy function to send email (Replace with actual email logic)
  const notifyDepartment = (deptName) => {
    alert(`Notification sent to ${deptName} Department for low resolving ratio.`);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Department-Wise Issue Statistics</h2>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Department</th>
                <th className="border p-3 text-center">Resolved</th>
                <th className="border p-3 text-center">Pending</th>
                <th className="border p-3 text-center">Unresolved</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => {
                const resolvingRatio = getResolvingRatio(dept.resolved, dept.pending, dept.unresolved);

                return (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 relative"
                    onMouseEnter={() => setHoveredDept(dept.dept)}
                    onMouseLeave={() => setHoveredDept(null)}
                  >
                    <td className="border p-3 relative">
                      {dept.dept}
                      {resolvingRatio < 50 && hoveredDept === dept.dept && (
                        <button 
                          className="absolute left-2/3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 transition"
                          onClick={() => notifyDepartment(dept.dept)}
                        >
                          Notify Them
                        </button>
                      )}
                    </td>
                    <td className="border p-3 text-center text-green-600 font-medium">{dept.resolved}</td>
                    <td className="border p-3 text-center text-yellow-500 font-medium">{dept.pending}</td>
                    <td className="border p-3 text-center text-red-500 font-medium">{dept.unresolved}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right: Bar Chart (Responsive) */}
        <div className="flex justify-center">
          <div className="w-full h-64 md:h-96"> {/* Adjust height based on screen size */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Resolved" fill="#22c55e" />
                <Bar dataKey="Pending" fill="#eab308" />
                <Bar dataKey="Unresolved" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
