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
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    navigate("/companies");
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
      <label htmlFor="firstname">First Name:</label>
      <input
        onChange={handleChange}
        name="firstname"
        value={formData.firstname}
        placeholder="first name"
        required
      />
      <label htmlFor="lastname">Last Name:</label>
      <input
        onChange={handleChange}
        name="lastname"
        value={formData.lastname}
        placeholder="lastname"
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
    </form>
  );
};

export default SignupForm;
