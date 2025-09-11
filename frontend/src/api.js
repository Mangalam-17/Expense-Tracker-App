import axios from "axios";
const BASE_URL = "http://localhost:5000/api/transactions";

export const getAllTransactions = () => axios.get(BASE_URL);
export const getTransaction = (id) => axios.get(`${BASE_URL}/${id}`);
export const createTransaction = (data) => axios.post(BASE_URL, data);
export const updateTransaction = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);
export const deleteTransaction = (id) => axios.delete(`${BASE_URL}/${id}`);
export const deleteAllTransactions = () => axios.delete(BASE_URL);
