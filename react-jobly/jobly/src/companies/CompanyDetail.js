import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api/api";
import JobCardList from "../jobs/JobCardList";
import Loading from "../common/Loading";

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
  if (!company.jobs) return <Loading />;
  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.description}</p>
      <JobCardList jobs={company.jobs} />
    </div>
  );
};

export default CompanyDetail;
