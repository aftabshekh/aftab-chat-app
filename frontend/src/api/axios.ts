import axios from "axios";

const BASE_URL = "https://aftab-chat-app.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;