import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// signup form

const SignupForm = ({ signup }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    let result = await signup(formData);
    // check if successful login, if not show error message
    if (result.success === true) {
      navigate("/companies");
    } else {
      setFormErrors(result.e);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        onChange={handleChange}
        name="username"
        value={formData.username}
        placeholder="username"
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        onChange={handleChange}
        name="password"
        value={formData.password}
        placeholder="password"
        autoComplete="on"
        required
      />
      <label htmlFor="firstName">First Name:</label>
      <input
        onChange={handleChange}
        name="firstName"
        value={formData.firstname}
        placeholder="first name"
        required
      />
      <label htmlFor="lastName">Last Name:</label>
      <input
        onChange={handleChange}
        name="lastName"
        value={formData.lastname}
        placeholder="last name"
        required
      />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        onChange={handleChange}
        name="email"
        value={formData.email}
        placeholder="email"
        required
      />
      <button>Submit</button>
      {formErrors.length ? formErrors.map((e) => <div>{e}</div>) : null}
    </form>
  );
};

export default SignupForm;
