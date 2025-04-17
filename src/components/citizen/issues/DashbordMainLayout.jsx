import React, { useEffect, useState } from 'react'
import Dashboard from './Dashbord'
import StatisticDisplay from './StatisticDisplay'
import { getUserReports } from '../../../firebase/citizen/reportFuncs';
function DashbordMainLayout() {

  const [userReports, setUserReports] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    unresolved: 0,
    resolved: 0,
    progress: 0,
  });

  useEffect(() => {
    const callGetUserReports = async () => {
      const res = await getUserReports(localStorage.getItem("uid"));
      console.log(res);
      setUserReports(res);

      // After fetching, calculate counts
      const newCounts = {
        total: res.length,
        pending: 0,
        unresolved: 0,
        resolved: 0,
        progress: 0,
      };

      res.forEach(report => {
        if (report.status === 'pending') newCounts.pending++;
        else if (report.status === 'unresolved') newCounts.unresolved++;
        else if (report.status === 'resolved') newCounts.resolved++;
        else if (report.status === 'progress') newCounts.progress++;
      });

      setCounts(newCounts);
    };

    callGetUserReports();
  }, []);



 
  return (
        <>
            <StatisticDisplay  stats={counts} />
            <Dashboard />
        </>
)
}

export default DashbordMainLayout