// src/api/authApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7169/api", // match your backend
});

// Attach token helper (we’ll store token in localStorage)
export function setAuthToken(token) {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
}

export async function register(payload) {
  return API.post("/auth/register", payload);
}

export async function login(payload) {
  return API.post("/auth/login", payload);
}

export default API;
