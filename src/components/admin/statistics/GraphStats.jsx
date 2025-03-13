import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const pieData = [
  { name: "Resolved", value: 180, color: "#22c55e" }, // Green
  { name: "Pending", value: 90, color: "#eab308" }, // Yellow
  { name: "Unresolved", value: 50, color: "#ef4444" }, // Red
];

// Total issue comparison
const lastMonthTotal = 290; // Last month's total issues
const thisMonthTotal = 320; // This month's total issues
const issueChange = thisMonthTotal - lastMonthTotal;
const percentageChange = ((issueChange / lastMonthTotal) * 100).toFixed(1);

export default function GraphStats() {
  return (
    <div className="p-6 bg-gray-50">
      {/* Heading */}
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue Statistics Overview</h2> */}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Pie Chart */}
        <div className="flex justify-center">
          <PieChart width={250} height={250}>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Right: Total Issue Change */}
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Issue Change</h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">
              <span className="font-medium">Last Month:</span> {lastMonthTotal}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-medium">This Month:</span> {thisMonthTotal}
            </p>
            <p className={`text-xl font-bold flex items-center mt-2 ${issueChange >= 0 ? "text-red-600" : "text-green-600"}`}>
              {issueChange >= 0 ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
              {Math.abs(issueChange)} ({Math.abs(percentageChange)}%)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
