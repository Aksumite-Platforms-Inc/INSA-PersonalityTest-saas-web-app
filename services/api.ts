import axios from "axios";

const api = axios.create({
  baseURL: "localhost:8080/api/v1",
  //baseURL: "https://api.personality.insa.gov.et/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to auto-attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Customize if you're using context
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
