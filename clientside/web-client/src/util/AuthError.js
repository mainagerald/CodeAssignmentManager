import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AuthError = (error) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    if (error.message === "Session expired. Please log in again.") {
      logout();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    }
  };

export default AuthError
