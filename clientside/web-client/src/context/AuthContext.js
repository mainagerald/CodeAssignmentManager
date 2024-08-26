// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(() => {
    return localStorage.getItem("jwt") || "";
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (jwt) {
      const decodedToken = jwtDecode(jwt);
      setUser({
        role: decodedToken.authorities[0]});
    } else {
      setUser(null);
    }
  }, [jwt]);

  const login = (token) => {
    setJwt(token);
    localStorage.setItem("jwt", token);
  };

  const logout = () => {
    setJwt("");
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider value={{ jwt, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};