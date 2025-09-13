import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Setup axios with token header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Signup API call
  const signup = async (name, email, password) => {
    const response = await axios.post("/api/users/signup", {
      name,
      email,
      password,
    });
    setUser(response.data.user);
    setToken(response.data.user.token);
  };

  // Login API call
  const login = async (email, password) => {
    const response = await axios.post("/api/users/login", { email, password });
    setUser(response.data.user);
    setToken(response.data.user.token);
  };

  // Logout clears auth state
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
