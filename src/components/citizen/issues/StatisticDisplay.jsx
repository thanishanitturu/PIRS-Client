// import React from "react";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const StatisticDisplay = ({ stats }) => {
//   const { totalIssues, resolved, inProgress, pending } = stats;

//   // Data for the Pie chart
//   const data = {
//     labels: ["Resolved", "In Progress", "Pending"],
//     datasets: [
//       {
//         label: "Issue Statistics",
//         data: [resolved, inProgress, pending],
//         backgroundColor: ["#4CAF50", "#FFC107", "#FF5722"],
//         hoverBackgroundColor: ["#45A049", "#FFD54F", "#F44336"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             const value = tooltipItem.raw || 0;
//             const total = resolved + inProgress + pending;
//             const percentage = ((value / total) * 100).toFixed(1);
//             return `${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-full mx-auto">
//       <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
//         Statistics of Issues
//       </h2>
//       <div className="md:flex md:justify-between mb-6">
//         {/* Left section: Counts */}
//         <div className="md:w-1/2 space-y-4">
//           <div className="flex justify-between text-gray-600">
//             <span>Total Issues Raised:</span>
//             <span>{totalIssues}</span>
//           </div>
//           <div className="flex justify-between text-gray-600">
//             <span>Total Resolved:</span>
//             <span>{resolved}</span>
//           </div>
//           <div className="flex justify-between text-gray-600">
//             <span>Total Progressing:</span>
//             <span>{inProgress}</span>
//           </div>
//           <div className="flex justify-between text-gray-600">
//             <span>Total Pending:</span>
//             <span>{pending}</span>
//           </div>
//         </div>

//         {/* Right section: Pie chart */}
//         <div className="md:w-1/4 mt-1 md:mt-0 w-full">
//           <div className="w-full">
//             <Pie data={data} options={options} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatisticDisplay;
import React from "react";
import { useNavigate } from "react-router-dom";

const StatisticDisplay = ({ stats }) => {
  const navigate = useNavigate();

  const statistics = [
    { icon: "📊", label: "Total Issues Raised", value: stats.totalIssues },
    { icon: "✅", label: "Resolved Issues", value: stats.resolved },
    { icon: "⏳", label: "In Progress", value: stats.inProgress },
    { icon: "❌", label: "Unresolved Issues", value: stats.Pending },
  ];

  return (
    <div className="p-6 rounded-lg border border-gray-200 w-full max-w-full mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Statistics of Issues
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mx-3">
        {/* Left: Statistics */}
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-10 mr-12">
  {statistics.map((stat, index) => (
    <div key={index} className="flex items-center space-x-2 text-gray-600">
      <span className="text-2xl">{stat.icon}</span>
      <span className="font-semibold text-lg">{stat.label}:</span>
      <span className="text-xl">{stat.value}</span>
    </div>
  ))}
</div>


        {/* Right: Report Issue Button */}
        <div className="mt-6 md:mt-0">
          <button
            onClick={() => navigate("/issue-report")}
            className="px-3 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition"
          >
            Report Now..
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticDisplay;
