import React, { useContext, useEffect } from "react";
import AdminStatsTop from "./Headerstats";
import DeptWiseStats from "./DeptWiseStats";
import { AppContext } from "../../../context/AppContext";
import { getAllUserReports } from "../../../firebase/citizen/reportFuncs";

const AdminStatistics = () => {
  const {allReports,setAllReports} = useContext(AppContext);
  console.log(allReports)
  useEffect(() => {
    setTimeout(async() => {
      const response = await getAllUserReports();
      setAllReports(response);
     
    }, 100);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminStatsTop allReports={allReports}/>
      <DeptWiseStats />
    </div>
  );
};

export default AdminStatistics;
