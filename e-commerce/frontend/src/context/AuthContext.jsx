import React, { createContext, useContext, useEffect, useState } from "react";
// import { fetchUserData } from '../api/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [userData, setUserData] = useState(null);

  const login = async (userToken) => {
    try {
      // console.log(userToken)
      // const user = await fetchUserData(userToken);
      setToken(userToken);
      localStorage.setItem("token", userToken);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      login(existingToken);
    }
  }, []);

  const contextValue = { token, user: userData, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
