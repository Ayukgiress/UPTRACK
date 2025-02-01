import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://ticks-api.onrender.com",
    withCredentials: true
})