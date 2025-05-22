import axios from "axios";

axios.defaults.baseURL = "https://lony-api-3e20bf0b1e37.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;
