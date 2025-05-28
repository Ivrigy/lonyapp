import axios from "axios";

const baseConfig = {
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
  withCredentials: true,
  xsrfCookieName: "csrftoken",    // <— read this cookie
  xsrfHeaderName: "X-CSRFToken",  // <— set this header
};

export const axiosReq = axios.create(baseConfig);
export const axiosRes = axios.create(baseConfig);
