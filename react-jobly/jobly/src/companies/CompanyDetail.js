import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import JoblyApi from "../api/api";
import JobList from "../jobs/JobList";

const CompanyDetail = () => {
  // get params
  let handle = useParams().handle;
  const [company, setCompany] = useState([]);

  // first load show the company
  useEffect(() => {
    search(handle);
  }, [handle]);

  // accept a name prop to search the company
  const search = async () => {
    let c = await JoblyApi.getCompany(handle);
    setCompany(c);
  };
  console.log(company.jobs);
  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.description}</p>
      <JobList jobs={company.jobs} />
    </div>
  );
};

export default CompanyDetail;
