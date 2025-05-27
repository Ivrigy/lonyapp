import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const history = useHistory();
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get("dj-rest-auth/user/", {
          withCredentials: true, // ✅ Send cookie
        });
        setCurrentUser(data);
      } catch (err) {
        setCurrentUser(null); // Graceful fallback
      }
    };
    handleMount();
  }, []);
  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axiosReq.post("/dj-rest-auth/token/refresh/", null, {
            withCredentials: true, // ✅ Send refresh token cookie
          });
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin");
            }
            return null;
          });
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axiosReq.post("/dj-rest-auth/token/refresh/", null, {
              withCredentials: true, // ✅ Again
            });
            return axiosRes(err.config);
          } catch (refreshErr) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
          }
        }
        return Promise.reject(err);
      }
    );
  }, [history]);
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};