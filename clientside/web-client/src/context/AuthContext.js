import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BaseUrl } from "../api/Constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (jwt) {
      const decodedToken = jwtDecode(jwt);
      console.log(decodedToken);
      
      setUser({
        role: decodedToken.authorities[0],
        email: decodedToken.sub
      });
    } else {
      setUser(null);
    }
  }, [jwt]);

  const login = (accessToken, refreshToken) => {
    setJwt(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("jwt", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setJwt("");
    setRefreshToken("");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/auth/refresh`, JSON.stringify(refreshToken), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      login(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ jwt, user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);