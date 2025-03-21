import React, { useState } from "react";

const SearchIssue = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pending: false,
    resolved: false,
    inProgress: false,
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); 
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: checked };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border w-full mx-auto mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-20">
        {/* Left area: Search input */}
        <div className="w-full md:w-2/3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for issues..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Right area: Filters */}
        <div className="w-full md:w-1/3 mt-4 md:mt-0 flex justify-between items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pending"
              name="pending"
              checked={filters.pending}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <label htmlFor="pending" className="text-gray-700">
              Pending
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="resolved"
              name="resolved"
              checked={filters.resolved}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <label htmlFor="resolved" className="text-gray-700">
              Resolved
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inProgress"
              name="inProgress"
              checked={filters.inProgress}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <label htmlFor="inProgress" className="text-gray-700">
              In Progress
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchIssue;
