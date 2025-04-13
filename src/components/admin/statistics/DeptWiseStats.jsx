import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUserByDepartment,sendNotificationToUser } from "../../../firebase/admin/manageUserFuncs";

export default function DeptWiseStats({ departmentData ,setSnackbar}) {
 
  
  const [hoveredDept, setHoveredDept] = useState(null);

  const chartData = departmentData.map((dept) => ({
    name: dept.department,
    Resolved: dept.resolved,
    Pending: dept.pending,
    Progress: dept.progress,
    Unresolved: dept.unresolved,
  }));
  // console.log(getUserByDepartment)
  // Calculate maximum value across all categories for YAxis ticks
  const maxValue = Math.max(
    ...departmentData.map(dept => 
      Math.max(dept.resolved, dept.pending, dept.progress, dept.unresolved)
    )
  );

  // Generate integer ticks from 0 to maxValue
  const generateTicks = () => {
    const ticks = [];
    const step = Math.ceil(maxValue / 10); // Aim for about 10 ticks
    for (let i = 0; i <= maxValue; i += step) {
      ticks.push(i);
    }
    // Ensure maxValue is included if not already
    if (ticks[ticks.length - 1] < maxValue) {
      ticks.push(maxValue);
    }
    return ticks;
  };

  const getResolvingRatio = (resolved, pending, unresolved, progress) => {
    const total = resolved + pending + unresolved + progress;
    return total > 0 ? (resolved / total) * 100 : 0;
  };

  const notifyDepartment = async(deptName)=>{
    try {
      const user = await getUserByDepartment(deptName);
      if (!user) {
        alert(`No user found for ${deptName} department.`);
        return;
      }
  
      const notification = {
        title: "Low Resolving Ratio Alert",
        message: `Your department (${deptName}) has a low issue resolving ratio. Please take action.`,
        timestamp:new Date(),
        department:deptName,
        isRead: false,
      };
  
      await sendNotificationToUser(user.uid, notification);
  setSnackbar({open:true,severity:'success',message:`Notification sent successfully to ${deptName} department!`})
     
      
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("Error sending notification. Check console.");
  setSnackbar({open:true,severity:'error',message:`Error in sending notification`})
      
    }
  }
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Department-Wise Issue Statistics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Department</th>
                <th className="border p-3 text-center">Resolved</th>
                <th className="border p-3 text-center">Pending</th>
                <th className="border p-3 text-center">Progress</th>
                <th className="border p-3 text-center">Unresolved</th>
                <th className="border p-3 text-center">Resolving %</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
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
                    className={`${hoveredDept === dept.department ? "bg-gray-200" : ""}`}
                    onMouseEnter={() => setHoveredDept(dept.department)}
                    onMouseLeave={() => setHoveredDept(null)}
                  >
                    <td className="border p-3">{dept.department}</td>
                    <td className="border p-3 text-center">{dept.resolved}</td>
                    <td className="border p-3 text-center">{dept.pending}</td>
                    <td className="border p-3 text-center">{dept.progress}</td>
                    <td className="border p-3 text-center">{dept.unresolved}</td>
                    <td className="border p-3 text-center">{resolvingRatio.toFixed(1)}%</td>
                    <td className="border p-3 text-center">
                      {resolvingRatio < 50 && (
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          onClick={() => notifyDepartment(dept.department)}
                        >
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

        {/* Right: Bar Chart with integer Y-axis */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis 
                allowDecimals={false}
                ticks={generateTicks()}
                domain={[0, maxValue]}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="Resolved" fill="#4CAF50" />
              <Bar dataKey="Pending" fill="#FFC107" />
              <Bar dataKey="Progress" fill="#03A9F4" />
              <Bar dataKey="Unresolved" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}