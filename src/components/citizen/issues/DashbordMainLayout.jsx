import React from 'react'
import Dashboard from './Dashbord'
import StatisticDisplay from './StatisticDisplay'
import { Pending } from '@mui/icons-material';

function DashbordMainLayout() {
  const issueStats = {
    totalIssues: 100,
    resolved: 40,
    inProgress: 30,
    Pending: 30,
  };
  return (
        <>
            <StatisticDisplay stats={issueStats} />
            <Dashboard />
        </>
)
}

export default DashbordMainLayout