import axios from "axios";
import { getToken, saveToken } from "../data/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://financial-diagnois-api.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) saveToken(null);
    return Promise.reject(error);
  }
);

export function setToken(token) { saveToken(token); }
export default api;
