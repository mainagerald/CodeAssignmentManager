import React from "react";
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
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/logout" element={<Logout/>}></Route>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
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
