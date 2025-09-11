import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAllTransactions = () => http.get("/");
export const getTransaction = (id) => http.get(`/${id}`);
export const createTransaction = (data) => http.post("/", data);
export const updateTransaction = (id, data) => http.put(`/${id}`, data);
export const deleteTransaction = (id) => http.delete(`/${id}`);
export const deleteAllTransactions = () => http.delete("/");
