import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  // 1) On mount, fetch “who am I?”
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        console.log("✅ user:", data);
        setCurrentUser(data);
      } catch (err) {
        console.warn("❌ user fetch failed:", err.response?.status);
        setCurrentUser(null);
      }
    })();
  }, []);

  // 2) On any 401, do one refresh + retry
  useMemo(() => {
    const interceptor = axiosRes.interceptors.response.use(
      resp => resp,
      async (error) => {
        const orig = error.config;
        if (error.response?.status === 401 && !orig._retry) {
          orig._retry = true;
          try {
            // 🔥 Use axiosReq so baseURL+withCredentials apply
            await axiosReq.post("/dj-rest-auth/token/refresh/");
            // replay the original request
            return axiosRes(orig);
          } catch {
            // refresh failed → log out
            setCurrentUser(prev => {
              if (prev) history.push("/signin");
              return null;
            });
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosRes.interceptors.response.eject(interceptor);
    };
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
