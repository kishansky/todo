// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://todobackend.onexcode.com/api",
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store token here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
