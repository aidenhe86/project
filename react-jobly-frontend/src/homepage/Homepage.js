import React, { useContext } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";

function Home() {
  const { currentUser } = useContext(UserContext);
  return (
    <section className="col-md-8">
      <Card>
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">Welcome to Jobly!</h3>
          </CardTitle>
          <CardSubtitle>All the jobs in one, convenient place.</CardSubtitle>
          {currentUser ? (
            <h4>
              Welcome Back, {currentUser.firstName || currentUser.username}
            </h4>
          ) : (
            <span>
              <Link color="primary" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Sign Up
              </Link>
            </span>
          )}
        </CardBody>
      </Card>
    </section>
  );
}

export default Home;
