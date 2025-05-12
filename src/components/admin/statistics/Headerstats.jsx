import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaListAlt, FaSpinner } from "react-icons/fa";
import { calculateIssueCounts } from "../../../utilities/utilities";

export default function AdminStatsTop({ allReports }) {
  const issueCounts = calculateIssueCounts(allReports);

  const statistics = [
    { 
      title: "Total Issues", 
      count: issueCounts.total, 
      color: "from-blue-500 to-blue-600", 
      icon: <FaListAlt className="text-blue-100" />,
      bg: "bg-blue-100"
    },
    { 
      title: "Resolved", 
      count: issueCounts.resolved, 
      color: "from-green-500 to-green-600", 
      icon: <FaCheckCircle className="text-green-100" />,
      bg: "bg-green-100"
    },
    { 
      title: "Pending", 
      count: issueCounts.pending, 
      color: "from-yellow-500 to-yellow-600", 
      icon: <FaHourglassHalf className="text-yellow-100" />,
      bg: "bg-yellow-100"
    },
    { 
      title: "In Progress", 
      count: issueCounts.progress, 
      color: "from-purple-500 to-purple-600", 
      icon: <FaSpinner className="text-purple-100 animate-spin" />,
      bg: "bg-purple-100"
    },
    { 
      title: "Unresolved", 
      count: issueCounts.unresolved, 
      color: "from-red-500 to-red-600", 
      icon: <FaTimesCircle className="text-red-100" />,
      bg: "bg-red-100"
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Issue Overview</h2>
        <p className="text-sm md:text-base text-gray-500 mt-1">Current status of all reported issues</p>
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden overflow-x-auto pb-4">
        <div className="flex space-x-4 w-max">
          {statistics.map((stat, index) => (
            <div key={index} className={`w-40 h-32 bg-gradient-to-br ${stat.color} rounded-xl shadow-sm p-4 flex flex-col justify-between`}>
              <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statistics.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-sm p-5 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-sm font-medium text-white/90">{stat.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.count}</p>
              <div className="h-1 bg-white/20 mt-2 rounded-full">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${(stat.count / issueCounts.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary for Mobile */}
      <div className="md:hidden mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-700 mb-3">Quick Summary</h3>
        <div className="space-y-3">
          {statistics.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${stat.bg} mr-2`}></div>
                <span className="text-sm text-gray-600">{stat.title}</span>
              </div>
              <span className="font-medium">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}