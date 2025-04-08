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
        }}
      />

     
      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
        
        }}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="unresolved">Unresolved</option>
        <option value="resolved">Resolved</option>
        <option value="progress">In Progress</option>
      </select>

      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
       
        }}
      >
       <option value="">All Categories</option>
<option value="waste_management">Waste Management</option>
<option value="road_problems">Road Problems</option>
<option value="electrical_issues">Electrical Issues</option>
<option value="water_issues">Water Issues</option>
<option value="traffic_problems">Traffic Problems</option>
<option value="public_parks">Public Parks</option>
      </select>

      <input
        type="date"
        className="border p-2 rounded w-full md:w-1/6"
        value={dateReported}
        onChange={(e) => {
          setDateReported(e.target.value);
       
        }}
      />

    
      <select
        className="border p-2 rounded w-full md:w-1/6"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
        }}
      >
        <option value="newest">Newest First</option>
        <option value="most-upvoted">Most Upvoted</option>
      </select>
    </div>
    </>
  );
};

export default SearchFilter;
