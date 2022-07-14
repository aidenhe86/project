import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../auth/UserContext";
import JoblyApi from "../api/api";
import Loading from "../common/Loading";

const UserForm = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: "",
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
    let updatedUser;
    try {
      updatedUser = await JoblyApi.updateCurrentUser(
        currentUser.username,
        formData
      );
    } catch (e) {
      setFormErrors(e);
      return;
    }
    setCurrentUser(updatedUser);
    navigate("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>Username: {currentUser.username}</div>
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
        value={formData.firstName}
        placeholder="first name"
        required
      />
      <label htmlFor="lastName">Last Name:</label>
      <input
        onChange={handleChange}
        name="lastName"
        value={formData.lastName}
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

export default UserForm;
