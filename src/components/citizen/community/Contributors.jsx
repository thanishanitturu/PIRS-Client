import React, { useEffect, useState } from "react";
import { fetchUserReportsStatistics } from "../../../firebase/citizen/reportFuncs";
import { getUserData } from "../../../firebase/citizen/authFuncs";
import { Loader } from "lucide-react";

const Contributors = () => {
  const [contributors, setContributors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const stats = await fetchUserReportsStatistics();

        const enrichedContributors = await Promise.all(
          stats.map(async (userStat) => {
            const userData = await getUserData(userStat.userId);
            return {
              photo: userData?.photoURL || `https://via.placeholder.com/40?text=${encodeURIComponent(userData?.name?.charAt(0) || "U")}`,
              name: userData?.name || "Unknown",
              totalIssues: userStat.stats.total,
              resolvedIssues: userStat.stats.resolved,
            };
          })
        );

        setContributors(enrichedContributors);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const getMedalIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  if (loading || !contributors) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-lg text-gray-700">Loading contributors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg p-6 w-full bg-gray-50">
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
        Top Contributors
      </h2>
      {contributors.length === 0 ? (
        <p className="text-center text-gray-500">No contributors found</p>
      ) : (
        <ul className="space-y-6">
          {contributors.map((contributor, index) => (
            <li
              key={index}
              className="flex items-center gap-4 relative bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={contributor.photo}
                alt={contributor.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/40?text=${encodeURIComponent(contributor.name?.charAt(0) || "U")}`;
                }}
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{contributor.name}</p>
                <p className="text-sm text-gray-600">
                  Reported {contributor.totalIssues} issues, Resolved {contributor.resolvedIssues}
                </p>
              </div>
              {index < 3 && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl">
                  {getMedalIcon(index)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contributors;