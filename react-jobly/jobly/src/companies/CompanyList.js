import React, { useState, useEffect } from "react";
import JoblyApi from "../api/api";
import CompanyCard from "../companies/CompanyCard";
import SearchForm from "../common/SearchForm";

// Show a list of companies page
const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  // first load show all companies
  useEffect(() => {
    search();
  }, []);

  // accept a name argument to search company
  const search = async (name) => {
    let companies = await JoblyApi.getCompanies(name);
    setCompanies(companies);
  };
  // check if found company, if not show not found element
  return (
    <div className="CompanyList">
      <SearchForm search={search} />
      {companies.length ? (
        companies.map((c) => (
          <CompanyCard
            key={c.handle}
            handle={c.handle}
            name={c.name}
            logoUrl={c.logoUrl}
            description={c.description}
          />
        ))
      ) : (
        <p>No Company Found.</p>
      )}
    </div>
  );
};

export default CompanyList;
