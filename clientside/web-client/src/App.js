import React, { useEffect, useState } from "react";
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
import Navbar from "./components/Navbar";
import ReviewerDashboard from "./components/ReviewerDashboard";
import ReviewerAssignmentView from "./components/ReviewerAssignmentView";

function App() {
  const [jwt] = useLocalStorageState("", "jwt");
  const [role, setRole] = useState("");

  useEffect(()=> {
    if (jwt) {
      var decodedToken = jwtDecode(jwt);
      var role = decodedToken.authorities[0];
      setRole(role);
    }
  }, [jwt]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {role === "REVIEWER" ? <ReviewerDashboard /> : <Dashboard />}
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments/:id"
          element={
            <PrivateRoute>
              {role === "REVIEWER" ? <ReviewerAssignmentView /> : <AssignmentView />}
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
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;