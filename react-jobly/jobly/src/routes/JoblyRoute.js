import React from "react";
import Homepage from "../homepage/Homepage";
import CompanyList from "../companies/CompanyList";
import CompanyDetail from "../companies/CompanyDetail";
import JobList from "../jobs/JobList";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import UserForm from "../users/UserForm";
import { Route, Routes } from "react-router-dom";

function joblyRoute() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/profile" element={<UserForm />} />
      <Route path="/companies">
        <Route index element={<CompanyList />} />
        <Route path=":handle" element={<CompanyDetail />} />
      </Route>
      <Route path="/jobs">
        <Route index element={<JobList />} />
      </Route>
    </Routes>
  );
}

export default joblyRoute;
