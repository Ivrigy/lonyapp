// src/contexts/CurrentUserContext.js

// src/contexts/CurrentUserContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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

  useMemo(() => {
    const reqInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axiosReq.post("dj-rest-auth/token/refresh/");
          } catch {
            setCurrentUser(null);
            removeTokenTimestamp();
            history.push("/signin");
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        const origReq = error.config;  // <— define origReq here
        if (error.response?.status === 401 && !origReq._retry) {
          origReq._retry = true;
          try {
            await axiosReq.post("dj-rest-auth/token/refresh/");
            return axiosRes(origReq);  // <— replay against axiosRes
          } catch {
            setCurrentUser(null);
            removeTokenTimestamp();
            history.push("/signin");
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

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get("dj-rest-auth/user/");
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
