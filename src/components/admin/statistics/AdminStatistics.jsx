import React from "react";
import { Link } from "react-router-dom";
import AdminStatsTop from "./Headerstats";
import GraphStats from "./GraphStats";
import DeptWiseStats from "./DeptWiseStats";

const AdminStatistics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminStatsTop />
      {/* <GraphStats /> */}
      <DeptWiseStats />
    </div>
  );
};

export default AdminStatistics;
