import React from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

function Home() {
  // const { currentUser } = useContext(UserContext);
  let currentUser = false;
  return (
    <section className="col-md-8">
      <Card>
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">Welcome to Jobly!</h3>
          </CardTitle>
          <CardSubtitle>All the jobs in one, convenient place.</CardSubtitle>
          {currentUser ? (
            <h4>Welcome Back, {currentUser}</h4>
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
