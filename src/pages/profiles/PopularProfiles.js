import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";

const PopularProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });
  const { popularProfiles } = profileData;
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p className="fw-bold text-secondary mb-3">Most followed profiles</p>
          {mobile ? (
            <div className="d-flex justify-content-around flex-wrap">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <div key={profile.id} className="text-center">
                  <p className="mb-1">{profile.owner}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-grid gap-2">
              {popularProfiles.results.map((profile) => (
                <div key={profile.id}>
                  <p className="mb-1">{profile.owner}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
