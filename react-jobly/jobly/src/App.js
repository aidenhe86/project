import React from "react";
import JoblyRoute from "./routes/JoblyRoute";
import NavBar from "./nav/NavBar";
import UserContext from "./auth/UserContext";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  let currentUser = true;
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser }}>
        <div className="App">
          <NavBar />
          <main>
            <JoblyRoute />
          </main>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
