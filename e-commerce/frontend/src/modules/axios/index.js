import axios from "axios";

// Set up Axios instance
const baseURL = "http://localhost:3000";

const instance = axios.create({ baseURL });

// Add interceptor to automatically add authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  //   console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  //   console.log(config);
  return config;
});

export { instance };
