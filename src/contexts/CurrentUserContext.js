// src/contexts/CurrentUserContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import {
  removeTokenTimestamp,
  shouldRefreshToken,
  setTokenTimestamp,
} from "../utils/utils";

const CurrentUserContext = createContext();
const SetCurrentUserContext = createContext();
const SetTokenTimestampContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);
export const useSetTokenTimestamp = () =>
  useContext(SetTokenTimestampContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  // 1) Interceptors to refresh JWT when needed
  useMemo(() => {
    const reqInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser((prev) => {
              if (prev) history.push("/signin");
              return null;
            });
            removeTokenTimestamp();
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(error.config);
          } catch {
            setCurrentUser((prev) => {
              if (prev) history.push("/signin");
              return null;
            });
            removeTokenTimestamp();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(reqInterceptor);
      axiosRes.interceptors.response.eject(resInterceptor);
    };
  }, [history]);

  // 2) On mount, load current user
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch {
        setCurrentUser(null);
      }
    };
    handleMount();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <SetTokenTimestampContext.Provider value={setTokenTimestamp}>
          {children}
        </SetTokenTimestampContext.Provider>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
