import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaCalendarAlt, FaSortAmountDown } from "react-icons/fa";

const SearchFilter = ({
  onFilterChange,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sortBy,
  setSortBy,
  status,
  setStatus,
  dateReported,
  setDateReported
}) => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilterChange({ searchTerm, status, category, dateReported, sortBy });
  }, [searchTerm, status, category, dateReported, sortBy]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      {/* Main Search Bar */}
      <div className="relative flex items-center mb-2">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search issues..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 p-2 text-gray-600 hover:text-blue-600 md:hidden"
          aria-label="Toggle filters"
        >
          <FaFilter />
        </button>
      </div>

      {/* Mobile Filter Toggle Area */}
      <div className={`md:hidden ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Status Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
                <option value="progress">In Progress</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="waste_management">Waste Management</option>
                <option value="road_problems">Road Problems</option>
                <option value="electrical_issues">Electrical Issues</option>
                <option value="water_issues">Water Issues</option>
                <option value="traffic_problems">Traffic Problems</option>
                <option value="public_parks">Public Parks</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Date Reported</label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="most-upvoted">Most Upvoted</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaSortAmountDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters (Hidden on Mobile) */}
      <div className="hidden md:flex flex-wrap gap-3 mt-3">
        {/* Status Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <div className="relative">
            <select
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
              <option value="progress">In Progress</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <div className="relative">
            <select
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="waste_management">Waste Management</option>
              <option value="road_problems">Road Problems</option>
              <option value="electrical_issues">Electrical Issues</option>
              <option value="water_issues">Water Issues</option>
              <option value="traffic_problems">Traffic Problems</option>
              <option value="public_parks">Public Parks</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <div className="relative">
            <input
              type="date"
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateReported}
              onChange={(e) => setDateReported(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Sort By Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <div className="relative">
            <select
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="most-upvoted">Most Upvoted</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;