import React from "react";
import { Container } from "react-bootstrap";
import { useProfileData } from "../../contexts/ProfileDataContext";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p className="mb-3" >
            Most followed profiles
          </p>
          {mobile ? (
            <div className="d-flex justify-content-around flex-wrap">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            <div className="d-grid gap-2">
              {popularProfiles.results.map((profile) => (
                <Profile key={profile.id} profile={profile} />
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
