import axios from "axios";

const BASE = axios.create({
  baseURL: "https://reachinbox-backend-3tqv.onrender.com/emails",
});

export default BASE;