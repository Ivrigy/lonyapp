import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { Button, Stack } from "react-bootstrap";

const Profile = ({ profile, mobile, imageSize = 40 }) => {
  const { id, following_id, image, owner } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <Stack
      direction={mobile ? "vertical" : "horizontal"}
      gap={2}
      className="align-items-center py-2 px-2 text-start"
    >
      <Link to={`/profiles/${id}`}>
        <Avatar src={image} height={imageSize} />
      </Link>

      <div className={`flex-grow-1 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>

      {!mobile && currentUser && !is_owner && (
        <Button
          className={`${btnStyles.Button} btn-sm`}
          onClick={() => {}}
        >
          {following_id ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Stack>
  );
};

export default Profile;
