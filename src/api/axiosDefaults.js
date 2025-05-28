// src/api/axiosDefaults.js
import axios from "axios";

const baseConfig = {
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
  withCredentials: true,
};

export const axiosReq = axios.create(baseConfig);
export const axiosRes = axios.create(baseConfig);
