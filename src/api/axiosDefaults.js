import axios from "axios";

axios.defaults.baseURL =  "https://lony-backend-86431739f0ea.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();

