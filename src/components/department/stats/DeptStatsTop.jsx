import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaListAlt } from "react-icons/fa";

export default function DeptStatsTop() {
  const statistics = [
    { title: "Total Issues", count: 150, color: "bg-blue-500", icon: <FaListAlt size={30} /> },
    { title: "Resolved Issues", count: 100, color: "bg-green-500", icon: <FaCheckCircle size={30} /> },
    { title: "Pending Issues", count: 30, color: "bg-yellow-500", icon: <FaHourglassHalf size={30} /> },
    { title: "Unresolved Issues", count: 20, color: "bg-red-500", icon: <FaTimesCircle size={30} /> },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Department Issue Statistics</h2>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className={`p-3 ${stat.color} text-white rounded-lg shadow-md flex items-center`}
          >
            <div className="mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}