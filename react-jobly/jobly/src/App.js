import React, { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { BrowserRouter } from "react-router-dom";
import JoblyRoute from "./routes/JoblyRoute";
import NavBar from "./nav/NavBar";
import UserContext from "./auth/UserContext";
import JoblyApi from "./api/api";
import useLocalStorageState from "./hooks/useLocalStorageState";
import Loading from "./common/Loading";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState("userToken");
  const [applications, setApplications] = useState(new Set([]));

  // get current user when first load and whenever token changed
  useEffect(() => {
    getCurrentUser();
  }, [token]);

  // get current user, if no user return null
  const getCurrentUser = async () => {
    setIsLoading(true);
    if (token) {
      try {
        let { username } = decodeToken(token);
        JoblyApi.token = token;
        let currentUser = await JoblyApi.getCurrentUser(username);
        setCurrentUser(currentUser);
        setApplications(new Set(currentUser.applications));
      } catch (e) {
        setCurrentUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (data) => {
    try {
      let token = await JoblyApi.login(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };
  const signup = async (data) => {
    try {
      let token = await JoblyApi.signup(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  if (isLoading) return <Loading />;

  /** Checks if a job has been applied for. */
  const hasAppliedToJob = (id) => {
    return applications.has(id);
  };

  /** Apply to a job: make API call and update set of application IDs. */
  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyJob(currentUser.username, id);
    setApplications(new Set([...applications, id]));
  }

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob }}
      >
        <div className="App">
          <NavBar logout={logout} />
          <main>
            <JoblyRoute login={login} signup={signup} />
          </main>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}
export default App;
