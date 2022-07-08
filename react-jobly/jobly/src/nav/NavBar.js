import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

function NavBar() {
  const currentUser = true;
  const login = () => {
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/companies">Companies</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/jobs">jobs</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/profile">Profile</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/signout">Sign Out</NavLink>
        </NavItem>
      </Nav>
    );
  };
  const signout = () => {
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/login">Login</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/signup">Sign Up</NavLink>
        </NavItem>
      </Nav>
    );
  };

  return (
    <div>
      <Navbar expand="md">
        <NavLink exact="true" to="/" className="navbar-brand">
          Jobly
        </NavLink>
        {currentUser ? login() : signout()}
      </Navbar>
    </div>
  );
}

export default NavBar;
