import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "../auth/UserContext";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);
  const login = () => {
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/companies">Companies</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/jobs">Jobs</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/profile">Profile</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/" onClick={logout}>
            Log Out {currentUser.firstName || currentUser.username}
          </NavLink>
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
