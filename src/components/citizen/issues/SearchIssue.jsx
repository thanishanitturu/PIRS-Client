import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchIssue = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pending: false,
    resolved: false,
    progress: false,
    unresolved: false,
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200 w-full mx-auto mb-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search issues..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={toggleFilters}
          className="ml-2 p-2 text-gray-600 hover:text-blue-600 md:hidden"
          aria-label="Toggle filters"
        >
          <FaFilter />
        </button>
      </div>

      {/* Filters - Mobile (Collapsible) */}
      <div className={`md:hidden mt-3 ${showFilters ? "block" : "hidden"}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pending-mobile"
              name="pending"
              checked={filters.pending}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pending-mobile" className="ml-2 text-sm text-gray-700">
              Pending
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="resolved-mobile"
              name="resolved"
              checked={filters.resolved}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="resolved-mobile" className="ml-2 text-sm text-gray-700">
              Resolved
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="progress-mobile"
              name="progress"
              checked={filters.progress}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="progress-mobile" className="ml-2 text-sm text-gray-700">
              In Progress
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="unresolved-mobile"
              name="unresolved"
              checked={filters.unresolved}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="unresolved-mobile" className="ml-2 text-sm text-gray-700">
              Unresolved
            </label>
          </div>
        </div>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:flex justify-between items-center mt-4 space-x-4">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pending-desktop"
              name="pending"
              checked={filters.pending}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pending-desktop" className="ml-2 text-sm text-gray-700">
              Pending
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="resolved-desktop"
              name="resolved"
              checked={filters.resolved}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="resolved-desktop" className="ml-2 text-sm text-gray-700">
              Resolved
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="progress-desktop"
              name="progress"
              checked={filters.progress}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="progress-desktop" className="ml-2 text-sm text-gray-700">
              In Progress
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="unresolved-desktop"
              name="unresolved"
              checked={filters.unresolved}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="unresolved-desktop" className="ml-2 text-sm text-gray-700">
              Unresolved
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchIssue;