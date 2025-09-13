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

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      console.log("Signup response ", response.data);
      setUser(response.data.user);
      setToken(response.data.user.token); // Check if token exists here, else adjust
      console.log("Set User:", response.data.user);
      console.log("Set Token:", response.data.user.token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      console.log("Login response ", response.data);
      setUser(response.data.user);
      setToken(response.data.user.token); // Check if token exists here, else adjust
      console.log("Set User:", response.data.user);
      console.log("Set Token:", response.data.user.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

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
