import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// login form

const LoginForm = ({ login }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    login(formData);
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
      <button>Submit</button>
    </form>
  );
};

export default LoginForm;
