import axios from "axios";

export const api = axios.create({
  baseURL: "https://todoproject-production.up.railway.app", 
});