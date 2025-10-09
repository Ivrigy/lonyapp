import axios from "axios";

export const API_BASE_URL = "https://lony-backend-86431739f0ea.herokuapp.com/";

export const axiosReq = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) return Promise.reject(error);
    if (error.response?.status === 401) {
      try {
        original._retry = true;
        await axiosReq.post("/dj-rest-auth/token/refresh/");
        return axiosReq(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export const axiosRes = axiosReq;