import React from "react";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Comment.module.css";

const Comment = ({
  profile_id,
  profile_image,
  owner,
  updated_at,
  content,
}) => {
  return (
    <div className="mb-3">
      <hr />
      <Stack direction="horizontal" gap={2}>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>

        <Stack gap={1} className="flex-grow-1">
          <div className="d-flex align-items-center">
            <span className={`${styles.Owner} me-2`}>{owner}</span>
            <small className={styles.Date}>{updated_at}</small>
          </div>
          <p className="mb-0">{content}</p>
        </Stack>
      </Stack>
    </div>
  );
};

export default Comment;
