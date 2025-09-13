import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

// Attach JWT token automatically from AuthContext localStorage
API.interceptors.request.use((req) => {
  try {
    const storedAuth = localStorage.getItem("authUser");
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error reading auth token from localStorage", err);
  }
  return req;
});

export default API;
