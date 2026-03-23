import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api", // your backend
  baseURL: "https://eventify-backend-rxdz.onrender.com/api", // deployed backend
});

export default API;
