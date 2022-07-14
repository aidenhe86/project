import React from "react";
import { Link } from "react-router-dom";

/* Renders a company card shows simple info. */
const CompanyCard = ({ handle, description, logoUrl, name }) => {
  return (
    <Link to={`/companies/${handle}`}>
      <div className="row CompanyCard">
        <div className="col d-flex flex-column align-items-center">
          <img src={logoUrl} alt={logoUrl} />
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
