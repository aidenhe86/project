import React, { useState, useEffect } from "react";
import JoblyApi from "../api/api";
import JobCardList from "../jobs/JobCardList";
import SearchForm from "../common/SearchForm";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  // first load show all jobs
  useEffect(() => {
    search();
  }, []);

  // accept a title argument to search jobs
  const search = async (title) => {
    let jobs = await JoblyApi.getJobs(title);
    setJobs(jobs);
  };

  return (
    <div className="JobList">
      <SearchForm search={search} />
      {jobs.length ? <JobCardList jobs={jobs} /> : <p>No Job Found.</p>}
    </div>
  );
};

export default JobList;
