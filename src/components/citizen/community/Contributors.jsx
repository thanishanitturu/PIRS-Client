import React from "react";

const Contributors = () => {
  const contributors = [
    {
      icon: "👤",
      name: "John Doe",
      info: "Reported 15 issues, resolved 10.",
    },
    {
      icon: "👤",
      name: "Jane Smith",
      info: "Reported 12 issues, resolved 8.",
    },
    {
      icon: "👤",
      name: "Alice Johnson",
      info: "Reported 10 issues, resolved 7.",
    },
  ];

  return (
    <div className="flex flex-col   rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Top Contributors</h2>
      <ul className="space-y-4">
        {contributors.map((contributor, index) => (
          <li key={index} className="flex items-center gap-4 relative">
            <span className="text-3xl">{contributor.icon}</span>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{contributor.name}</p>
              <p className="text-sm">{contributor.info}</p>
            </div>

            {/* Medal Rank Icon */}
            {index === 0 && (
              <div className="absolute right-0 top-0 p-2 text-yellow-500">
                <i className="fas fa-medal text-4xl" />
              </div>
            )}
            {index === 1 && (
              <div className="absolute right-0 top-0 p-2 text-gray-400">
                <i className="fas fa-medal text-4xl" />
              </div>
            )}
            {index === 2 && (
              <div className="absolute right-0 top-0 p-2 text-yellow-600">
                <i className="fas fa-medal text-4xl" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="text-gray-800 mt-12 text-center">
        <span className="text-blue-600">They Say: </span>Be a Part of the Community, and then the community will be good.
      </p>
    </div>
  );
};

export default Contributors;
