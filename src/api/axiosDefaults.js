import axios from "axios";

axios.defaults.baseURL = "https://lony-api-3e20bf0b1e37.herokuapp.com/api/";
axios.defaults.withCredentials = true;
// axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

export const axiosReq = axios.create();
export const axiosRes = axios.create();


