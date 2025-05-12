import React from "react";
import { useNavigate } from "react-router-dom";

const StatisticDisplay = ({ stats }) => {
  const navigate = useNavigate();

  const statistics = [
    { icon: "📊", label: "Total Issues", value: stats?.total },
    { icon: "✅", label: "Resolved", value: stats?.resolved },
    { icon: "🔄", label: "In Progress", value: stats?.progress },
    { icon: "⏳", label: "Pending", value: stats?.pending },
    { icon: "❌", label: "Unresolved", value: stats?.unresolved },
  ];

  return (
    <div className="p-6 rounded-lg border border-gray-200 w-full max-w-full mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Statistics of Issues
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mx-3">
        {/* Left: Statistics - Original layout for desktop, scrollable for mobile */}
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <div className="hidden md:flex flex-wrap justify-center md:justify-between items-center gap-10 mr-12">
            {statistics.map((stat, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600">
                <span className="text-2xl">{stat.icon}</span>
                <span className="font-semibold text-lg">{stat.label}:</span>
                <span className="text-xl">{stat.value}</span>
              </div>
            ))}
          </div>
          
          {/* Mobile-only scrollable version */}
          <div className="md:hidden w-full overflow-x-auto pb-2">
            <div className="flex space-x-6 min-w-max px-2">
              {statistics.map((stat, index) => (
                <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-sm font-medium text-gray-600 text-center">
                    {stat.label.split(' ')[0]}
                  </span>
                  <span className="text-base font-bold text-gray-800">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Report Issue Button */}
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/issue-report")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          >
            Report Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticDisplay;