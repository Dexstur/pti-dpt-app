import axios from "axios";

const { VITE_APP_API_URL } = import.meta.env;

export const baseURL = VITE_APP_API_URL;

const Api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Credentials": true,
  },
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
