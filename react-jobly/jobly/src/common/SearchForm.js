import React, { useState } from "react";

const SearchForm = ({ search }) => {
  const INITIAL_STATE = {
    name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  //   change the name when user input the search name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  //   show the search result
  const handleSubmit = (e) => {
    e.preventDefault();
    search(formData.name);
  };
  return (
    <form onSubmit={handleSubmit}>
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
