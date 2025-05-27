import axios from "axios";

export const axiosReq = axios.create({
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
  withCredentials: true,
});

