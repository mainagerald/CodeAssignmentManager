import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorageState } from '../util/useLocalState';

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useLocalStorageState("", "jwt");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function logout() {
      console.log("Triggered logout");
      setAuth("");
      setIsLoggingOut(true);
  }

  useEffect(() => {
      if (isLoggingOut) {
          const token = localStorage.getItem("jwt");
          console.log("JWT token in local storage after logout:", token);
          navigate("/login");
      }
  }, [isLoggingOut, navigate]);

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/dashboard" className="no-underline hover:text-gray-200 text-white transition duration-300">Coder</Link>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/assignments" className="text-white hover:text-gray-200 transition duration-300">
            Assignments
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-200 transition duration-300">
            Profile
          </Link>
          <button 
            onClick={logout} 
            className="text-white hover:text-gray-200 transition duration-300 focus:outline-none"
          >
            Logout
          </button>
        </div>
        <div className="md:hidden">
          <button className="text-white hover:text-gray-200 focus:outline-none transition duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;