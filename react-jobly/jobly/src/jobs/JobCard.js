import React, { useState, useEffect, useContext } from "react";
import "./JobCard.css";
import UserContext from "../auth/UserContext";

/* Renders a job card shows jobs information. */
const JobCard = ({ equity, id, salary, title, companyName }) => {
  const { hasAppliedToJob, applyToJob } = useContext(UserContext);
  const [applied, setApplied] = useState();

  useEffect(() => {
    setApplied(hasAppliedToJob(id));
  }, [id]);
  const handleApply = () => {
    if (hasAppliedToJob(id)) return;
    applyToJob(id);
    setApplied(true);
  };

  return (
    <div className="row JobCard">
      <div className="col d-flex flex-column align-items-center">
        <h4>{title}</h4>
        <h5>{companyName}</h5>
        <small>
          <div>Salary : {salary}</div>
          <div>Equity : {equity}</div>
        </small>
        <button
          onClick={handleApply}
          className="btn btn-primary"
          disabled={applied}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
