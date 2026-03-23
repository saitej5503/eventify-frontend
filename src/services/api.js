import axios from "axios";

const API = axios.create({
  baseURL: "https://eventify-backend-rxdz.onrender.com/api"
});

export default API;