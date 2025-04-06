import React from "react";

import { calculateIssueCounts } from "../../../utilities/utilities";

const Statistics = ({initialIssues}) => {


  const issueCounts  = calculateIssueCounts(initialIssues);

  const statistics = [
    { icon: "📊", label: "Total Issues", value: issueCounts.total },
    { icon: "✅", label: "Resolved", value: issueCounts.resolved },
    { icon: "🔄", label: "In Progress", value: issueCounts.progress },
    { icon: "⏳", label: "Pending", value: issueCounts.pending },
    { icon: "❌", label: "Unresolved", value: issueCounts.unresolved },
];

  return (
    <div className="flex flex-col  rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Statistics</h2>
      <ul className="space-y-4">
        {statistics.map((stat, index) => (
          <li key={index} className="flex items-center gap-4">
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-md font-semibold">{stat.label}</p>
              <p className="text-sm">{stat.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
