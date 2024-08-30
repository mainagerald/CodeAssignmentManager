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
import ReviewerDashboard from "./components/ReviewerDashboard";
import ReviewerAssignmentView from "./components/ReviewerAssignmentView";
import { useAuth } from "./context/AuthContext";

function App() {
  const {user} = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === "REVIEWER" ? <ReviewerDashboard /> : <Dashboard />}
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments/:assignmentId"
          element={
            <PrivateRoute>
              {user?.role === "REVIEWER" ? <ReviewerAssignmentView /> : <AssignmentView />}
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