import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import axios from "axios";

// Set axios base URL using environment variable
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
