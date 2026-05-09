import axios from "axios";

const BASE = axios.create({
  baseURL: "http://localhost:5000/emails",
});

export default BASE;