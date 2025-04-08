import React, { useState,useEffect, useContext } from 'react';
import HeadingComponent from './HeadingComponent';
import StatisticsLayout from './StatisticsLayout';
import SearchFilter from './SearchFilter';
import IssueGrid from './IssueGrid';
import { getAllUserReports } from '../../../firebase/citizen/reportFuncs';
import { AppContext } from '../../../context/AppContext';

const CommunityLayout = () => {
 const{allReports,setAllReports} = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [issues, setIssues] = useState(allReports);
  const [filteredIssues, setFilteredIssues] = useState(allReports);


   useEffect(() => {
      setTimeout(async() => {
        const response = await getAllUserReports();
        setAllReports(response);
        setIssues(response);
        setFilteredIssues(response);
      }, 100);
    }, []);

  const handleFilterChange = ({ searchTerm, status, category, dateReported, sortBy }) => {
    let filtered = [...allReports];

    if (searchTerm) {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((issue) => issue.status === status);
    }

    if (category) {
      filtered = filtered.filter((issue) => issue.category === category);
    }
    
    if (dateReported) {
      filtered = filtered.filter((issue) => {
        const issueDate = new Date(issue.reportedDate).toISOString().split('T')[0];
        const filterDate = new Date(dateReported).toISOString().split('T')[0];
        return issueDate === filterDate;
      });
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate)); 
    } else if (sortBy === "most-upvoted") {
      filtered.sort((a, b) => b.likeCount - a.likeCount);
    }

    setFilteredIssues(filtered);
  };


  return (
    <>
      <HeadingComponent />
      <StatisticsLayout initialIssues={allReports} />
      <SearchFilter
        onFilterChange={handleFilterChange}
        setSortBy={setSortBy}
        setDateReported={setDateReported}
        searchTerm={searchTerm}
        status={status}
        category={category}
        dateReported={dateReported}
        sortBy={sortBy}
        setCategory={setCategory}
        setSearchTerm={setSearchTerm}
        setStatus={setStatus}
      />
      <IssueGrid issues={filteredIssues} setIssues={setIssues} setFilteredIssues={setFilteredIssues}/>
    </>
  );
};

export default CommunityLayout;

