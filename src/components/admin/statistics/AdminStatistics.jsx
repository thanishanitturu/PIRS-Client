import React, { useContext, useEffect } from "react";
import AdminStatsTop from "./Headerstats";
import DeptWiseStats from "./DeptWiseStats";
import { AppContext } from "../../../context/AppContext";
import { getAllUserReports } from "../../../firebase/citizen/reportFuncs";
import { calculateDeptWiseIssueCounts } from "../../../utilities/utilities";

const AdminStatistics = () => {
  const {allReports,setAllReports,setSnackbar} = useContext(AppContext);
  // console.log(allReports)
  useEffect(() => {
    setTimeout(async() => {
      const response = await getAllUserReports();
      setAllReports(response);
    }, 100);
  }, []);

  const deptwisestats = calculateDeptWiseIssueCounts(allReports);
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminStatsTop allReports={allReports}/>
      <DeptWiseStats departmentData = {deptwisestats} setSnackbar={setSnackbar}/>
    </div>
  );
};

export default AdminStatistics;
