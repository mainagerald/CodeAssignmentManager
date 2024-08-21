import React, { useState } from "react";
import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import AssignmentView from "./components/AssignmentView";
import CreateAssignmentView from "./components/CreateAssignmentView";
import PrivateRoute from "./util/PrivateRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from "./components/Logout";
import { useLocalStorageState } from "./util/useLocalState";
import { jwtDecode } from "jwt-decode";
import ReviewerDashboard from "./components/ReviewerDashboard";

function App() {
  const [jwt] = useLocalStorageState("", "jwt");
  const [role, setRole] = useState(getRole());

  function getRole() {
    if (jwt) {
      var decodedToken = jwtDecode(jwt);
      var role = decodedToken.authorities[0];
      console.log(role);
      return role;
    }
    setRole(role);
  }
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/logout" element={<Logout/>}></Route>
        <Route
          path="/dashboard"
          element={
            role == "REVIEWER" ? (
              <PrivateRoute>
                <ReviewerDashboard />
              </PrivateRoute>
            ) : (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )
          }
        />
        <Route
          path="/assignments/:id"
          element={
            <PrivateRoute>
              <AssignmentView />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <PrivateRoute>
              <CreateAssignmentView />
            </PrivateRoute>
          }
        />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
