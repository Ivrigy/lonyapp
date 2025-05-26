import axios from "axios";

const common = {
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
  withCredentials: true,
  headers: { post: { "Content-Type": "multipart/form-data" } },
};

export const axiosReq = axios.create(common);
export const axiosRes = axios.create(common);
