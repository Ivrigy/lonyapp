import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get("auth/user/");
        console.log("✅ [CurrentUserContext] user data:", data);
        setCurrentUser(data);
      } catch (err) {
        console.log("❌ [CurrentUserContext] could not load user:", err.response?.status, err.response?.data);
        setCurrentUser(null);
      }
    };
    handleMount();
  }, []);

  useMemo(() => { const reqInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("auth/token/refresh/", null, {
            withCredentials: true,
          });
        } catch (err) {
          setCurrentUser((prev) => {
            if (prev) history.push("/signin");
            return null;
          });
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await axios.post("auth/token/refresh/", null, {
              withCredentials: true,
            });
            return axiosReq(error.config);
          } catch (err) {
            setCurrentUser((prev) => {
              if (prev) history.push("/signin");
              return null;
            });
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};