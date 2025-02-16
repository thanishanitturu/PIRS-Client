import React, { useState,useEffect } from "react";

const SearchFilter = ({ onFilterChange,searchTerm,setSearchTerm,category,setCategory,sortBy,setSortBy,status,setStatus,dateReported,setDateReported }) => {
 

  useEffect(() => {
    onFilterChange({ searchTerm, status, category, dateReported, sortBy });
  }, [searchTerm, status, category, dateReported, sortBy]);

  return (
    <>
    <hr className="border-t-2 border-gray-300 my-4" />

    <div className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row items-center gap-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search issues..."
        className="border p-2 rounded w-full md:w-1/4"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          // handleFilterChange();
        }}
      />

      {/* Status Filter */}
      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          // handleFilterChange();
        }}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Unresolved">Unresolved</option>
        <option value="Resolved">Resolved</option>
      </select>

      {/* Category Filter */}
      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          // handleFilterChange();
        }}
      >
        <option value="">All Categories</option>
        <option value="Waste">Waste Management</option>
        <option value="Roads">Roads</option>
        <option value="Electricity">Electricity</option>
        <option value="Water">Water Supply</option>
      </select>

      {/* Date Picker */}
      <input
        type="date"
        className="border p-2 rounded w-full md:w-1/6"
        value={dateReported}
        onChange={(e) => {
          setDateReported(e.target.value);
          // handleFilterChange();
        }}
      />

      {/* Sorting Options */}
      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          // handleFilterChange();
        }}
      >
        <option value="newest">Newest First</option>
        {/* <option value="most-reported">Most Reported</option> */}
        <option value="most-upvoted">Most Upvoted</option>
      </select>
    </div>
    </>
  );
};

export default SearchFilter;
