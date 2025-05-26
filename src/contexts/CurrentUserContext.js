import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    const reqInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axiosReq.post("/dj-rest-auth/token/refresh/");
        } catch {
          setCurrentUser((prev) => {
            if (prev) {
              history.push("/signin");
            }
            return null;
          });
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const resInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axiosReq.post("/dj-rest-auth/token/refresh/");
            return axiosRes(err.config);
          } catch {
            setCurrentUser((prev) => {
              if (prev) {
                history.push("/signin");
              }
              return null;
            });
          }
        }
        return Promise.reject(err);
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
