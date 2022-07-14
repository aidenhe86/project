import React, { useState } from "react";
import "./SearchForm.css";

const SearchForm = ({ search }) => {
  const INITIAL_STATE = {
    name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  //   change the name value when user input the search name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  //   show the search result by input term or undefined
  const handleSubmit = (e) => {
    e.preventDefault();
    search(formData.name || undefined);
  };
  return (
    <form className="SearchForm" onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        name="name"
        id="name"
        value={formData.name}
        placeholder="Enter your search term here!"
      />
      <button>Submit</button>
    </form>
  );
};

export default SearchForm;
