import axios from "axios";

const api = axios.create({
  baseURL: "https://lony-api-3e20bf0b1e37.herokuapp.com/",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const origReq = error.config;
    const url = origReq.url || "";

    if (
      url.endsWith("/dj-rest-auth/login/") ||
      url.endsWith("/dj-rest-auth/registration/") ||
      url.endsWith("/dj-rest-auth/token/refresh/") ||
      url.endsWith("/dj-rest-auth/user/")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !origReq._retry) {
      origReq._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await api.post("/dj-rest-auth/token/refresh/", { refresh });
          localStorage.setItem("access_token", data.access);
          origReq.headers.Authorization = `Bearer ${data.access}`;
          return api(origReq);
        } catch {}
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return Promise.reject(error);
  }
);

export default api;