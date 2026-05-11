import axios from "axios";

const BASE = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default BASE;